#!/usr/bin/env bash
#
# deploy.sh — deploy Atlantic Connect Marketing on the Vyra VPS.
#
# This box already runs Caddy as the public TLS edge (auto Let's Encrypt) in
# front of several loopback apps. So we DON'T ship nginx/certbot — we run the
# Next.js standalone server in a container on a loopback port and add a Caddy
# site block for $DOMAIN -> 127.0.0.1:$APP_PORT.
#
#   ./deploy.sh                 build + (re)start the container, wire Caddy
#   ./deploy.sh --no-build      restart without rebuilding the image
#   ./deploy.sh --no-caddy      run the app only, don't touch the Caddyfile
#   ./deploy.sh --print-caddy   print the Caddy block and exit
#
set -euo pipefail
cd "$(dirname "$0")"

DO_BUILD=1; DO_CADDY=1; PRINT_ONLY=0
for a in "$@"; do case "$a" in
  --no-build)    DO_BUILD=0 ;;
  --no-caddy)    DO_CADDY=0 ;;
  --print-caddy) PRINT_ONLY=1 ;;
  -h|--help)     sed -n '3,14p' "$0"; exit 0 ;;
  *) echo "Unknown option: $a" >&2; exit 2 ;;
esac; done

# ---- config ----------------------------------------------------------------
if [[ ! -f .env ]]; then
  echo "==> No .env found — creating one from .env.example"
  cp .env.example .env
fi
set -a; source .env; set +a
DOMAIN="${DOMAIN:-acm.vyradata.com}"
APP_PORT="${APP_PORT:-8101}"
CADDYFILE="${CADDYFILE:-/etc/caddy/Caddyfile}"

# ---- the Caddy site block (port stays in sync with APP_PORT) ---------------
read -r -d '' CADDY_BLOCK <<EOF || true
# ─── Atlantic Connect Marketing ($DOMAIN) ──────────────────────────────────
# Next.js standalone container (acm-site) on loopback :$APP_PORT.
$DOMAIN {
    encode zstd gzip
    reverse_proxy 127.0.0.1:$APP_PORT {
        header_up X-Real-IP {remote_host}
    }
    header {
        -Server
        Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
        X-Content-Type-Options "nosniff"
        Referrer-Policy "strict-origin-when-cross-origin"
    }
}
EOF

if [[ "$PRINT_ONLY" == 1 ]]; then printf '%s\n' "$CADDY_BLOCK"; exit 0; fi

# ---- prerequisites ---------------------------------------------------------
if docker compose version >/dev/null 2>&1; then COMPOSE="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then COMPOSE="docker-compose"
else echo "ERROR: Docker Compose not found." >&2; exit 1; fi
SUDO=""; [[ "${EUID:-$(id -u)}" -ne 0 ]] && SUDO="sudo"

echo "==> Domain:    $DOMAIN"
echo "==> Upstream:  127.0.0.1:$APP_PORT  (Caddy reverse_proxy target)"
echo "==> Origin:    ${NEXT_PUBLIC_SITE_URL:-https://$DOMAIN}"
echo "==> Compose:   $COMPOSE"

# ---- preflight: APP_PORT must be free (or already ours) --------------------
# Guarantees we never collide with another service on this multi-app host.
# If the port is held by anything other than our own acm-site container, abort
# WITHOUT changing a thing (no compose up, no Caddy edit).
if command -v ss >/dev/null 2>&1 && ss -ltnH "sport = :$APP_PORT" 2>/dev/null | grep -q .; then
  mine="$(docker ps --filter 'name=^/acm-site$' --filter "publish=$APP_PORT" --format '{{.Names}}' 2>/dev/null || true)"
  if [[ "$mine" == "acm-site" ]]; then
    echo "==> Port $APP_PORT held by the existing acm-site container (will be replaced in place)."
  else
    echo "ERROR: host port $APP_PORT is already in use by another service:" >&2
    ss -ltnpH "sport = :$APP_PORT" 2>/dev/null >&2 || true
    echo "      Pick a free APP_PORT in .env and re-run. Nothing was changed." >&2
    exit 1
  fi
fi

# ---- build + run -----------------------------------------------------------
if [[ "$DO_BUILD" == 1 ]]; then echo "==> Building image"; $COMPOSE build; fi
echo "==> Starting container"
$COMPOSE up -d

# ---- health check ----------------------------------------------------------
echo -n "==> Waiting for the app on :$APP_PORT "
for i in $(seq 1 30); do
  code="$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$APP_PORT/" || true)"
  if [[ "$code" == "200" ]]; then echo " OK"; break; fi
  echo -n "."; sleep 1
  if [[ "$i" -eq 30 ]]; then
    echo " FAILED (no 200 from the app)"; $COMPOSE logs --tail 40 app; exit 1
  fi
done

# ---- wire Caddy (safe: validate a candidate file, back up, then reload) ----
if [[ "$DO_CADDY" == 1 ]]; then
  if [[ ! -f "$CADDYFILE" ]]; then
    echo "==> WARNING: $CADDYFILE not found — add this block to Caddy manually:"
    printf '\n%s\n\n' "$CADDY_BLOCK"
  elif grep -q "$DOMAIN {" "$CADDYFILE"; then
    echo "==> Caddy already serves $DOMAIN — leaving the Caddyfile untouched."
  else
    echo "==> Adding $DOMAIN to $CADDYFILE (the other sites are left as-is)"
    TMP="$(mktemp)"
    cat "$CADDYFILE" > "$TMP"
    printf '\n%s\n' "$CADDY_BLOCK" >> "$TMP"

    # Pre-validate the WHOLE candidate config if the caddy binary is available.
    # If it can't parse, we never touch the live file. (A successful reload
    # below also self-validates, so this is belt-and-suspenders.)
    if command -v caddy >/dev/null 2>&1 \
       && ! caddy validate --adapter caddyfile --config "$TMP" >/dev/null 2>&1; then
      echo "==> ERROR: candidate Caddyfile failed validation; live config untouched." >&2
      echo "    The block I tried to add:"; printf '%s\n' "$CADDY_BLOCK"
      rm -f "$TMP"; exit 1
    fi

    BK="$CADDYFILE.bak.$(date +%Y%m%d%H%M%S)"
    $SUDO cp "$CADDYFILE" "$BK"
    $SUDO cp "$TMP" "$CADDYFILE"
    # Graceful reload — NOT restart — so every other site keeps serving.
    if $SUDO systemctl reload caddy 2>/dev/null \
       || $SUDO caddy reload --adapter caddyfile --config "$CADDYFILE" 2>/dev/null; then
      echo "==> Caddy reloaded gracefully (zero downtime). Backup: $BK"
    else
      echo "==> Reload failed — restoring previous Caddyfile from $BK and reloading." >&2
      $SUDO cp "$BK" "$CADDYFILE"
      $SUDO systemctl reload caddy 2>/dev/null \
        || $SUDO caddy reload --adapter caddyfile --config "$CADDYFILE" 2>/dev/null || true
      rm -f "$TMP"; exit 1
    fi
    rm -f "$TMP"
  fi
fi

echo ""
echo "==> Done. https://$DOMAIN"
$COMPOSE ps

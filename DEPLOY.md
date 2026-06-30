# Deploy — acm.vyradata.com (Vyra VPS)

The VPS already runs **Caddy** as the public TLS edge (auto Let's Encrypt) in
front of several loopback apps. ACM follows the same pattern as `life` /
`insights` / `vyradata.com`: the Next.js app runs in a **Docker container on a
loopback port**, and a **Caddy site block** reverse-proxies `acm.vyradata.com`
to it. (It can't be a static `file_server` landing like the `*.vyradata.com`
sites — it's a real Next.js app with SSR, `/_next/image`, and dynamic
sitemap/robots.)

```
Internet ──TLS──> Caddy (:443) ──proxy──> 127.0.0.1:8101 ──> acm-site container (node server.js)
```

## Files

| File | Purpose |
|---|---|
| `Dockerfile` | Multi-stage build → Next.js standalone runner (+ sharp for `next/image`) |
| `docker-compose.yml` | Runs the `acm-site` container, published on `127.0.0.1:$APP_PORT` |
| `deploy.sh` | Build + start the container, then wire the Caddy block (validate → backup → reload) |
| `deploy/caddy/acm.vyradata.com.caddy` | Reference copy of the Caddy block |
| `.env.example` | `DOMAIN`, `NEXT_PUBLIC_SITE_URL`, `APP_PORT`, `CADDYFILE` |

## Prerequisites

- Docker + the compose plugin (already on this box — `life`/`insights` use it).
- DNS for `acm.vyradata.com` → this server. The Caddyfile note says there's a
  wildcard `*.vyradata.com` A/AAAA record, so this should already resolve.
- `APP_PORT` (default **8101**) free on the host. Check: `ss -ltnp | grep 8101`.

## Deploy (run on the server)

Get the code onto the VPS, then one command:

```bash
# from your Mac — copy the repo up (excludes build artifacts):
rsync -az --delete \
  --exclude node_modules --exclude .next --exclude .git --exclude .env \
  /Users/mark/Documents/atlantic/atlantic-connect-marketing/ \
  root@31.97.136.140:/opt/acm-site/

# then on the server:
ssh root@31.97.136.140
cd /opt/acm-site
cp .env.example .env        # tweak APP_PORT only if 8101 is taken
./deploy.sh
```

`deploy.sh` builds the image, starts the container on `127.0.0.1:8101`, waits
for a `200`, then appends the Caddy block to `/etc/caddy/Caddyfile` and reloads
Caddy. Caddy provisions the TLS cert for `acm.vyradata.com` automatically on the
first request. Live at `https://acm.vyradata.com`.

> Alternative to rsync: `git clone` the repo onto the server (needs GitHub
> access for `Novera-Industries/atlantic-connect-marketing`).

### Caddy safety

The script never edits the live Caddyfile blindly: it builds a candidate file,
runs `caddy validate` on it, backs up the current Caddyfile
(`Caddyfile.bak.<timestamp>`), swaps in the new one, and reloads — restoring the
backup if the reload fails. If `acm.vyradata.com` is already present it leaves
the file alone. Use `./deploy.sh --no-caddy` to manage Caddy yourself, or
`./deploy.sh --print-caddy` to just print the block.

### Flags

```bash
./deploy.sh --no-build      # restart without rebuilding the image
./deploy.sh --no-caddy      # run the app only, don't touch the Caddyfile
./deploy.sh --print-caddy   # print the Caddy block and exit
```

## Operate

```bash
cd /opt/acm-site
docker compose ps
docker compose logs -f app          # app logs
docker compose restart app          # restart the app
docker compose up -d --build        # rebuild + redeploy after a code update
docker compose down                 # stop (Caddy block stays; site 502s until back up)
```

## Notes

- **Origin override**: `site.url` reads `NEXT_PUBLIC_SITE_URL` (inlined at build
  time), falling back to `https://atlanticconnectmarketing.ca`. This deployment
  builds with `https://acm.vyradata.com`, so canonical/sitemap/robots/JSON-LD
  all point at this host.
- **Indexing**: this block lets the site be indexed. If `acm.vyradata.com` is
  only a preview (the real home being `atlanticconnectmarketing.ca`), add
  `X-Robots-Tag "noindex, nofollow"` to the block's `header {}` — same as the
  `vyradata.dev` / staging blocks already do.
- **Forms**: the strategy-call / apply forms are still a `mailto:` fallback —
  wire them to a real endpoint before promoting past a preview.
- **`sharp`**: bundled into the image for the runtime platform (the Dockerfile
  builds it in an isolated stage), so `/_next/image` works.

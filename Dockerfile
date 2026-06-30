# syntax=docker/dockerfile:1
# Atlantic Connect Marketing — production image (Next.js 15 standalone).
# Multi-stage: deps -> build -> minimal runner (node server.js).

ARG NODE_VERSION=22

# ---- base: shared runtime + sharp's musl shim ------------------------------
FROM node:${NODE_VERSION}-alpine AS base
# libc6-compat lets sharp's prebuilt binaries load on Alpine (musl).
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# ---- deps: install node_modules (incl. sharp, devDeps for the build) -------
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ---- sharp: the next/image optimizer dep, built for THIS platform ----------
# Next's standalone trace doesn't reliably copy the `sharp` package, and any
# native binaries traced on the build host would be the wrong platform anyway.
# Install it in isolation here (correct musl/glibc + arch binaries) and overlay
# it onto the runner — without dragging the whole dependency tree along.
FROM base AS sharp
WORKDIR /sharp
RUN npm init -y >/dev/null 2>&1 \
 && npm install --omit=dev --no-audit --no-fund sharp@0.33.5

# ---- builder: compile the standalone server --------------------------------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Canonical origin for THIS deployment. NEXT_PUBLIC_* is inlined at build time,
# so it must be set here (not just at runtime) for metadata/sitemap/robots/JSON-LD.
ARG NEXT_PUBLIC_SITE_URL=https://acm.vyradata.com
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NODE_ENV=production
RUN npm run build

# ---- runner: just the standalone output, run as non-root -------------------
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Public assets, the standalone server (+ its pruned node_modules), and the
# hashed static chunks. Order/paths per Next's standalone contract.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Overlay sharp (+ its deps) so /_next/image works at runtime. Layered after the
# standalone copy so it fills in the package the tracer omits.
COPY --from=sharp --chown=nextjs:nodejs /sharp/node_modules ./node_modules

USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/ || exit 1
CMD ["node", "server.js"]

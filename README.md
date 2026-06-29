# Atlantic Connect Marketing Inc. — website

A jaw-dropping, motion-rich, desktop-priority marketing site for a Halifax
face-to-face field-marketing & sales firm. Built around **"The Current"** (the
brand's ocean wave). Two audiences, one world: **clients** (cool ocean/silver)
and **talent** (warm champagne/gold).

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Lenis** smooth scroll, wired to the **GSAP** ticker (one clock for Lenis +
  ScrollTrigger + Motion `useScroll`)
- **Motion** (`motion/react`) for declarative reveals / parallax / gestures
- **GSAP** ScrollTrigger + SplitText for the ≤2 heavy pinned scenes per page
- Raw **WebGL** fragment shader for the one WebGL beat (liquid-chrome ocean),
  off on mobile / reduced-motion
- **Tailwind** + design tokens · self-hosted **Clash Display** + **Switzer**
  (Fontshare, in `/public/fonts`) · **sharp** for image optimization

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (output: standalone)
npm start        # run the standalone Node server
```

(There's a `.claude/launch.json` so the Preview tooling can start it as `acm-site`.)

## Routes

`/` (Home + The Fork) · `/partner` · `/careers` · `/about` · `/privacy` ·
`/sitemap.xml` · `/robots.txt`. SEO: LocalBusiness + Organization + JobPosting +
FAQ JSON-LD, all trust copy server-rendered.

## Signature motion

1. **The Current hero** — static poster is the LCP (<100 KB), WebGL fades in on
   top after load (desktop only).
2. **The Fork** (home, pinned) — the current splits into two doors that animate
   apart, cool vs warm.
3. **Day in the Life** (careers, pinned horizontal) — scrubbed beats.
4. Scroll-locked count-ups, masked-line headlines, magnetic CTAs, custom cursor.

Reduced motion is a **designed** state everywhere (no Lenis, no pins, instant
reveals). No-JS reveals everything via a `<noscript>` rule.

## Media — what's real vs. generated

- **Real (client-provided), in `/public/real` + `/public/brand/logo-mark.webp`:**
  the official chrome AC + wave **logo** (header/footer/favicon), the **team
  photo**, and **Bernie / Neely / Ahnaf** headshots (About leadership, Careers
  Teamwork, home team rail). Source files live in the repo root + `assets-src`.
- **AI-generated abstract layers only (no humans), in `/public/brand`:** the
  ocean/chrome "Current" plates + the Fork split (Higgsfield, per the brief's
  rule that AI is confined to abstract water/light/chrome).
- **Atmospheric, no-people shots, in `/public/media`:** Halifax harbour / street
  / office interior (editorial backdrops).
- **Crafted placeholders** (`MediaFrame`) still stand in for the day-in-the-life
  footage, testimonial video, and field moments — drop real footage into those
  slots (see `assets-src/real/DROP-FILES-HERE.md`).

## No-proof launch state

Zero fabricated metrics or client logos. Count-ups animate only verifiable facts
(75% reply rate, 4 channels, 100% trained). Case-study + unverified-metric slots
are intentional, confidentiality-framed states until real numbers are approved.

## Deploy (self-hosted VPS, not Vercel)

`output: 'standalone'` → `node server.js` under PM2/systemd or Docker, behind
nginx (TLS, HTTP/2, brotli, long-cache for `/brand` + fonts), Cloudflare in front
for heavy media. `sharp` required for `next/image`. Wire the strategy-call /
apply forms to the CMS/CRM endpoint (currently a mailto fallback).

## Image pipeline

```bash
node scripts/optimize-media.mjs   # assets-src/{brand,media} → /public webp + blur
node scripts/process-real.mjs     # real logo crop + favicon + photo webp
```

# Design

## Theme

A **drenched dark, cinematic brand surface** — deep Atlantic-navy ground lit by ocean-blue and chrome. Not a dashboard, not an editorial magazine: a kinetic, premium, human brand world built around **The Current** (the wave). Color strategy = **Committed/Drenched**: navy carries the surface; ocean blue, electric azure, and liquid-chrome are the light. Two temperatures share one world — **client** surfaces lean cool (ocean blue + silver chrome), **talent** surfaces warm the same navy with brighter azure + champagne/gold chrome + white glow. No orange, ever.

Physical scene: a Halifax harbour at blue hour — dark water, city light on a metallic swell, the sense of momentum and rising. That mood governs every surface.

## Color palette

OKLCH tokens, anchored to the real logo (ocean wave + chrome). Hex shown for reference.

**Ground & surface**
- `--bg` Deep Navy `#0B1A2B` · `oklch(0.20 0.035 248)` — page ground
- `--bg-elev` Navy Raise `#0F2236` · `oklch(0.25 0.045 248)` — elevated sections / cards-when-needed
- `--bg-deep` Abyss `#06111E` · `oklch(0.15 0.03 248)` — hero void / footers
- `--line` Hairline `rgba(201,210,214,0.12)` — borders (1px only, never side-stripes)

**Brand light**
- `--brand` Ocean Blue `#1B75BC` · `oklch(0.55 0.13 250)` — primary action, the wave
- `--brand-bright` Electric Azure `#2E97E6` · `oklch(0.67 0.14 246)` — highlights, interactive, talent-side energy
- `--brand-deep` Depth Blue `#0E4C82` · `oklch(0.40 0.11 252)` — pressed/active, gradients into navy

**Metals (decoration / large-display only — not body text)**
- Silver chrome (client): `#F2F4F6 → #AEB7BF → #4A5158`
- Champagne/gold chrome (talent): `#F3E2BE → #E8C98A → #7A5E2E`

**Text (on dark)**
- `--ink` `#FAFBFC` · primary text — AAA on `--bg`
- `--muted` `#C9D2D6` · secondary text — ≥7:1 on `--bg`
- `--subtle` `#8A98A2` · tertiary/labels — ≥4.5:1 on `--bg`, never smaller than 14px

**Contrast law:** body ≥4.5:1, large ≥3:1, verified against `--bg`/`--bg-elev`. Ocean blue & champagne/gold are for fills, large headings, and graphics — never small body copy. Every accent-on-accent pairing gets measured before it ships.

## Typography

Distinctive, non-reflex pairing (both free + self-hostable on the VPS via Fontshare):

- **Display — Clash Display (variable).** Kinetic, premium grotesque. Its variable weight axis drives the scroll-reactive headline (the "Energy" value made literal). Used for hero/section headlines. Letter-spacing floor −0.03em (never tighter). Clamp max ≤ 6rem.
- **Body — Switzer (variable).** Neutral, highly legible grotesque for all running text, labels, UI. Tabular figures for count-up stats and numbers. Line-height 1.6 body / 1.05–1.15 display; +0.05 line-height on light-on-dark.

Pairing rationale: characterful display grotesque against a neutral text grotesque — different roles, clear contrast axis, no reflex fonts (no Inter/DM/Space/Outfit/Plus Jakarta/Fraunces/Playfair). Type scale: fluid `clamp()`, ≥1.25 ratio. Sentence case for copy; headlines may use deliberate case for voice. No all-caps body. Body measure 60–75ch.

## Spacing, radius, grid

- 8px base; scale 4/8/12/16/24/32/48/64/96/128. Generous default (breathe).
- Radius: 0–4px on structural panels (sharp, premium), 8–12px on cards/inputs when used, full-pill only on tags/small buttons. Never 24px+ on cards.
- 12-col desktop grid, fluid gutters via `clamp()`. Asymmetric compositions allowed and encouraged for emphasis. Container max ~1280–1440px with full-bleed hero/section breaks.

## Components

- **Dual CTA (header + sections):** "Partner With Us" = solid ocean-blue, primary. "Careers" = outline with champagne/gold edge, secondary. Equal weight in the header; client modestly prioritized in scroll order. ≥44px targets. Every CTA flanked by a micro-proof (stat/quote/badge slot) — no naked buttons.
- **The Fork doors:** two equal-weight panels, cool (client) vs warm (talent), magnetic hover, distinct motion temperature.
- **Count-up stat:** large tabular display number + label, value driven by scroll position (not a timer), reduced-motion shows final value instantly.
- **Case-study card / growth-ladder rung / value-as-evidence:** inline-first (avoid card-grid reflex); use framing only where it earns it.
- **Custom cursor + magnetic CTAs:** single root cursor, pointer-fine only; disabled for touch and reduced-motion; never blocks native pointer accuracy.
- Icons: one set (Lucide, outline), consistent stroke; no emoji.

## Motion

- **Engine:** one Lenis smooth-scroll wired to the GSAP ticker; Framer Motion (`motion/react`) for declarative reveals/parallax/gestures; GSAP ScrollTrigger for ≤2 heavy pinned/scrubbed scenes per page.
- **Materials:** transform/opacity/clip-path first; blur, mask, and chrome glow used where they materially help and stay smooth.
- **Easing:** ease-out expo/quart for entrances; no bounce/elastic. Reveals 0.5–0.7s; exits ~60–70% of entrance.
- **Signature beats:** The Current hero scrub (canvas image-sequence, static poster = LCP), The Fork split, scroll-locked count-ups.
- **Reduced motion:** mandatory designed fallback in both engines — pins/scrub/parallax become instant/crossfade; nothing ships blank or gated behind a never-firing reveal.
- **Budget:** sustained 60fps, lazy-mount heavy canvas/WebGL/video behind IntersectionObserver, one WebGL beat max, WebGL off on mobile.

## Imagery

Real team/event photography is the spine (clean studio headshots on light backgrounds + candid high-energy event shots). Higgsfield/WebGL supply abstract ocean-light, liquid-chrome, and wave-energy only — never people. The logo wave (vector) is animated directly (draw-on, liquid-chrome fill). Stock used only as a temporary placeholder with verified URLs, never colored-block placeholders.

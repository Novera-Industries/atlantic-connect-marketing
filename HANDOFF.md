# Handoff — Atlantic Connect Marketing site

Continue in a new chat from here. Project root: `/Users/officemac/ACM/acm-site`.
Run: `npm run dev` (or the Preview tool config `acm-site`) → http://localhost:3000.
Build: `npm run build` (green as of this handoff). Typecheck: `npm run typecheck`.

## Iteration 16 — dissolution morphs (recording 3, 2026-07-07)

Recording 3 (7.34.56 PM): radiance FIXED — vortex strong, static visible, helix
clearly reads behind the timeline, count-ups + fork split + ladder + culture all
verified live. One defect left: the vortex→static morph travelled as one dense
BLOB (all particles on the same clock, the eye smearing across mid-transition).
FIX: the travelling-wave stagger now applies to EVERY transition — gate changed
from `smoothstep(1.6, 2.2, uStage)` to `smoothstep(0.25, 0.75, uStage)` — so
formations dissolve and re-form in waves (tight again at each integer stage).
Verified: clean build + fresh-server hero frame. The morph feel needs the next
user recording. Remaining tunables unchanged (HANDOFF iter 14 list).

## Iteration 15 — radiance pass from the user's live recording (2026-07-07)

User recorded the real scroll (Downloads/Screen Recording 2026-07-07 at 7.23.31 PM
.mov — NOTE the first attempt was a drag from the floating thumbnail whose
ephemeral NSIRD temp file vanished before it could be read; ask for a saved
file). Frame review: ALL mechanics work live (pin scrub activates steps, count-
ups run, sticky bar behaves, morphs happen) but every formation rendered far too
FAINT — dust, not the reference's crisp bright dots. Four compounding causes,
all fixed:
1. GROUND: home now plays in the hero void — a fixed `bg-bg-deep` layer under
   the canvas (HomeStage, DOM-order sibling before it). The site-wide navy was
   eating the additive particles' contrast.
2. ALPHA STACK: flicker floor 0.5→0.72 (`0.72 + 0.28*wave`), dAlpha 0.5–1.1 →
   0.62–1.15, fNoise z halved to ±0.5 so static isn't depth-dimmed.
3. SIZE: `1.35 + pow(aRand2,1.7)*4.4` (was 0.9 + pow²*3.6); twinkle 0.78–1.0.
4. HEAT: FRAG core 0.6→0.85; cNoise dim 0.62→0.85; heroLift trimmed 0.3→0.25
   (floor already raised).
Verified on fresh-load first frames: desktop vortex now bright, arms over ~70%
width on the near-black ground; mobile 375 arms span nearly full width. Plot
unchanged (geometry untouched).
DEV-SERVER GOTCHA (hit twice): HMR after GlobalCurrent/HomeStage edits corrupts
the dev server (`TypeError: a[d] is not a function` on /, unstyled HTML). Fix:
stop server, `rm -rf .next`, `npm run build`, fresh start. Do this FIRST if the
page 500s or screenshots come back unstyled.

## Iteration 14 — reference-tier particle redesign: THE VORTEX (2026-07-07)

User re-sent the textura.eu/HELIOS reference video (same file as iteration 2;
frames re-extracted and studied at crop level) and asked for the dot animation
to be redesigned "more impressive" + the site to be perfect on mobile. What the
reference actually is: (1) hero = a rotating 3D SPIRAL GALAXY (arms + luminous
core), (2) a perspective dot-ocean receding to a horizon, (3) depth everywhere
(many tiny dim dots + few bright carriers, near=big/bright far=small/faint),
(4) mostly white/silver particles. THIS RESOLVES THE LONG-OPEN "WAVE" QUESTION:
the hero is now `fVortex` — an ocean whirlpool (the ocean's galaxy, echoes the
logo curl): 5 log-spiral arms, 12% of particles in a tight luminous EYE, slow
uTime rotation, disk tilted (y*0.46), centre at (0,-0.18) so the eye sits BELOW
the headline like the reference. fWaveCrest/fClientCurrent/fTalentCurrent/
fThread/fLanes were REMOVED (replaced), git history has them.

New formation set (stages unchanged 0..7): 0 fVortex · 1 fNoise (kept) ·
2 fSea (perspective dot-ocean: rows compress toward a horizon at client-photo
level, near rows swell) · 3 fHelix (double spiral down the pinned timeline,
aStream = front/back strand) · 4 fStreams (four channel lanes converging to a
vanishing point) · 5 fSplit (kept) · 6 fRise (kept) · 7 fSettle/fTwist (kept).

Global depth pass (the volume illusion): every formation returns pos.z in
[-1,1] (larger = farther); main() computes dSize (1.3→0.55) and dAlpha
(1.1→0.5) from it; gl_Position now uses z=0 (depth is shading-only). Size field
is reference-tier: `0.9 + pow(aRand2,2)*3.6` (many fine dots, few bright).
`coreBoost` makes particles near the eye glow + grow (gated to uStage<1);
`heroLift` (+0.3 alpha, same gate) makes the vortex denser than the travelling
stages. Hero colour now silverier: cMerged = mix(cool, chrome, 0.45+0.35*hash).
Tunables if the user wants adjustments: R multiplier 0.68 (disk size), 0.46
(tilt), -0.18 (eye y), 0.16 (rotation speed), heroLift 0.3, coreBoost radius
0.30/0.04.

Verified: plot-global.mjs mirrors all new math (geometry confirmed: real spiral
+ sea + helix + streams); typecheck/build green; LIVE first-frame screenshots on
a real-viewport preview show the vortex rendering on desktop (~60% width, core
under the headline) AND mobile 375px (arms span ~85% width below the headline —
the reference's phone framing). Mobile structure re-verified: no overflow-x, no
pin on mobile, stacked steps opacity 1. NOT verifiable here (throttled hidden
tab): the rotation, morphs, and scrub feel — user's real browser is the judge.
NOTE: a stale dev server threw `TypeError: a[d] is not a function` on / after
the shader HMR — fixed by stopping the server, `rm -rf .next/cache`, fresh
start. Do that first if the page 500s in dev.

## Iteration 13 — the 8-act storytelling restructure (2026-07-07)

User approved a full homepage redesign brief (plan file: humming-nibbling-tome.md;
new client decisions SUPERSEDE the June-26 fork-first doctrine: brand audience is
PRIMARY, careers secondary; a sticky strategy-call bar is approved; social scope
LinkedIn-only). Home went from 5 sections to an 8-act scroll story; the particle
engine went from stages 0..4 to 0..7. Subpages untouched.

New page order (page.tsx): Hero → Tension (anchor `noise`, NEW fNoise digital
static) → ClientPreview (stats row moved out; ProofCTA added) → ProcessTimeline
(anchor `process`, NEW fThread vertical current; the home page's ONE GSAP pin,
desktop ≥1024px + no-reduced-motion, mobile = stacked list) → ProofCoverage
(anchor `coverage`, NEW fLanes four-channel lanes; carries the 3 stat count-ups +
4 channel tiles + honesty note) → TheFork (anchors `partner`/`careers`, fSplit) →
LadderTeaser (anchor `talent`, NEW fRise warm climb; rungs step up on desktop,
75%+ stat as CTA micro-proof) → Culture (anchor `trust`, TeamRail marquee;
settle/twist finale sits below it, footer dual CTA is the story's ending — do
NOT add another CTA block) → StickyCall (fixed bar, appears past hero, hides
near footer, dismissible, careers link hidden on mobile).

Engine changes (GlobalCurrent.tsx): uniforms uAnchorF/G/H (noise/process/
coverage); formations fNoise/fThread/fLanes/fRise added, fTalentCurrent retired
in place; morph chain 7 branches; clamp 0..7; edge-fade protected near stages 1
AND 5; computeStage raw = [0, noise, client, process, coverage, fork(partner+
careers avg), talent, trust]; `__forceStage` now 0..7. plot-global.mjs mirrors
all 8 stages (`node scripts/plot-global.mjs` — verified, geometry correct).
TalentPreview.tsx + TrustBand.tsx retired from the page but kept in-repo.

Copy: new home.tension/process/proof/ladder/culture/sticky blocks in content.ts
(all reuse/adapt approved strings; zero new stats; no em dashes). Footer "Inc.."
doubled-period fixed. PRODUCT.md + repo-local DESIGN.md added (impeccable setup).
Research: /Users/officemac/ACM/research/content-inventory.md (full crawl of both
live sites + LinkedIn + Meta Ad Library, 2026-07-07). NOTE from the crawl: the
APEX domain atlanticconnectmarketing.ca already serves this Next build while its
subpaths (/about, /careers, /partner-with-us) still serve old Squarespace pages —
launch needs 301s from old slugs.

Verified this pass: typecheck + build green; plot-global geometry for all 8
stages; structural checks at 1280 + fresh-load 375 (no overflow-x, pin absent on
mobile, steps opacity 1, sticky bar full-width + 44px CTA + careers link hidden,
dismiss button 44px). NOT yet verified (needs the user's real browser/GPU, the
usual constraint): the animated morph through the new stages, pin scrub feel,
sticky-bar enter/exit timing, legibility plates over live particles at stages
1/3/4/6.

## What's done

A full motion-rich Next.js 15 marketing site for Atlantic Connect Marketing
(Halifax field-marketing firm). Brand = "The Current" (ocean wave). Pages:
Home, Partner, Careers, About, Privacy + sitemap/robots/JSON-LD. Real assets
wired (logo, team photo, headshots — AI-upscaled), self-hosted fonts (Clash
Display + Switzer), Lenis→GSAP scroll, Motion reveals. Em dashes removed.
Other pages (Partner/Careers/About) are DONE and good — do not touch.

## Active work: home = one continuous particle "Current" (textura.agency style)

Approved plan: `/Users/officemac/.claude/plans/tranquil-doodling-peach.md` (read it).
Reference video: `/Users/officemac/Downloads/a87660b18f8642108ff7524febdc1fff.MP4`.
NOTE what it actually is: a phone screen-recording of **textura.eu** (the "HELIOS"
project, IG @textura.eu) with the meme overlay "Them: it won't work on mobile /
Me with Claude". So the brief is two-fold: (1) match the textura look — dense
morphing particle **nebula/clouds** over near-black with clean white type, and
(2) **it must sing on mobile** — that's the whole point of the clip. User
decisions: **particles take over the hero** (blue shader hero retired) and
**full textura-tier** (~20k particles desktop / 9k mobile, lead-into every block).

Journey is now driven by an ANCHOR-DERIVED STAGE (0..4), NOT guessed scroll-%
thresholds — so each formation is active exactly when its section is centred in
the viewport (computeStage() in GlobalCurrent reads live section rects → stage;
the shader blends formations P0..P4 by stage). Stages:
0 WAVE (hero) → 1 split into Partner/Careers cards → 2 HALO around the centred
Client photo → 3 warm halo on the Talent card → 4 SETTLE (one calm wave above the
Trust CTA — the current full circle). Colour: merged → cool/warm → cool → warm →
chrome. Dev hook is now `window.__forceStage = <0..4>` (was __forceProgress).

### Design direction locked by user (2026-06-29, iteration 2)

Premium feel = **dark-tech minimal** (textura/Linear: restraint, negative space,
fine hairlines, particles do the drama). Headlines = **cleaner neutral grotesque
(Switzer)** — Clash Display retired from the UI (the `font-display` token +
`h1–h4` now resolve to `var(--font-body)`; Clash still loaded but unused, safe to
drop later). Feedback applied this pass:
1. Hero is now CENTRED (eyebrow/headline/sub), Switzer headline, radial scrim.
2. Hero particle form is the logo's OCEAN-WAVE CREST (`fWaveCrest`), not a circle.
3. ClientPreview redesigned to a CENTRED showcase — photo is the mid-screen focal
   point and the constellation is a cool elliptical HALO (`fConstellation`) that
   frames/orbits it (anchor reads the centred photo's rect). Redundant proof chip
   removed (it duplicated the heading). Halo size vs photo is approximate (tuned
   blind to the live morph) — confirm/​nudge `ring` (GlobalCurrent + plot) on a
   real GPU.
Verified: hero on a real-viewport preview screenshot (centred + Switzer + wave);
`plot-global.mjs` shows wave-crest + halo geometry; build + typecheck green.

### Iteration 3 — user recorded the live scroll, 4 fixes (2026-06-29)

User screen-recording (frames extracted via ffmpeg; NOTE macOS recording
filenames contain a U+202F narrow-no-break-space before "PM" → ffmpeg can't open
the literal path, glob-copy it first). Complaints + fixes:
1. "Hero doesn't look like a wave" → `fWaveCrest` made much FULLER (more body,
   stronger crest+curl, denser-near-crest). Confirmed fuller on a GPU screenshot.
2. "'One current' (TheFork) looks cheap" → `fSplit` rebuilt as TWO clean ribbons
   from a top trunk into the cards (was scattered dust; perp scatter 0.07→0.04).
3. "Doesn't line up with the scroll" → ROOT CAUSE: formations were driven by
   guessed scroll-% thresholds. Rebuilt to the anchor-derived STAGE system above
   (computeStage). This is the big architectural fix.
4. "Don't like the end" → was two clumps floating in the gap above the CTA.
   Replaced `fReconverge` with `fSettle` — one calm wide wave that settles above
   the CTA (current full circle). `fTalent` also reworked to a warm halo.
### Iteration 4 — second recording: kill the rings, wave still off (2026-06-29)

Recording 2 ("looking better"): sync is fixed. Two complaints left:
1. "Big C's at 75% and the photo look terrible, don't match the flow" → the
   client/talent HALOS rendered as hollow ovals / "C"s. ROOT FIX: halos are the
   wrong metaphor for a flowing current. Replaced `fHalo`/`fTalent` with
   `fClientCurrent`/`fTalentCurrent` — horizontal flowing WAVES at the section's
   level; the opaque photo/card masks the middle so the current reads as flowing
   AROUND the focal element (aBand spread 0.42). Now the whole page is one
   continuous current (wave → split → flow past photo → warm flow → settle).
2. "Wave needs to look more like a wave" (2nd time) → user picked "breaking barrel
   (like the logo)" from a style question. Built `fWaveCrest` as a barrel (face →
   spiral curl). On a REAL-viewport GPU screenshot it looked like SCATTERED NOISE
   through the headline → user said "revert back that doesn't look good". REVERTED
   `fWaveCrest` (+ plot mirror) to the prior swell-crest version (the rec2 look:
   broad arc/swell behind the headline). Verified reverted on a GPU screenshot.
   THE WAVE IS STILL UNSOLVED — 3 blind attempts (fuller / surface / barrel) all
   missed. NEXT: get a REFERENCE IMAGE of the wave they want before trying again;
   blind shape-guessing isn't converging. The barrel math is in git history / this
   handoff if needed.
Note: a real-viewport preview instance DOES appear sometimes (most are 0×0) — when
you get one, screenshot the hero immediately; that's the only GPU check available.
Verified: stage geometry in `plot-global.mjs` (currents flow, no rings), build +
typecheck green, no shader compile errors. CURRENTS (client/talent) still NOT seen
on GPU animated — pending the user's next recording.

### Iteration 5 — recording 3 + footer cleanup (2026-06-29) — VERIFIED LIVE

A preview instance came up with `document.hidden === false` (loop runs while
scrolled!) so this round was verified on a real GPU by scroll+screenshot. Fixes:
1. Removed the redundant TrustBand dual CTA (two stacked For brands/For talent
   blocks — the global footer already has one). `trust` anchor moved to the
   process strip. Dropped now-unused Link/Button imports.
2. Hero pixels + split + client(blue) left untouched (user: "they look good").
3+4. client→talent and talent→trust were "just a colour shift" (consecutive
   horizontal currents cross-fading at similar Y). FIX: in main(), a per-particle
   transition STAGGER that peaks mid-transition and only ramps up for uStage>1.6
   (`stagger = 0.16 + smoothstep(1.6,2.2,uStage)*sin(fract(uStage)*PI)*0.62`).
   Spreads the morph into a flowing blue→warm gradient field — VERIFIED in a
   midpoint screenshot (both colours coexist + flow, no snap). Hero/split/client
   keep tight stagger (0.16).
5. "Pixels should hide behind the footer at the bottom, reappear on scroll up" →
   new `uFade` uniform (multiplies vAlpha), computed each frame from the footer's
   screen position: `sstep((footerTop - vh*0.3)/(vh*0.6))`, smoothed. VERIFIED:
   full mid-page, ~0 at the bottom.
Verified live (real-viewport, non-hidden instance): hero unchanged, talent=warm
current (no ring), trust=current, bottom=dual-CTA-gone + faded. build+typecheck
green, no shader errors. The WAVE shape is still the reverted swell (user hasn't
re-specified after rejecting the barrel) — leave it until they give a reference.

### Iteration 6 — legibility plates (2026-06-29) — VERIFIED LIVE

User: "can't read the text with the current stopping point" (the Trust body
paragraph sat under a dense band of the current). FIX: a radial "legibility
plate" behind the centred text block in TrustBand (and proactively the left text
column in TalentPreview) — `pointer-events-none absolute` div with a strong navy
radial-gradient that dims the particles behind the COPY while the current still
flows full-strength on the sides (content sits IN the current, readable). Did NOT
touch the client section (user likes it; its text sits above the photo-level
current, already clear) or the hero (already has a scrim). Verified live on a
real-viewport/non-hidden instance: trust + talent copy now readable, current
flows around. build+typecheck green. Pattern for any future "can't read X over
particles": same plate behind that text block.

### Iteration 7 — opaque talent card + marquee (2026-06-29) — VERIFIED LIVE

1. "Make sure this block isn't transparent" (the talent 49%+/75%+ proof card) →
   the warm current was bleeding through its `/60`+`/40` gradient. Made it opaque:
   `bg-bg-deep bg-gradient-to-br from-[#1a1407] to-bg-deep`. Current now flows
   AROUND it. Verified (cardBg rgb(6,17,30)).
2. "Make these photos auto-scroll, smooth loop" (TeamRail) → rebuilt TeamRail as a
   seamless MARQUEE: doubled track + `animate-team-marquee` (translateX 0→-50%,
   32s linear infinite — keyframe added to tailwind.config). Cells use `mr-4`
   (uniform width) so -50% lands exactly on the 2nd copy = no seam. Edge mask-fade,
   pause-on-hover, reduced-motion → static swipeable row. Verified live: two
   screenshots showed the rail advanced (continuous scroll). build+typecheck green.

### Iteration 8 — blue+gold twist ending + soft wave edges (2026-06-29) — VERIFIED LIVE

1. "Make the white do a blue+gold twist then hide behind the footer" → new
   `fTwist` braid (two strands by aStream, opposite-phase sines that cross =
   blue/gold helix). New `uTwist` uniform (0=white settle, 1=braid) ramps from the
   footer position (`1 - sstep((footerTop-0.9vh)/0.4vh)`) — earlier than `uFade`,
   so the order is white settle → blue+gold braid → fade behind footer. Stage-4
   pos = `mix(fSettle,fTwist,uTwist)`, colour = `mix(cChrome, cSplit, uTwist)`.
   Verified live across scroll positions (white @1.5vh, braid @0.9vh, fade <0.5vh).
2. "Border on the left/right too harsh" (hero wave cut off hard at the sides) →
   alpha edge-fade on the outer ~12% of aT (`aTedge`), PROTECTED near stage 1 so
   the split streams still land hard in the cards (`mix(1,aTedge,smoothstep(0.5,1,
   abs(uStage-1)))`). Verified: hero wave now tapers softly L/R.
NOTE: `plot-global.mjs` does NOT model uTwist/uFade/edge-fade (runtime uniforms);
geometry there is still valid but the ending/edges are verified LIVE only.

Follow-up: user wanted the settle/twist band moved from ABOVE the 01-04 strip
(over the body copy) to UNDER the "Trained, compliant…" line → changed both
`fSettle` and `fTwist` y-offset from `e.y + 0.30` to `e.y - 0.42` (e = trust/strip
anchor). Verified live: band now sits in the open space below the strip, copy +
strip clear. (If they want a bigger gap under the Trained line, go more negative.)

### Iteration 9 — site polish pass + AI filler imagery (2026-06-29)

A) POLISH PASS (ran ui-ux-pro-max + impeccable as the lens; audited every page via
a background workflow — kept the scroll system + brand gradient text/eyebrows
untouched). Implemented: form a11y (StrategyCallForm: label htmlFor/id, name,
autocomplete, removed input `outline-none` so the global focus ring shows),
Button `focus-visible:outline-offset-2`, Footer social icons → 44px (h-11 w-11),
About team names `<p>`→`<h3>`, FAQ button hover + `aria-hidden` on its Plus,
Header `tracking-display`(undefined)→`tracking-[-0.03em]`, `aria-hidden` on
decorative MapPin/Quote icons, careers off-scale spacing (py-1.5→2, py-2.5→3),
careers IG label "IG"→descriptive. No P0s were found. Build+typecheck green.

B) FILLER IMAGERY (Higgsfield soul_2, user chose "realistic AI people"). Generated
+ wired the HOME slots: ClientPreview rep-in-field (`/media/rep-field.webp`) and
the 4 TeamRail moments (`/real/moment-{huddle,close,board,promo}.webp`). All in
`src/lib/media.ts` under an "AI-GENERATED FILLER … swap before launch" block,
optimized to webp + blur placeholders, verified on a real-viewport preview.
STILL TODO (next batch): the other-page slots — partner/page.tsx (1), careers/page.tsx
(2 + the 3 IG 1:1 tiles), about/page.tsx (3), careers/DayInLife.tsx frames.
Pipeline: generate_image(soul_2, aspect, prompt) → poll job_display/show_generations →
curl rawUrl → sharp resize→webp + 16px blur → public/ → media.ts → component.

### Iteration 10 — numbered lists redesigned (2026-06-29) — VERIFIED LIVE

User: the vertical numbered lists "look so cheap and off" (a tiny number floating
on a hairline `border-l`; on the timeline ones the line didn't pass through the
badge centres). Fixed all 3:
- `HowItWorks.tsx` (partner) and the careers ladder (`careers/page.tsx`): rebuilt
  as flex timelines — `<li className="flex gap-5 pb-7 last:pb-0">`, a `w-9`
  badge column (`relative flex flex-col items-center`) with a centred connector
  `<span absolute left-1/2 top-9 -bottom-7 w-px -translate-x-1/2>` (so the line
  runs through the badge centre, verified badgeCx==connCx live), z-10 `bg-bg`
  badges over the line, font-display tabular-nums numbers. Blue / gold per page.
- partner case-study skeleton list (`partner/page.tsx`): compact inline numbered
  badges (h-6 w-6 circles), no hairline.
Verified on a fresh-CSS preview (NOTE: a reused dev server served STALE CSS —
`relative`→static, `w-9` not applied — always restart fresh when classes look
unapplied; the production build is the source of truth). build+typecheck green.

### Iteration 11 — remaining filler imagery + brighter Halifax (2026-06-29) VERIFIED

User: "the rest of the images" + the Coverage Halifax shot is "too dark."
- Brighter Halifax: new `media.halifaxBright` (`/media/halifax-bright.webp`, sunny
  daytime waterfront) wired into the Partner Coverage MediaFrame (replaced the dark
  `halifaxHarbour`, which the About hero keeps — it's scrimmed there). Verified live.
- Careers values grid: `valueEnergy`/`valueGrowth`/`valueIntegrity` mapped by value
  name (Teamwork still uses the real `teamGroup`). Verified — looks great.
- Careers Day-in-the-Life beats: `dilMorning` / reuse `repField` (Midday) /
  `dilAfternoon` / `dilEvening`, mapped by index. Verified (afternoon beat).
- Careers Instagram tiles ×3: `ig1/ig2/ig3`.
- SKIPPED on purpose: the careers TESTIMONIAL frame — its on-page caption says
  "Authentic footage · no actors, no stock, no AI", so AI there would contradict
  itself. Left as the crafted placeholder. (DayInLife's "no AI" is only a code
  comment, no on-page claim, so it was filled — comment updated to note swap.)
All 10 new images: Higgsfield soul_2 → webp+blur in media.ts AI-filler block
(batch 2). build+typecheck green.

OPEN: user pasted the repo URL https://github.com/Novera-Industries/atlantic-connect-marketing.git
— project is NOT a git repo locally yet; asked whether to init+commit+push (not done
without explicit go-ahead). Also still open: the hero WAVE shape (needs a reference).

### Iteration 12 — heading descenders no longer clipped (2026-06-29) VERIFIED

User: "the bottom of the letters in the headers" was cut off. Cause: the GSAP
`mask:"lines"` reveal wraps each heading line in an `overflow: clip` box sized to
the line-height; Switzer's descenders sit ~0.09em (measured 7.4px @ the hero)
BELOW that box, so ~1/3 of g/y/p/j got shaved. Fix in `globals.css` (@layer
utilities): `.reveal-line, :has(> .split-line) { padding-bottom: 0.16em;
margin-bottom: -0.16em; }` — extends the clip region for descenders, the negative
margin keeps the heading rhythm identical (descenders overflow into the gap just
like a non-masked heading). Applies to every SplitReveal/Hero headline at once.
Verified on the hero (powerful / marketing / happens / person descenders all whole).

GIT: PUSHED (2026-06-29, user authorized). acm-site is now a git repo on `main`,
remote `origin` = https://github.com/Novera-Industries/atlantic-connect-marketing.git
(private). Initial commit f03df3d pushed + tracking set. Identity: Novera Industries
<admin@noveradatasolutions.com>. node_modules/.next gitignored; assets-src/ source
PNGs (~120MB) ARE tracked (project intent). Future changes: normal commit + push.

### Phase 1 FIXED + Phase 2 + Phase 3 BUILT (2026-06-29)

Phase 3 (this pass): graceful no-WebGL fallback (try/catch around the renderer);
firmer mobile budget (viewport-tiered COUNT 20k/14k/9k/6.5k + DPR capped 1.5 on
phones — fill-rate is the mobile bottleneck); a designed reduced-motion static
state (`StaticCurrent.tsx`, a quiet two-temperature CSS atmosphere shown instead
of the canvas); and light directional legibility scrims on the three lower
sections (content lifted above via `relative z-10`). The bloom now RENDERS and
reads great at scroll 0 on a real viewport (confirmed by screenshot). Remaining:
Phase 4 + the user's full-journey on-GPU/on-phone confirmation.

Key files (Phase 1):
- `src/components/home/GlobalCurrent.tsx` — the fixed full-page Three.js particle
  engine. Formations (bloom/wave/split/ambient) in the vertex shader, driven by
  Motion `useScroll` over the content wrapper. Has a dev hook
  `window.__forceProgress = <0..1>` to inspect any formation at any scroll.
- `src/components/home/anchors.ts` — `useBlockAnchor(name)` registry; the engine
  reads the Partner/Careers card rects each frame so streams lead INTO them.
- `src/components/home/HomeStage.tsx` — renders `<GlobalCurrent>` (lazy, ssr:false)
  + wraps the sections in a `relative z-10` div passed to the engine as scroll target.
- `src/app/page.tsx` — `<HomeStage>` wrapping Hero/TheFork/ClientPreview/TalentPreview/TrustBand.
- `src/components/home/Hero.tsx` — shader/plate removed, headline over particles.
- `src/components/home/TheFork.tsx` — local canvas+pin removed; heading + two cards
  registered as anchors (`useBlockAnchor("partner"|"careers")`).
- TalentPreview/TrustBand — opaque section bg removed (so particles show).

Verified: engine renders (bloom shows on clean load), scroll-progress is exact
(measured p=0.16 at the right scroll), and `scripts/plot-global.mjs` →
`scripts/global-preview.png` confirms the formation GEOMETRY is correct
(bloom → wave → split-into-card-boxes).

### THE BUG — FIXED (2026-06-29)

User reported "I don't see anything" on a real GPU. Root cause: the canvas mount
was `fixed inset-0 -z-10`. A fixed element with **negative** z-index paints in
the root stacking context's negative layer — i.e. *below* `<body>`'s in-flow
opaque navy `bg-bg`, which then paints over it (CSS Appendix E order: html bg →
neg-z children → body bg). The Preview screenshot tool reads the WebGL buffer
directly so it "showed" bloom, masking the bug; the real-browser report was
ground truth.

Fix applied:
- `GlobalCurrent.tsx`: canvas div `-z-10` → `z-0` (now paints *above* the body
  bg, still below content `z-10`) + `pointer-events-none`. Body bg left navy as
  the guaranteed ground; transparent additive particles composite over it.
- `Hero.tsx`: scrims lightened (`from-bg/85`→`/65`, `from-bg/70`→`/55`) so the
  Current reads through.
Verified: `npm run build` + `npm run typecheck` green; live preview computed
styles show `mountZ:0`, `position:fixed`, `pointer-events:none`, navy body/html;
`scripts/plot-global.mjs` still shows correct bloom→wave→split geometry. Final
on-GPU look is the user's to confirm (preview viewport is 0×0 headless → cannot
render the fixed canvas). Possible follow-up tuning to taste: particle
size/brightness/density.

### Verification constraint (important — updated)

The Preview tool runs **software WebGL in a headless tab that reports
`document.hidden === true`**, so the browser **throttles requestAnimationFrame to
~0 after the first frame**. Consequence: the engine renders ONE frame (the bloom
at scroll 0 — which now looks correct, confirmed by screenshot) and then can't
advance, so `window.__forceProgress` and scroll CANNOT drive the journey here.
Viewport is sometimes 0×0 and sometimes real (~1325×1030) depending on the
instance. Net: screenshots only verify the scroll-0 bloom; they cannot show the
morph. Verify the journey via: (1) `node scripts/plot-global.mjs` for geometry
(the reliable path), (2) the **user's real browser** for motion (the only
reliable animated check).

Note: Motion's `useScroll` logs a pre-existing, non-fatal "ensure the container
has a non-static position" warning on the home page (all scroll targets ARE
relative — it's a Motion/Lenis heuristic, not our regression; making the CountUp
span relative did NOT silence it). Functionality is unaffected (bloom maps at
p≈0 correctly). Investigate on real hardware if it ever proves real.

### Next steps

1. DONE: layering bug fixed (canvas z-0; see above).
2. DONE: Phase 2 built — constellation/talent/reconverge formations in the shader
   (`fConstellation`/`fTalent`/`fReconverge`, uniforms `uAnchorC/D/E`), plus a new
   `AnchorPoint` client wrapper so the server sections register anchors. Anchors
   attached: Client media (ClientPreview), Talent proof card (TalentPreview),
   Trust CTA grid (TrustBand). Bloom enlarged to a dense nebula. `plot-global.mjs`
   now renders all six beats. NEXT: user confirms the full journey on a real GPU
   and we tune density/colour/glow/size to taste.
3. DONE: Phase 3 — per-section scrims (ClientPreview/TalentPreview/TrustBand),
   `StaticCurrent` reduced-motion atmosphere, no-WebGL try/catch, viewport-tiered
   mobile budget + DPR cap. NEXT: confirm the scrims read well over live particles
   on a real GPU (added blind to the morph — likely need tuning), and PROFILE ON A
   REAL PHONE (the reference video's whole point).
4. Phase 4: polish + 60fps profiling (incl. the 5 getBoundingClientRect/frame for
   anchors — throttle or gate-by-phase if it shows up). Resolve the pre-existing
   Motion useScroll warning if real. Remove `__forceProgress`.

Old per-section particle Fork (`src/components/home/CurrentParticles.tsx`) and the
hero shader (`src/components/brand/CurrentCanvas.tsx`) are retired from the home
but kept in-repo. `scripts/plot-particles.mjs` plots the old Fork formations.

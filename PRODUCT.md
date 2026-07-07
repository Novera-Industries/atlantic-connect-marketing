# Atlantic Connect Marketing — Product Context

**What:** Marketing site for Atlantic Connect Marketing Inc., a Halifax face-to-face
field-marketing and sales firm (in-person customer acquisition for client brands)
with a second audience: recruiting reps into a merit-based career ladder.

**Register:** brand — the design IS the product. Cinematic, scroll-driven
storytelling over a single continuous WebGL particle "Current" (the brand's ocean
wave), dark Atlantic-navy world, two temperatures (cool ocean = clients, warm
champagne/gold = talent).

**Audiences and priority:** client brands are primary (revenue), talent is a
strong second (client-confirmed 2026-07). Header CTAs deep-link high-intent
traffic straight to /partner and /careers, bypassing the homepage story.

**Primary conversion:** the 20-minute strategy call (partner side; form at
/partner#contact, mailto fallback until a CRM endpoint exists). Secondary:
careers applications (mailto, "Apply in 2 minutes").

**Hard content rules:**
- No fabricated metrics, client logos, testimonials, or case-study numbers, ever.
  The complete truthful stat universe: 1-business-day reply; 75%+ applications
  answered in a day (Indeed); 4 in-person channels; 100% reps trained before
  deployment; 20-min call; 2-min apply; the 4-step process.
- No em dashes in copy. No coral/orange. "Elevate Your Sales Strategy" lives on
  /partner only. Payroll entity "Atlantic Connect Services Inc." never appears.
- Keep the pyramid-scheme FAQs (partner + careers). Confidentiality framed as
  strength ("No logo wall, on purpose").
- Zero AI imagery on identifiable humans presented as real; AI filler images are
  marked in src/lib/media.ts and must be swapped before launch.

**Pages:** / (eight-act scroll story) · /partner · /careers · /about · /privacy.
Pinned-scene budget: max two per page (home uses one: the process timeline).

**Design system:** see DESIGN.md (mirrors /Users/officemac/ACM/ACM/DESIGN.md,
locked with the client across 12 iterations — do not re-theme).

**Deploy:** self-hosted VPS (Docker + Caddy), staging at acm.vyradata.com,
production domain atlanticconnectmarketing.ca. No Vercel.

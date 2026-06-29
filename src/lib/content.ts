/**
 * All site copy as structured data, server-rendered for SEO (never buried in
 * canvas/WebGL). No-proof launch state: ZERO fabricated metrics or logos.
 * Count-ups use only genuinely-true facts; unverified figures render as
 * intentional "pending" slots (see components), framed as confidentiality.
 */

export const home = {
  // Brand-neutral hero. "Elevate Your Sales Strategy" lives on Partner only.
  hero: {
    eyebrow: "Halifax, Nova Scotia",
    headline: ["The most powerful", "marketing still happens", "in person."],
    sub: "Atlantic Canada's people-first field marketing, built on genuine connections between people, brands, and communities.",
  },
  fork: {
    eyebrow: "Two ways to grow with the current",
    heading: "One current. Two ways forward.",
    sub: "Every brand we grow and every career we build rides the same current: real human connection, made face to face. Choose your side.",
    client: {
      kicker: "For brands",
      title: "Partner With Us",
      line: "Grow your brand",
      blurb: "The human channel a digital agency can't replicate. Trained, on-brand reps acquiring real customers in person.",
      href: "/partner",
    },
    talent: {
      kicker: "For talent",
      title: "Grow With Us",
      line: "Build your career",
      blurb: "Start in the field, learn to lead, and run your own campaign. Merit, mentorship, and momentum from day one.",
      href: "/careers",
    },
  },
  clientPreview: {
    eyebrow: "For brands",
    heading: "The human channel digital can't replicate.",
    body: "Algorithms compete for attention. We earn it in person, in the neighbourhoods, stores, and events where your customers actually decide. Trained reps, your brand standards, measured results.",
    cta: "See how it works",
  },
  talentPreview: {
    eyebrow: "For talent",
    heading: "Grow With Us.",
    body: "We hire for energy and integrity, then teach the rest. People who start in the field here go on to lead teams and run campaigns, and we tell you exactly how.",
    cta: "Explore careers",
  },
  trust: {
    heading: "Built on genuine connection, and proof of how we work.",
    body: "We're a young firm with a deliberate way of working. Until the case studies are public, our process is the proof: transparent, trained, and accountable to the brands who trust us with their reputation.",
  },
};

export const partner = {
  hero: {
    eyebrow: "Partner With Us",
    headline: ["Connecting your brand", "to customers,", "face to face."],
    tagline: "Elevate Your Sales Strategy.",
    sub: "Outsourced, in-person customer acquisition across Atlantic Canada: a human sales channel that earns trust no feed can buy.",
  },
  differentiator: {
    eyebrow: "The difference",
    heading: "A channel a digital agency can't replicate.",
    body: "Digital marketing rents attention. Face-to-face marketing earns it. Our reps represent your brand in person, answering questions, handling objections, and creating the kind of genuine connection that converts and sticks.",
    points: [
      { title: "Real conversations", body: "Trained reps who can read the room, not a scripted funnel." },
      { title: "Your brand, protected", body: "On-brand standards and conduct your customers feel as quality." },
      { title: "Measured, not assumed", body: "You see what we do and what changed: accountability built in." },
    ],
  },
  how: {
    eyebrow: "How face-to-face acquisition works",
    heading: "Four steps. One named point of contact.",
    steps: [
      {
        n: "01",
        title: "Discovery",
        body: "We learn your brand, your customer, and the result that matters, then agree on what success looks like and how we'll protect your reputation in the field.",
        contact: "Led by your campaign strategist",
      },
      {
        n: "02",
        title: "Campaign Design",
        body: "We design the in-person approach: channels, territories, messaging, and the brand-safety guardrails every rep is trained and held to.",
        contact: "Co-built with your account lead",
      },
      {
        n: "03",
        title: "Deploy & Train Field Team",
        body: "Reps are trained on your brand before a single doorstep. We deploy across the right Atlantic-Canada territories and monitor conduct throughout.",
        contact: "Run by your field manager",
      },
      {
        n: "04",
        title: "Report & Optimize",
        body: "You get clear reporting on activity and outcomes, and we optimize the campaign against the result we agreed on in Discovery.",
        contact: "Reviewed with your strategist",
      },
    ],
  },
  // Credibility wall: VERIFIABLE / true facts only. Unverified = intentional pending slot.
  stats: {
    eyebrow: "How we hold ourselves accountable",
    heading: "Numbers we'll only show when they're true.",
    items: [
      { value: 1, suffix: "", label: "business day, our standard to reply to an inquiry", real: true },
      { value: 4, suffix: "", label: "in-person channels: residential, retail, B2B, events", real: true },
      { value: 100, suffix: "%", label: "of reps trained & brand-compliant before deployment", real: true },
      { value: null, suffix: "", label: "customers acquired, verified & published at launch", real: false },
    ],
    note: "We don't borrow award-case-study numbers or invent metrics. As campaigns complete and clients approve, verified figures replace these slots.",
  },
  caseStudies: {
    eyebrow: "Case studies",
    heading: "Proof, published the right way.",
    body: "The brands we serve trust us with their reputation, so results go public only when they're verified and approved. Here's the structure each case study follows the moment it's cleared.",
    skeleton: ["Client", "The challenge", "What we did", "What changed", "The numbers"],
    sectors: ["National telecom", "Retail & home services", "Events & experiential"],
    status: "Published as results are verified and client-approved",
  },
  riskReversal: {
    eyebrow: "Brand safety",
    heading: "Your reputation is the product we protect.",
    body: "Every rep is trained on your brand, held to a clear conduct standard, and monitored in the field. You define the result; we measure against it. If something's off, you hear it from us first.",
    guarantees: [
      "Reps trained on your brand standards before deployment",
      "Clear conduct & compliance expectations, monitored in the field",
      "Transparent reporting on activity and outcomes",
      "You set the success metric, and we're accountable to it",
    ],
  },
  confidentiality: {
    eyebrow: "Confidentiality",
    heading: "No logo wall, on purpose.",
    body: "We don't splash client logos across a homepage to borrow their credibility. The brands we represent trust us with their reputation, and discretion is part of the service. Our process, our standards, and our references, shared directly, are how we earn yours.",
  },
  coverage: {
    eyebrow: "Coverage",
    heading: "Atlantic Canada, in person.",
    body: "We deploy field teams across Atlantic-Canada territories, matched to the channel that fits your customer.",
    channels: [
      { title: "Residential", body: "Door-to-door conversations in the neighbourhoods your customers live in." },
      { title: "Retail", body: "In-store and storefront activations where buying decisions happen." },
      { title: "B2B", body: "Business-to-business outreach, in person, with a human point of contact." },
      { title: "Events", body: "Experiential and event activations that put your brand face to face with crowds." },
    ],
  },
  faq: {
    eyebrow: "Straight answers",
    heading: "The legitimacy questions, answered.",
    items: [
      {
        q: "Is this a pyramid scheme or MLM?",
        a: "No. We're an outsourced field-marketing and sales firm: brands hire us to acquire customers in person, and we pay our team to do that work. There's no buy-in, no recruiting-to-earn, and no product our own people are required to purchase.",
      },
      {
        q: "How do you protect our brand in the field?",
        a: "Reps are trained on your brand standards before deployment, held to a clear conduct code, and monitored throughout the campaign. You define the success metric and we report against it.",
      },
      {
        q: "How is this different from a digital agency?",
        a: "We don't run ads or chase clicks. We create real, in-person conversations with potential customers, a channel that earns trust digital can't, and that complements whatever you're already doing online.",
      },
      {
        q: "What does a campaign cost and commit to?",
        a: "It depends on the channel, territory, and result you're after. Start with a 20-minute strategy call (no pressure, no spam) and we'll tell you honestly whether face-to-face is a fit.",
      },
    ],
  },
  cta: {
    eyebrow: "Start here",
    heading: "Book a 20-minute strategy call.",
    body: "We'll learn your goal and tell you honestly whether a human channel is the right fit. No pressure, no spam.",
    microcopy: "We reply within one business day. No pressure, no spam.",
    secondary: "See how it works",
  },
};

export const careers = {
  hero: {
    eyebrow: "Careers · Grow With Us",
    headline: ["Start in the field.", "Learn to lead.", "Run the campaign."],
    sub: "We hire for energy and integrity, then teach the rest. If you're driven and people light you up, this is where you grow.",
  },
  dayInLife: {
    eyebrow: "A day in the life",
    heading: "Real days. Real momentum.",
    body: "No two days look the same, but they all start with the team and end a little further than they began.",
    beats: [
      { time: "Morning", title: "Hype & huddle", body: "The team meets, sets the day's goals, and gets each other ready. Energy is the value you can feel by 9am." },
      { time: "Midday", title: "In the field", body: "Real conversations with real people. You represent a brand, handle the moment, and get better with every door." },
      { time: "Afternoon", title: "The team win", body: "A breakthrough, a first close, a personal best, and a team that celebrates it like it's their own." },
      { time: "Evening", title: "Celebrate", body: "We mark the wins. Culture isn't a perk here; it's how the work actually feels." },
    ],
  },
  ladder: {
    eyebrow: "Your growth path",
    heading: "A clear ladder, climbed on merit.",
    body: "We promote from within based on results and leadership, not tenure. Here's the path, and roughly how fast it can move when you're ready.",
    rungs: [
      { role: "Entry Rep", when: "Day one", body: "Learn the craft of face-to-face: brand, conversation, resilience. Full training, real mentorship." },
      { role: "Team Lead", when: "When you're ready", body: "Coach newer reps, own a small team's energy and results, and learn to lead by example." },
      { role: "Assistant Manager", when: "On merit", body: "Help run the campaign: people, performance, and the standards that keep brands trusting us." },
      { role: "Run a Campaign / Office", when: "The goal", body: "Own a campaign or office end to end: the people, the clients, and the growth." },
    ],
    earningsNote:
      "We're transparent about earnings in the interview, where we can be specific and honest about your market and role. We don't post income claims online; that's a promise we keep, not a number we market.",
  },
  values: {
    eyebrow: "Our values, as evidence",
    heading: "Four values you can see, not just read.",
    items: [
      { value: "Energy", evidence: "Team-night footage", body: "The culture is loud, optimistic, and genuinely fun, and it shows up on camera, not just in a slide.", tone: "warm" as const },
      { value: "Growth", evidence: "A named promotion story", body: "Real people who started in the field and now lead, with their story, in their words.", tone: "warm" as const },
      { value: "Teamwork", evidence: "Group UGC", body: "We win as a team. The footage our people post themselves is the proof.", tone: "warm" as const },
      { value: "Integrity", evidence: "Our brand-safety stance", body: "We protect the brands we represent and the people we hire. Honest framing, no hype.", tone: "cool" as const },
    ],
  },
  stat: {
    value: 75,
    suffix: "%+",
    headline: "of applications get a reply within one business day.",
    body: "People-first isn't a slogan; it's how we treat you from the very first message. (Source: Indeed responsiveness.)",
  },
  testimonial: {
    eyebrow: "From the team",
    heading: "Hear it from the people who live it.",
    body: "Real reps and managers, in their own words. Not actors, not stock, not AI.",
  },
  roles: {
    eyebrow: "Open roles",
    heading: "Show us your energy.",
    body: "We're always meeting driven people. Tell us about you. A short application is all it takes to start.",
    list: [
      { title: "Entry-Level Brand Ambassador", type: "Full-time · Halifax, NS", blurb: "Face-to-face customer acquisition with full training and a clear path to leadership." },
      { title: "Field Sales Representative", type: "Full-time · Atlantic Canada", blurb: "Represent national brands in person and grow into team leadership on merit." },
      { title: "Team Lead (Internal Track)", type: "Promotion track", blurb: "For reps ready to coach, own results, and learn to run a campaign." },
    ],
    apply: "Apply in 2 minutes",
  },
  faq: {
    eyebrow: "Honest answers",
    heading: "Before you apply.",
    items: [
      {
        q: "Is this commission-only or a pyramid scheme?",
        a: "It's a real job at a real firm. We're transparent about how the role pays in the interview, where we can be specific to your market. There's no buy-in and no recruiting-to-earn.",
      },
      {
        q: "Do I need experience?",
        a: "No. We hire for energy and integrity and train the rest. Plenty of our leaders started with zero sales experience.",
      },
      {
        q: "What does growth actually look like?",
        a: "A clear ladder: Entry Rep → Team Lead → Assistant Manager → running a campaign or office, climbed on merit, not tenure.",
      },
    ],
  },
  cta: {
    heading: "Grow With Us.",
    body: "If you're driven, coachable, and people give you energy, let's talk.",
    microcopy: "We reply within one business day. Every application gets a real response.",
  },
};

export const about = {
  hero: {
    eyebrow: "About",
    headline: ["Genuine connections", "between people, brands,", "and communities."],
    sub: "Atlantic Connect Marketing Inc. is a Halifax field-marketing and sales firm built on a simple belief: the most powerful marketing still happens in person.",
  },
  mission: {
    eyebrow: "Why we exist",
    heading: "We grow brands, and the people who build them.",
    body: "We win customers for brands the human way, face to face across Atlantic Canada, and we build careers for ambitious young people who do that work. The same current runs through both: real connection, made in person.",
  },
  values: {
    eyebrow: "What we stand for",
    heading: "Four values, lived daily.",
    items: [
      { title: "Integrity", body: "We protect the brands we represent and the people we hire. Honest framing, always." },
      { title: "Growth", body: "We develop people relentlessly, and promote from within on merit." },
      { title: "Teamwork", body: "We win together. The culture is the strategy." },
      { title: "Energy", body: "Optimistic, high-energy, and genuinely fun to be part of." },
    ],
  },
  office: {
    eyebrow: "Where we are",
    heading: "Downtown Halifax, 1568 Argyle St.",
    body: "A real office on Argyle Street, in the heart of downtown Halifax. Our community claim isn't a tagline; it's the city we work in every day.",
  },
  leadership: {
    eyebrow: "Our people",
    heading: "The people behind the current.",
    body: "We grow our leaders from the field, and many started exactly where new reps start today. More of the team joins this page as we keep building.",
  },
};

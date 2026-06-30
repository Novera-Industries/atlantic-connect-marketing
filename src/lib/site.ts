/**
 * Single source of truth for ground-truth brand facts.
 * Public name is standardized as "Atlantic Connect Marketing Inc." everywhere.
 * ("Atlantic Connect Services Inc." is the payroll entity - never shown publicly.)
 */
export const site = {
  name: "Atlantic Connect Marketing Inc.",
  shortName: "Atlantic Connect Marketing",
  // Production origin. Override per-deployment with NEXT_PUBLIC_SITE_URL
  // (inlined at build time) — e.g. https://acm.vyradata.com for the VPS preview.
  // Falls back to the canonical production domain when unset.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://atlanticconnectmarketing.ca",
  // Brand spine (em dash removed per direction; meaning preserved).
  spine:
    "genuine connections between people, brands, and communities.",
  evp: "Grow With Us.",
  // "Elevate Your Sales Strategy" lives on the Partner page ONLY - never the neutral hero.
  clientTagline: "Elevate Your Sales Strategy",
  values: ["Integrity", "Growth", "Teamwork", "Energy"] as const,
  // The one genuinely-citable, verifiable people-first signal (Indeed).
  responseStat: { value: 75, label: "of applications get a reply within one business day" },
  address: {
    street: "1568 Argyle St, Unit 3",
    city: "Halifax",
    region: "NS",
    regionName: "Nova Scotia",
    postalCode: "B3J 2B3",
    country: "CA",
    full: "1568 Argyle St, Unit 3, Halifax, NS B3J 2B3",
  },
  social: {
    instagram: "https://www.instagram.com/atlanticconnectmarketing/",
    instagramHandle: "@atlanticconnectmarketing",
    linkedin: "https://www.linkedin.com/company/atlantic-connect-marketing-inc",
  },
  email: {
    partners: "partners@atlanticconnectmarketing.ca",
    careers: "careers@atlanticconnectmarketing.ca",
  },
} as const;

export const nav = [
  { label: "Home", href: "/" },
  { label: "Partner With Us", href: "/partner" },
  { label: "Careers", href: "/careers" },
  { label: "About", href: "/about" },
] as const;

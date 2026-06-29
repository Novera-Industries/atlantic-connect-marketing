import { site } from "./site";
import { careers, partner } from "./content";

/** LocalBusiness - Halifax, 1568 Argyle St. */
export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${site.url}/#business`,
    name: site.name,
    description:
      "Face-to-face / direct field-marketing and sales firm in Halifax, Nova Scotia - outsourced, in-person customer acquisition for brands across Atlantic Canada.",
    url: site.url,
    areaServed: "Atlantic Canada",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    sameAs: [site.social.instagram, site.social.linkedin],
    knowsAbout: ["Field marketing", "Direct sales", "Customer acquisition", "Experiential marketing"],
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#org`,
    name: site.name,
    url: site.url,
    slogan: site.evp,
    sameAs: [site.social.instagram, site.social.linkedin],
  };
}

/** JobPosting per open role (Careers). DatePosted is supplied at render time. */
export function jobPostingSchema(role: { title: string; type: string; blurb: string }, datePosted: string) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: role.title,
    description: role.blurb,
    datePosted,
    employmentType: role.type.toLowerCase().includes("full-time") ? "FULL_TIME" : "OTHER",
    hiringOrganization: {
      "@type": "Organization",
      name: site.name,
      sameAs: site.url,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress: site.address.street,
        addressLocality: site.address.city,
        addressRegion: site.address.region,
        postalCode: site.address.postalCode,
        addressCountry: site.address.country,
      },
    },
    applicantLocationRequirements: { "@type": "Country", name: "Canada" },
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

export const schemas = {
  localBusiness: localBusinessSchema,
  organization: organizationSchema,
  partnerFaq: () => faqSchema(partner.faq.items),
  careersFaq: () => faqSchema(careers.faq.items),
};

import type { Metadata } from "next";
import { Container, Section, Eyebrow } from "@/components/layout/Container";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy (PIPEDA)",
  description: "How Atlantic Connect Marketing Inc. handles personal information under PIPEDA.",
  robots: { index: false, follow: true },
};

// Placeholder privacy page - replace with counsel-reviewed PIPEDA copy + the
// chosen privacy-friendly analytics (Plausible/Umami) consent disclosure.
export default function PrivacyPage() {
  return (
    <Section className="pt-32">
      <Container size="prose">
        <Eyebrow tone="muted">Privacy</Eyebrow>
        <h1 className="mt-5 font-display text-display-md font-semibold text-ink">Privacy &amp; PIPEDA</h1>
        <div className="mt-8 space-y-5 text-muted">
          <p>
            {site.name} respects your privacy. We collect only the information you choose to share with us, for
            example when you book a strategy call or apply for a role, and we use it solely to respond to you.
          </p>
          <p>
            We handle personal information in accordance with Canada&apos;s Personal Information Protection and
            Electronic Documents Act (PIPEDA). We use privacy-friendly, self-hosted analytics and do not sell your data.
          </p>
          <p>
            This page is a placeholder pending a counsel-reviewed privacy policy and the final analytics/consent
            configuration. Questions? Email{" "}
            <a href={`mailto:${site.email.partners}`} className="text-brand-bright underline">
              {site.email.partners}
            </a>
            .
          </p>
        </div>
      </Container>
    </Section>
  );
}

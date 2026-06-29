import { ShieldCheck } from "lucide-react";
import { Container, Section, Eyebrow } from "@/components/layout/Container";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { AnchorPoint } from "./AnchorPoint";
import { home, partner } from "@/lib/content";

export function TrustBand() {
  return (
    <Section id="trust" className="isolate border-t border-line">
      {/* soft top scrim to seat the heading; the reconverged Current funnels into the CTA cards below */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg/40 via-transparent to-transparent" />
      <Container size="shell" className="relative z-10">
        <div className="relative mx-auto max-w-3xl">
          {/* legibility plate — the current flows around this copy, not over it */}
          <div className="pointer-events-none absolute -inset-x-12 -inset-y-8 bg-[radial-gradient(62%_70%_at_50%_50%,rgba(11,26,43,0.92),rgba(11,26,43,0.6)_55%,transparent_82%)]" />
          <div className="relative text-center">
            <Eyebrow tone="muted" className="justify-center">
              How we earn trust
            </Eyebrow>
            <SplitReveal as="h2" className="mx-auto mt-5 max-w-[20ch] font-display text-display-md font-semibold text-ink">
              {home.trust.heading}
            </SplitReveal>
            <Reveal delay={0.05}>
              <p className="mx-auto mt-5 max-w-prose text-muted">{home.trust.body}</p>
            </Reveal>
          </div>
        </div>

        {/* compact 4-step process strip - the current settles through the work.
            Carries the `trust` anchor now that the redundant dual CTA is gone
            (the global footer already has the For brands / For talent CTAs). */}
        <AnchorPoint name="trust">
          <RevealGroup className="relative mt-14 grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {partner.how.steps.map((s) => (
              <RevealItem key={s.n} className="bg-bg-elev p-6">
                <span className="font-display text-2xl font-semibold text-brand-bright">{s.n}</span>
                <h3 className="mt-2 font-display text-lg text-ink">{s.title}</h3>
                <p className="mt-1.5 text-sm text-subtle">{s.contact}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </AnchorPoint>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-8 flex max-w-2xl items-center justify-center gap-2.5 text-center text-sm text-muted">
            <ShieldCheck className="h-4 w-4 shrink-0 text-brand-bright" />
            Trained, compliant, on-brand reps. You define the result, we&apos;re accountable to it.
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}

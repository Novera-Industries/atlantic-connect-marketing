import { UserCheck } from "lucide-react";
import { Container, Section, Eyebrow } from "@/components/layout/Container";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";
import { partner } from "@/lib/content";

const h = partner.how;

/**
 * 4-step scrollytelling. In-flow (sticky left column + revealed steps), NOT a
 * hard pin - preserves find-in-page and anchor links, and keeps the page to a
 * single heavy pinned scene budget for the Fork elsewhere.
 */
export function HowItWorks() {
  return (
    <Section id="how" className="border-t border-line">
      <Container size="shell">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          {/* sticky intro + progress spine */}
          <div className="lg:sticky lg:top-28 lg:h-fit">
            <Eyebrow tone="ocean">{h.eyebrow}</Eyebrow>
            <SplitReveal as="h2" className="mt-5 max-w-[16ch] font-display text-display-md font-semibold text-ink">
              {h.heading}
            </SplitReveal>
            <Reveal delay={0.05}>
              <p className="mt-6 max-w-prose text-muted">
                A transparent, named-contact process, so you always know who&apos;s accountable and how your brand is
                protected at every step.
              </p>
            </Reveal>
          </div>

          {/* steps — numbered timeline; the connector runs through the badge centres */}
          <ol className="relative">
            {h.steps.map((s, i) => (
              <Reveal as="li" key={s.n} delay={i * 0.05} className="relative flex gap-5 pb-7 last:pb-0">
                <div className="relative flex w-9 shrink-0 flex-col items-center">
                  <span className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full border border-brand/40 bg-bg font-display text-sm font-semibold tabular-nums text-brand-bright">
                    {s.n}
                  </span>
                  {i < h.steps.length - 1 && (
                    <span aria-hidden className="absolute left-1/2 top-9 -bottom-7 w-px -translate-x-1/2 bg-line" />
                  )}
                </div>
                <div className="flex-1 rounded-card border border-line bg-bg-elev p-6 sm:p-7">
                  <h3 className="font-display text-xl text-ink sm:text-2xl">{s.title}</h3>
                  <p className="mt-3 text-muted">{s.body}</p>
                  <p className="mt-4 inline-flex items-center gap-2 text-sm text-brand-bright">
                    <UserCheck aria-hidden="true" className="h-4 w-4" />
                    {s.contact}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}

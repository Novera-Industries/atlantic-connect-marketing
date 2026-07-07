import { Container, Section, Eyebrow } from "@/components/layout/Container";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";
import { TeamRail } from "./TeamRail";
import { AnchorPoint } from "./AnchorPoint";
import { home } from "@/lib/content";

const c = home.culture;

/**
 * Act 8 — culture, then the close. Carries the `trust` anchor: the Current
 * settles into its calm final wave below this block (fSettle, stage 7), braids
 * blue+gold, and hides behind the footer — whose dual CTA banner is the
 * story's actual ending (kept there on purpose; no duplicate CTA block here).
 */
export function Culture() {
  return (
    <Section id="culture" className="isolate overflow-hidden border-t border-line">
      <Container size="shell" className="relative z-10">
        <div className="relative mx-auto max-w-2xl text-center">
          <div className="pointer-events-none absolute -inset-x-10 -inset-y-6 bg-[radial-gradient(60%_70%_at_50%_50%,rgba(11,26,43,0.9),rgba(11,26,43,0.5)_58%,transparent_84%)]" />
          <div className="relative">
            <Eyebrow tone="muted" className="justify-center">
              {c.eyebrow}
            </Eyebrow>
            <SplitReveal
              as="h2"
              className="mx-auto mt-5 max-w-[16ch] font-display text-display-md font-semibold text-ink"
            >
              {c.heading}
            </SplitReveal>
            <Reveal delay={0.05}>
              <p className="mx-auto mt-5 max-w-prose text-muted">{c.body}</p>
            </Reveal>
          </div>
        </div>

        <AnchorPoint name="trust">
          <TeamRail />
        </AnchorPoint>
      </Container>
    </Section>
  );
}

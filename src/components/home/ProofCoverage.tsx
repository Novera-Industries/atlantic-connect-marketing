import { Container, Section, Eyebrow } from "@/components/layout/Container";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/CountUp";
import { Button, ProofCTA } from "@/components/ui/Button";
import { AnchorPoint } from "./AnchorPoint";
import { home, partner } from "@/lib/content";

const pr = home.proof;
// Only genuinely-true numbers animate (the no-fabricated-proof rule).
const stats = partner.stats.items.filter((s) => s.real);

/**
 * Act 5 — proof and coverage. The Current fans into four parallel lanes here
 * (fLanes, stage 4): one lane per in-person channel. Count-ups are scroll-
 * locked and only verifiable numbers render; the pending-proof honesty note
 * carries over from the Partner stat wall.
 */
export function ProofCoverage() {
  return (
    <Section id="proof" className="isolate overflow-hidden">
      <Container size="container" className="relative z-10">
        <div className="relative mx-auto max-w-2xl text-center">
          <div className="pointer-events-none absolute -inset-x-10 -inset-y-6 bg-[radial-gradient(60%_70%_at_50%_50%,rgba(11,26,43,0.88),rgba(11,26,43,0.45)_60%,transparent_84%)]" />
          <div className="relative">
            <Eyebrow tone="ocean" className="justify-center">
              {pr.eyebrow}
            </Eyebrow>
            <SplitReveal
              as="h2"
              className="mx-auto mt-5 max-w-[16ch] font-display text-display-md font-semibold text-ink"
            >
              {pr.heading}
            </SplitReveal>
            <Reveal delay={0.05}>
              <p className="mx-auto mt-5 max-w-prose text-muted">{pr.body}</p>
            </Reveal>
          </div>
        </div>

        <AnchorPoint name="coverage">
          {/* the four lanes of the Current flow behind these four channels */}
          <RevealGroup className="mx-auto mt-14 grid max-w-4xl gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {partner.coverage.channels.map((c) => (
              <RevealItem key={c.title} className="bg-bg-elev/95 p-6">
                <h3 className="font-display text-lg font-semibold text-ink">{c.title}</h3>
                <p className="mt-2 text-sm text-subtle">{c.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal delay={0.08}>
            <div className="relative mx-auto mt-12 max-w-2xl">
              {/* legibility plate — the coverage lanes flow around the stats, not over them */}
              <div className="pointer-events-none absolute -inset-x-8 -inset-y-4 bg-[radial-gradient(70%_85%_at_50%_50%,rgba(11,26,43,0.88),rgba(11,26,43,0.45)_62%,transparent_86%)]" />
              <dl className="relative grid grid-cols-3 gap-6 border-y border-line py-7 text-center">
                {stats.map((s) => (
                  <div key={s.label}>
                    <dd className="font-display text-3xl font-semibold text-chrome sm:text-4xl">
                      <CountUp value={s.value as number} suffix={s.suffix} />
                    </dd>
                    <dt className="mt-1.5 text-xs text-subtle">{s.label}</dt>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-5 max-w-xl text-center text-sm text-subtle">{pr.note}</p>
          </Reveal>
        </AnchorPoint>

        <Reveal delay={0.15} className="mt-10">
          <ProofCTA className="items-center text-center" proof={partner.cta.microcopy}>
            <Button href="/partner#coverage" variant="outline" size="md">
              {pr.cta}
            </Button>
          </ProofCTA>
        </Reveal>
      </Container>
    </Section>
  );
}

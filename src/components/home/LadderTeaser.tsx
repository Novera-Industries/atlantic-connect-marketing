import { Container, Section, Eyebrow } from "@/components/layout/Container";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/CountUp";
import { Button, ProofCTA } from "@/components/ui/Button";
import { AnchorPoint } from "./AnchorPoint";
import { home, careers } from "@/lib/content";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";

const l = home.ladder;
const rungs = careers.ladder.rungs;

/**
 * Act 7 — the talent story, warm. The rungs step UP across the row (the climb
 * made literal) while the warm Current rises diagonally behind them (fRise,
 * stage 6). Carries the 75% reply stat as the CTA's micro-proof.
 */
export function LadderTeaser() {
  return (
    <Section id="for-talent" className="isolate overflow-hidden">
      {/* warm wash — the temperature turns after the cool client acts */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_70%_10%,rgba(232,201,138,0.10),transparent_60%)]" />
      <Container size="container" className="relative z-10">
        <div className="relative mx-auto max-w-2xl text-center">
          <div className="pointer-events-none absolute -inset-x-10 -inset-y-6 bg-[radial-gradient(60%_70%_at_50%_50%,rgba(11,26,43,0.88),rgba(11,26,43,0.45)_60%,transparent_84%)]" />
          <div className="relative">
            <Eyebrow tone="gold" className="justify-center">
              {l.eyebrow}
            </Eyebrow>
            <SplitReveal
              as="h2"
              className="mx-auto mt-5 max-w-[15ch] font-display text-display-md font-semibold text-gold"
            >
              {l.heading}
            </SplitReveal>
            <Reveal delay={0.05}>
              <p className="mx-auto mt-5 max-w-prose text-muted">{l.body}</p>
            </Reveal>
          </div>
        </div>

        <AnchorPoint name="talent">
          {/* the climb — each rung sits a step higher on desktop */}
          <RevealGroup className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
            {rungs.map((r, i) => (
              <RevealItem
                key={r.role}
                as="div"
                className={cn(
                  "rounded-card border border-gold-mid/25 bg-bg-deep/90 p-6",
                  i === 1 && "lg:mb-10",
                  i === 2 && "lg:mb-20",
                  i === 3 && "border-gold-mid/50 lg:mb-32"
                )}
              >
                <span className="font-display text-2xl font-semibold tabular-nums text-gold-lo">
                  0{i + 1}
                </span>
                <h3 className="mt-2 font-display text-lg font-semibold text-gold-hi">{r.role}</h3>
                <p className="mt-1 text-eyebrow font-medium uppercase tracking-[0.18em] text-gold-mid">
                  {r.when}
                </p>
                <p className="mt-3 text-sm text-muted">{r.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </AnchorPoint>

        <Reveal delay={0.1} className="mt-12">
          <ProofCTA
            className="items-center text-center"
            proof={
              <>
                <span className="font-display text-base font-semibold text-gold-hi">
                  <CountUp value={site.responseStat.value} suffix="%+" />
                </span>{" "}
                {careers.stat.headline}
              </>
            }
          >
            <Button href="/careers" variant="gold" size="lg">
              {l.cta}
            </Button>
          </ProofCTA>
        </Reveal>
      </Container>
    </Section>
  );
}

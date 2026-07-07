import { Container, Eyebrow } from "@/components/layout/Container";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";
import { AnchorPoint } from "./AnchorPoint";
import { home } from "@/lib/content";

const t = home.tension;

/**
 * Act 2 — the tension beat. The one place the Current is NOT water: the
 * particles degrade into cold digital static (fNoise, stage 1) while the copy
 * names the problem. The act resolves as you scroll on and the static
 * organizes back into the human current at the client section.
 */
export function Tension() {
  return (
    <AnchorPoint
      name="noise"
      as="section"
      id="tension"
      className="relative isolate flex min-h-[110svh] items-center overflow-hidden bg-[rgba(6,17,30,0.4)]"
    >
      {/* legibility plate — the static crackles around the copy, not over it */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(52%_46%_at_50%_50%,rgba(6,17,30,0.88),rgba(6,17,30,0.4)_60%,transparent_82%)]" />
      <Container size="container" className="relative z-10 w-full">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Eyebrow tone="muted" className="justify-center">
            {t.eyebrow}
          </Eyebrow>
          <SplitReveal
            as="h2"
            className="mt-6 max-w-[12ch] font-display text-display-lg font-semibold text-subtle"
          >
            {t.headline.join(" ")}
          </SplitReveal>
          <Reveal delay={0.05}>
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted">{t.body}</p>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-10 font-display text-xl font-medium text-chrome sm:text-2xl">{t.punch}</p>
          </Reveal>
        </div>
      </Container>
    </AnchorPoint>
  );
}

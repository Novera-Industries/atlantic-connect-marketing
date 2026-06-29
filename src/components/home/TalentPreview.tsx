import { Container, Section, Eyebrow } from "@/components/layout/Container";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/CountUp";
import { Button } from "@/components/ui/Button";
import { TeamRail } from "./TeamRail";
import { AnchorPoint } from "./AnchorPoint";
import { home } from "@/lib/content";
import { site } from "@/lib/site";

const t = home.talentPreview;

export function TalentPreview() {
  return (
    <Section id="for-talent" className="relative overflow-hidden">
      {/* warm wash so the temperature shifts from the client section above */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_80%_0%,rgba(232,201,138,0.10),transparent_60%)]" />
      {/* gentle scrim toward the copy (left); the warm swarm rises into the card (right) */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-bg/45 via-bg/10 to-transparent" />
      <Container size="shell" className="relative z-10">
        <div className="grid items-end gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative">
            {/* legibility plate — the warm current flows around this copy, not over it */}
            <div className="pointer-events-none absolute -inset-x-8 -inset-y-6 bg-[radial-gradient(78%_78%_at_32%_50%,rgba(11,26,43,0.9),rgba(11,26,43,0.45)_58%,transparent_85%)]" />
            <div className="relative">
              <Eyebrow tone="gold">{t.eyebrow}</Eyebrow>
              <SplitReveal as="h2" className="mt-5 font-display text-display-lg font-semibold text-gold">
                {t.heading}
              </SplitReveal>
              <Reveal delay={0.05}>
                <p className="mt-6 max-w-prose text-lg text-muted">{t.body}</p>
              </Reveal>
            </div>
          </div>

          {/* the warm talent stream of the Current rises into this proof card */}
          <AnchorPoint name="talent">
            <Reveal delay={0.1} className="lg:pb-2">
              <div className="rounded-card border border-gold-mid/25 bg-bg-deep bg-gradient-to-br from-[#1a1407] to-bg-deep p-7">
                <p className="font-display text-5xl font-semibold text-gold sm:text-6xl">
                  <CountUp value={site.responseStat.value} suffix="%+" />
                </p>
                <p className="mt-2 text-sm text-muted">
                  of applications get a reply within one business day. People-first, from your very first message.
                </p>
                <Button href="/careers" variant="gold" size="md" className="mt-6">
                  {t.cta}
                </Button>
              </div>
            </Reveal>
          </AnchorPoint>
        </div>

        <TeamRail />
      </Container>
    </Section>
  );
}

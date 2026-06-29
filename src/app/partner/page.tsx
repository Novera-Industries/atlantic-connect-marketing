import type { Metadata } from "next";
import { Check, Lock, Home as HomeIcon, Store, Briefcase, PartyPopper, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Container, Section, Eyebrow } from "@/components/layout/Container";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { PageHero } from "@/components/sections/PageHero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { StatWall } from "@/components/sections/StatWall";
import { Faq } from "@/components/sections/Faq";
import { StrategyCallForm } from "@/components/sections/StrategyCallForm";
import { MediaFrame } from "@/components/media/MediaFrame";
import { WaveDivider } from "@/components/brand/WaveDivider";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { partner } from "@/lib/content";
import { media } from "@/lib/media";
import { schemas } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Partner With Us · Face-to-face customer acquisition",
  description:
    "Elevate your sales strategy with a human channel a digital agency can't replicate. Trained, on-brand reps acquiring real customers across Atlantic Canada. Book a 20-minute strategy call.",
};

const channelIcons = [HomeIcon, Store, Briefcase, PartyPopper];

export default function PartnerPage() {
  return (
    <>
      <JsonLd data={schemas.partnerFaq()} />

      <PageHero
        eyebrow={partner.hero.eyebrow}
        headline={partner.hero.headline}
        sub={partner.hero.sub}
        tagline={partner.hero.tagline}
        tone="cool"
        image={{ src: media.currentCool.src, blur: media.currentCool.blur }}
      />

      {/* Differentiator */}
      <Section id="differentiator">
        <Container size="shell">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <Eyebrow tone="ocean">{partner.differentiator.eyebrow}</Eyebrow>
              <SplitReveal as="h2" className="mt-5 max-w-[16ch] font-display text-display-md font-semibold text-ink">
                {partner.differentiator.heading}
              </SplitReveal>
              <Reveal delay={0.05}>
                <p className="mt-6 max-w-prose text-lg text-muted">{partner.differentiator.body}</p>
              </Reveal>
            </div>
            <RevealGroup className="flex flex-col gap-4">
              {partner.differentiator.points.map((p) => (
                <RevealItem key={p.title} className="rounded-card border border-line bg-bg-elev p-6">
                  <h3 className="font-display text-xl text-ink">{p.title}</h3>
                  <p className="mt-2 text-muted">{p.body}</p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </Container>
      </Section>

      <HowItWorks />

      {/* Credibility wall - verifiable only */}
      <Section id="numbers" className="border-t border-line">
        <Container size="shell">
          <div className="max-w-2xl">
            <Eyebrow tone="ocean">{partner.stats.eyebrow}</Eyebrow>
            <SplitReveal as="h2" className="mt-5 font-display text-display-md font-semibold text-ink">
              {partner.stats.heading}
            </SplitReveal>
          </div>
          <Reveal delay={0.05} className="mt-10">
            <StatWall items={partner.stats.items} />
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-prose text-sm text-subtle">{partner.stats.note}</p>
          </Reveal>
        </Container>
      </Section>

      {/* Case studies - designed no-proof state */}
      <Section id="results">
        <Container size="shell">
          <div className="max-w-2xl">
            <Eyebrow tone="ocean">{partner.caseStudies.eyebrow}</Eyebrow>
            <SplitReveal as="h2" className="mt-5 font-display text-display-md font-semibold text-ink">
              {partner.caseStudies.heading}
            </SplitReveal>
            <Reveal delay={0.05}>
              <p className="mt-6 text-lg text-muted">{partner.caseStudies.body}</p>
            </Reveal>
          </div>
          <RevealGroup className="mt-12 grid gap-5 lg:grid-cols-3">
            {partner.caseStudies.sectors.map((sector) => (
              <RevealItem key={sector} className="flex flex-col rounded-card border border-line bg-bg-elev p-7">
                <span className="text-eyebrow font-medium uppercase tracking-[0.18em] text-subtle">Case study</span>
                <h3 className="mt-2 font-display text-xl text-ink">{sector}</h3>
                <ol className="mt-5 space-y-2.5">
                  {partner.caseStudies.skeleton.map((label, i) => (
                    <li key={label} className="flex items-center gap-3 text-sm text-subtle">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-brand/30 text-[0.7rem] font-medium tabular-nums text-brand-bright">
                        {i + 1}
                      </span>
                      <span>{label}</span>
                    </li>
                  ))}
                </ol>
                <span className="mt-6 inline-block rounded-full border border-line px-3 py-1 text-[0.65rem] uppercase tracking-[0.18em] text-subtle">
                  {partner.caseStudies.status}
                </span>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
        <WaveDivider className="mt-20 opacity-60" />
      </Section>

      {/* Risk reversal */}
      <Section id="brand-safety" className="bg-bg-elev">
        <Container size="shell">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <Eyebrow tone="ocean">{partner.riskReversal.eyebrow}</Eyebrow>
              <SplitReveal as="h2" className="mt-5 max-w-[16ch] font-display text-display-md font-semibold text-ink">
                {partner.riskReversal.heading}
              </SplitReveal>
              <Reveal delay={0.05}>
                <p className="mt-6 max-w-prose text-lg text-muted">{partner.riskReversal.body}</p>
              </Reveal>
            </div>
            <RevealGroup className="flex flex-col gap-3">
              {partner.riskReversal.guarantees.map((g) => (
                <RevealItem key={g} className="flex items-start gap-3 rounded-card border border-line bg-bg p-5">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand-bright">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-muted">{g}</span>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </Container>
      </Section>

      {/* Confidentiality as strength */}
      <Section>
        <Container size="shell">
          <Reveal>
            <div className="relative overflow-hidden rounded-card border border-line bg-gradient-to-br from-bg-elev to-bg-deep p-10 sm:p-14">
              <Lock className="h-8 w-8 text-chrome-mid" />
              <h2 className="mt-6 max-w-[18ch] font-display text-display-md font-semibold text-chrome">
                {partner.confidentiality.heading}
              </h2>
              <p className="mt-5 max-w-prose text-lg text-muted">{partner.confidentiality.body}</p>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Coverage */}
      <Section id="coverage" className="border-t border-line">
        <Container size="shell">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div>
              <Eyebrow tone="ocean">{partner.coverage.eyebrow}</Eyebrow>
              <SplitReveal as="h2" className="mt-5 font-display text-display-md font-semibold text-ink">
                {partner.coverage.heading}
              </SplitReveal>
              <Reveal delay={0.05}>
                <p className="mt-6 max-w-prose text-lg text-muted">{partner.coverage.body}</p>
              </Reveal>
              <RevealGroup className="mt-8 grid gap-4 sm:grid-cols-2">
                {partner.coverage.channels.map((ch, i) => {
                  const Icon = channelIcons[i];
                  return (
                    <RevealItem key={ch.title} className="rounded-card border border-line bg-bg-elev p-5">
                      <Icon className="h-5 w-5 text-brand-bright" />
                      <h3 className="mt-3 font-display text-lg text-ink">{ch.title}</h3>
                      <p className="mt-1.5 text-sm text-muted">{ch.body}</p>
                    </RevealItem>
                  );
                })}
              </RevealGroup>
            </div>
            <Reveal y={36}>
              <MediaFrame
                src={media.halifaxBright.src}
                blur={media.halifaxBright.blur}
                aspect="4/5"
                tone="cool"
                alt="The Halifax waterfront on a bright clear day, the heart of Atlantic Canada coverage."
                caption="Halifax & Atlantic Canada, where we work, in person."
                className="shadow-lift"
              />
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Legitimacy FAQ */}
      <Section className="bg-bg-elev">
        <Container size="container">
          <div className="max-w-2xl">
            <Eyebrow tone="ocean">{partner.faq.eyebrow}</Eyebrow>
            <SplitReveal as="h2" className="mt-5 font-display text-display-md font-semibold text-ink">
              {partner.faq.heading}
            </SplitReveal>
          </div>
          <div className="mt-10">
            <Faq items={partner.faq.items} tone="ocean" />
          </div>
        </Container>
      </Section>

      {/* CTA + form */}
      <Section id="contact" className="border-t border-line bg-bg-deep">
        <Container size="shell">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <Eyebrow tone="ocean">{partner.cta.eyebrow}</Eyebrow>
              <SplitReveal as="h2" className="mt-5 max-w-[14ch] font-display text-display-lg font-semibold text-chrome">
                {partner.cta.heading}
              </SplitReveal>
              <Reveal delay={0.05}>
                <p className="mt-6 max-w-prose text-lg text-muted">{partner.cta.body}</p>
              </Reveal>
              <Reveal delay={0.1}>
                <Link
                  href="#how"
                  className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-brand-bright hover:text-ink"
                >
                  {partner.cta.secondary}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="mt-10 flex items-center gap-2.5 text-sm text-subtle">
                  <ShieldCheck className="h-4 w-4 text-brand-bright" />
                  Your reputation is the product we protect.
                </p>
              </Reveal>
            </div>
            <Reveal y={28}>
              <StrategyCallForm />
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  );
}

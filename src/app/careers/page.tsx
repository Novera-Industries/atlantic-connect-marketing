import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, TrendingUp, Quote, Heart, Zap, Users, ShieldCheck } from "lucide-react";
import { Container, Section, Eyebrow } from "@/components/layout/Container";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { PageHero } from "@/components/sections/PageHero";
import { DayInLife } from "@/components/careers/DayInLife";
import { Faq } from "@/components/sections/Faq";
import { CountUp } from "@/components/motion/CountUp";
import { MediaFrame } from "@/components/media/MediaFrame";
import { WaveDivider } from "@/components/brand/WaveDivider";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { careers } from "@/lib/content";
import { media } from "@/lib/media";
import { site } from "@/lib/site";
import { jobPostingSchema, faqSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Careers · Grow With Us",
  description:
    "Start in the field, learn to lead, and run your own campaign. People-first field-marketing careers in Halifax & Atlantic Canada. We reply to 75%+ of applications within one business day.",
};

const DATE_POSTED = "2026-06-01";
const valueIcons = { Energy: Zap, Growth: TrendingUp, Teamwork: Users, Integrity: ShieldCheck } as const;

export default function CareersPage() {
  const jobSchemas = careers.roles.list.map((r) => jobPostingSchema(r, DATE_POSTED));

  return (
    <>
      <JsonLd data={[...jobSchemas, faqSchema(careers.faq.items)]} />

      <PageHero
        eyebrow={careers.hero.eyebrow}
        headline={careers.hero.headline}
        sub={careers.hero.sub}
        tone="warm"
        image={{ src: media.currentWarm.src, blur: media.currentWarm.blur }}
      />

      <DayInLife />

      {/* Growth ladder */}
      <Section id="growth" className="border-t border-line">
        <Container size="shell">
          <div className="max-w-2xl">
            <Eyebrow tone="gold">{careers.ladder.eyebrow}</Eyebrow>
            <SplitReveal as="h2" className="mt-5 font-display text-display-md font-semibold text-ink">
              {careers.ladder.heading}
            </SplitReveal>
            <Reveal delay={0.05}>
              <p className="mt-6 text-lg text-muted">{careers.ladder.body}</p>
            </Reveal>
          </div>

          <ol className="relative mt-12">
            {careers.ladder.rungs.map((r, i) => (
              <Reveal as="li" key={r.role} delay={i * 0.06} className="relative flex gap-5 pb-7 last:pb-0">
                <div className="relative flex w-9 shrink-0 flex-col items-center">
                  <span className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full border border-gold-mid/45 bg-bg font-display text-sm font-semibold tabular-nums text-gold-mid">
                    {i + 1}
                  </span>
                  {i < careers.ladder.rungs.length - 1 && (
                    <span aria-hidden className="absolute left-1/2 top-9 -bottom-7 w-px -translate-x-1/2 bg-gold-mid/25" />
                  )}
                </div>
                <div className="flex-1 rounded-card border border-line bg-bg-elev p-6 sm:flex sm:items-center sm:justify-between sm:gap-6">
                  <div>
                    <h3 className="font-display text-xl text-ink sm:text-2xl">{r.role}</h3>
                    <p className="mt-2 max-w-xl text-muted">{r.body}</p>
                  </div>
                  <span className="mt-3 inline-block shrink-0 rounded-full border border-gold-mid/30 px-4 py-2 text-sm text-gold-mid sm:mt-0">
                    {r.when}
                  </span>
                </div>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={0.1}>
            <p className="mt-8 max-w-prose rounded-card border border-line bg-bg-elev p-6 text-sm text-subtle">
              {careers.ladder.earningsNote}
            </p>
          </Reveal>
        </Container>
        <WaveDivider tone="gold" className="mt-20 opacity-60" />
      </Section>

      {/* Values as evidence */}
      <Section id="values">
        <Container size="shell">
          <div className="max-w-2xl">
            <Eyebrow tone="gold">{careers.values.eyebrow}</Eyebrow>
            <SplitReveal as="h2" className="mt-5 font-display text-display-md font-semibold text-ink">
              {careers.values.heading}
            </SplitReveal>
          </div>
          <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2">
            {careers.values.items.map((v) => {
              const Icon = valueIcons[v.value as keyof typeof valueIcons] ?? Heart;
              // Teamwork uses the real team photo; the rest use AI filler (swap before launch).
              const valueImg: Record<string, { src: string; blur: string }> = {
                Teamwork: media.teamGroup,
                Energy: media.valueEnergy,
                Growth: media.valueGrowth,
                Integrity: media.valueIntegrity,
              };
              const valueAlt: Record<string, string> = {
                Teamwork: "The Atlantic Connect Marketing team together.",
                Energy: "The team celebrating together at a team night.",
                Growth: "A rep being congratulated on a promotion.",
                Integrity: "A rep honestly representing a brand with a customer.",
              };
              const real = valueImg[v.value] ?? null;
              return (
                <RevealItem key={v.value} className="overflow-hidden rounded-card border border-line bg-bg-elev">
                  <MediaFrame
                    tone={v.tone}
                    kind="film"
                    aspect="16/9"
                    label={v.evidence}
                    rounded="none"
                    src={real?.src}
                    blur={real?.blur}
                    objectPosition="center 30%"
                    alt={real ? valueAlt[v.value] ?? "" : ""}
                  />
                  <div className="p-6 sm:p-7">
                    <span className="inline-flex items-center gap-2 text-eyebrow font-medium uppercase tracking-[0.18em] text-gold-mid">
                      <Icon className="h-4 w-4" />
                      {v.value}
                    </span>
                    <p className="mt-3 text-muted">{v.body}</p>
                    <p className="mt-3 text-sm text-subtle">Evidence: {v.evidence}</p>
                  </div>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </Container>
      </Section>

      {/* The stat */}
      <Section className="border-y border-line bg-bg-elev">
        <Container size="shell" className="text-center">
          <Reveal>
            <p className="font-display text-[clamp(4rem,14vw,11rem)] font-semibold leading-none text-gold">
              <CountUp value={careers.stat.value} suffix={careers.stat.suffix} />
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mx-auto mt-4 max-w-2xl font-display text-2xl text-ink sm:text-3xl">{careers.stat.headline}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-4 max-w-prose text-muted">{careers.stat.body}</p>
          </Reveal>
        </Container>
      </Section>

      {/* Testimonial + UGC */}
      <Section id="voices">
        <Container size="shell">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <Reveal y={32}>
              <MediaFrame
                tone="warm"
                kind="film"
                aspect="4/5"
                label="Rep & manager testimonial, in their own words"
                caption="Authentic footage · no actors, no stock, no AI"
                className="shadow-lift"
              />
            </Reveal>
            <div>
              <Eyebrow tone="gold">{careers.testimonial.eyebrow}</Eyebrow>
              <SplitReveal as="h2" className="mt-5 font-display text-display-md font-semibold text-ink">
                {careers.testimonial.heading}
              </SplitReveal>
              <Reveal delay={0.05}>
                <Quote aria-hidden="true" className="mt-6 h-8 w-8 text-gold-mid" />
                <p className="mt-3 max-w-prose text-lg text-muted">{careers.testimonial.body}</p>
              </Reveal>
              <RevealGroup className="mt-8 grid grid-cols-3 gap-3">
                {[media.ig1, media.ig2, media.ig3].map((img, i) => (
                  <RevealItem key={i}>
                    <MediaFrame
                      tone="warm"
                      kind="photo"
                      aspect="1/1"
                      src={img.src}
                      blur={img.blur}
                      alt="A sample post from the Atlantic Connect Marketing Instagram."
                      label="Sample post from our Instagram"
                      rounded="card"
                    />
                  </RevealItem>
                ))}
              </RevealGroup>
              <Reveal delay={0.1}>
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm text-gold-mid hover:text-gold-hi"
                >
                  {site.social.instagramHandle}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* Open roles */}
      <Section id="roles" className="border-t border-line bg-bg-elev">
        <Container size="shell">
          <div className="max-w-2xl">
            <Eyebrow tone="gold">{careers.roles.eyebrow}</Eyebrow>
            <SplitReveal as="h2" className="mt-5 font-display text-display-md font-semibold text-ink">
              {careers.roles.heading}
            </SplitReveal>
            <Reveal delay={0.05}>
              <p className="mt-6 text-lg text-muted">{careers.roles.body}</p>
            </Reveal>
          </div>
          <RevealGroup className="mt-10 flex flex-col gap-3">
            {careers.roles.list.map((role) => (
              <RevealItem key={role.title}>
                <Link
                  href={`mailto:${site.email.careers}?subject=${encodeURIComponent("Application: " + role.title)}`}
                  className="group flex flex-col gap-3 rounded-card border border-line bg-bg p-6 transition-colors hover:border-gold-mid/40 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <h3 className="font-display text-xl text-ink sm:text-2xl">{role.title}</h3>
                    <p className="mt-1 text-sm text-subtle">{role.type}</p>
                    <p className="mt-2 max-w-xl text-muted">{role.blurb}</p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-gold-mid/40 px-5 py-3 text-sm text-gold-hi transition-colors group-hover:bg-gold-mid/10">
                    {careers.roles.apply}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      {/* FAQ */}
      <Section>
        <Container size="container">
          <div className="max-w-2xl">
            <Eyebrow tone="gold">{careers.faq.eyebrow}</Eyebrow>
            <SplitReveal as="h2" className="mt-5 font-display text-display-md font-semibold text-ink">
              {careers.faq.heading}
            </SplitReveal>
          </div>
          <div className="mt-10">
            <Faq items={careers.faq.items} tone="gold" />
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section className="border-t border-line bg-bg-deep">
        <Container size="shell" className="text-center">
          <SplitReveal as="h2" className="mx-auto max-w-[14ch] font-display text-display-lg font-semibold text-gold">
            {careers.cta.heading}
          </SplitReveal>
          <Reveal delay={0.05}>
            <p className="mx-auto mt-6 max-w-prose text-lg text-muted">{careers.cta.body}</p>
          </Reveal>
          <Reveal delay={0.1} className="mt-8 flex flex-col items-center gap-3">
            <Button
              href={`mailto:${site.email.careers}?subject=${encodeURIComponent("Application: Grow With Us")}`}
              variant="gold"
              size="lg"
            >
              {careers.roles.apply}
            </Button>
            <p className="text-sm text-subtle">{careers.cta.microcopy}</p>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}

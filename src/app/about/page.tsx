import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import { Container, Section, Eyebrow } from "@/components/layout/Container";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { PageHero } from "@/components/sections/PageHero";
import { MediaFrame } from "@/components/media/MediaFrame";
import { Button } from "@/components/ui/Button";
import { WaveDivider } from "@/components/brand/WaveDivider";
import { about } from "@/lib/content";
import { media } from "@/lib/media";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Atlantic Connect Marketing Inc., a Halifax field-marketing and sales firm built on genuine connections between people, brands, and communities.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow={about.hero.eyebrow}
        headline={about.hero.headline}
        sub={about.hero.sub}
        tone="cool"
        image={{ src: media.halifaxHarbour.src, blur: media.halifaxHarbour.blur }}
      />

      {/* Mission */}
      <Section>
        <Container size="shell">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <Eyebrow tone="ocean">{about.mission.eyebrow}</Eyebrow>
              <SplitReveal as="h2" className="mt-5 max-w-[16ch] font-display text-display-md font-semibold text-ink">
                {about.mission.heading}
              </SplitReveal>
            </div>
            <Reveal>
              <p className="text-lg text-muted">{about.mission.body}</p>
              <p className="mt-7 font-display text-2xl leading-snug text-chrome sm:text-3xl">{site.spine}</p>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Values */}
      <Section className="border-y border-line bg-bg-elev">
        <Container size="shell">
          <div className="max-w-2xl">
            <Eyebrow tone="ocean">{about.values.eyebrow}</Eyebrow>
            <SplitReveal as="h2" className="mt-5 font-display text-display-md font-semibold text-ink">
              {about.values.heading}
            </SplitReveal>
          </div>
          <RevealGroup className="mt-12 grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {about.values.items.map((v) => (
              <RevealItem key={v.title} className="bg-bg-elev p-7">
                <h3 className="font-display text-2xl text-ink">{v.title}</h3>
                <p className="mt-3 text-sm text-muted">{v.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      {/* Office */}
      <Section>
        <Container size="shell">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <Reveal y={32}>
              <MediaFrame
                src={media.officeInterior.src}
                alt="A modern downtown Halifax office interior."
                aspect="4/3"
                tone="cool"
                caption="Our space on Argyle Street. Real photography drops in here."
                className="shadow-lift"
              />
            </Reveal>
            <div>
              <Eyebrow tone="ocean">{about.office.eyebrow}</Eyebrow>
              <SplitReveal as="h2" className="mt-5 font-display text-display-md font-semibold text-ink">
                {about.office.heading}
              </SplitReveal>
              <Reveal delay={0.05}>
                <p className="mt-6 max-w-prose text-lg text-muted">{about.office.body}</p>
                <p className="mt-6 inline-flex items-center gap-2.5 text-muted">
                  <MapPin aria-hidden="true" className="h-5 w-5 text-brand-bright" />
                  {site.address.full}
                </p>
              </Reveal>
            </div>
          </div>
        </Container>
        <WaveDivider className="mt-20 opacity-60" />
      </Section>

      {/* Leadership */}
      <Section className="border-t border-line">
        <Container size="shell">
          <div className="max-w-2xl">
            <Eyebrow tone="ocean">{about.leadership.eyebrow}</Eyebrow>
            <SplitReveal as="h2" className="mt-5 font-display text-display-md font-semibold text-ink">
              {about.leadership.heading}
            </SplitReveal>
            <Reveal delay={0.05}>
              <p className="mt-6 text-lg text-muted">{about.leadership.body}</p>
            </Reveal>
          </div>
          <Reveal y={28} className="mt-12">
            <MediaFrame
              src={media.teamGroup.src}
              blur={media.teamGroup.blur}
              alt="The Atlantic Connect Marketing team at a company event in downtown Halifax."
              aspect="16/9"
              tone="cool"
              sizes="(min-width: 1280px) 1200px, 100vw"
              objectPosition="center 28%"
              caption="The team, downtown Halifax."
              className="shadow-lift"
            />
          </Reveal>
          <RevealGroup className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Bernie", role: "Leadership", src: media.bernie.src, blur: media.bernie.blur },
              { name: "Neely", role: "Team", src: media.neely.src, blur: media.neely.blur },
              { name: "Ahnaf", role: "Team", src: media.ahnaf.src, blur: media.ahnaf.blur },
            ].map((p) => (
              <RevealItem key={p.name}>
                <MediaFrame
                  src={p.src}
                  blur={p.blur}
                  alt={`${p.name}, ${p.role} at Atlantic Connect Marketing`}
                  aspect="4/5"
                  tone="cool"
                  sizes="(min-width: 1024px) 33vw, 50vw"
                />
                <h3 className="mt-3 font-display text-lg text-ink">{p.name}</h3>
                <p className="text-sm text-subtle">{p.role}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      {/* Closing dual CTA */}
      <Section className="border-t border-line bg-bg-deep">
        <Container size="shell">
          <div className="grid gap-4 md:grid-cols-2">
            <Reveal className="flex flex-col items-start gap-3 rounded-card border border-line bg-bg-elev p-8">
              <p className="text-eyebrow font-medium uppercase tracking-[0.18em] text-brand-bright">For brands</p>
              <h3 className="font-display text-2xl text-ink">Partner with us.</h3>
              <Button href="/partner" variant="primary" size="lg">
                Book a strategy call
              </Button>
              <p className="text-sm text-subtle">We reply within one business day.</p>
            </Reveal>
            <Reveal delay={0.06} className="flex flex-col items-start gap-3 rounded-card border border-gold-mid/25 bg-bg-elev p-8">
              <p className="text-eyebrow font-medium uppercase tracking-[0.18em] text-gold-mid">For talent</p>
              <h3 className="font-display text-2xl text-gold">Grow With Us.</h3>
              <Button href="/careers" variant="gold" size="lg">
                Explore careers
              </Button>
              <p className="text-sm text-subtle">Every application gets a real reply.</p>
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  );
}

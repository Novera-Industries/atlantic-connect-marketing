import { Container, Section, Eyebrow } from "@/components/layout/Container";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";
import { MediaFrame } from "@/components/media/MediaFrame";
import { CountUp } from "@/components/motion/CountUp";
import { Button } from "@/components/ui/Button";
import { WaveDivider } from "@/components/brand/WaveDivider";
import { AnchorPoint } from "./AnchorPoint";
import { home } from "@/lib/content";
import { media } from "@/lib/media";

const c = home.clientPreview;

export function ClientPreview() {
  return (
    <Section id="for-brands" className="isolate overflow-hidden">
      {/* soft centred scrim — seats the headline + photo over the cool halo */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(58%_50%_at_50%_44%,rgba(11,26,43,0.5),transparent_72%)]" />
      <Container size="container" className="relative z-10">
        {/* centred intro */}
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow tone="ocean" className="justify-center">
            {c.eyebrow}
          </Eyebrow>
          <SplitReveal as="h2" className="mx-auto mt-5 max-w-[18ch] font-display text-display-md font-semibold text-ink">
            {c.heading}
          </SplitReveal>
          <Reveal delay={0.05}>
            <p className="mx-auto mt-5 max-w-prose text-lg text-muted">{c.body}</p>
          </Reveal>
        </div>

        {/* the photo — centred focal point; the cool halo of the Current frames it */}
        <AnchorPoint name="client" className="relative mx-auto mt-14 max-w-xl">
          <Reveal y={36} className="relative">
            <MediaFrame
              tone="cool"
              aspect="4/3"
              src={media.repField.src}
              blur={media.repField.blur}
              alt="A field-marketing rep talking with a customer on a downtown Halifax street."
              label="A rep in the field, mid-conversation"
              caption="Real campaign moment · commissioned shoot"
              className="shadow-lift"
            />
          </Reveal>
        </AnchorPoint>

        {/* proof stats — centred row below the focal photo */}
        <Reveal delay={0.1}>
          <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-6 border-y border-line py-7 text-center">
            <Stat value={1} label="business day to reply" />
            <Stat value={4} label="in-person channels" />
            <Stat value={100} suffix="%" label="reps trained on your brand" />
          </dl>
        </Reveal>

        <Reveal delay={0.15} className="mt-8 text-center">
          <Button href="/partner" variant="primary" size="lg">
            {c.cta}
          </Button>
        </Reveal>
      </Container>
      <WaveDivider className="relative z-10 mt-20 opacity-60" />
    </Section>
  );
}

function Stat({ value, suffix, label }: { value: number; suffix?: string; label: string }) {
  return (
    <div>
      <dd className="font-display text-3xl font-semibold text-chrome sm:text-4xl">
        <CountUp value={value} suffix={suffix} />
      </dd>
      <dt className="mt-1.5 text-xs text-subtle">{label}</dt>
    </div>
  );
}

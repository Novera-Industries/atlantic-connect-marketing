"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container, Eyebrow } from "@/components/layout/Container";
import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/motion/Reveal";
import { useBlockAnchor, type AnchorName } from "./anchors";
import { home } from "@/lib/content";
import { cn } from "@/lib/cn";

const f = home.fork;

/**
 * The split beat. No local canvas / pin anymore — the one global particle
 * current (GlobalCurrent) forks here, with the two cards registered as anchors
 * so the cool/warm streams visibly lead INTO them as you scroll.
 */
export function TheFork() {
  return (
    <section id="fork" className="relative flex min-h-[128svh] flex-col justify-center py-24">
      <Container size="shell" className="relative z-10 text-center">
        <Eyebrow tone="muted" className="justify-center">
          {f.eyebrow}
        </Eyebrow>
        <h2 className="mx-auto mt-5 max-w-[16ch] font-display text-display-lg font-semibold text-ink">
          One current. <span className="text-chrome">Two ways forward.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-prose text-muted">{f.sub}</p>
      </Container>

      <Container size="shell" className="relative z-10 mt-[16vh] grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-10">
        <ForkCTA
          anchor="partner"
          tone="cool"
          align="left"
          kicker={f.client.kicker}
          title={f.client.title}
          line={f.client.line}
          blurb={f.client.blurb}
          href={f.client.href}
        />
        <ForkCTA
          anchor="careers"
          tone="warm"
          align="right"
          kicker={f.talent.kicker}
          title={f.talent.title}
          line={f.talent.line}
          blurb={f.talent.blurb}
          href={f.talent.href}
        />
      </Container>
    </section>
  );
}

function ForkCTA({
  anchor,
  tone,
  align,
  kicker,
  title,
  line,
  blurb,
  href,
}: {
  anchor: AnchorName;
  tone: "cool" | "warm";
  align: "left" | "right";
  kicker: string;
  title: string;
  line: string;
  blurb: string;
  href: string;
}) {
  const anchorRef = useBlockAnchor(anchor);
  const warm = tone === "warm";
  return (
    <Reveal y={28} className={cn(align === "right" && "sm:justify-self-end")}>
      <Magnetic strength={0.16}>
        <Link
          ref={anchorRef}
          href={href}
          data-cursor="link"
          className={cn(
            "group flex max-w-md flex-col rounded-card border bg-bg-deep/55 p-6 backdrop-blur-md transition-colors sm:p-8",
            warm ? "border-gold-mid/30 hover:border-gold-mid/60" : "border-brand/30 hover:border-brand-bright/60"
          )}
        >
          <span
            className={cn(
              "text-eyebrow font-medium uppercase tracking-[0.2em]",
              warm ? "text-gold-mid" : "text-brand-bright"
            )}
          >
            {kicker}
          </span>
          <span className={cn("mt-2 font-display text-3xl font-semibold sm:text-4xl", warm ? "text-gold" : "text-chrome")}>
            {title}
          </span>
          <span className="mt-1 font-display text-lg text-ink">{line}</span>
          <span className="mt-4 max-w-sm text-sm text-muted">{blurb}</span>
          <span
            className={cn(
              "mt-6 inline-flex items-center gap-1.5 text-sm font-medium",
              warm ? "text-gold-hi" : "text-ink"
            )}
          >
            Enter
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </Link>
      </Magnetic>
    </Reveal>
  );
}

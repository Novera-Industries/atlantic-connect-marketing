"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { Container, Eyebrow } from "@/components/layout/Container";
import { Button, ProofCTA } from "@/components/ui/Button";
import { AnchorPoint } from "./AnchorPoint";
import { home, partner } from "@/lib/content";

const p = home.process;
const steps = partner.how.steps;

/**
 * Act 4 — the process, as the home page's ONE pinned scene (the pin budget is
 * two per page; the hero scrub is not a pin, so this is the only one). Desktop:
 * the stage pins for one viewport-height of scroll and the four steps activate
 * in sequence while a progress line draws through them. Mobile / reduced
 * motion: a plain stacked list, everything readable, nothing scroll-locked.
 * The vertical thread of the Current (fThread, stage 3) flows down behind it.
 */
export function ProcessTimeline() {
  const section = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const items = gsap.utils.toArray<HTMLElement>(".process-step", pin.current ?? undefined);
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pin.current,
            pin: true,
            scrub: 0.5,
            start: "center center",
            end: "+=140%",
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
        tl.fromTo(line.current, { scaleY: 0 }, { scaleY: 1, ease: "none", duration: 4 }, 0);
        items.forEach((el, i) => {
          tl.fromTo(
            el,
            { opacity: 0.28, x: -14 },
            { opacity: 1, x: 0, ease: "power2.out", duration: 0.8 },
            i * 0.95
          );
        });
      });
      return () => mm.revert();
    },
    { scope: section }
  );

  return (
    <section ref={section} id="process" className="relative isolate overflow-hidden py-20 sm:py-28">
      <Container size="container" className="relative z-10">
        <div className="relative mx-auto max-w-2xl text-center">
          {/* legibility plate — the vertical thread flows around the copy */}
          <div className="pointer-events-none absolute -inset-x-10 -inset-y-6 bg-[radial-gradient(60%_70%_at_50%_50%,rgba(11,26,43,0.9),rgba(11,26,43,0.5)_58%,transparent_84%)]" />
          <div className="relative">
            <Eyebrow tone="muted" className="justify-center">
              {p.eyebrow}
            </Eyebrow>
            <h2 className="mx-auto mt-5 max-w-[16ch] font-display text-display-md font-semibold text-ink">
              {p.heading}
            </h2>
            <p className="mx-auto mt-5 max-w-prose text-muted">{p.body}</p>
          </div>
        </div>
      </Container>

      <AnchorPoint name="process">
        <div ref={pin} className="relative mt-4 py-10 lg:py-14">
          <Container size="container" className="relative z-10">
            <ol className="relative mx-auto flex max-w-2xl flex-col gap-9 lg:gap-10">
              {/* progress line (desktop scrub) — runs through the badge centres */}
              <div
                aria-hidden
                className="absolute -bottom-2 left-[1.125rem] top-2 hidden w-px -translate-x-1/2 bg-line lg:block"
              />
              <div
                aria-hidden
                className="absolute -bottom-2 left-[1.125rem] top-2 hidden w-px origin-top -translate-x-1/2 scale-y-0 bg-gradient-to-b from-brand-bright to-brand lg:block"
                ref={line}
              />
              {steps.map((s) => (
                <li key={s.n} className="process-step relative flex gap-5">
                  {/* legibility plate per step */}
                  <div className="pointer-events-none absolute -inset-x-6 -inset-y-3 bg-[radial-gradient(70%_90%_at_40%_50%,rgba(11,26,43,0.88),rgba(11,26,43,0.4)_62%,transparent_88%)]" />
                  <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand/40 bg-bg font-display text-sm font-semibold tabular-nums text-brand-bright">
                    {s.n}
                  </span>
                  <div className="relative z-10">
                    <h3 className="font-display text-xl font-semibold text-ink sm:text-2xl">{s.title}</h3>
                    <p className="mt-1 text-sm text-subtle">{s.contact}</p>
                    <p className="mt-2.5 max-w-xl text-muted">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Container>
        </div>
      </AnchorPoint>

      <Container size="container" className="relative z-10 mt-8 lg:mt-12">
        <ProofCTA className="items-center text-center" proof={p.ctaProof}>
          <Button href="/partner#how" variant="outline" size="md">
            {p.cta}
          </Button>
        </ProofCTA>
      </Container>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { Container, Eyebrow } from "@/components/layout/Container";
import { MediaFrame } from "@/components/media/MediaFrame";
import { careers } from "@/lib/content";
import { media } from "@/lib/media";

const d = careers.dayInLife;

// AI filler per beat (Morning, Midday, Afternoon, Evening). Swap for the real
// footage before launch — these frames are designed for authentic team video.
const beatImages = [media.dilMorning, media.repField, media.dilAfternoon, media.dilEvening];
const beatAlt = [
  "The team in an energetic morning huddle.",
  "A rep mid-conversation with a customer in the field.",
  "The team celebrating a win together.",
  "The team celebrating at the end of the day.",
];

/**
 * "Day in the Life" - Careers' one heavy pinned scene. The heading scrolls in
 * normally, then a full-viewport stage pins and a horizontal rail of beats
 * scrubs through the centre of the screen (each panel is a full 100vw frame).
 * Mobile / reduced motion: a vertical static storyboard, each beat on its own.
 * 100% real footage drops into these frames (no stock, no actors, no AI).
 */
export function DayInLife() {
  const section = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const distance = () => Math.max(0, (track.current?.scrollWidth ?? 0) - window.innerWidth);
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pin.current,
            pin: true,
            scrub: 0.6,
            start: "top top",
            end: () => "+=" + distance(),
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
        // Translate by the exact overflow (scrollWidth - viewport), in pixels.
        tl.to(track.current, { x: () => -distance(), ease: "none" }, 0);
        tl.fromTo(progress.current, { scaleX: 0 }, { scaleX: 1, ease: "none" }, 0);
      });
      return () => mm.revert();
    },
    { scope: section }
  );

  return (
    <section ref={section} className="relative bg-bg-deep">
      {/* heading - normal flow, scrolls in ahead of the pin */}
      <Container size="shell" className="pt-20 sm:pt-28">
        <Eyebrow tone="gold">{d.eyebrow}</Eyebrow>
        <h2 className="mt-5 max-w-[16ch] font-display text-display-md font-semibold text-ink">{d.heading}</h2>
        <p className="mt-5 max-w-prose text-muted">{d.body}</p>
      </Container>

      {/* pinned full-viewport stage (desktop) / vertical stack (mobile) */}
      <div ref={pin} className="relative mt-10 md:mt-16 md:h-screen md:overflow-hidden">
        <div
          ref={track}
          className="flex flex-col gap-6 px-5 pb-16 sm:px-8 md:h-full md:w-max md:flex-row md:gap-0 md:px-0 md:pb-0"
        >
          {d.beats.map((b, i) => (
            <article
              key={b.title}
              className="dil-panel flex shrink-0 flex-col justify-center md:h-full md:w-screen md:px-[9vw]"
            >
              <div className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
                <div>
                  <span className="font-display text-6xl font-semibold text-gold-lo/60 sm:text-7xl">0{i + 1}</span>
                  <p className="mt-4 text-eyebrow font-medium uppercase tracking-[0.2em] text-gold-mid">{b.time}</p>
                  <h3 className="mt-2 font-display text-3xl text-ink sm:text-4xl">{b.title}</h3>
                  <p className="mt-4 max-w-md text-lg text-muted">{b.body}</p>
                </div>
                <MediaFrame
                  tone="warm"
                  kind="film"
                  aspect="4/3"
                  src={beatImages[i]?.src}
                  blur={beatImages[i]?.blur}
                  alt={beatAlt[i] ?? ""}
                  label={`${b.time} · ${b.title}`}
                  className="shadow-lift"
                />
              </div>
            </article>
          ))}
        </div>

        {/* pin progress (desktop) */}
        <div className="absolute bottom-8 left-1/2 hidden h-px w-48 -translate-x-1/2 overflow-hidden bg-line md:block">
          <div ref={progress} className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-gold-mid to-gold-hi" />
        </div>
      </div>
    </section>
  );
}

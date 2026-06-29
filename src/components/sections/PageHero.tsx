"use client";

import { Fragment, useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { gsap, useGSAP } from "@/lib/gsap";
import { SplitText } from "gsap/SplitText";
import { Container, Eyebrow } from "@/components/layout/Container";
import { cn } from "@/lib/cn";

if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText);
}

const EASE = [0.22, 1, 0.36, 1] as const;

export function PageHero({
  eyebrow,
  headline,
  sub,
  tagline,
  tone = "cool",
  image,
}: {
  eyebrow: string;
  headline: string[];
  sub: string;
  tagline?: string;
  tone?: "cool" | "warm";
  image: { src: string; blur: string };
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["0%", "16%"]);
  const scale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [1.04, 1.14]);

  useGSAP(
    () => {
      const el = headlineRef.current;
      if (!el || reduced) return;
      let split: SplitText | null = null;
      let cancelled = false;
      document.fonts.ready.then(() => {
        if (cancelled || !el) return;
        split = SplitText.create(el, { type: "lines", mask: "lines", linesClass: "split-line" });
        split.lines.at(-1)?.classList.add(tone === "warm" ? "text-gold" : "text-chrome");
        gsap.from(split.lines, { yPercent: 120, duration: 0.95, ease: "expo.out", stagger: 0.1, delay: 0.1 });
      });
      return () => {
        cancelled = true;
        split?.revert();
      };
    },
    { scope: ref, dependencies: [reduced, tone] }
  );

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[64svh] items-end overflow-hidden pt-[var(--header-h)]"
    >
      <motion.div style={{ y, scale }} className="absolute inset-0 -z-10">
        <Image
          src={image.src}
          alt=""
          fill
          priority
          placeholder="blur"
          blurDataURL={image.blur}
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-bg-deep via-bg-deep/55 to-bg-deep/75" />
      <div className="absolute inset-0 -z-10 vignette" />

      <Container size="shell" className="relative z-10 pb-16 sm:pb-20">
        <Eyebrow tone={tone === "warm" ? "gold" : "ocean"}>{eyebrow}</Eyebrow>
        <h1 ref={headlineRef} className="mt-6 max-w-[20ch] font-display text-display-xl font-semibold text-ink">
          {headline.map((line, i) => (
            <Fragment key={i}>
              {line}
              {i < headline.length - 1 && <br />}
            </Fragment>
          ))}
        </h1>
        {tagline && (
          <motion.p
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduced ? 0 : 0.6, duration: 0.6 }}
            className={cn("mt-5 font-display text-xl sm:text-2xl", tone === "warm" ? "text-gold-mid" : "text-brand-bright")}
          >
            {tagline}
          </motion.p>
        )}
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduced ? 0 : 0.7, duration: 0.7, ease: EASE }}
          className="mt-6 max-w-prose text-lg text-muted sm:text-xl"
        >
          {sub}
        </motion.p>
      </Container>
    </section>
  );
}

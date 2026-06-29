"use client";

import { useRef } from "react";
import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ChevronDown } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { SplitText } from "gsap/SplitText";
import { Container, Eyebrow } from "@/components/layout/Container";
import { home } from "@/lib/content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText);
}

const HEADLINE = "The most powerful marketing still happens in person.";

export function Hero() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yText = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, -120]);
  const opacityText = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const wght = useTransform(scrollYProgress, [0, 1], [505, 640]);
  const fvs = useMotionTemplate`'wght' ${wght}`;

  useGSAP(
    () => {
      const el = headlineRef.current;
      if (!el || reduced) return;
      let split: SplitText | null = null;
      let cancelled = false;
      document.fonts.ready.then(() => {
        if (cancelled || !el) return;
        split = SplitText.create(el, { type: "lines", mask: "lines", linesClass: "split-line" });
        split.lines.at(-1)?.classList.add("text-chrome");
        gsap.from(split.lines, { yPercent: 120, duration: 1.05, ease: "expo.out", stagger: 0.1, delay: 0.15 });
      });
      return () => {
        cancelled = true;
        split?.revert();
      };
    },
    { scope: ref, dependencies: [reduced] }
  );

  return (
    <section ref={ref} className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden">
      {/* centered legibility scrim — a soft radial seat for the headline that keeps
          the wave reading through on every side (dark-tech minimal, not a heavy wash) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(58%_46%_at_50%_48%,rgba(11,26,43,0.58),transparent_72%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/55 via-transparent to-bg/20" />

      <Container size="container" className="relative z-10 w-full">
        <motion.div
          style={{ y: yText, opacity: opacityText }}
          className="mx-auto flex max-w-4xl flex-col items-center text-center"
        >
          <Eyebrow tone="ocean" className="justify-center">
            {home.hero.eyebrow}
          </Eyebrow>
          <motion.h1
            ref={headlineRef}
            style={{ fontVariationSettings: reduced ? undefined : fvs }}
            className="mt-7 max-w-[16ch] font-display text-display-xl font-semibold text-ink"
          >
            {HEADLINE}
          </motion.h1>
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: reduced ? 0 : 0.7 }}
            className="mt-7 max-w-xl text-balance text-lg text-muted sm:text-xl"
          >
            {home.hero.sub}
          </motion.p>
        </motion.div>
      </Container>

      <motion.a
        href="#fork"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduced ? 0 : 1.2, duration: 0.6 }}
        className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-subtle"
        aria-label="Scroll to choose your current"
      >
        <span className="text-[0.7rem] uppercase tracking-[0.3em]">Find your current</span>
        <motion.span
          animate={reduced ? undefined : { y: [0, 7, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-5 w-5" />
        </motion.span>
      </motion.a>
    </section>
  );
}

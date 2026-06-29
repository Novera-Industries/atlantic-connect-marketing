"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { SplitText } from "gsap/SplitText";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText);
}

/**
 * THE one reusable headline reveal: SplitText masked lines rising from 110%.
 * Free in GSAP 3.13+ (we run 3.15) including the `mask:"lines"` option, which
 * builds the overflow:hidden wrapper for us. Runs after fonts are ready so
 * lines split correctly. Reduced motion → text simply renders (no split).
 */
export function SplitReveal({
  children,
  as: Tag = "h2",
  className,
  start = "top 82%",
  stagger = 0.12,
  duration = 0.9,
  delay = 0,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  start?: string;
  stagger?: number;
  duration?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reduced) return;

      let split: SplitText | null = null;
      let tween: gsap.core.Tween | null = null;

      const run = () => {
        split = SplitText.create(el, { type: "lines", mask: "lines", linesClass: "split-line" });
        tween = gsap.from(split.lines, {
          yPercent: 115,
          duration,
          delay,
          ease: "expo.out",
          stagger,
          scrollTrigger: { trigger: el, start, once: true },
        });
      };

      // Wait for fonts so line breaks are measured against the real typeface.
      let cancelled = false;
      document.fonts.ready.then(() => {
        if (!cancelled) {
          run();
          ScrollTrigger.refresh();
        }
      });

      return () => {
        cancelled = true;
        (tween as gsap.core.Tween & { scrollTrigger?: { kill: () => void } })?.scrollTrigger?.kill();
        tween?.kill();
        split?.revert();
      };
    },
    { scope: ref, dependencies: [reduced] }
  );

  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  );
}

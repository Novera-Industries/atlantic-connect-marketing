"use client";

import { useEffect, useRef } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/cn";

const fmt = (n: number) => new Intl.NumberFormat("en-CA").format(n);

/**
 * Scroll-locked count-up. The value is driven by the element's scroll position
 * (never a timer) and written straight to textContent - no React re-render on
 * scroll, no setState. Reduced motion / no-JS shows the final value. We only
 * animate truly-verifiable numbers (see lib/content.ts).
 */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.92", "start 0.45"],
  });
  const count = useTransform(scrollYProgress, [0, 1], [0, value]);

  useMotionValueEvent(count, "change", (v) => {
    if (!reduced && ref.current) ref.current.textContent = `${prefix}${fmt(Math.round(v))}${suffix}`;
  });

  // Initialise to the current scroll-mapped value (0 while still below the fold).
  useEffect(() => {
    if (!reduced && ref.current) {
      ref.current.textContent = `${prefix}${fmt(Math.round(count.get()))}${suffix}`;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  // SSR / no-JS / reduced-motion render the real, final value.
  return (
    <span ref={ref} className={cn("tnum tabular-nums", className)}>
      {`${prefix}${fmt(value)}${suffix}`}
    </span>
  );
}

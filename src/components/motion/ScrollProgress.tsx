"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** Thin page-level progress line (the current filling). Cheap: scaleX only. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[110] h-0.5 origin-left bg-gradient-to-r from-brand via-brand-bright to-gold-mid"
    />
  );
}

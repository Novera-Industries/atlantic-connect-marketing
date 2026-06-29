"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

/**
 * Single root custom cursor: a precise ocean dot + a lagging chrome ring that
 * swells over interactive targets. Pointer-fine only; never mounts for touch
 * or reduced motion, and is pointer-events:none so it never steals accuracy.
 */
export function CustomCursor() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 350, damping: 28, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 350, damping: 28, mass: 0.5 });

  useEffect(() => {
    if (reduced) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);
    document.body.classList.add("cursor-active");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement | null;
      setActive(!!t?.closest("a, button, [data-cursor='link'], input, textarea, select"));
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      document.body.classList.remove("cursor-active");
    };
  }, [reduced, x, y]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[120] hidden md:block">
      {/* precise dot */}
      <motion.span
        style={{ x, y }}
        className="absolute -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-brand-bright"
      />
      {/* lagging ring */}
      <motion.span
        style={{ x: ringX, y: ringY }}
        animate={{ scale: active ? 1.9 : 1, opacity: active ? 1 : 0.6 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="absolute -ml-4 -mt-4 h-8 w-8 rounded-full border border-chrome-mid/70"
      />
    </div>
  );
}

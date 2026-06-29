"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { cn } from "@/lib/cn";

/**
 * Magnetic hover for CTAs and the Fork doors. Pointer-fine only (mousemove
 * doesn't continuously fire on touch); disabled under reduced motion. Never
 * blocks native pointer accuracy - it only translates the wrapper.
 */
export function Magnetic({
  children,
  className,
  strength = 0.3,
  radius = 1,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
  radius?: number;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  if (reduced) return <span className={cn("inline-flex", className)}>{children}</span>;

  const onMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const mx = e.clientX - (r.left + r.width / 2);
    const my = e.clientY - (r.top + r.height / 2);
    x.set(mx * strength * radius);
    y.set(my * strength * radius);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className={cn("inline-flex", className)}
    >
      {children}
    </motion.span>
  );
}

"use client";

import { useEffect, useState } from "react";

/**
 * Reactive prefers-reduced-motion. Returns true when the user has asked for
 * reduced motion. We default to `true` during SSR/first paint so nothing
 * heavy fires before we've confirmed the user is OK with motion.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

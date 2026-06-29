"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type LenisContextValue = {
  lenis: Lenis | null;
  scrollTo: (target: string | number | HTMLElement, opts?: { offset?: number }) => void;
};

const LenisContext = createContext<LenisContextValue>({ lenis: null, scrollTo: () => {} });

export const useSmoothScroll = () => useContext(LenisContext);

/**
 * THE single scroll engine. Exactly one Lenis instance, autoRaf:false, driven
 * by the GSAP ticker - so Lenis, GSAP ScrollTrigger and Motion useScroll all
 * read the same scroll position on the same frame.
 *
 * Under prefers-reduced-motion we do NOT smooth-scroll: native scroll +
 * ScrollTrigger still works, and reveals fall back to instant (see motion
 * components). Degraded, never broken.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      // Make ScrollTrigger work against native scroll, no smoothing.
      ScrollTrigger.refresh();
      return;
    }

    const instance = new Lenis({
      autoRaf: false,
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo-out
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      lerp: 0.1,
    });
    lenisRef.current = instance;
    setLenis(instance);
    if (process.env.NODE_ENV !== "production") {
      (window as unknown as { __lenis?: Lenis }).__lenis = instance;
    }

    // Keep ScrollTrigger in lockstep with Lenis.
    instance.on("scroll", ScrollTrigger.update);

    const ticker = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(ticker);
      instance.off("scroll", ScrollTrigger.update);
      instance.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, [reduced]);

  const scrollTo: LenisContextValue["scrollTo"] = (target, opts) => {
    const offset = opts?.offset ?? -88;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset, duration: 1.1 });
    } else if (typeof target === "string") {
      const el = document.querySelector(target);
      el?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    } else if (typeof target !== "number") {
      target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    }
  };

  return <LenisContext.Provider value={{ lenis, scrollTo }}>{children}</LenisContext.Provider>;
}

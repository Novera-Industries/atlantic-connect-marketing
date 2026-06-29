"use client";

import { useRef, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { StaticCurrent } from "./StaticCurrent";

// Three.js loads lazily (client-only) so it stays out of the critical bundle.
const GlobalCurrent = dynamic(() => import("./GlobalCurrent").then((m) => m.GlobalCurrent), {
  ssr: false,
});

/**
 * Hosts the one continuous particle "Current" behind the whole home page. The
 * fixed canvas sits behind the scrolling content (passed as children, kept as
 * server components); scroll progress over `contentRef` drives the morph.
 * Reduced motion → the designed static atmosphere instead of the live canvas.
 */
export function HomeStage({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {reduced ? <StaticCurrent /> : <GlobalCurrent targetRef={contentRef} />}
      <div ref={contentRef} className="relative z-10">
        {children}
      </div>
    </>
  );
}

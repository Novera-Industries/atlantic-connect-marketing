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
      {/* the home journey plays in the hero void (near-black, bg-deep) — the
          reference's contrast: bright crisp dots need a dark ground, and the
          site-wide navy was washing the Current out (user recording, iter 15).
          DOM-order sibling before the canvas: same z-plane, paints beneath it. */}
      <div aria-hidden className="fixed inset-0 z-0 bg-bg-deep" />
      {reduced ? <StaticCurrent /> : <GlobalCurrent targetRef={contentRef} />}
      <div ref={contentRef} className="relative z-10">
        {children}
      </div>
    </>
  );
}

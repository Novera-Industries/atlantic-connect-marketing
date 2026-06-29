"use client";

import { type ReactNode } from "react";
import { useBlockAnchor, type AnchorName } from "./anchors";

/**
 * Wrap a content block so the one global particle Current (GlobalCurrent) can
 * aim a stream INTO it as you scroll. Lets the lower home sections — which stay
 * server components — register an anchor without going client-wide (the engine
 * reads this node's live screen rect each frame). Mirror of how TheFork's cards
 * register the partner/careers anchors.
 */
export function AnchorPoint({
  name,
  className,
  children,
}: {
  name: AnchorName;
  className?: string;
  children: ReactNode;
}) {
  const ref = useBlockAnchor(name);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

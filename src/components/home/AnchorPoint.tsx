"use client";

import { type ElementType, type ReactNode } from "react";
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
  as: Tag = "div",
  id,
}: {
  name: AnchorName;
  className?: string;
  children: ReactNode;
  as?: ElementType;
  id?: string;
}) {
  const ref = useBlockAnchor(name);
  return (
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  );
}

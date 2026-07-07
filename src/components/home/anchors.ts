"use client";

import { useCallback } from "react";

/**
 * Lead-into-blocks: each content block the particle current should flow into
 * registers its DOM node here, and GlobalCurrent reads the live screen rect each
 * frame to aim a stream at it. Module singleton — there is one home page.
 */
export type AnchorName =
  | "partner"
  | "careers"
  | "client"
  | "talent"
  | "trust"
  | "noise"
  | "process"
  | "coverage";

const registry: Partial<Record<AnchorName, HTMLElement | null>> = {};

/** Attach the returned callback ref to the block you want particles to lead into. */
export function useBlockAnchor(name: AnchorName) {
  return useCallback(
    (el: HTMLElement | null) => {
      registry[name] = el;
    },
    [name]
  );
}

export function getAnchorRect(name: AnchorName): DOMRect | null {
  const el = registry[name];
  return el ? el.getBoundingClientRect() : null;
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useMotionValueEvent } from "motion/react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { home } from "@/lib/content";

const s = home.sticky;

/**
 * The persistent conversion lever: a slim strategy-call bar that enters once
 * the hero is behind you and steps aside near the footer (the twist finale and
 * the footer's own dual CTA own that space). Client CTA is primary per the
 * approved brief; the quiet Careers link keeps the talent funnel one tap away
 * (segmented funnels, never buried). Dismissible for the session.
 */
export function StickyCall() {
  const reduced = useReducedMotion();
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const vh = window.innerHeight;
    const footer = document.querySelector("footer");
    const ftop = footer ? footer.getBoundingClientRect().top : Infinity;
    setVisible(y > vh * 0.85 && ftop > vh * 1.1);
  });

  return (
    <AnimatePresence>
      {visible && !dismissed && (
        <motion.div
          key="sticky-call"
          initial={{ opacity: 0, y: reduced ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduced ? 0 : 24 }}
          transition={{ duration: reduced ? 0.15 : 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 sm:inset-x-auto sm:right-6 sm:bottom-6"
        >
          <div className="flex items-center gap-3 rounded-full border border-line bg-bg-deep/90 py-2 pl-2 pr-3 shadow-lift backdrop-blur-md sm:gap-4 sm:pl-2.5 sm:pr-4">
            <Button href="/partner#contact" variant="primary" size="md" magnetic={false}>
              {s.label}
            </Button>
            <div className="hidden min-w-0 flex-col sm:flex">
              <span className="text-xs text-subtle">{s.proof}</span>
              <Link
                href="/careers"
                className="text-xs font-medium text-gold-mid transition-colors hover:text-gold-hi"
              >
                {s.careers} →
              </Link>
            </div>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              aria-label="Dismiss the strategy call bar"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-subtle transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

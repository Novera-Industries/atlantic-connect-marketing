"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/cn";

export function Faq({ items, tone = "ocean" }: { items: { q: string; a: string }[]; tone?: "ocean" | "gold" }) {
  const [open, setOpen] = useState<number | null>(0);
  const reduced = useReducedMotion();
  const accent = tone === "gold" ? "text-gold-mid" : "text-brand-bright";

  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="-mx-2 flex w-[calc(100%+1rem)] items-center justify-between gap-6 rounded-panel px-2 py-6 text-left transition-colors hover:bg-bg-elev"
              >
                <span className="font-display text-lg text-ink sm:text-xl">{it.q}</span>
                <Plus
                  aria-hidden="true"
                  className={cn(
                    "h-5 w-5 shrink-0 transition-transform duration-300",
                    accent,
                    isOpen && "rotate-45"
                  )}
                />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={reduced ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{ duration: reduced ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-prose pb-6 text-muted">{it.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

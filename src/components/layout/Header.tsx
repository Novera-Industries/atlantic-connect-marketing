"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, X } from "lucide-react";
import { BrandMark } from "@/components/brand/BrandMark";
import { Button } from "@/components/ui/Button";
import { nav } from "@/lib/site";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
import { cn } from "@/lib/cn";

export function Header() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const { lenis } = useSmoothScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock smooth-scroll + page scroll while the mobile menu is open.
  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, lenis]);

  useEffect(() => setOpen(false), [pathname]);

  const linkCls = (href: string) =>
    cn(
      "relative text-sm transition-colors duration-200 hover:text-ink",
      pathname === href ? "text-ink" : "text-muted"
    );

  return (
    <header className="fixed inset-x-0 top-0 z-[100]">
      <div
        className={cn(
          "border-b transition-colors duration-300",
          scrolled ? "border-line bg-[rgba(11,26,43,0.85)] backdrop-blur-xl" : "border-transparent bg-transparent"
        )}
      >
        <div className="mx-auto flex h-[var(--header-h)] max-w-shell items-center justify-between gap-4 px-5 sm:px-8">
          <Link href="/" aria-label="Atlantic Connect Marketing, home" className="shrink-0">
            <BrandMark />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            {nav.slice(1).map((item) => (
              <Link key={item.href} href={item.href} className={linkCls(item.href)}>
                {item.label}
                {pathname === item.href && (
                  <span className="absolute -bottom-1.5 left-0 h-px w-full bg-brand-bright" />
                )}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Button href="/partner" variant="primary" size="md" icon={false} magnetic>
              Partner With Us
            </Button>
            <Button href="/careers" variant="gold" size="md" icon={false} magnetic>
              Careers
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduced ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 top-[var(--header-h)] z-[90] bg-[rgba(6,17,30,0.97)] backdrop-blur-xl md:hidden"
          >
            <nav className="flex flex-col gap-2 px-6 py-8" aria-label="Mobile">
              {nav.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={reduced ? false : { opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: reduced ? 0 : 0.05 + i * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "block border-b border-line py-4 font-display text-2xl tracking-[-0.03em]",
                      pathname === item.href ? "text-ink" : "text-muted"
                    )}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-6 flex flex-col gap-3">
                <Button href="/partner" variant="primary" size="lg" magnetic={false} className="w-full">
                  Partner With Us
                </Button>
                <Button href="/careers" variant="gold" size="lg" magnetic={false} className="w-full">
                  Grow With Us
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

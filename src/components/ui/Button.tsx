"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { Magnetic } from "@/components/motion/Magnetic";
import { cn } from "@/lib/cn";

type Variant = "primary" | "gold" | "outline" | "ghost";
type Size = "md" | "lg";

const base =
  "group relative inline-flex select-none items-center justify-center gap-2 font-medium whitespace-nowrap transition-[background,color,border-color,box-shadow] duration-300 ease-expo-out focus-visible:outline-2 focus-visible:outline-offset-2";

const sizes: Record<Size, string> = {
  md: "h-11 rounded-full px-5 text-[0.95rem]",
  lg: "h-[3.25rem] rounded-full px-7 text-base",
};

const variants: Record<Variant, string> = {
  // Partner / primary - solid ocean blue, the wave
  primary:
    "bg-brand text-white shadow-[0_10px_30px_-12px_rgba(27,117,188,0.8)] hover:bg-brand-bright hover:shadow-glow",
  // Careers / secondary - outline with champagne/gold edge
  gold:
    "border border-gold-mid/60 text-gold-hi hover:border-gold-mid hover:bg-gold-mid/10",
  outline:
    "border border-line text-ink hover:border-chrome-mid/50 hover:bg-white/[0.03]",
  ghost: "text-muted hover:text-ink",
};

export function Button({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  icon = true,
  magnetic = true,
  className,
  type,
  "aria-label": ariaLabel,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  size?: Size;
  icon?: boolean;
  magnetic?: boolean;
  className?: string;
  type?: "button" | "submit";
  "aria-label"?: string;
}) {
  const content = (
    <>
      <span>{children}</span>
      {icon && (
        <ArrowRight
          className="h-4 w-4 transition-transform duration-300 ease-expo-out group-hover:translate-x-1"
          strokeWidth={2}
        />
      )}
    </>
  );

  const cls = cn(base, sizes[size], variants[variant], className);

  const inner = href ? (
    <Link href={href} className={cls} aria-label={ariaLabel}>
      {content}
    </Link>
  ) : (
    <button type={type ?? "button"} onClick={onClick} className={cls} aria-label={ariaLabel}>
      {content}
    </button>
  );

  return magnetic ? <Magnetic strength={0.25}>{inner}</Magnetic> : inner;
}

/**
 * A CTA flanked by a micro-proof - enforces the "no naked buttons" rule.
 * Pass a verifiable stat/quote/badge into `proof`.
 */
export function ProofCTA({
  children,
  proof,
  className,
}: {
  children: ReactNode;
  proof: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-start gap-3", className)}>
      {children}
      <p className="text-sm text-subtle">{proof}</p>
    </div>
  );
}

import { cn } from "@/lib/cn";
import type { ElementType, ReactNode } from "react";

export function Container({
  children,
  className,
  size = "container",
}: {
  children: ReactNode;
  className?: string;
  size?: "container" | "shell" | "prose";
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-8",
        size === "shell" && "max-w-shell",
        size === "container" && "max-w-container",
        size === "prose" && "max-w-prose",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Section({
  children,
  className,
  id,
  as: Tag = "section",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: ElementType;
}) {
  return (
    <Tag id={id} className={cn("relative py-20 sm:py-28 lg:py-36", className)}>
      {children}
    </Tag>
  );
}

/** Section kicker / eyebrow - labels, never smaller than 14px. */
export function Eyebrow({
  children,
  tone = "ocean",
  className,
}: {
  children: ReactNode;
  tone?: "ocean" | "gold" | "muted";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 text-eyebrow font-medium uppercase",
        className
      )}
    >
      <span
        className={cn(
          "h-px w-7",
          tone === "ocean" && "bg-brand-bright",
          tone === "gold" && "bg-gold-mid",
          tone === "muted" && "bg-subtle"
        )}
      />
      <span
        className={cn(
          tone === "ocean" && "text-brand-bright",
          tone === "gold" && "text-gold-mid",
          tone === "muted" && "text-subtle"
        )}
      >
        {children}
      </span>
    </span>
  );
}

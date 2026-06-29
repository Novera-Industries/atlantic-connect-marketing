import { cn } from "@/lib/cn";

/**
 * In-flow wave divider - the current flowing between sections. Pure SVG, no
 * JS, GPU-cheap. `tone` tints the stroke cool (client) or warm (talent).
 */
export function WaveDivider({
  className,
  tone = "ocean",
  flip = false,
}: {
  className?: string;
  tone?: "ocean" | "gold";
  flip?: boolean;
}) {
  const stroke = tone === "gold" ? "url(#wd-gold)" : "url(#wd-ocean)";
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none w-full overflow-hidden leading-[0]", flip && "rotate-180", className)}
    >
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="h-16 w-full sm:h-24">
        <defs>
          <linearGradient id="wd-ocean" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0E4C82" stopOpacity="0" />
            <stop offset="35%" stopColor="#1B75BC" stopOpacity="0.8" />
            <stop offset="65%" stopColor="#2E97E6" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0E4C82" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="wd-gold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7A5E2E" stopOpacity="0" />
            <stop offset="40%" stopColor="#E8C98A" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#F3E2BE" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#7A5E2E" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0 70 C 240 20, 480 20, 720 60 S 1200 110, 1440 56"
          fill="none"
          stroke={stroke}
          strokeWidth="1.5"
        />
        <path
          d="M0 84 C 280 44, 520 40, 760 78 S 1220 120, 1440 72"
          fill="none"
          stroke={stroke}
          strokeWidth="1"
          strokeOpacity="0.4"
        />
      </svg>
    </div>
  );
}

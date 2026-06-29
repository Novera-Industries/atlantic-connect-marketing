import Image from "next/image";
import { Camera, Film } from "lucide-react";
import { cn } from "@/lib/cn";

type Tone = "cool" | "warm";

/**
 * Authenticity is load-bearing. Where real photo/video exists it renders with
 * a chrome frame + cinematic scrim. Where it doesn't yet, it renders a crafted,
 * clearly-labelled capture frame (never a flat colour block) - the real
 * commissioned shoot drops straight into this slot at content time.
 */
export function MediaFrame({
  src,
  alt = "",
  aspect = "3/2",
  tone = "cool",
  label,
  caption,
  kind = "photo",
  priority = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  className,
  rounded = "card",
  blur,
  objectPosition,
}: {
  src?: string;
  alt?: string;
  aspect?: "3/2" | "4/5" | "16/9" | "1/1" | "21/9" | "4/3";
  tone?: Tone;
  label?: string;
  caption?: string;
  kind?: "photo" | "film";
  priority?: boolean;
  sizes?: string;
  className?: string;
  rounded?: "card" | "panel" | "none";
  blur?: string;
  objectPosition?: string;
}) {
  const radius = rounded === "card" ? "rounded-card" : rounded === "panel" ? "rounded-panel" : "";
  const Icon = kind === "film" ? Film : Camera;

  return (
    <figure
      className={cn(
        "group relative overflow-hidden border border-line bg-bg-elev",
        radius,
        className
      )}
      style={{ aspectRatio: aspect.replace("/", " / ") }}
    >
      {src ? (
        <>
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes={sizes}
            placeholder={blur ? "blur" : undefined}
            blurDataURL={blur}
            className="object-cover"
            style={objectPosition ? { objectPosition } : undefined}
          />
          {/* cinematic scrim keeps text legible over any photo */}
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg-deep/70 via-transparent to-transparent" />
          <span className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5" />
        </>
      ) : (
        <PlaceholderFill tone={tone} label={label} Icon={Icon} kind={kind} />
      )}

      {caption && (
        <figcaption className="absolute inset-x-0 bottom-0 z-10 flex items-end p-4 sm:p-5">
          <span className="text-sm text-muted">{caption}</span>
        </figcaption>
      )}
    </figure>
  );
}

function PlaceholderFill({
  tone,
  label,
  Icon,
  kind,
}: {
  tone: Tone;
  label?: string;
  Icon: typeof Camera;
  kind: "photo" | "film";
}) {
  const grad =
    tone === "warm"
      ? "from-[#1a1407] via-bg-elev to-bg-deep"
      : "from-brand-deep/30 via-bg-elev to-bg-deep";
  const ring = tone === "warm" ? "text-gold-mid" : "text-brand-bright";

  return (
    <div className={cn("absolute inset-0 bg-gradient-to-br", grad)}>
      {/* faint wave motif so it reads as 'the current', not an empty box */}
      <svg
        aria-hidden
        viewBox="0 0 600 400"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full opacity-[0.16]"
      >
        <defs>
          <linearGradient id={`mf-${tone}`} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor={tone === "warm" ? "#7A5E2E" : "#0E4C82"} />
            <stop offset="100%" stopColor={tone === "warm" ? "#F3E2BE" : "#2E97E6"} />
          </linearGradient>
        </defs>
        <path d="M0 250 C 150 180, 300 320, 450 230 S 700 180, 800 250" fill="none" stroke={`url(#mf-${tone})`} strokeWidth="2" />
        <path d="M0 300 C 180 240, 320 360, 480 280 S 720 240, 820 300" fill="none" stroke={`url(#mf-${tone})`} strokeWidth="1.4" strokeOpacity="0.5" />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
        <span className={cn("flex h-11 w-11 items-center justify-center rounded-full border border-line", ring)}>
          <Icon className="h-5 w-5" strokeWidth={1.6} />
        </span>
        <span className="max-w-[22ch] text-sm font-medium text-muted">
          {label ?? (kind === "film" ? "Authentic footage" : "Real team photography")}
        </span>
        <span className="text-[0.68rem] uppercase tracking-[0.28em] text-subtle">
          Commissioned shoot
        </span>
      </div>
    </div>
  );
}

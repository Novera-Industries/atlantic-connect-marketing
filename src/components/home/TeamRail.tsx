"use client";

import { MediaFrame } from "@/components/media/MediaFrame";
import { media } from "@/lib/media";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const moments: {
  label: string;
  src?: string;
  blur?: string;
  pos?: string;
}[] = [
  { label: "The team, downtown Halifax", src: media.teamGroup.src, blur: media.teamGroup.blur, pos: "center 22%" },
  { label: "Morning huddle, full energy", src: media.momentHuddle.src, blur: media.momentHuddle.blur },
  { label: "First close of the day", src: media.momentClose.src, blur: media.momentClose.blur },
  { label: "Team win on the board", src: media.momentBoard.src, blur: media.momentBoard.blur },
  { label: "Celebrating a promotion", src: media.momentPromo.src, blur: media.momentPromo.blur },
];

function Moment({ m, hidden }: { m: (typeof moments)[number]; hidden?: boolean }) {
  // mr-4 (not flex gap) so each cell is a uniform width — lets the duplicated
  // track loop seamlessly at translateX(-50%).
  return (
    <div className="mr-4 w-[78vw] shrink-0 sm:w-[44vw] lg:w-[23rem]" aria-hidden={hidden}>
      <MediaFrame
        tone="warm"
        aspect="4/5"
        kind="film"
        label={m.label}
        src={m.src}
        blur={m.blur}
        objectPosition={m.pos}
        alt={m.src ? "The Atlantic Connect Marketing team." : ""}
        sizes="(min-width: 1024px) 23rem, 78vw"
      />
    </div>
  );
}

/**
 * Auto-scrolling team-moment rail: a seamless marquee loop (the track is doubled
 * and slides to -50%, so it repeats with no visible seam). Pauses on hover.
 * Reduced motion → a static, swipeable row (no auto-scroll). Real footage drops
 * into each frame at content time.
 */
export function TeamRail() {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return (
      <div className="mt-10 flex overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {moments.map((m, i) => (
          <Moment key={i} m={m} />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_5%,#000_95%,transparent)]">
      <div className="flex w-max animate-team-marquee hover:[animation-play-state:paused]">
        {moments.map((m, i) => (
          <Moment key={`a-${i}`} m={m} />
        ))}
        {moments.map((m, i) => (
          <Moment key={`b-${i}`} m={m} hidden />
        ))}
      </div>
    </div>
  );
}

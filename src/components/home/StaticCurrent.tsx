/**
 * Designed static state for the home "Current" — shown when motion is reduced
 * (or no WebGL), in place of the live particle engine. Not a frozen poster of
 * the particles: a quiet, two-temperature atmosphere (cool bloom up top where
 * the hero nebula lives, a warm hint lower-right for the talent beat) so the
 * page still reads as one world without any animation. Pure CSS, no canvas.
 */
export function StaticCurrent() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      {/* cool bloom — the hero nebula's resting place */}
      <div className="absolute inset-0 bg-[radial-gradient(58%_40%_at_50%_16%,rgba(46,151,230,0.16),transparent_70%)]" />
      {/* warm hint — the talent temperature */}
      <div className="absolute inset-0 bg-[radial-gradient(46%_34%_at_82%_64%,rgba(232,201,138,0.08),transparent_70%)]" />
      {/* faint current line through the middle */}
      <div className="absolute inset-x-0 top-[42%] h-px bg-gradient-to-r from-transparent via-brand/20 to-transparent" />
      {/* settle the edges so type stays AAA */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,transparent_55%,rgba(6,17,30,0.5)_100%)]" />
    </div>
  );
}

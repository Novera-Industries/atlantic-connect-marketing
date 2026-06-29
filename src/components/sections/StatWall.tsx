import { CountUp } from "@/components/motion/CountUp";
import { cn } from "@/lib/cn";

type Item = { value: number | null; suffix?: string; label: string; real?: boolean };

/**
 * Credibility wall - VERIFIABLE figures only. A null value renders as an
 * intentional "verified at launch" slot, never a fabricated number. This is
 * the no-proof launch state, designed to look deliberate.
 */
export function StatWall({ items }: { items: Item[] }) {
  return (
    <dl className="grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
      {items.map((it, i) => (
        <div key={i} className="bg-bg-elev p-7">
          <dd className={cn("font-display text-4xl font-semibold sm:text-5xl", it.value === null ? "text-subtle" : "text-chrome")}>
            {it.value === null ? (
              <span aria-hidden className="inline-block h-1 w-9 rounded-full bg-subtle/40 align-middle" />
            ) : (
              <CountUp value={it.value} suffix={it.suffix} />
            )}
          </dd>
          <dt className="mt-3 text-sm text-muted">{it.label}</dt>
          {it.value === null && (
            <span className="mt-3 inline-block rounded-full border border-line px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.2em] text-subtle">
              Verified at launch
            </span>
          )}
        </div>
      ))}
    </dl>
  );
}

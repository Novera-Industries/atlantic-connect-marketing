import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * The Atlantic Connect mark: the official chrome "AC" + ocean-wave logo
 * (cropped from the client logo; the black wordmark is dropped because it's
 * invisible on navy) paired with a light wordmark that reads on the dark ground.
 */
export function BrandMark({
  className,
  showWordmark = true,
  wordmarkClassName,
}: {
  className?: string;
  showWordmark?: boolean;
  wordmarkClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image
        src="/brand/logo-mark.webp"
        alt="Atlantic Connect Marketing"
        width={230}
        height={160}
        priority
        className="h-9 w-auto shrink-0 drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]"
      />
      {showWordmark && (
        <span className={cn("flex flex-col leading-none", wordmarkClassName)}>
          <span className="font-display text-[0.98rem] font-semibold tracking-display text-ink">
            Atlantic Connect
          </span>
          <span className="text-[0.62rem] font-medium uppercase tracking-[0.34em] text-subtle">
            Marketing
          </span>
        </span>
      )}
    </span>
  );
}

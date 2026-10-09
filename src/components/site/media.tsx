import Image from "next/image";

import { cn } from "@/lib/utils";
import type { MediaAsset } from "@/lib/types";

/**
 * Responsive image slot (TRD §8 media pipeline: next/image generates sized,
 * modern-format variants instead of WordPress's -300x300 style copies).
 *
 * Until the media library is migrated from /wp-content/uploads/, assets
 * without a `src` render a branded placeholder so layouts stay intact.
 */
export function Media({
  asset,
  sizes = "100vw",
  priority,
  className,
  aspect = "aspect-[4/5]",
}: {
  asset?: MediaAsset;
  sizes?: string;
  priority?: boolean;
  className?: string;
  aspect?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-secondary",
        aspect,
        className,
      )}
    >
      {asset?.src ? (
        <Image
          src={asset.src}
          alt={asset.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : (
        <div
          role="img"
          aria-label={asset?.alt ?? "Image coming soon"}
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[radial-gradient(ellipse_at_top,var(--color-card),var(--color-secondary)_60%,var(--color-border))] p-6 text-center"
        >
          <span className="font-heading text-4xl text-brand-ink italic">AG</span>
          {asset?.alt && (
            <span className="max-w-[16rem] text-[0.65rem] tracking-[0.2em] text-muted-foreground uppercase">
              {asset.alt}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

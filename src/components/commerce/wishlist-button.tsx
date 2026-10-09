"use client";

import { HeartIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import type { ProductSnapshot } from "@/lib/commerce";
import { useWishlist, wishlist } from "@/lib/store";
import { cn } from "@/lib/utils";

/** Native wishlist, replacing the /wishsuite/ plugin (audit §2.2, §4). */
export function WishlistButton({
  product,
  withLabel = false,
  className,
}: {
  product: ProductSnapshot;
  withLabel?: boolean;
  className?: string;
}) {
  const { has } = useWishlist();
  const saved = has(product.slug);
  const label = saved ? "Saved to wishlist" : "Save to wishlist";

  return (
    <Button
      variant={withLabel ? "ghost" : "secondary"}
      size={withLabel ? "lg" : "icon"}
      aria-pressed={saved}
      aria-label={withLabel ? undefined : label}
      className={className}
      onClick={() => {
        if (!saved) trackEvent("add_to_wishlist", { item_id: product.sku });
        wishlist.toggle({
          slug: product.slug,
          name: product.name,
          sku: product.sku,
          priceUsd: product.priceUsd,
          image: product.image,
        });
      }}
    >
      <HeartIcon
        data-icon={withLabel ? "inline-start" : undefined}
        className={cn(saved && "fill-current text-brand")}
      />
      {withLabel && label}
    </Button>
  );
}

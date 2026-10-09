import type { BagItem } from "@/lib/store";
import type { Product } from "@/lib/types";

/** Serializable product snapshot passed to client commerce components. */
export type ProductSnapshot = Omit<BagItem, "quantity"> & {
  inStock: boolean;
  madeToOrder: boolean;
};

export function toSnapshot(p: Product): ProductSnapshot {
  return {
    slug: p.slug,
    name: p.name,
    sku: p.sku,
    priceUsd: p.priceUsd,
    image: p.images[0],
    maxQuantity: p.stockQuantity,
    inStock: p.inStock,
    madeToOrder: p.madeToOrder,
  };
}

/** Whether a product can go straight into the bag (vs. commission via consultation). */
export function isPurchasable(p: Pick<Product, "inStock" | "madeToOrder">) {
  return p.inStock && !p.madeToOrder;
}

import Link from "next/link";

import { Price } from "@/components/commerce/price";
import { WishlistButton } from "@/components/commerce/wishlist-button";
import { ProductSpotlight } from "@/components/catalog/product-spotlight";
import { QuickView } from "@/components/catalog/quick-view";
import { Media } from "@/components/site/media";
import { Badge } from "@/components/ui/badge";
import { getCollections } from "@/lib/catalog";
import { isPurchasable, toSnapshot } from "@/lib/commerce";
import type { Product } from "@/lib/types";

/**
 * Product card (audit §3.3/§3.4): image, quick view, wishlist, collection
 * tag, title and price. Primary action stays on the PDP so every card has
 * a single, clear tap target on mobile.
 */
export async function ProductCard({
  product,
  priority,
}: {
  product: Product;
  priority?: boolean;
}) {
  const collections = await getCollections();
  const tag =
    collections.find(
      (c) => c.kind === "signature" && product.collections.includes(c.slug),
    ) ?? collections.find((c) => product.collections.includes(c.slug));
  const snapshot = toSnapshot(product);
  const href = `/product/${product.slug}`;

  return (
    <article className="group relative flex flex-col gap-3">
      <div className="relative">
        <Link href={href} aria-label={product.name}>
          <Media
            asset={product.images[0]}
            priority={priority}
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 50vw"
            className="transition-transform duration-700 group-hover:scale-[1.02]"
          />
        </Link>
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.madeToOrder && <Badge variant="secondary">Commission</Badge>}
          {!product.inStock && <Badge variant="secondary">Sold out</Badge>}
        </div>
        <WishlistButton product={snapshot} className="absolute top-2 right-2" />
        <QuickView
          product={snapshot}
          description={product.shortDescription}
          purchasable={isPurchasable(product)}
          className="absolute inset-x-2 bottom-2 hidden opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 md:flex"
        />
      </div>
      <div className="flex flex-col gap-1">
        {tag && (
          <Link
            href={`/collections/${tag.slug}`}
            className="text-[0.65rem] tracking-[0.2em] text-brand-ink uppercase hover:underline"
          >
            {tag.name}
          </Link>
        )}
        <h3 className="font-heading text-lg leading-snug sm:text-xl">
          <Link href={href} className="hover:underline underline-offset-4">
            {product.name}
          </Link>
        </h3>
        <Price
          usd={product.priceUsd}
          className="text-sm text-muted-foreground"
        />
      </div>
    </article>
  );
}

/**
 * Product listing. `adaptive` avoids a lone card beside empty columns on
 * sparse collections: 1 piece → spotlight, 2 → two large cards, 3+ → grid.
 */
export function ProductGrid({
  products,
  adaptive = false,
}: {
  products: Product[];
  adaptive?: boolean;
}) {
  if (adaptive && products.length === 1) {
    return <ProductSpotlight product={products[0]} />;
  }
  if (adaptive && products.length === 2) {
    return (
      <div className="mx-auto grid w-full max-w-4xl gap-x-6 gap-y-10 sm:grid-cols-2 lg:gap-x-10">
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} priority />
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3">
      {products.map((p, i) => (
        <ProductCard key={p.slug} product={p} priority={i < 3} />
      ))}
    </div>
  );
}

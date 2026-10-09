import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

import { ProductPurchase } from "@/components/catalog/product-purchase";
import { Price } from "@/components/commerce/price";
import { Media } from "@/components/site/media";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCollections } from "@/lib/catalog";
import { toSnapshot } from "@/lib/commerce";
import type { Product } from "@/lib/types";

/** Single-piece feature layout for collections with one product. */
export async function ProductSpotlight({ product }: { product: Product }) {
  const collections = await getCollections();
  const primary =
    collections.find(
      (c) => c.kind === "signature" && product.collections.includes(c.slug),
    ) ?? collections.find((c) => product.collections.includes(c.slug));
  const href = `/product/${product.slug}`;

  return (
    <article className="grid items-center gap-8 border bg-card md:grid-cols-2 md:gap-0">
      <Link
        href={href}
        aria-label={product.name}
        className="group block overflow-hidden"
      >
        <Media
          asset={product.images[0]}
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          className="transition-transform duration-700 group-hover:scale-[1.02]"
        />
      </Link>
      <div className="flex flex-col gap-5 px-5 pb-8 md:px-10 md:py-10 lg:px-14">
        {primary && <p className="eyebrow">{primary.name}</p>}
        <h3 className="text-4xl leading-tight md:text-5xl">
          <Link href={href} className="underline-offset-4 hover:underline">
            {product.name}
          </Link>
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <Price usd={product.priceUsd} className="text-2xl" />
          {product.madeToOrder && (
            <Badge variant="secondary">Made to order</Badge>
          )}
          {!product.inStock && !product.madeToOrder && (
            <Badge variant="secondary">Sold out</Badge>
          )}
        </div>
        <p className="leading-relaxed text-muted-foreground">
          {product.shortDescription}
        </p>
        <ProductPurchase
          product={toSnapshot(product)}
          collectionName={primary?.name}
        />
        <Button
          variant="link"
          className="self-start px-0"
          nativeButton={false}
          render={<Link href={href} />}
        >
          View full details <ArrowRightIcon data-icon="inline-end" />
        </Button>
      </div>
    </article>
  );
}

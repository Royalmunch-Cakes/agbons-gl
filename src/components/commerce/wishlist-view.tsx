"use client";

import { HeartIcon, XIcon } from "lucide-react";
import Link from "next/link";

import { Price } from "@/components/commerce/price";
import { Media } from "@/components/site/media";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useWishlist, wishlist } from "@/lib/store";

/** Wishlist page body — replaces the /wishsuite/ plugin page (audit §2.2). */
export function WishlistView() {
  const { items } = useWishlist();

  if (!items.length) {
    return (
      <Empty className="border py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <HeartIcon />
          </EmptyMedia>
          <EmptyTitle>Your wishlist is empty</EmptyTitle>
          <EmptyDescription>
            Tap the heart on any piece to save it here.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button nativeButton={false} render={<Link href="/shop" />}>
            Explore the shop
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
      {items.map((item) => (
        <li key={item.slug} className="relative flex flex-col gap-3">
          <Link href={`/product/${item.slug}`}>
            <Media asset={item.image} sizes="(min-width: 1024px) 25vw, 50vw" />
          </Link>
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-2 right-2"
            aria-label={`Remove ${item.name} from wishlist`}
            onClick={() => wishlist.remove(item.slug)}
          >
            <XIcon />
          </Button>
          <Link
            href={`/product/${item.slug}`}
            className="font-heading text-lg leading-snug hover:underline"
          >
            {item.name}
          </Link>
          <Price usd={item.priceUsd} className="text-sm text-muted-foreground" />
        </li>
      ))}
    </ul>
  );
}

import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { getCollections, getProducts } from "@/lib/catalog";
import { getContent } from "@/lib/content";

/** XML sitemap (TRD §8 SEO parity). Bag and wishlist are excluded (noindex). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collections, journalPosts] = await Promise.all([
    getProducts(),
    getCollections(),
    getContent("journal"),
  ]);
  const url = (path: string) => `${siteConfig.url}${path}`;

  const pages: [string, number][] = [
    ["/", 1],
    ["/bridal-couture", 0.9],
    ["/collections", 0.9],
    ["/shop", 0.9],
    ["/consultation", 0.8],
    ["/about", 0.7],
    ["/lookbook", 0.7],
    ["/journal", 0.6],
    ["/contact", 0.6],
    ["/faqs", 0.5],
    ["/shipping", 0.3],
    ["/returns", 0.3],
    ["/privacy", 0.2],
    ["/terms", 0.2],
  ];

  return [
    ...pages.map(([path, priority]) => ({ url: url(path), priority })),
    ...collections.map((c) => ({
      url: url(`/collections/${c.slug}`),
      priority: 0.8,
      images: c.hero.src ? [url(c.hero.src)] : undefined,
    })),
    ...products.map((p) => ({
      url: url(`/product/${p.slug}`),
      priority: 0.7,
      images: p.images.flatMap((i) => (i.src ? [url(i.src)] : [])),
    })),
    ...journalPosts.map((p) => ({
      url: url(`/journal/${p.slug}`),
      priority: 0.5,
    })),
  ];
}

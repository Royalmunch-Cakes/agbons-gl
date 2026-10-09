import { collections, productLines } from "@/content/collections";
import { products } from "@/content/products";
import type { Collection, Product, ProductLine } from "@/lib/types";

/**
 * Catalog data access. Pages only talk to these functions, so the static
 * content files can later be replaced with a headless CMS (TRD §8) by
 * changing the implementations here. They are async for that reason.
 */

export const PAGE_SIZE = 9;

export type SortKey = "featured" | "newest" | "price-asc" | "price-desc";

export const sortOptions: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

export type ProductQuery = {
  q?: string;
  line?: string;
  collections?: string[];
  sort?: SortKey;
  page?: number;
};

export async function getProducts(): Promise<Product[]> {
  return products;
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  return products.find((p) => p.slug === slug);
}

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  return products.filter((p) => p.featured).slice(0, limit);
}

export async function getProductLines(): Promise<ProductLine[]> {
  return productLines;
}

export async function getProductLine(
  slug: string,
): Promise<ProductLine | undefined> {
  return productLines.find((l) => l.slug === slug);
}

export async function getCollections(): Promise<Collection[]> {
  return collections;
}

export async function getCollection(
  slug: string,
): Promise<Collection | undefined> {
  return collections.find((c) => c.slug === slug);
}

export async function getProductsInCollection(slug: string): Promise<Product[]> {
  return products.filter((p) => p.collections.includes(slug));
}

/** Facet counts for the shop filter (audit §3.4 "category checkboxes with counts"). */
export async function getFacetCounts() {
  const count = (pred: (p: Product) => boolean) => products.filter(pred).length;
  return {
    lines: productLines.map((l) => ({
      ...l,
      count: count((p) => p.line === l.slug),
    })),
    collections: collections.map((c) => ({
      ...c,
      count: count((p) => p.collections.includes(c.slug)),
    })),
  };
}

function sortProducts(list: Product[], sort: SortKey): Product[] {
  const sorted = [...list];
  switch (sort) {
    case "newest":
      return sorted.sort((a, b) => b.sortOrder - a.sortOrder);
    case "price-asc":
      return sorted.sort((a, b) => a.priceUsd - b.priceUsd);
    case "price-desc":
      return sorted.sort((a, b) => b.priceUsd - a.priceUsd);
    default:
      return sorted.sort(
        (a, b) =>
          Number(!!b.featured) - Number(!!a.featured) ||
          b.sortOrder - a.sortOrder,
      );
  }
}

/** Search, filter, sort and paginate (audit §3.4 shop requirements). */
export async function queryProducts(query: ProductQuery) {
  const q = query.q?.trim().toLowerCase();
  const selected = query.collections ?? [];

  const filtered = products.filter((p) => {
    if (query.line && p.line !== query.line) return false;
    if (selected.length && !selected.some((c) => p.collections.includes(c)))
      return false;
    if (q) {
      const haystack =
        `${p.name} ${p.sku} ${p.shortDescription} ${p.collections.join(" ")}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  const sorted = sortProducts(filtered, query.sort ?? "featured");
  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, query.page ?? 1), pageCount);

  return {
    items: sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    total: sorted.length,
    page,
    pageCount,
  };
}

/** Related products: same collection first, then same line (audit §3.5 item 12). */
export async function getRelatedProducts(
  product: Product,
  limit = 3,
): Promise<Product[]> {
  const others = products.filter((p) => p.slug !== product.slug);
  const score = (p: Product) =>
    p.collections.filter((c) => product.collections.includes(c)).length * 2 +
    (p.line === product.line ? 1 : 0);
  return others
    .map((p) => ({ p, s: score(p) }))
    .filter(({ s }) => s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map(({ p }) => p);
}

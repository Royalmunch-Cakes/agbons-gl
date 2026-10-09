/**
 * Content model (audit §4, TRD §8 "product/collection data model").
 *
 * The catalog uses a two-axis taxonomy as first-class schema:
 *   - `ProductLine`  — the garment line (e.g. Bridal Couture, Ready-to-Wear)
 *   - `Collection`   — a named signature collection or a season/year drop
 * A product belongs to exactly one line and any number of collections.
 *
 * These types are the seam for a headless CMS: content files in
 * `src/content/` implement them today and can be swapped for CMS queries in
 * `src/lib/catalog.ts` without touching pages.
 */

/** A single image in the media library. `src` is optional until assets are migrated. */
export type MediaAsset = {
  src?: string;
  alt: string;
};

export type ProductLine = {
  slug: string;
  name: string;
  description: string;
};

export type CollectionKind = "signature" | "season";

export type Collection = {
  slug: string;
  name: string;
  kind: CollectionKind;
  /** Short code used in SKUs, e.g. CDC → AGB-CDC-033. */
  code: string;
  year?: number;
  tagline: string;
  description: string;
  hero: MediaAsset;
  /** Old WordPress path, kept for 301 redirects (see next.config.ts). */
  legacyPath?: string;
};

export type ProductDetails = {
  fabric?: string;
  silhouette?: string;
  embellishment?: string;
  care?: string;
  /** Production lead time for made-to-order pieces. */
  leadTime?: string;
};

export type Product = {
  slug: string;
  sku: string;
  name: string;
  line: string;
  collections: string[];
  /** Base price in USD (audit §5.13). Display currency is converted client-side. */
  priceUsd: number;
  images: MediaAsset[];
  shortDescription: string;
  description: string;
  details: ProductDetails;
  /** Units available for immediate purchase. 0 with `madeToOrder` = commission only. */
  stock: number;
  /** Bespoke piece made to the client's measurements (audit §4, §5.11). */
  madeToOrder: boolean;
  featured?: boolean;
  /** ISO date, used for "newest" sorting. */
  publishedAt: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  location: string;
};

export type CurrencyCode = "USD" | "NGN";

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

export type StorySection = {
  heading: string;
  paragraphs: string[];
};

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
  /** Editorial story shown on the collection page (migrated from WordPress). */
  story?: StorySection[];
  /** Commission price for a bespoke piece from this collection. */
  fromPriceUsd?: number;
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
  inStock: boolean;
  /** Tracked quantity, when WooCommerce managed stock for the product. */
  stockQuantity?: number;
  /** Commissioned bespoke piece made to the client's measurements (audit §4, §5.11). */
  madeToOrder: boolean;
  featured?: boolean;
  /** Higher = newer. Used for "newest" sorting. */
  sortOrder: number;
  /** Original WordPress URL, for migration traceability. */
  sourceUrl?: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  location: string;
};

/** Admin-editable site settings (contact, hours, socials, announcement). */
export type SiteSettings = {
  announcement: string;
  contact: { email: string; phone: string; whatsapp: string };
  socials: { instagram: string; facebook: string; tiktok: string; x: string };
  hours: { days: string; time: string }[];
  hoursNote: string;
};

export type HomeFeature = {
  title: string;
  cta: string;
  href: string;
  image: MediaAsset;
};

/** Admin-editable homepage copy and imagery (audit §3.1). */
export type HomeContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroAccent: string;
  heroSubtitle: string;
  heroImage: MediaAsset;
  storyEyebrow: string;
  storyHeading: string;
  storyParagraphs: string[];
  storyImage: MediaAsset;
  features: HomeFeature[];
  dreamHeading: string;
  dreamBody: string;
  dreamSteps: string[];
  dreamImage: MediaAsset;
};

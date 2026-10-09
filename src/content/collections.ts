import type { Collection, ProductLine } from "@/lib/types";

/** Garment lines — axis 1 of the taxonomy (audit §4). */
export const productLines: ProductLine[] = [
  {
    slug: "bridal-couture",
    name: "Bridal Couture",
    description:
      "Bespoke bridal gowns hand-finished in our Benin City atelier, made to your measurements.",
  },
  {
    slug: "ready-to-wear",
    name: "Ready-to-Wear",
    description:
      "Luxury occasion and reception pieces, available to order in standard sizes or tailored.",
  },
];

/**
 * Named and seasonal collections — axis 2 of the taxonomy (audit §2.4).
 * `legacyPath` preserves the WordPress URL so it can 301 to the new route.
 *
 * TODO(content): confirm collection copy and hero imagery with the client.
 */
export const collections: Collection[] = [
  {
    slug: "haute-couture",
    name: "Haute Couture Collection",
    kind: "signature",
    code: "HCC",
    tagline: "Atelier pieces of uncompromising craft.",
    description:
      "Our most technical work — sculpted bodices, hand-applied embellishment and architectural silhouettes, each piece taking hundreds of hours in the atelier.",
    hero: { alt: "Haute Couture Collection gown in the atelier" },
    legacyPath: "/haute-collection",
  },
  {
    slug: "queen-idia",
    name: "Queen Idia Collection",
    kind: "signature",
    code: "QIC",
    tagline: "A tribute to Benin's warrior queen.",
    description:
      "Inspired by the iconic ivory mask of Queen Idia — coral-bead detailing, regal necklines and a quiet strength drawn from Edo heritage.",
    hero: { alt: "Queen Idia Collection gown with coral detailing" },
    legacyPath: "/queen-idia-collection",
  },
  {
    slug: "crystal-drop",
    name: "Crystal Drop Collection",
    kind: "signature",
    code: "CDC",
    tagline: "Light, caught and held.",
    description:
      "Cascading crystal drops on fluid silhouettes, designed to move and shimmer with every step down the aisle.",
    hero: { alt: "Crystal Drop Collection gown with cascading crystals" },
    legacyPath: "/crystal-drop-collection",
  },
  {
    slug: "ice-crystal",
    name: "Ice & Crystal Collection",
    kind: "signature",
    code: "ICC",
    tagline: "Cool tones, brilliant finish.",
    description:
      "Frost-pale fabrics layered with crystal embroidery for the bride who wants to glow in clean, luminous lines.",
    hero: { alt: "Ice & Crystal Collection gown" },
    legacyPath: "/ice-crystal-collection",
  },
  {
    slug: "royal-ancestors",
    name: "Royal Ancestors Collection",
    kind: "signature",
    code: "RAC",
    tagline: "Heritage, worn with pride.",
    description:
      "Rich textures and ceremonial references that honour the royal courts of our ancestors, reimagined for the modern bride.",
    hero: { alt: "Royal Ancestors Collection gown" },
    legacyPath: "/royal-ancestors-collection",
  },
  {
    slug: "stone-petal-sparkle",
    name: "Stone, Petal & Sparkle Collection",
    kind: "signature",
    code: "SPS",
    tagline: "Romance in three dimensions.",
    description:
      "Hand-placed stones, sculpted petals and soft sparkle combine in romantic, textural gowns.",
    hero: { alt: "Stone, Petal & Sparkle Collection gown" },
    legacyPath: "/stone-petal-sparkle-collection",
  },
  {
    slug: "2024",
    name: "2024 Collections",
    kind: "season",
    code: "C24",
    year: 2024,
    tagline: "The 2024 bridal season.",
    description:
      "Every gown from our 2024 bridal season, from statement ballgowns to modern minimalist silhouettes.",
    hero: { alt: "2024 bridal season gowns" },
  },
  {
    slug: "2023",
    name: "2023 Collections",
    kind: "season",
    code: "C23",
    year: 2023,
    tagline: "The 2023 bridal season.",
    description:
      "Signature pieces from our 2023 bridal season, available to commission in your measurements.",
    hero: { alt: "2023 bridal season gowns" },
  },
];

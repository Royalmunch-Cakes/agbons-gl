import type { Product, ProductDetails } from "@/lib/types";

/**
 * SAMPLE CATALOG — placeholder data for development.
 *
 * The live site has 42 products (audit §2.4, §6). Only "Onyx Frost Tailored
 * Dress" (AGB-CDC-033) was confirmed by the audit; every other entry is
 * illustrative. Replace this file with the migrated WooCommerce export (or
 * a CMS query in src/lib/catalog.ts) before launch.
 *
 * SKU format: AGB-{collection code}-{nnn} (audit §4).
 */

const bespokeCare =
  "Professional specialist dry clean only. Store flat or hanging in the breathable garment bag provided.";

function product(
  p: Omit<Product, "images" | "details" | "description"> & {
    description?: string;
    details?: ProductDetails;
    imageCount?: number;
  },
): Product {
  const { imageCount = 3, details, description, ...rest } = p;
  return {
    ...rest,
    description: description ?? p.shortDescription,
    details: { care: bespokeCare, ...details },
    images: Array.from({ length: imageCount }, (_, i) => ({
      alt: `${p.name} — view ${i + 1}`,
    })),
  };
}

export const products: Product[] = [
  product({
    slug: "onyx-frost-tailored-dress",
    sku: "AGB-CDC-033",
    name: "Onyx Frost Tailored Dress",
    line: "bridal-couture",
    collections: ["crystal-drop", "2024"],
    priceUsd: 1850,
    shortDescription:
      "A sharply tailored silhouette in deep onyx, finished with frost-crystal detailing at the neckline.",
    description:
      "The Onyx Frost Tailored Dress pairs a structured, figure-skimming cut with a scattering of hand-set frost crystals. Designed for the reception or an evening celebration, it is made in our Benin City atelier and finished by hand.",
    details: {
      fabric: "Silk crepe with satin lining",
      silhouette: "Tailored column",
      embellishment: "Hand-set crystals",
      leadTime: "4–6 weeks",
    },
    stock: 1,
    madeToOrder: false,
    featured: true,
    publishedAt: "2024-05-12",
  }),
  product({
    slug: "ivory-oba-ballgown",
    sku: "AGB-HCC-001",
    name: "Ivory Oba Ballgown",
    line: "bridal-couture",
    collections: ["haute-couture", "2024"],
    priceUsd: 6500,
    shortDescription:
      "A regal ivory ballgown with a sculpted corset and cathedral-length train.",
    details: {
      fabric: "Duchess satin, tulle underlay",
      silhouette: "Ballgown",
      embellishment: "Hand-beaded lace appliqué",
      leadTime: "10–14 weeks",
    },
    stock: 0,
    madeToOrder: true,
    featured: true,
    publishedAt: "2024-03-02",
  }),
  product({
    slug: "queen-idia-pearl-mermaid-gown",
    sku: "AGB-QIC-002",
    name: "Queen Idia Pearl Mermaid Gown",
    line: "bridal-couture",
    collections: ["queen-idia", "2024"],
    priceUsd: 5200,
    shortDescription:
      "A mermaid silhouette crowned with pearl and coral-bead detailing inspired by Queen Idia.",
    details: {
      fabric: "Stretch crepe, French lace",
      silhouette: "Mermaid",
      embellishment: "Pearls and coral beads",
      leadTime: "8–12 weeks",
    },
    stock: 0,
    madeToOrder: true,
    featured: true,
    publishedAt: "2024-04-18",
  }),
  product({
    slug: "crystal-cascade-bridal-gown",
    sku: "AGB-CDC-003",
    name: "Crystal Cascade Bridal Gown",
    line: "bridal-couture",
    collections: ["crystal-drop", "2024"],
    priceUsd: 4800,
    shortDescription:
      "Fluid layers of tulle with crystal drops that cascade from bodice to hem.",
    details: {
      fabric: "Silk tulle",
      silhouette: "A-line",
      embellishment: "Crystal drops",
      leadTime: "8–10 weeks",
    },
    stock: 0,
    madeToOrder: true,
    featured: true,
    publishedAt: "2024-02-20",
  }),
  product({
    slug: "ice-petal-corset-gown",
    sku: "AGB-ICC-004",
    name: "Ice Petal Corset Gown",
    line: "bridal-couture",
    collections: ["ice-crystal", "2024"],
    priceUsd: 4300,
    shortDescription:
      "A boned corset gown in frost-pale organza with crystal-edged petals.",
    details: {
      fabric: "Organza, satin corsetry",
      silhouette: "Fit and flare",
      embellishment: "Crystal-edged petals",
      leadTime: "8–10 weeks",
    },
    stock: 0,
    madeToOrder: true,
    featured: true,
    publishedAt: "2024-06-01",
  }),
  product({
    slug: "royal-ancestor-coral-gown",
    sku: "AGB-RAC-005",
    name: "Royal Ancestor Coral Gown",
    line: "bridal-couture",
    collections: ["royal-ancestors", "2024"],
    priceUsd: 5600,
    shortDescription:
      "A ceremonial gown with coral accents and a structured, royal neckline.",
    details: {
      fabric: "Brocade and silk faille",
      silhouette: "Ballgown",
      embellishment: "Coral beadwork",
      leadTime: "10–12 weeks",
    },
    stock: 0,
    madeToOrder: true,
    featured: true,
    publishedAt: "2024-07-09",
  }),
  product({
    slug: "stone-and-petal-sparkle-gown",
    sku: "AGB-SPS-006",
    name: "Stone & Petal Sparkle Gown",
    line: "bridal-couture",
    collections: ["stone-petal-sparkle", "2024"],
    priceUsd: 4950,
    shortDescription:
      "Three-dimensional petals and hand-placed stones on a romantic A-line.",
    details: {
      fabric: "Tulle, organza petals",
      silhouette: "A-line",
      embellishment: "Hand-placed stones, 3D petals",
      leadTime: "8–12 weeks",
    },
    stock: 0,
    madeToOrder: true,
    publishedAt: "2024-08-14",
  }),
  product({
    slug: "edo-moonlight-a-line-gown",
    sku: "AGB-C24-007",
    name: "Edo Moonlight A-Line Gown",
    line: "bridal-couture",
    collections: ["2024"],
    priceUsd: 3600,
    shortDescription:
      "A softly structured A-line with a sweetheart neckline and moonlit sheen.",
    details: { fabric: "Mikado silk", silhouette: "A-line", leadTime: "6–8 weeks" },
    stock: 1,
    madeToOrder: false,
    publishedAt: "2024-01-22",
  }),
  product({
    slug: "ivory-lace-cathedral-gown",
    sku: "AGB-C24-008",
    name: "Ivory Lace Cathedral Gown",
    line: "bridal-couture",
    collections: ["2024"],
    priceUsd: 4200,
    shortDescription:
      "Long-sleeved French lace with a dramatic cathedral train.",
    details: {
      fabric: "French Chantilly lace",
      silhouette: "Sheath with detachable train",
      leadTime: "8–10 weeks",
    },
    stock: 0,
    madeToOrder: true,
    publishedAt: "2024-09-03",
  }),
  product({
    slug: "champagne-bloom-ballgown",
    sku: "AGB-C24-009",
    name: "Champagne Bloom Ballgown",
    line: "bridal-couture",
    collections: ["2024"],
    priceUsd: 3900,
    shortDescription: "Champagne tulle layered with blooming floral appliqué.",
    details: { fabric: "Tulle", silhouette: "Ballgown", leadTime: "8 weeks" },
    stock: 1,
    madeToOrder: false,
    publishedAt: "2024-10-11",
  }),
  product({
    slug: "pearl-veil-off-shoulder-gown",
    sku: "AGB-C23-010",
    name: "Pearl Veil Off-Shoulder Gown",
    line: "bridal-couture",
    collections: ["2023"],
    priceUsd: 3400,
    shortDescription:
      "An off-shoulder bodice edged in seed pearls with a matching veil.",
    details: {
      fabric: "Satin, silk tulle veil",
      silhouette: "Fit and flare",
      leadTime: "6–8 weeks",
    },
    stock: 1,
    madeToOrder: false,
    publishedAt: "2023-03-15",
  }),
  product({
    slug: "gilded-heritage-gown",
    sku: "AGB-C23-011",
    name: "Gilded Heritage Gown",
    line: "bridal-couture",
    collections: ["2023"],
    priceUsd: 3800,
    shortDescription: "Gold-thread embroidery tracing traditional Edo motifs.",
    details: {
      fabric: "Silk shantung",
      silhouette: "A-line",
      embellishment: "Gold-thread embroidery",
      leadTime: "8 weeks",
    },
    stock: 0,
    madeToOrder: true,
    publishedAt: "2023-05-28",
  }),
  product({
    slug: "ivory-crepe-minimalist-gown",
    sku: "AGB-C23-012",
    name: "Ivory Crepe Minimalist Gown",
    line: "bridal-couture",
    collections: ["2023"],
    priceUsd: 2600,
    shortDescription: "Clean lines, a low back and a whisper of a train.",
    details: { fabric: "Heavy silk crepe", silhouette: "Column", leadTime: "6 weeks" },
    stock: 2,
    madeToOrder: false,
    publishedAt: "2023-07-04",
  }),
  product({
    slug: "aso-oke-reception-gown",
    sku: "AGB-C23-013",
    name: "Aso-Oke Reception Gown",
    line: "ready-to-wear",
    collections: ["2023"],
    priceUsd: 1450,
    shortDescription:
      "Hand-woven aso-oke reimagined as a fitted reception gown.",
    details: { fabric: "Hand-woven aso-oke", silhouette: "Mermaid", leadTime: "4 weeks" },
    stock: 2,
    madeToOrder: false,
    publishedAt: "2023-09-19",
  }),
  product({
    slug: "midnight-bead-reception-dress",
    sku: "AGB-C24-014",
    name: "Midnight Bead Reception Dress",
    line: "ready-to-wear",
    collections: ["2024"],
    priceUsd: 1250,
    shortDescription: "A midnight-blue cocktail dress with all-over beadwork.",
    details: {
      fabric: "Beaded mesh",
      silhouette: "Knee-length sheath",
      leadTime: "3–4 weeks",
    },
    stock: 3,
    madeToOrder: false,
    publishedAt: "2024-11-02",
  }),
  product({
    slug: "coral-court-two-piece",
    sku: "AGB-C23-015",
    name: "Coral Court Two-Piece",
    line: "ready-to-wear",
    collections: ["2023"],
    priceUsd: 1150,
    shortDescription: "A structured bustier and flowing skirt with coral accents.",
    details: { fabric: "Satin and chiffon", silhouette: "Two-piece", leadTime: "3–4 weeks" },
    stock: 2,
    madeToOrder: false,
    publishedAt: "2023-11-25",
  }),
];

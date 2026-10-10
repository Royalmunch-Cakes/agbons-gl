import type { Collection, Product } from "@/lib/types";

/** Blank documents for the admin "New" forms. */
export function emptyProduct(): Product {
  return {
    slug: "",
    sku: "",
    name: "",
    line: "bridal-couture",
    collections: [],
    priceUsd: 0,
    images: [],
    shortDescription: "",
    description: "",
    details: {},
    inStock: true,
    madeToOrder: false,
    featured: false,
    sortOrder: 0,
  };
}

export function emptyCollection(): Collection {
  return {
    slug: "",
    name: "",
    kind: "signature",
    code: "",
    tagline: "",
    description: "",
    hero: { alt: "" },
    story: [],
  };
}

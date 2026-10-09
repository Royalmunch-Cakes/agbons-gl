import type { NextConfig } from "next";

import { collections } from "./src/content/collections";

// WooCommerce category slug → new collection slug (audit §2.2).
const legacyCategories: Record<string, string> = {
  "bridal-couture/2023-collections": "2023",
  "bridal-couture/2024-collections": "2024",
  "2023-collections": "2023",
  "2024-collections": "2024",
  "crystal-drop-collection": "crystal-drop",
  "haute-couture-collections": "haute-couture",
  "ice-and-crystals": "ice-crystal",
  "queen-idia-collection": "queen-idia",
  "royal-ancestors": "royal-ancestors",
  "stone-petal-sparkle": "stone-petal-sparkle",
};

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  /**
   * Permanent redirects from WordPress URLs so existing links and search
   * rankings carry over at cutover (audit §2, TRD §8 content migration).
   * /product/{slug} keeps its original path and needs no redirect.
   */
  async redirects() {
    return [
      ...collections
        .filter((c) => c.legacyPath)
        .map((c) => ({
          source: c.legacyPath!,
          destination: `/collections/${c.slug}`,
          permanent: true,
        })),
      ...Object.entries(legacyCategories).map(([from, to]) => ({
        source: `/product-category/${from}`,
        destination: `/collections/${to}`,
        permanent: true,
      })),
      { source: "/product-category/bridal-couture", destination: "/bridal-couture", permanent: true },
      { source: "/wishsuite", destination: "/wishlist", permanent: true },
      { source: "/cart", destination: "/bag", permanent: true },
      { source: "/checkout", destination: "/bag", permanent: true },
      { source: "/faq-2", destination: "/faqs", permanent: true },
      { source: "/blog", destination: "/journal", permanent: true },
      { source: "/services", destination: "/consultation", permanent: true },
      { source: "/my-account", destination: "/", permanent: false },
      { source: "/my-account-2", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;

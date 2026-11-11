import type { NextConfig } from "next";

import {
  CLOUDINARY_MEDIA_FOLDER,
  cloudinaryBase,
} from "./src/lib/cloudinary";
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
  experimental: {
    serverActions: {
      // Admin image uploads go through a server action (default limit 1 MB).
      // Photos are resized in the browser first; 4 MB stays under the hosts'
      // request caps (Vercel 4.5 MB, Netlify ~6 MB).
      bodySizeLimit: "4mb",
    },
  },
  images: {
    // All media is on Cloudinary, which resizes and converts images
    // (f_auto/q_auto) on its CDN — the host never optimizes images.
    loader: "custom",
    loaderFile: "./src/lib/cloudinary-loader.ts",
  },
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
  /**
   * Response headers for every host (moved here from netlify.toml so they
   * also apply on Vercel).
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Media moved to Cloudinary (agbons-gl folder, same sub-paths). Keeps
      // old links and any "/media/…" path in saved content working.
      {
        source: "/media/video/:path*",
        destination: `${cloudinaryBase("video")}/${CLOUDINARY_MEDIA_FOLDER}/video/:path*`,
        permanent: true,
      },
      {
        source: "/media/:path*",
        destination: `${cloudinaryBase("image")}/${CLOUDINARY_MEDIA_FOLDER}/:path*`,
        permanent: true,
      },
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
      {
        source: "/product-category/bridal-couture",
        destination: "/bridal-couture",
        permanent: true,
      },
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

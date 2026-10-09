#!/usr/bin/env node
/**
 * Migrates the WooCommerce catalog into src/content/products.json and
 * downloads product images into public/media/products/ (audit §6, TRD §8
 * content migration plan).
 *
 * Usage:
 *   node scripts/import-woocommerce.mjs [--from <url|file>] [--insecure] [--skip-images]
 *
 *   --from         WooCommerce Store API products endpoint or a saved JSON
 *                  export (default: live site, per_page=100).
 *   --insecure     Skip TLS verification (the current host's certificate
 *                  chain is untrusted).
 *   --skip-images  Only write product data.
 */
import fs from "node:fs";
import path from "node:path";

import { download, getJson, parseArgs } from "./lib/http.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const DEFAULT_SOURCE =
  "https://agbons-gl.com/wp-json/wc/store/v1/products?per_page=100";

// WooCommerce category slug → collection slug in src/content/collections.ts.
const CATEGORY_MAP = {
  "2023-collections": "2023",
  "2024-collections": "2024",
  "crystal-drop-collection": "crystal-drop",
  "haute-couture-collections": "haute-couture",
  "ice-and-crystals": "ice-crystal",
  "queen-idia-collection": "queen-idia",
  "royal-ancestors": "royal-ancestors",
  "stone-petal-sparkle": "stone-petal-sparkle",
};

// Products featured on the current /bridal-couture/ page (audit §3.3).
const FEATURED = new Set([
  "onyx-frost-tailored-dress",
  "platinum-haze-tunic-dress",
  "summer-icon-dress",
  "royal-ember-gown",
  "blush-equinox-maxi-dress",
  "terra",
]);

const decode = (s = "") =>
  s
    .replace(/<[^>]+>/g, " ")
    .replace(/&#8217;|&rsquo;/g, "’")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&amp;|&#038;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

async function loadSource(from, insecure) {
  if (/^https?:/.test(from)) return getJson(from, insecure);
  return JSON.parse(fs.readFileSync(path.resolve(from), "utf8"));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const insecure = Boolean(args.insecure);
  const source = await loadSource(args.from ?? DEFAULT_SOURCE, insecure);

  const products = [];
  const downloads = [];

  for (const wc of source) {
    const minor = 10 ** (wc.prices?.currency_minor_unit ?? 2);
    const collections = wc.categories
      .map((c) => CATEGORY_MAP[c.slug])
      .filter(Boolean);
    const name = decode(wc.name);
    // Products with no description are collection "commission" listings
    // (e.g. "Haute Couture Bridal Collection", $5,000 per piece).
    const isCommission = !decode(wc.description);

    const images = wc.images.map((img, i) => {
      const ext = path.extname(new URL(img.src).pathname) || ".jpg";
      const file = `${wc.slug}-${i + 1}${ext.toLowerCase()}`;
      downloads.push({ url: img.src, dest: path.join(ROOT, "public/media/products", file) });
      return {
        src: `/media/products/${file}`,
        alt: decode(img.alt) || `${name}${wc.images.length > 1 ? ` — view ${i + 1}` : ""}`,
      };
    });

    products.push({
      slug: wc.slug,
      sku: wc.sku,
      name,
      line: "bridal-couture",
      collections,
      priceUsd: Number(wc.prices.price) / minor,
      images,
      shortDescription:
        decode(wc.short_description) ||
        `${name} — commissioned couture, made to your measurements.`,
      description: decode(wc.description),
      details: {},
      inStock: Boolean(wc.is_in_stock),
      ...(typeof wc.low_stock_remaining === "number"
        ? { stockQuantity: wc.low_stock_remaining }
        : {}),
      madeToOrder: isCommission,
      featured: FEATURED.has(wc.slug),
      // The Store API exposes no publish date; WooCommerce IDs increase with creation.
      sortOrder: wc.id,
      sourceUrl: wc.permalink,
    });
  }

  products.sort((a, b) => b.sortOrder - a.sortOrder);
  const out = path.join(ROOT, "src/content/products.json");
  fs.writeFileSync(out, `${JSON.stringify(products, null, 2)}\n`);
  console.log(`Wrote ${products.length} products → ${path.relative(ROOT, out)}`);

  if (args["skip-images"]) return;
  let fetched = 0;
  for (const { url, dest } of downloads) {
    try {
      if (await download(url, dest, insecure)) fetched++;
    } catch (err) {
      console.warn(`  ! ${err.message}`);
    }
  }
  console.log(`Images: ${fetched} downloaded, ${downloads.length - fetched} already present or failed.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

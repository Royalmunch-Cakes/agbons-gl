#!/usr/bin/env node
/**
 * Downloads site imagery and brand films listed in scripts/site-media.json
 * into public/media/ (audit §6 content migration).
 *
 * Usage: node scripts/pull-site-media.mjs [--insecure]
 *   --insecure  Skip TLS verification (the current host's certificate chain
 *               is untrusted).
 *
 * Videos are large and gitignored; run this after cloning to fetch them.
 */
import fs from "node:fs";
import path from "node:path";

import { download, parseArgs } from "./lib/http.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const args = parseArgs(process.argv.slice(2));
const manifest = JSON.parse(
  fs.readFileSync(path.join(import.meta.dirname, "site-media.json"), "utf8"),
);

let fetched = 0;
let failed = 0;
for (const [rel, url] of Object.entries(manifest)) {
  if (rel.startsWith("_")) continue;
  try {
    if (await download(url, path.join(ROOT, "public/media", rel), Boolean(args.insecure))) {
      fetched++;
      console.log(`  ✓ ${rel}`);
    }
  } catch (err) {
    failed++;
    console.warn(`  ! ${rel}: ${err.message}`);
  }
}
console.log(`Done: ${fetched} downloaded, ${failed} failed.`);

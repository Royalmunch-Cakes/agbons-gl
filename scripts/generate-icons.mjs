#!/usr/bin/env node
/**
 * Generates the site favicon set from the brand icon (hosted on Cloudinary,
 * see scripts/cloudinary-media.json):
 *   src/app/icon.png        512×512  (<link rel="icon">)
 *   src/app/apple-icon.png  180×180  (iOS home screen, ivory background)
 *   src/app/favicon.ico     16/32/48 (legacy /favicon.ico requests)
 *   src/app/opengraph-image.jpg  1200×630 default social share image
 *
 * Usage: node scripts/generate-icons.mjs
 */
import fs from "node:fs";
import path from "node:path";

import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const MEDIA = JSON.parse(
  fs.readFileSync(path.join(ROOT, "scripts/cloudinary-media.json"), "utf8"),
);
const download = async (key) =>
  Buffer.from(await (await fetch(MEDIA[key].url)).arrayBuffer());
const SRC = await download("/media/brand/icon-full.webp");
const APP = path.join(ROOT, "src/app");
const IVORY = { r: 250, g: 247, b: 242, alpha: 1 };

/** Square icon: the artwork centred with `pad` (0–1) margin on `background`. */
async function square(size, { pad = 0.08, background = IVORY } = {}) {
  const inner = Math.round(size * (1 - pad * 2));
  const art = await sharp(SRC)
    .trim()
    .resize(inner, inner, {
      fit: "contain",
      background: { ...background, alpha: 0 },
    })
    .png()
    .toBuffer();
  return sharp({
    create: { width: size, height: size, channels: 4, background },
  })
    .composite([{ input: art, gravity: "center" }])
    .png()
    .toBuffer();
}

/** Minimal ICO container holding PNG-encoded images. */
function toIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + images.length * 16;
  const entries = images.map(({ size, data }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    return e;
  });
  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

if (!fs.existsSync(SRC)) {
  console.error(
    `Missing ${path.relative(ROOT, SRC)} — run: npm run media:pull -- --insecure`,
  );
  process.exit(1);
}

fs.writeFileSync(path.join(APP, "icon.png"), await square(512, { pad: 0.06 }));
fs.writeFileSync(
  path.join(APP, "apple-icon.png"),
  await square(180, { pad: 0.12 }),
);
const ico = await Promise.all(
  [16, 32, 48].map(async (size) => ({
    size,
    data: await square(size, { pad: 0.02 }),
  })),
);
fs.writeFileSync(path.join(APP, "favicon.ico"), toIco(ico));
await sharp(await download("/media/site/home-hero.png"))
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(path.join(APP, "opengraph-image.jpg"));
fs.writeFileSync(
  path.join(APP, "opengraph-image.alt.txt"),
  "AGBONS-GL — five couture gowns from the new collection",
);
console.log(
  "Wrote src/app/icon.png, apple-icon.png, favicon.ico, opengraph-image.jpg",
);

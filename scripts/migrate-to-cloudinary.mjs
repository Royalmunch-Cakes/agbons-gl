/**
 * One-off migration: uploads every image and video under public/media/ to Cloudinary,
 * into a dedicated folder (CLOUDINARY_FOLDER, default "agbons-gl"), keeping
 * the sub-folder layout:  public/media/products/x.jpg → agbons-gl/products/x
 *
 * Writes scripts/cloudinary-media.json (local path → Cloudinary URL). Safe to
 * re-run: existing assets are skipped (overwrite=false).
 *
 *   node scripts/migrate-to-cloudinary.mjs
 *
 * Reads CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET
 * from the environment or .env. Credentials are never printed.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const MEDIA = path.join(ROOT, "public/media");
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);
const VIDEO_EXT = new Set([".mp4", ".webm", ".mov"]);
const kindOf = (file) =>
  VIDEO_EXT.has(path.extname(file).toLowerCase()) ? "video" : "image";

function loadEnv() {
  const file = path.join(ROOT, ".env");
  const fromFile = fs.existsSync(file)
    ? Object.fromEntries(
        fs
          .readFileSync(file, "utf8")
          .split(/\r?\n/)
          .map((l) => l.match(/^([A-Z0-9_]+)=(.*)$/))
          .filter(Boolean)
          .map((m) => [m[1], m[2].trim()]),
      )
    : {};
  return { ...fromFile, ...process.env };
}

const env = loadEnv();
const cloud = env.CLOUDINARY_CLOUD_NAME;
const key = env.CLOUDINARY_API_KEY;
const secret = env.CLOUDINARY_API_SECRET;
const folder = env.CLOUDINARY_FOLDER || "agbons-gl";
if (!cloud || !key || !secret) {
  console.error("Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.");
  process.exit(1);
}
const basic = `Basic ${Buffer.from(`${key}:${secret}`).toString("base64")}`;

function sign(params) {
  const str = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return crypto.createHash("sha1").update(str + secret).digest("hex");
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return walk(p);
    const ext = path.extname(e.name).toLowerCase();
    return IMAGE_EXT.has(ext) || VIDEO_EXT.has(ext) ? [p] : [];
  });
}

async function upload(file) {
  const rel = path.relative(MEDIA, file).split(path.sep).join("/"); // products/x.jpg
  const sub = path.posix.dirname(rel);
  const name = path.posix.basename(rel, path.posix.extname(rel));
  const params = {
    asset_folder: `${folder}/${sub}`,
    overwrite: "false",
    public_id: `${folder}/${sub}/${name}`,
    timestamp: String(Math.floor(Date.now() / 1000)),
    unique_filename: "false",
  };
  const form = new FormData();
  for (const [k, v] of Object.entries(params)) form.append(k, v);
  form.append("api_key", key);
  form.append("signature", sign(params));
  form.append("file", new Blob([fs.readFileSync(file)]), path.basename(file));

  for (let attempt = 1; ; attempt++) {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/${kindOf(file)}/upload`, {
      method: "POST",
      body: form,
    });
    const json = await res.json();
    if (res.ok) {
      return {
        local: `/media/${rel}`,
        publicId: json.public_id,
        kind: kindOf(file),
        url: `https://res.cloudinary.com/${cloud}/${kindOf(file)}/upload/${json.public_id}.${path.posix.extname(rel).slice(1)}`,
        width: json.width,
        height: json.height,
        bytes: json.bytes,
        existing: Boolean(json.existing),
      };
    }
    if (attempt >= 3 || res.status < 500) {
      throw new Error(`${rel}: ${res.status} ${json.error?.message ?? ""}`);
    }
    await new Promise((r) => setTimeout(r, 1000 * attempt));
  }
}

// Create the destination folder explicitly (idempotent).
const created = await fetch(
  `https://api.cloudinary.com/v1_1/${cloud}/folders/${encodeURIComponent(folder)}`,
  { method: "POST", headers: { Authorization: basic } },
);
console.log(`folder "${folder}":`, created.ok ? "ready" : `HTTP ${created.status}`);

const files = walk(MEDIA);
console.log(`uploading ${files.length} files…`);
const results = [];
const queue = [...files];
await Promise.all(
  Array.from({ length: 4 }, async () => {
    while (queue.length) {
      const f = queue.shift();
      const r = await upload(f);
      results.push(r);
      process.stdout.write(r.existing ? "=" : ".");
    }
  }),
);
console.log();

results.sort((a, b) => a.local.localeCompare(b.local));
const manifest = Object.fromEntries(
  results.map((r) => [r.local, { kind: r.kind, url: r.url, width: r.width, height: r.height }]),
);
fs.writeFileSync(
  path.join(ROOT, "scripts/cloudinary-media.json"),
  JSON.stringify(manifest, null, 2) + "\n",
);
const mb = results.reduce((s, r) => s + (r.bytes || 0), 0) / 1e6;
console.log(
  `done: ${results.length} files (${results.filter((r) => r.existing).length} already there), ${mb.toFixed(1)} MB → scripts/cloudinary-media.json`,
);

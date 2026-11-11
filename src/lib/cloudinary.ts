/**
 * Cloudinary delivery helpers (shared by server, client and next.config).
 *
 * All site media lives in Cloudinary under CLOUDINARY_MEDIA_FOLDER, mirroring
 * the old public/media/ layout (scripts/migrate-to-cloudinary.mjs):
 *   /media/products/x.jpg → …/image/upload/agbons-gl/products/x.jpg
 */
export const CLOUDINARY_CLOUD =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "mgioqhn4";
export const CLOUDINARY_MEDIA_FOLDER = "agbons-gl";

export const cloudinaryBase = (kind: "image" | "video") =>
  `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/${kind}/upload`;

const VIDEO = /\.(mp4|webm|mov)$/i;

/**
 * Maps a pre-migration "/media/…" path (still present in content saved
 * through the admin before the move) to its Cloudinary URL.
 */
export function legacyMediaUrl(src: string): string | null {
  const m = src.match(/^\/media\/(.+)$/);
  if (!m) return null;
  const kind = VIDEO.test(m[1]) ? "video" : "image";
  return `${cloudinaryBase(kind)}/${CLOUDINARY_MEDIA_FOLDER}/${m[1]}`;
}

/** Absolute media URL for places outside next/image (JSON-LD, posters). */
export function mediaUrl(src: string): string {
  return legacyMediaUrl(src) ?? src;
}

/**
 * Adds Cloudinary delivery transforms (auto format/quality, width cap) to a
 * Cloudinary image URL. Returns null for anything else.
 */
export function cloudinaryImage(
  src: string,
  width: number,
  quality?: number,
): string | null {
  const url = legacyMediaUrl(src) ?? src;
  const m = url.match(
    /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/,
  );
  if (!m) return null;
  const params = ["f_auto", "c_limit", `w_${width}`, `q_${quality ?? "auto"}`];
  return `${m[1]}${params.join(",")}/${m[2]}`;
}

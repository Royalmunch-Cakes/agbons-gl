/**
 * Shrinks a photo in the browser before upload so it fits the server-action
 * body limit (next.config.ts, 4 MB) and the host's request cap (Netlify ~6 MB,
 * Vercel 4.5 MB) — and loads fast on the site.
 *
 * - Longest edge capped at MAX_EDGE; JPEG/WebP re-encoded at good quality.
 * - PNGs keep transparency (WebP where the browser can encode it, else PNG).
 * - GIFs are left untouched (re-encoding would drop animation).
 * - Small images already within limits are uploaded as-is.
 */

export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024; // keep in sync with the server
const MAX_EDGE = 2400;
const TARGET_BYTES = 2 * 1024 * 1024;

export class ImageTooLargeError extends Error {}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality?: number,
) {
  return new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, type, quality),
  );
}

async function encode(
  bitmap: ImageBitmap,
  width: number,
  height: number,
  type: string,
  quality: number,
  opaque: boolean,
) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  if (opaque) {
    // JPEG has no alpha: paint white instead of black behind transparent pixels.
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
  }
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0, width, height);
  return canvasToBlob(canvas, type, quality);
}

export async function prepareImage(file: File): Promise<File> {
  if (file.type === "image/gif") {
    if (file.size > MAX_UPLOAD_BYTES) {
      throw new ImageTooLargeError("GIFs must be 4 MB or smaller.");
    }
    return file;
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    // Format the browser can't decode; let the server validate it.
    return file;
  }

  const longest = Math.max(bitmap.width, bitmap.height);
  if (longest <= MAX_EDGE && file.size <= TARGET_BYTES) {
    bitmap.close();
    return file;
  }

  const keepAlpha = file.type === "image/png";
  let scale = Math.min(1, MAX_EDGE / longest);
  let quality = 0.86;
  let blob: Blob | null = null;

  for (let attempt = 0; attempt < 6; attempt++) {
    const w = Math.max(1, Math.round(bitmap.width * scale));
    const h = Math.max(1, Math.round(bitmap.height * scale));
    if (keepAlpha) {
      blob = await encode(bitmap, w, h, "image/webp", quality, false);
      // Some browsers (older Safari) can't encode WebP and return PNG instead.
      if (!blob || blob.type !== "image/webp") {
        blob = await encode(bitmap, w, h, "image/png", 1, false);
      }
    } else {
      blob = await encode(bitmap, w, h, "image/jpeg", quality, true);
    }
    if (blob && blob.size <= TARGET_BYTES) break;
    // Still too big: step quality down first, then dimensions.
    if (quality > 0.7) quality -= 0.08;
    else scale *= 0.8;
  }
  bitmap.close();

  if (!blob || blob.size > MAX_UPLOAD_BYTES) {
    throw new ImageTooLargeError(
      "This image is too large to upload even after resizing. Try a smaller photo.",
    );
  }
  const ext = blob.type === "image/jpeg" ? "jpg" : blob.type.split("/")[1];
  const name = file.name.replace(/\.[^.]+$/, "") + "." + ext;
  return new File([blob], name, { type: blob.type, lastModified: Date.now() });
}

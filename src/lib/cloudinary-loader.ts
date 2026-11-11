"use client";

import { cloudinaryImage } from "@/lib/cloudinary";

/**
 * next/image loader (next.config.ts → images.loaderFile). Cloudinary resizes
 * and picks the best format per browser (f_auto → AVIF/WebP), so images are
 * never optimized by the Next.js server — no function CPU or image-
 * optimization usage on the host.
 *
 * Sources that aren't on Cloudinary (legacy /media-store admin uploads,
 * blob:/data: previews) are returned unchanged.
 */
export default function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  return cloudinaryImage(src, width, quality) ?? src;
}

"use server";

import { revalidatePath, updateTag } from "next/cache";

import { checkUnique, documentSchemas } from "@/lib/admin/schemas";
import { formatIssue } from "@/lib/admin/format-issue";
import {
  contentTag,
  saveContent,
  type ContentKey,
  type ContentMap,
} from "@/lib/content";
import { requireAdmin } from "@/lib/server/admin-auth";
import { blobs } from "@/lib/server/blob-store";
import type { MediaAsset } from "@/lib/types";

/**
 * Tags expire the cached data; revalidating the root layout also makes
 * dynamic [slug] pages re-render on their next visit instead of serving
 * one stale render (read-your-own-writes for editors).
 */
function refreshSite() {
  revalidatePath("/", "layout");
}

export type ActionResult = { ok: true } | { ok: false; error: string };

/** Validate and store a whole content document, then refresh the site. */
export async function saveDocument<K extends ContentKey>(
  key: K,
  value: ContentMap[K],
): Promise<ActionResult> {
  await requireAdmin();
  const schema = documentSchemas[key];
  if (!schema) return { ok: false, error: "Unknown document." };

  const parsed = schema.safeParse(value);
  if (!parsed.success) return { ok: false, error: formatIssue(parsed.error) };

  if (key === "products" || key === "collections" || key === "journal") {
    const dup = checkUnique(parsed.data as { slug: string }[], key);
    if (dup) return { ok: false, error: dup };
  }

  try {
    await saveContent(key, parsed.data as ContentMap[K]);
  } catch (err) {
    console.error("[admin] save failed", err);
    return { ok: false, error: "Saving failed. Please try again." };
  }
  updateTag(contentTag(key));
  refreshSite();
  return { ok: true };
}

const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

/** Upload an image to the media store; returns an asset for the editor. */
export async function uploadImage(
  formData: FormData,
): Promise<{ ok: true; asset: MediaAsset } | { ok: false; error: string }> {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Choose an image to upload." };
  }
  const ext = IMAGE_TYPES[file.type];
  if (!ext)
    return { ok: false, error: "Use a JPG, PNG, WebP, AVIF or GIF image." };
  if (file.size > MAX_UPLOAD_BYTES) {
    return { ok: false, error: "Images must be 8 MB or smaller." };
  }

  const key = `uploads/${new Date().getFullYear()}/${crypto.randomUUID()}.${ext}`;
  try {
    await blobs("media").setBinary(key, await file.arrayBuffer(), {
      contentType: file.type,
      name: file.name.slice(0, 200),
    });
  } catch (err) {
    console.error("[admin] upload failed", err);
    return { ok: false, error: "Upload failed. Please try again." };
  }
  const alt =
    String(formData.get("alt") ?? "").trim() ||
    file.name.replace(/\.[^.]+$/, "");
  return { ok: true, asset: { src: `/media-store/${key}`, alt } };
}

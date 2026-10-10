"use server";

import { revalidatePath, updateTag } from "next/cache";

import type { ActionResult } from "@/app/admin/actions";
import { collectionSchema, productSchema } from "@/lib/admin/schemas";
import { formatIssue } from "@/lib/admin/format-issue";
import { contentTag, getContentForEdit, saveContent } from "@/lib/content";
import { requireAdmin } from "@/lib/server/admin-auth";
import type { Collection, Product } from "@/lib/types";

/**
 * Item-level catalog operations. Each reads the latest document, changes a
 * single product/collection and writes it back, so editors working on
 * different items don't overwrite each other's changes.
 */

/**
 * Tags expire the cached data; revalidating the root layout also makes
 * dynamic [slug] pages re-render on their next visit instead of serving
 * one stale render (read-your-own-writes for editors).
 */
function refreshSite() {
  revalidatePath("/", "layout");
}

export async function saveProduct(
  product: Product,
  originalSlug: string | null,
): Promise<ActionResult & { slug?: string }> {
  await requireAdmin();
  const parsed = productSchema.safeParse(product);
  if (!parsed.success) return { ok: false, error: formatIssue(parsed.error) };
  const next = parsed.data as Product;

  const products = await getContentForEdit("products");
  const clash = products.find(
    (p) => p.slug === next.slug && p.slug !== originalSlug,
  );
  if (clash)
    return {
      ok: false,
      error: `Another product already uses the slug “${next.slug}”.`,
    };

  let updated: Product[];
  if (originalSlug === null) {
    const maxOrder = products.reduce((m, p) => Math.max(m, p.sortOrder), 0);
    updated = [{ ...next, sortOrder: maxOrder + 1 }, ...products];
  } else {
    if (!products.some((p) => p.slug === originalSlug)) {
      return {
        ok: false,
        error: "This product no longer exists. Reload the list.",
      };
    }
    updated = products.map((p) => (p.slug === originalSlug ? next : p));
  }

  await saveContent("products", updated);
  updateTag(contentTag("products"));
  refreshSite();
  return { ok: true, slug: next.slug };
}

export async function deleteProduct(slug: string): Promise<ActionResult> {
  await requireAdmin();
  const products = await getContentForEdit("products");
  if (!products.some((p) => p.slug === slug))
    return { ok: false, error: "Product not found." };
  await saveContent(
    "products",
    products.filter((p) => p.slug !== slug),
  );
  updateTag(contentTag("products"));
  refreshSite();
  return { ok: true };
}

export async function saveCollection(
  collection: Collection,
  originalSlug: string | null,
): Promise<ActionResult & { slug?: string }> {
  await requireAdmin();
  const parsed = collectionSchema.safeParse(collection);
  if (!parsed.success) return { ok: false, error: formatIssue(parsed.error) };
  const next = parsed.data as Collection;

  const collections = await getContentForEdit("collections");
  if (
    collections.some((c) => c.slug === next.slug && c.slug !== originalSlug)
  ) {
    return {
      ok: false,
      error: `Another collection already uses the slug “${next.slug}”.`,
    };
  }

  const updated =
    originalSlug === null
      ? [...collections, next]
      : collections.map((c) => (c.slug === originalSlug ? next : c));
  await saveContent("collections", updated);

  // Keep product assignments pointing at a renamed collection.
  if (originalSlug && originalSlug !== next.slug) {
    const products = await getContentForEdit("products");
    await saveContent(
      "products",
      products.map((p) => ({
        ...p,
        collections: p.collections.map((c) =>
          c === originalSlug ? next.slug : c,
        ),
      })),
    );
    updateTag(contentTag("products"));
  }
  updateTag(contentTag("collections"));
  refreshSite();
  return { ok: true, slug: next.slug };
}

export async function deleteCollection(slug: string): Promise<ActionResult> {
  await requireAdmin();
  const collections = await getContentForEdit("collections");
  if (!collections.some((c) => c.slug === slug))
    return { ok: false, error: "Collection not found." };
  await saveContent(
    "collections",
    collections.filter((c) => c.slug !== slug),
  );
  // Remove the collection from any products that referenced it.
  const products = await getContentForEdit("products");
  await saveContent(
    "products",
    products.map((p) => ({
      ...p,
      collections: p.collections.filter((c) => c !== slug),
    })),
  );
  updateTag(contentTag("collections"));
  updateTag(contentTag("products"));
  refreshSite();
  return { ok: true };
}

import type { Metadata } from "next";

import { ProductEditor } from "@/app/admin/(dashboard)/products/product-editor";
import { emptyProduct } from "@/lib/admin/defaults";
import { getContentForEdit } from "@/lib/content";
import { requireAdmin } from "@/lib/server/admin-auth";

/** Session-checked per request; see the dashboard layout. */
export const instant = false;

export const metadata: Metadata = { title: "New product" };

export default async function NewProductPage() {
  await requireAdmin();
  const collections = await getContentForEdit("collections");
  return (
    <ProductEditor
      initial={emptyProduct()}
      isNew
      collections={collections.map(({ slug, name }) => ({ slug, name }))}
    />
  );
}

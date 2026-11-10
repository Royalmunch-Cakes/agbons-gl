import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductEditor } from "@/app/admin/(dashboard)/products/product-editor";
import { getContentForEdit } from "@/lib/content";
import { requireAdmin } from "@/lib/server/admin-auth";

/** Session-checked per request; see the dashboard layout. */
export const instant = false;

export const metadata: Metadata = { title: "Edit product" };

export default async function EditProductPage(
  props: PageProps<"/admin/products/[slug]">,
) {
  await requireAdmin();
  const { slug } = await props.params;
  const [products, collections] = await Promise.all([
    getContentForEdit("products"),
    getContentForEdit("collections"),
  ]);
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  return (
    <ProductEditor
      key={product.slug}
      initial={product}
      isNew={false}
      collections={collections.map(({ slug, name }) => ({ slug, name }))}
    />
  );
}

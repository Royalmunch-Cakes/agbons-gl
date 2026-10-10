import type { Metadata } from "next";

import { ProductList } from "@/app/admin/(dashboard)/products/product-list";
import { getContentForEdit } from "@/lib/content";
import { requireAdmin } from "@/lib/server/admin-auth";

export const metadata: Metadata = { title: "Products" };

export default async function ProductsPage() {
  await requireAdmin();
  const [products, collections] = await Promise.all([
    getContentForEdit("products"),
    getContentForEdit("collections"),
  ]);
  return (
    <ProductList
      products={products}
      collections={Object.fromEntries(collections.map((c) => [c.slug, c.name]))}
    />
  );
}

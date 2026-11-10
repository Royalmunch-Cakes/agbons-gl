import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CollectionEditor } from "@/app/admin/(dashboard)/collections/collection-editor";
import { getContentForEdit } from "@/lib/content";
import { requireAdmin } from "@/lib/server/admin-auth";

/** Session-checked per request; see the dashboard layout. */
export const instant = false;

export const metadata: Metadata = { title: "Edit collection" };

export default async function EditCollectionPage(
  props: PageProps<"/admin/collections/[slug]">,
) {
  await requireAdmin();
  const { slug } = await props.params;
  const [collections, products] = await Promise.all([
    getContentForEdit("collections"),
    getContentForEdit("products"),
  ]);
  const collection = collections.find((c) => c.slug === slug);
  if (!collection) notFound();

  return (
    <CollectionEditor
      key={collection.slug}
      initial={collection}
      isNew={false}
      productCount={products.filter((p) => p.collections.includes(slug)).length}
    />
  );
}

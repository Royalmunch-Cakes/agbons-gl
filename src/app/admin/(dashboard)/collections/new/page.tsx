import type { Metadata } from "next";

import { CollectionEditor } from "@/app/admin/(dashboard)/collections/collection-editor";
import { emptyCollection } from "@/lib/admin/defaults";
import { requireAdmin } from "@/lib/server/admin-auth";

export const metadata: Metadata = { title: "New collection" };

export default async function NewCollectionPage() {
  await requireAdmin();
  return (
    <CollectionEditor initial={emptyCollection()} isNew productCount={0} />
  );
}

import type { Metadata } from "next";

import { PostEditor } from "@/app/admin/(dashboard)/journal/post-editor";
import { emptyPost } from "@/lib/admin/defaults";
import { getContentForEdit } from "@/lib/content";
import { requireAdmin } from "@/lib/server/admin-auth";

/** Session-checked per request; see the dashboard layout. */
export const instant = false;

export const metadata: Metadata = { title: "New post" };

export default async function NewPostPage() {
  await requireAdmin();
  const collections = await getContentForEdit("collections");
  return (
    <PostEditor
      initial={emptyPost()}
      isNew
      collections={collections.map(({ slug, name }) => ({ slug, name }))}
    />
  );
}

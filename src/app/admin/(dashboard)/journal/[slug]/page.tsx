import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PostEditor } from "@/app/admin/(dashboard)/journal/post-editor";
import { getContentForEdit } from "@/lib/content";
import { requireAdmin } from "@/lib/server/admin-auth";

export const metadata: Metadata = { title: "Edit post" };

export default async function EditPostPage(
  props: PageProps<"/admin/journal/[slug]">,
) {
  await requireAdmin();
  const { slug } = await props.params;
  const [posts, collections] = await Promise.all([
    getContentForEdit("journal"),
    getContentForEdit("collections"),
  ]);
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <PostEditor
      key={post.slug}
      initial={post}
      isNew={false}
      collections={collections.map(({ slug, name }) => ({ slug, name }))}
    />
  );
}

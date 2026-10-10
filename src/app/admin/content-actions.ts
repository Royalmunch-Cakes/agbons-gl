"use server";

import { revalidatePath, updateTag } from "next/cache";

import type { ActionResult } from "@/app/admin/actions";
import { documentSchemas } from "@/lib/admin/schemas";
import { formatIssue } from "@/lib/admin/format-issue";
import { contentTag, getContentForEdit, saveContent } from "@/lib/content";
import type { JournalPost } from "@/content/journal";
import { requireAdmin } from "@/lib/server/admin-auth";

const postSchema = documentSchemas.journal.element;

function refreshJournal() {
  updateTag(contentTag("journal"));
  revalidatePath("/", "layout");
}

/** Save one journal post (item-level, like products). */
export async function saveJournalPost(
  post: JournalPost,
  originalSlug: string | null,
): Promise<ActionResult & { slug?: string }> {
  await requireAdmin();
  const parsed = postSchema.safeParse(post);
  if (!parsed.success) {
    return { ok: false, error: formatIssue(parsed.error) };
  }
  const next = parsed.data as JournalPost;
  const posts = await getContentForEdit("journal");
  if (posts.some((p) => p.slug === next.slug && p.slug !== originalSlug)) {
    return {
      ok: false,
      error: `Another post already uses the slug “${next.slug}”.`,
    };
  }
  const updated =
    originalSlug === null
      ? [next, ...posts]
      : posts.map((p) => (p.slug === originalSlug ? next : p));
  await saveContent("journal", updated);
  refreshJournal();
  return { ok: true, slug: next.slug };
}

export async function deleteJournalPost(slug: string): Promise<ActionResult> {
  await requireAdmin();
  const posts = await getContentForEdit("journal");
  if (!posts.some((p) => p.slug === slug))
    return { ok: false, error: "Post not found." };
  await saveContent(
    "journal",
    posts.filter((p) => p.slug !== slug),
  );
  refreshJournal();
  return { ok: true };
}

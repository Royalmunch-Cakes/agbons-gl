import type { Metadata } from "next";

import { GalleryEditor } from "@/app/admin/(dashboard)/gallery/editor";
import { getContentForEdit } from "@/lib/content";
import { requireAdmin } from "@/lib/server/admin-auth";

export const metadata: Metadata = { title: "Gallery" };

export default async function Page() {
  await requireAdmin();
  return <GalleryEditor initial={await getContentForEdit("gallery")} />;
}

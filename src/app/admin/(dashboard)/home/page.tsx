import type { Metadata } from "next";

import { HomeEditor } from "@/app/admin/(dashboard)/home/editor";
import { getContentForEdit } from "@/lib/content";
import { requireAdmin } from "@/lib/server/admin-auth";

export const metadata: Metadata = { title: "Homepage" };

export default async function Page() {
  await requireAdmin();
  return <HomeEditor initial={await getContentForEdit("home")} />;
}

import type { Metadata } from "next";

import { HomeEditor } from "@/app/admin/(dashboard)/home/editor";
import { getContentForEdit } from "@/lib/content";
import { requireAdmin } from "@/lib/server/admin-auth";

/** Session-checked per request; see the dashboard layout. */
export const instant = false;

export const metadata: Metadata = { title: "Homepage" };

export default async function Page() {
  await requireAdmin();
  return <HomeEditor initial={await getContentForEdit("home")} />;
}

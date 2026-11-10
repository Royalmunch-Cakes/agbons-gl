import type { Metadata } from "next";

import { FaqsEditor } from "@/app/admin/(dashboard)/faqs/editor";
import { getContentForEdit } from "@/lib/content";
import { requireAdmin } from "@/lib/server/admin-auth";

/** Session-checked per request; see the dashboard layout. */
export const instant = false;

export const metadata: Metadata = { title: "FAQs" };

export default async function Page() {
  await requireAdmin();
  return <FaqsEditor initial={await getContentForEdit("faqs")} />;
}

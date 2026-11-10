import type { Metadata } from "next";

import { PoliciesEditor } from "@/app/admin/(dashboard)/policies/editor";
import { getContentForEdit } from "@/lib/content";
import { requireAdmin } from "@/lib/server/admin-auth";

/** Session-checked per request; see the dashboard layout. */
export const instant = false;

export const metadata: Metadata = { title: "Policies" };

export default async function Page() {
  await requireAdmin();
  return <PoliciesEditor initial={await getContentForEdit("policies")} />;
}

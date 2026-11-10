import type { Metadata } from "next";

import { SettingsEditor } from "@/app/admin/(dashboard)/settings/settings-editor";
import { getContentForEdit } from "@/lib/content";
import { requireAdmin } from "@/lib/server/admin-auth";

/** Session-checked per request; see the dashboard layout. */
export const instant = false;

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  await requireAdmin();
  return <SettingsEditor initial={await getContentForEdit("settings")} />;
}

import type { Metadata } from "next";

import { SettingsEditor } from "@/app/admin/(dashboard)/settings/settings-editor";
import { getContentForEdit } from "@/lib/content";
import { requireAdmin } from "@/lib/server/admin-auth";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  await requireAdmin();
  return <SettingsEditor initial={await getContentForEdit("settings")} />;
}

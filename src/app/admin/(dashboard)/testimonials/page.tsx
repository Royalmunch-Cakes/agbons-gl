import type { Metadata } from "next";

import { TestimonialsEditor } from "@/app/admin/(dashboard)/testimonials/editor";
import { getContentForEdit } from "@/lib/content";
import { requireAdmin } from "@/lib/server/admin-auth";

export const metadata: Metadata = { title: "Testimonials" };

export default async function Page() {
  await requireAdmin();
  return (
    <TestimonialsEditor initial={await getContentForEdit("testimonials")} />
  );
}

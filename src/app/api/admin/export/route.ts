import { cookies } from "next/headers";

import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin-session";
import { getContentForEdit, type ContentKey } from "@/lib/content";

const KEYS: ContentKey[] = [
  "settings",
  "home",
  "products",
  "collections",
  "gallery",
  "testimonials",
  "faqs",
  "journal",
  "policies",
];

/**
 * Downloads every content document as one JSON file — a backup of
 * admin-edited content, which lives in Netlify Blobs rather than git.
 * (Uploaded images stay in the media store and are referenced by URL.)
 */
export async function GET() {
  const store = await cookies();
  if (!(await verifySessionToken(store.get(ADMIN_COOKIE)?.value))) {
    return new Response("Unauthorized", { status: 401 });
  }
  const entries = await Promise.all(
    KEYS.map(async (k) => [k, await getContentForEdit(k)] as const),
  );
  const date = new Date().toISOString().slice(0, 10);
  return new Response(
    JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        content: Object.fromEntries(entries),
      },
      null,
      2,
    ),
    {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="agbons-gl-content-${date}.json"`,
        "Cache-Control": "no-store",
      },
    },
  );
}

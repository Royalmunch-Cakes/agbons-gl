import { blobs } from "@/lib/server/blob-store";

const IMMUTABLE = "public, max-age=31536000, immutable";

/**
 * Serves images uploaded through the admin dashboard from the media blob
 * store. Keys are random UUIDs and never overwritten, so responses are
 * immutable. The CDN headers let Vercel's and Netlify's edge caches keep
 * them: each image invokes this function roughly once per region, and every
 * later request is served from the CDN without using function CPU.
 *
 * Invalid keys and misses are cached briefly too, so repeated junk requests
 * can't each trigger a storage read.
 */
export async function GET(
  _request: Request,
  ctx: RouteContext<"/media-store/[...key]">,
) {
  const { key } = await ctx.params;
  const path = key.join("/");
  if (!/^uploads\/\d{4}\/[0-9a-f-]{36}\.(jpg|png|webp|avif|gif)$/.test(path)) {
    return notFound();
  }
  const blob = await blobs("media").getBinary(path);
  if (!blob) return notFound();

  return new Response(blob.data, {
    headers: {
      "Content-Type": blob.meta.contentType ?? "application/octet-stream",
      "Cache-Control": IMMUTABLE,
      "CDN-Cache-Control": IMMUTABLE,
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function notFound() {
  const brief = "public, max-age=300";
  return new Response("Not found", {
    status: 404,
    headers: { "Cache-Control": brief, "CDN-Cache-Control": brief },
  });
}

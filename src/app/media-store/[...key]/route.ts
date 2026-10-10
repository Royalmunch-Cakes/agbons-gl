import { blobs } from "@/lib/server/blob-store";

/**
 * Serves images uploaded through the admin dashboard from the media blob
 * store. Keys are random UUIDs, so responses are cached as immutable.
 */
export async function GET(
  _request: Request,
  ctx: RouteContext<"/media-store/[...key]">,
) {
  const { key } = await ctx.params;
  const path = key.join("/");
  if (!/^uploads\/\d{4}\/[0-9a-f-]{36}\.(jpg|png|webp|avif|gif)$/.test(path)) {
    return new Response("Not found", { status: 404 });
  }
  const blob = await blobs("media").getBinary(path);
  if (!blob) return new Response("Not found", { status: 404 });

  return new Response(blob.data, {
    headers: {
      "Content-Type": blob.meta.contentType ?? "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

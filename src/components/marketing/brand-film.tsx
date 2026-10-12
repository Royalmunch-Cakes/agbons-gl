/**
 * Self-hosted brand film (audit §3.1 item 9, §3.2 item 4). The poster shows
 * until the video loads. No filesystem checks: serverless functions don't
 * contain public/ files, so a check would fail whenever a page re-renders
 * on the server (e.g. after an admin save) and hide the video.
 */
export function BrandFilm({
  src,
  poster,
  title,
}: {
  src: string;
  poster: string;
  title: string;
}) {
  return (
    <video
      className="aspect-video w-full bg-primary object-cover"
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      controls
      preload="metadata"
      aria-label={title}
    />
  );
}

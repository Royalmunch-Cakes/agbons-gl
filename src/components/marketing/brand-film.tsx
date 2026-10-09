import fs from "node:fs";
import path from "node:path";

import { Media } from "@/components/site/media";

/**
 * Self-hosted brand film (audit §3.1 item 9, §3.2 item 4). If the file is
 * missing, the poster image renders instead.
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
  const available = fs.existsSync(path.join(process.cwd(), "public", src));

  if (!available) {
    return <Media asset={{ src: poster, alt: title }} aspect="aspect-video" />;
  }

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

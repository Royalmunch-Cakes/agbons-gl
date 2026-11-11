/**
 * Brand film (audit §3.1 item 9, §3.2 item 4), streamed from Cloudinary.
 * The poster (resized by Cloudinary) shows until the video loads.
 *
 * Pass the video's width/height to show it at its own ratio (nothing
 * cropped), capped to the viewport height so a portrait film fits on screen.
 * Without them it fills a 16:9 frame.
 */
import { cloudinaryImage, mediaUrl } from "@/lib/cloudinary";

export function BrandFilm({
  src,
  poster,
  title,
  width,
  height,
}: {
  src: string;
  poster: string;
  title: string;
  width?: number;
  height?: number;
}) {
  const ratio = width && height ? { width, height } : null;
  return (
    <video
      className={
        ratio
          ? "mx-auto block w-full bg-primary object-contain"
          : "aspect-video w-full bg-primary object-cover"
      }
      style={
        ratio
          ? {
              aspectRatio: `${ratio.width} / ${ratio.height}`,
              maxWidth: `min(100%, calc(85svh * ${ratio.width} / ${ratio.height}))`,
            }
          : undefined
      }
      width={ratio?.width}
      height={ratio?.height}
      src={mediaUrl(src)}
      poster={cloudinaryImage(poster, 1920) ?? poster}
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

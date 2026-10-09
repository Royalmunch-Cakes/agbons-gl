"use client";

import { ExpandIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Media } from "@/components/site/media";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { MediaAsset } from "@/lib/types";
import { cn } from "@/lib/utils";

/** PDP gallery: main image, thumbnails, full-size lightbox (audit §3.5 item 3). */
export function ProductGallery({ images, name }: { images: MediaAsset[]; name: string }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const current = images[active] ?? { alt: name };

  return (
    <div className="flex flex-col gap-3 md:flex-row-reverse md:items-start">
      <div className="relative flex-1">
        <button
          type="button"
          onClick={() => current.src && setZoom(true)}
          className="block w-full cursor-zoom-in"
          aria-label={`View ${current.alt} full size`}
        >
          <Media asset={current} priority sizes="(min-width: 768px) 50vw, 100vw" />
        </button>
        <Button
          variant="secondary"
          size="icon-lg"
          className="pointer-events-none absolute right-3 bottom-3"
          tabIndex={-1}
          aria-hidden
        >
          <ExpandIcon />
        </Button>
      </div>

      {images.length > 1 && (
        <ul className="flex gap-2 md:w-20 md:flex-col" aria-label="Product images">
          {images.map((img, i) => (
            <li key={img.src ?? i} className="w-20">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show image ${i + 1}`}
                aria-current={i === active}
                className={cn(
                  "block w-full border-2 border-transparent transition-opacity",
                  i === active ? "border-primary" : "opacity-60 hover:opacity-100",
                )}
              >
                <Media asset={img} sizes="80px" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={zoom} onOpenChange={setZoom}>
        <DialogContent className="bg-primary p-2 ring-0 sm:max-w-4xl">
          <DialogTitle className="sr-only">{current.alt}</DialogTitle>
          {current.src && (
            <div className="relative h-[85dvh]">
              <Image
                src={current.src}
                alt={current.alt}
                fill
                sizes="95vw"
                className="object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

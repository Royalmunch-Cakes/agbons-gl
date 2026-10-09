"use client";

import Image from "next/image";
import { useState } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { MediaAsset } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Masonry gallery with click-to-enlarge lightbox (audit §3.1 item 7).
 * Used as a teaser on the homepage and in full on /lookbook.
 */
export function CoutureGallery({
  images,
  className = "columns-2 md:columns-3 lg:columns-4",
}: {
  images: MediaAsset[];
  className?: string;
}) {
  const [index, setIndex] = useState<number | null>(null);
  const items = images.filter((img): img is Required<MediaAsset> => !!img.src);

  return (
    <>
      <ul className={cn("gap-3 md:gap-4", className)}>
        {items.map((img, i) => (
          <li key={img.src} className="mb-3 break-inside-avoid md:mb-4">
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="group block w-full overflow-hidden focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              aria-label={`Enlarge: ${img.alt}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={800}
                height={1000}
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </button>
          </li>
        ))}
      </ul>

      <Dialog
        open={index !== null}
        onOpenChange={(open) => !open && setIndex(null)}
      >
        <DialogContent className="bg-primary p-2 text-primary-foreground ring-0 sm:max-w-4xl md:p-4">
          <DialogTitle className="sr-only">Couture gallery</DialogTitle>
          {index !== null && (
            <Carousel opts={{ startIndex: index, loop: true }}>
              <CarouselContent>
                {items.map((img) => (
                  <CarouselItem key={img.src}>
                    <div className="relative h-[75dvh]">
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        sizes="90vw"
                        className="object-contain"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="mt-3 flex justify-center gap-2">
                <CarouselPrevious
                  variant="secondary"
                  className="static translate-0"
                />
                <CarouselNext
                  variant="secondary"
                  className="static translate-0"
                />
              </div>
            </Carousel>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

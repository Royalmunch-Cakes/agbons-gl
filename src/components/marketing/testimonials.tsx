"use client";

import { QuoteIcon } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Testimonial } from "@/lib/types";

/** Testimonials carousel (audit §3.1 item 8) — real client reviews only. */
export function Testimonials({ items }: { items: Testimonial[] }) {
  if (!items.length) return null;
  return (
    <Carousel opts={{ align: "start", loop: true }} className="w-full">
      <CarouselContent>
        {items.map((t) => (
          <CarouselItem key={t.name} className="md:basis-1/2 lg:basis-1/3">
            <figure className="flex h-full flex-col gap-5 border bg-card p-6 md:p-8">
              <QuoteIcon className="size-6 text-brand" aria-hidden />
              <blockquote className="flex-1 font-heading text-xl leading-snug italic">
                “{t.quote}”
              </blockquote>
              <figcaption className="text-sm">
                <span className="font-medium">{t.name}</span>
                <span className="block text-muted-foreground">
                  {t.location}
                </span>
              </figcaption>
            </figure>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="mt-6 flex justify-center gap-2">
        <CarouselPrevious className="static translate-0" />
        <CarouselNext className="static translate-0" />
      </div>
    </Carousel>
  );
}

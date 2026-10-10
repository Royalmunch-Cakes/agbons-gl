import { ArrowRightIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { ProductGrid } from "@/components/catalog/product-card";
import { NewsletterSection } from "@/components/forms/newsletter-form";
import { CtaBand } from "@/components/marketing/cta-band";
import { ValueProps } from "@/components/marketing/value-props";
import { Media } from "@/components/site/media";
import { Container, Section, SectionHeading } from "@/components/site/section";
import { Button } from "@/components/ui/button";
import { pageMedia } from "@/content/site";
import { getCollections, getFeaturedProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Bridal Couture",
  description:
    "Where every stitch whispers elegance. Explore AGBONS-GL bespoke bridal couture collections and request your custom bridal look.",
  alternates: { canonical: "/bridal-couture" },
};

/** Bridal Couture landing (audit §3.3). */
export default async function BridalCouturePage() {
  const [collections, featured] = await Promise.all([
    getCollections(),
    getFeaturedProducts(6),
  ]);
  const signature = collections.filter((c) => c.kind === "signature");

  return (
    <>
      {/* 2. Hero */}
      <section className="grid md:grid-cols-2">
        <Media
          asset={pageMedia.bridalHero}
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          aspect="aspect-[4/5] md:aspect-auto md:min-h-[80svh]"
        />
        <Container className="flex flex-col justify-center gap-5 py-14 md:px-12 lg:px-20">
          <p className="eyebrow">Bridal Couture</p>
          <h1 className="text-5xl leading-[1.05] text-balance md:text-6xl">
            Where Every Stitch Whispers Elegance
          </h1>
          <p className="max-w-md leading-relaxed text-muted-foreground">
            Experience bespoke couture crafted for your moment — hand-finished
            in our Benin City atelier and made to your measurements.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="xl" nativeButton={false} render={<Link href="/consultation" />}>
              Request your bridal look
            </Button>
            <Button
              variant="outline"
              size="xl"
              nativeButton={false}
              render={<a href="#collections" />}
            >
              Explore collections
            </Button>
          </div>
        </Container>
      </section>

      {/* 3. Section header + 4. Collection quick-links */}
      <Section id="collections" className="scroll-mt-24">
        <Container className="flex flex-col gap-12">
          <SectionHeading
            eyebrow="Bespoke bridal"
            title="For the woman who deserves a masterpiece."
            description="Select a collection and request your custom bridal outfit."
          />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {signature.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/collections/${c.slug}`}
                  className="group relative block overflow-hidden"
                >
                  <Media
                    asset={c.hero}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    aspect="aspect-[4/5]"
                    className="transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end gap-1 bg-linear-to-t from-black/75 via-black/15 to-transparent p-5 text-white">
                    <h3 className="text-2xl">{c.name}</h3>
                    <span className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase">
                      {c.year ? `${c.year} · ` : ""}Discover
                      <ArrowRightIcon className="size-3.5" aria-hidden />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* 5. Featured product grid */}
      <Section className="bg-secondary">
        <Container className="flex flex-col gap-12">
          <SectionHeading eyebrow="Ready to order" title="Featured Bridal Pieces" />
          <ProductGrid products={featured} />
          <Button
            variant="outline"
            size="xl"
            className="self-center"
            nativeButton={false}
            render={<Link href="/shop" />}
          >
            Shop all pieces
          </Button>
        </Container>
      </Section>

      {/* 6. CTA band */}
      <CtaBand title="Don't know where to begin?" />

      {/* 7. Value props */}
      <ValueProps />

      {/* 8. Newsletter */}
      <NewsletterSection />
    </>
  );
}

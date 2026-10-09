import { ShirtIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductGrid } from "@/components/catalog/product-card";
import { Price } from "@/components/commerce/price";
import { WhatsAppButton } from "@/components/commerce/whatsapp-button";
import { NewsletterSection } from "@/components/forms/newsletter-form";
import { Media } from "@/components/site/media";
import { Container, Section, SectionHeading } from "@/components/site/section";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { getCollection, getCollections, getProductsInCollection } from "@/lib/catalog";
import { siteConfig } from "@/config/site";

export async function generateStaticParams() {
  return (await getCollections()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(
  props: PageProps<"/collections/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const c = await getCollection(slug);
  if (!c) return {};
  return {
    title: c.name,
    description: `${c.tagline}. ${c.description}`,
    alternates: { canonical: `/collections/${c.slug}` },
    openGraph: { images: c.hero.src ? [c.hero.src] : undefined },
  };
}

/**
 * Collection page — one dynamic, data-driven template instead of six
 * one-off Elementor pages (audit §7 suggested IA, TRD §8).
 */
export default async function CollectionPage(props: PageProps<"/collections/[slug]">) {
  const { slug } = await props.params;
  const collection = await getCollection(slug);
  if (!collection) notFound();
  const products = await getProductsInCollection(slug);

  const consultHref = `/consultation?collection=${encodeURIComponent(collection.name)}`;

  return (
    <>
      <section className="grid md:grid-cols-2">
        <Media
          asset={collection.hero}
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          aspect="aspect-[4/5] md:aspect-auto md:min-h-[75svh]"
        />
        <Container className="flex flex-col justify-center gap-5 py-12 md:px-12 lg:px-20">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/collections" />}>
                  Collections
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{collection.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <p className="eyebrow">
            {collection.year ? `${collection.year} · ` : ""}
            {collection.kind === "signature" ? "Signature collection" : "Season"}
          </p>
          <h1 className="text-5xl leading-[1.05] text-balance md:text-6xl">
            {collection.name}
          </h1>
          <p className="font-heading text-2xl text-muted-foreground italic">
            {collection.tagline}
          </p>
          <p className="max-w-lg leading-relaxed text-muted-foreground">
            {collection.description}
          </p>
          {collection.fromPriceUsd && (
            <p className="text-sm">
              Commission from{" "}
              <Price usd={collection.fromPriceUsd} className="font-medium" /> per
              piece, made to your measurements.
            </p>
          )}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="xl" nativeButton={false} render={<Link href={consultHref} />}>
              Commission a piece
            </Button>
            <WhatsAppButton
              variant="outline"
              intent="enquiry"
              message={`Hello ${siteConfig.name}, I'm interested in the ${collection.name}. Could we arrange a consultation?`}
            >
              Enquire on WhatsApp
            </WhatsAppButton>
          </div>
        </Container>
      </section>

      {collection.story && (
        <Section>
          <Container className="grid gap-x-16 gap-y-12 md:grid-cols-2">
            {collection.story.map((s) => (
              <div key={s.heading} className="flex flex-col gap-3">
                <h2 className="text-3xl md:text-4xl">{s.heading}</h2>
                {s.paragraphs.map((p) => (
                  <p key={p.slice(0, 32)} className="leading-relaxed text-muted-foreground">
                    {p}
                  </p>
                ))}
              </div>
            ))}
          </Container>
        </Section>
      )}

      <Section className="bg-secondary">
        <Container className="flex flex-col gap-12">
          <SectionHeading
            eyebrow={collection.name}
            title="Pieces in this collection"
          />
          {products.length ? (
            <ProductGrid products={products} />
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ShirtIcon />
                </EmptyMedia>
                <EmptyTitle>Pieces are made to commission</EmptyTitle>
                <EmptyDescription>
                  Every gown in this collection is created for you. Book a
                  consultation to begin.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button nativeButton={false} render={<Link href={consultHref} />}>
                  Book a consultation
                </Button>
              </EmptyContent>
            </Empty>
          )}
        </Container>
      </Section>

      <NewsletterSection />
    </>
  );
}

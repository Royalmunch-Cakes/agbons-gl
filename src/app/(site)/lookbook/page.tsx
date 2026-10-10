import type { Metadata } from "next";
import Link from "next/link";

import { CtaBand } from "@/components/marketing/cta-band";
import { CoutureGallery } from "@/components/marketing/couture-gallery";
import { Container, PageHero, Section } from "@/components/site/section";
import { contactGallery } from "@/content/site";
import { getCollections } from "@/lib/catalog";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Lookbook",
  description:
    "The AGBONS-GL lookbook — editorial shoots, runway moments and real brides in bespoke couture.",
  alternates: { canonical: "/lookbook" },
};

/** Lookbook / Gallery, distinct from the homepage teaser (audit §2.5, §7). */
export default async function LookbookPage() {
  const [allCollections, gallery] = await Promise.all([
    getCollections(),
    getContent("gallery"),
  ]);
  const collections = allCollections.filter((c) => c.kind === "signature");
  const editorial = [
    ...collections.map((c) => ({ ...c.hero, alt: `${c.name}: ${c.hero.alt}` })),
    ...gallery,
    ...contactGallery,
  ];

  return (
    <>
      <PageHero
        eyebrow="Lookbook"
        title="Designed for Women Who Define Luxury"
        description="Editorial shoots, runway moments and the women who wear AGBONS-GL."
      >
        <nav
          aria-label="Collections"
          className="flex flex-wrap justify-center gap-2"
        >
          {collections.map((c) => (
            <Link
              key={c.slug}
              href={`/collections/${c.slug}`}
              className="border bg-background px-3 py-1.5 text-xs tracking-wide hover:border-foreground"
            >
              {c.name}
            </Link>
          ))}
        </nav>
      </PageHero>
      <Section>
        <Container>
          <CoutureGallery images={editorial} />
        </Container>
      </Section>
      <CtaBand title="Imagine yourself in AGBONS-GL" />
    </>
  );
}

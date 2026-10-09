import { ArrowRightIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { CtaBand } from "@/components/marketing/cta-band";
import { Media } from "@/components/site/media";
import { Container, PageHero, Section, SectionHeading } from "@/components/site/section";
import { getCollections, getProductsInCollection } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Explore every AGBONS-GL couture collection — Haute Couture, Queen Idia, Crystal Drop, Ice & Crystals, Royal Ancestors and Stone, Petal & Sparkle.",
  alternates: { canonical: "/collections" },
};

/**
 * Collections landing page — the old "Shop Collections" nav parent linked
 * to `#` with no page of its own (fixes audit §5.2).
 */
export default async function CollectionsPage() {
  const collections = await getCollections();
  const counts = Object.fromEntries(
    await Promise.all(
      collections.map(async (c) => [c.slug, (await getProductsInCollection(c.slug)).length] as const),
    ),
  );
  const signature = collections.filter((c) => c.kind === "signature");
  const seasons = collections.filter((c) => c.kind === "season");

  return (
    <>
      <PageHero
        eyebrow="The collections"
        title="Couture Stories, Told in Fabric and Light"
        description="Each AGBONS-GL collection begins with a story — myth, heritage, water, earth — and ends in hand-finished couture."
      />

      <Section>
        <Container className="flex flex-col gap-16 md:gap-24">
          {signature.map((c, i) => (
            <article
              key={c.slug}
              className="grid items-center gap-8 md:grid-cols-2 md:gap-14"
            >
              <Link
                href={`/collections/${c.slug}`}
                className={`group block overflow-hidden ${i % 2 ? "md:order-last" : ""}`}
                aria-label={c.name}
              >
                <Media
                  asset={c.hero}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  priority={i === 0}
                  className="transition-transform duration-700 group-hover:scale-[1.02]"
                />
              </Link>
              <div className="flex flex-col gap-4">
                <p className="eyebrow">
                  {c.year ? `${c.year} · ` : ""}Signature collection
                </p>
                <h2 className="text-4xl leading-tight md:text-5xl">{c.name}</h2>
                <p className="font-heading text-xl text-muted-foreground italic">
                  {c.tagline}
                </p>
                <p className="leading-relaxed text-muted-foreground">{c.description}</p>
                <Link
                  href={`/collections/${c.slug}`}
                  className="mt-2 flex items-center gap-2 self-start text-xs font-medium tracking-[0.2em] uppercase underline-offset-4 hover:underline"
                >
                  Discover the collection
                  <ArrowRightIcon className="size-3.5" aria-hidden />
                </Link>
              </div>
            </article>
          ))}
        </Container>
      </Section>

      <Section className="bg-secondary">
        <Container className="flex flex-col gap-12">
          <SectionHeading eyebrow="By season" title="Seasonal Collections" />
          <div className="grid gap-6 sm:grid-cols-2">
            {seasons.map((c) => (
              <Link
                key={c.slug}
                href={`/collections/${c.slug}`}
                className="group relative block overflow-hidden"
              >
                <Media
                  asset={c.hero}
                  sizes="(min-width: 640px) 50vw, 100vw"
                  aspect="aspect-[4/3]"
                  className="transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 flex flex-col justify-end gap-1 bg-linear-to-t from-black/75 via-black/10 to-transparent p-6 text-white">
                  <h3 className="text-3xl">{c.name}</h3>
                  <span className="text-xs tracking-[0.2em] uppercase">
                    {counts[c.slug]} pieces
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <CtaBand title="Commission a piece from any collection" />
    </>
  );
}

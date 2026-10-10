import { ArrowRightIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { ProductGrid } from "@/components/catalog/product-card";
import { WhatsAppButton } from "@/components/commerce/whatsapp-button";
import { NewsletterSection } from "@/components/forms/newsletter-form";
import { BrandFilm } from "@/components/marketing/brand-film";
import { CoutureGallery } from "@/components/marketing/couture-gallery";
import { Testimonials } from "@/components/marketing/testimonials";
import { ValueProps } from "@/components/marketing/value-props";
import { Media } from "@/components/site/media";
import { Container, Section, SectionHeading } from "@/components/site/section";
import { Button } from "@/components/ui/button";
import { videos } from "@/content/site";
import { getFeaturedProducts } from "@/lib/catalog";
import { getContent } from "@/lib/content";
import { consultationMessage } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: { absolute: "AGBONS-GL — Bespoke Bridal Couture | Luxury. Confidence. Couture." },
  description:
    "Luxury, hand-finished bridal gowns and couture pieces — made in Benin City, Nigeria, designed for the world. Book a bespoke bridal consultation.",
  alternates: { canonical: "/" },
};


/** Homepage (audit §3.1). */
export default async function HomePage() {
  const [featured, home, gallery, testimonials] = await Promise.all([
    getFeaturedProducts(6),
    getContent("home"),
    getContent("gallery"),
    getContent("testimonials"),
  ]);

  return (
    <>
      {/* 2. Hero */}
      <section className="border-b">
        <Container className="flex flex-col items-center gap-5 py-12 text-center md:py-20">
          <p className="eyebrow">{home.heroEyebrow}</p>
          <h1 className="max-w-4xl text-5xl leading-[1.02] text-balance sm:text-6xl md:text-7xl">
            {home.heroTitle}
            <span className="block italic text-brand-ink">{home.heroAccent}</span>
          </h1>
          <p className="max-w-xl leading-relaxed text-pretty text-muted-foreground">
            {home.heroSubtitle}
          </p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <WhatsAppButton message={consultationMessage} intent="consultation">
              Book a bridal consultation
            </WhatsAppButton>
            <Button
              variant="outline"
              size="xl"
              nativeButton={false}
              render={<Link href="/shop" />}
            >
              Shop the collections
            </Button>
          </div>
        </Container>
        <Media
          asset={home.heroImage}
          priority
          sizes="100vw"
          aspect="aspect-[16/10] md:aspect-[16/7]"
        />
      </section>

      {/* 3. Our Story, Our Craft */}
      <Section>
        <Container className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <Media
            asset={home.storyImage}
            sizes="(min-width: 768px) 45vw, 100vw"
            className="md:order-last"
          />
          <div className="flex flex-col gap-5">
            <p className="eyebrow">{home.storyEyebrow}</p>
            <h2 className="text-4xl leading-tight md:text-5xl">
              {home.storyHeading}
            </h2>
            {home.storyParagraphs.map((para) => (
              <p key={para.slice(0, 32)} className="leading-relaxed text-muted-foreground">
                {para}
              </p>
            ))}
            <Button
              variant="link"
              className="self-start px-0"
              nativeButton={false}
              render={<Link href="/about" />}
            >
              Read about us <ArrowRightIcon data-icon="inline-end" />
            </Button>
          </div>
        </Container>
      </Section>

      {/* 4. Feature / CTA strip */}
      <Section className="pt-0 md:pt-0">
        <Container className="grid gap-6 md:grid-cols-3">
          {home.features.map((f) => (
            <Link key={f.title} href={f.href} className="group relative block overflow-hidden">
              <Media
                asset={f.image}
                sizes="(min-width: 768px) 33vw, 100vw"
                aspect="aspect-square"
                className="transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 flex flex-col justify-end gap-2 bg-linear-to-t from-black/70 via-black/10 to-transparent p-6 text-white">
                <h3 className="text-3xl">{f.title}</h3>
                <span className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase">
                  {f.cta} <ArrowRightIcon className="size-3.5" aria-hidden />
                </span>
              </div>
            </Link>
          ))}
        </Container>
      </Section>

      {/* 5. Your Dream Dress Begins Here */}
      <Section className="bg-secondary">
        <Container className="grid items-center gap-10 md:grid-cols-[1fr_1.1fr] md:gap-16">
          <Media
            asset={home.dreamImage}
            sizes="(min-width: 768px) 45vw, 100vw"
            aspect="aspect-[4/5] md:aspect-[3/4]"
          />
          <div className="flex flex-col gap-5">
            <p className="eyebrow">The bespoke process</p>
            <h2 className="text-4xl leading-tight md:text-5xl">
              {home.dreamHeading}
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              {home.dreamBody}
            </p>
            <ol className="flex flex-col gap-3 border-l pl-5 text-sm">
              {home.dreamSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="xl" nativeButton={false} render={<Link href="/consultation" />}>
                Start your consultation
              </Button>
              <WhatsAppButton
                message={consultationMessage}
                intent="consultation"
                variant="outline"
              >
                Chat on WhatsApp
              </WhatsAppButton>
            </div>
          </div>
        </Container>
      </Section>

      {/* 6. Value props */}
      <ValueProps />

      {/* Featured pieces */}
      <Section>
        <Container className="flex flex-col gap-12">
          <SectionHeading
            eyebrow="The atelier"
            title="Featured Pieces"
            description="Signature gowns and sets from our latest collections."
          />
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

      {/* 7. Couture Gallery */}
      <Section className="bg-secondary">
        <Container className="flex flex-col gap-12">
          <SectionHeading
            eyebrow="Couture gallery"
            title="Designed for Women Who Define Luxury"
            description="Step behind the seams — explore our couture gallery, featuring exclusive designs, editorial shoots, and client moments that embody timeless sophistication."
          />
          <CoutureGallery images={gallery.slice(0, 8)} />
          <Button
            variant="outline"
            size="xl"
            className="self-center"
            nativeButton={false}
            render={<Link href="/lookbook" />}
          >
            View the lookbook
          </Button>
        </Container>
      </Section>

      {/* 8. Testimonials */}
      <Section>
        <Container className="flex flex-col gap-12">
          <SectionHeading
            eyebrow="Testimonials"
            title="What Our Clients Say"
            description="From the first consultation to the final fitting, our clients' happiness is our true measure of success."
          />
          <Testimonials items={testimonials} />
        </Container>
      </Section>

      {/* 9. Brand film */}
      <Section className="pt-0 md:pt-0">
        <Container>
          <BrandFilm
            src={videos.brandFilm.src}
            poster={videos.brandFilm.poster}
            title="AGBONS-GL brand film"
          />
        </Container>
      </Section>

      {/* 10. Newsletter */}
      <NewsletterSection />
    </>
  );
}

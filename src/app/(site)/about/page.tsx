import type { Metadata } from "next";

import { NewsletterSection } from "@/components/forms/newsletter-form";
import { BrandFilm } from "@/components/marketing/brand-film";
import { CtaBand } from "@/components/marketing/cta-band";
import { Media } from "@/components/site/media";
import { Container, Section, SectionHeading } from "@/components/site/section";
import { siteConfig } from "@/config/site";
import { pageMedia, videos } from "@/content/site";

export const metadata: Metadata = {
  title: "About — Our Story",
  description:
    "AGBONS-GL NIG. LIMITED is a Nigerian fashion house crafting bespoke bridal couture, ready-to-wear and luxury fashion experiences from Benin City, Edo State.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    title: "Quality Craftsmanship",
    body: "Every piece is meticulously tailored for perfection, ensuring the highest quality standard in design.",
  },
  {
    title: "Bespoke Experience",
    body: "We bring your dream designs to life, uniquely made to fit your exact measurements and personality.",
  },
  {
    title: "Globally Inspired",
    body: "Rooted in African creativity and authenticity, our refined designs are perfect for the world stage.",
  },
  {
    title: "Sustainable Elegance",
    body: "We prioritize ethical sourcing and crafting timeless designs, guaranteeing true elegance that transcends trends.",
  },
];

/** About page (audit §3.2). */
export default function AboutPage() {
  return (
    <>
      {/* 2. Hero */}
      <section className="relative isolate overflow-hidden bg-primary text-primary-foreground">
        <Media
          asset={pageMedia.aboutHero}
          priority
          sizes="100vw"
          aspect="aspect-auto"
          className="absolute inset-0 -z-10 opacity-45"
        />
        <Container className="flex min-h-[70svh] flex-col items-center justify-center gap-5 py-20 text-center">
          <p className="text-[0.7rem] font-medium tracking-[0.3em] uppercase">
            A Legacy of Elegance, Crafted in Nigeria
          </p>
          <h1 className="max-w-3xl text-5xl leading-[1.05] text-balance md:text-7xl">
            Redefining Luxury. Celebrating Craftsmanship.
          </h1>
          <p className="max-w-xl leading-relaxed text-primary-foreground/85">
            Where timeless design meets modern femininity — each piece created
            to inspire confidence, elegance, and grace.
          </p>
        </Container>
      </section>

      {/* 3. Our Story + 4. Brand video */}
      <Section>
        <Container className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <div className="flex flex-col gap-5">
            <p className="eyebrow">Our story</p>
            <h2 className="text-4xl leading-tight md:text-5xl">
              A Nigerian fashion house for the woman who dares to be seen
            </h2>
            <div className="prose-brand">
              <p>
                Founded by {siteConfig.founder}, {siteConfig.legalName} is a
                Nigerian fashion house dedicated to crafting bespoke bridal
                couture, ready-to-wear pieces, and luxury fashion experiences
                that embody sophistication and individuality.
              </p>
              <p>
                From our studio in Benin City, Edo State, every design tells a
                story — one of passion, heritage, and artistry.
              </p>
              <p>
                Driven by a vision to merge African creativity with global
                standards of luxury, we bring together fine craftsmanship,
                premium fabrics, and attention to every exquisite detail. Each
                collection reflects a deep understanding of form, culture, and
                emotion — designed for the woman who dares to be seen.
              </p>
            </div>
          </div>
          <BrandFilm
            src={videos.ourStory.src}
            poster={videos.ourStory.poster}
            title="The AGBONS-GL story"
          />
        </Container>
      </Section>

      {/* 5. Philosophy + 6. Values */}
      <Section className="bg-secondary">
        <Container className="flex flex-col gap-14">
          <SectionHeading
            eyebrow="Our philosophy"
            title="Fashion is more than appearance — it’s expression."
            description="Every gown, every stitch, and every fitting session is a collaboration between imagination and craftsmanship. We exist to empower women to own their elegance, whether walking down the aisle, gracing an event, or embracing everyday luxury."
          />
          <div className="grid gap-px overflow-hidden border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <div key={v.title} className="flex flex-col gap-3 bg-background p-6 md:p-8">
                <span className="font-heading text-3xl text-brand-ink">
                  0{i + 1}
                </span>
                <h3 className="text-2xl">{v.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 7. Meet the Creative Director */}
      <Section>
        <Container className="grid items-center gap-10 md:grid-cols-[1fr_1.2fr] md:gap-16">
          <Media
            asset={pageMedia.founder}
            sizes="(min-width: 768px) 40vw, 100vw"
          />
          <div className="flex flex-col gap-5">
            <p className="eyebrow">Meet the Creative Director</p>
            <h2 className="text-4xl leading-tight md:text-5xl">
              {siteConfig.founder}
            </h2>
            <div className="prose-brand">
              <p>
                {siteConfig.founder} is a visionary designer whose passion for
                detail and design excellence has shaped the identity of
                AGBONS-GL.
              </p>
              <p>
                Her creative direction blends traditional African elegance with
                global haute couture influences, creating a unique brand
                aesthetic that celebrates luxury, culture, and womanhood.
              </p>
              <p>
                Her meticulous approach ensures quality craftsmanship in every
                piece, transforming fabrics into statements of confidence and
                sophisticated artistry that resonates with clients worldwide.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* 8. Vision + 9. Mission */}
      <Section className="border-t">
        <Container className="grid gap-12 md:grid-cols-2">
          {[
            {
              title: "Our Vision",
              body: "To become a leading African fashion brand that bridges luxury, culture, and individuality, inspiring confidence and redefining elegance for every woman.",
            },
            {
              title: "Our Mission",
              body: "To craft exclusive fashion experiences — from couture gowns to contemporary pieces — that speak to the heart of every woman and elevate African luxury on the global stage.",
            },
          ].map((item) => (
            <div key={item.title} className="flex flex-col gap-4 border-l-2 border-brand pl-6">
              <h2 className="text-3xl md:text-4xl">{item.title}</h2>
              <p className="font-heading text-xl leading-relaxed text-muted-foreground italic md:text-2xl">
                {item.body}
              </p>
            </div>
          ))}
        </Container>
      </Section>

      {/* 10. CTA band */}
      <CtaBand title="Ready to experience luxury, designed just for you?" />

      {/* 11. Newsletter */}
      <NewsletterSection />
    </>
  );
}

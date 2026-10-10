import type { Metadata } from "next";
import Link from "next/link";

import { NewsletterSection } from "@/components/forms/newsletter-form";
import { Media } from "@/components/site/media";
import { Container, PageHero, Section } from "@/components/site/section";
import { Badge } from "@/components/ui/badge";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Journal & Press",
  description:
    "Runway debuts, press moments and stories from the AGBONS-GL atelier in Benin City.",
  alternates: { canonical: "/journal" },
};

/** Journal & Press (audit §2.5 — previously a dead link with no content). */
export default async function JournalPage() {
  const [lead, ...rest] = await getContent("journal");

  return (
    <>
      <PageHero
        eyebrow="Journal & Press"
        title="Stories From the Atelier"
        description="Runway debuts, press moments and the craft behind our couture."
      />
      <Section>
        <Container className="flex flex-col gap-16">
          {lead && (
            <Link
              href={`/journal/${lead.slug}`}
              className="group grid items-center gap-8 md:grid-cols-2 md:gap-12"
            >
              <Media
                asset={lead.image}
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
                aspect="aspect-[4/3]"
              />
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="capitalize">
                    {lead.kind}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {lead.dateLabel}
                  </span>
                </div>
                <h2 className="text-4xl leading-tight group-hover:underline md:text-5xl">
                  {lead.title}
                </h2>
                <p className="leading-relaxed text-muted-foreground">
                  {lead.excerpt}
                </p>
              </div>
            </Link>
          )}
          <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/journal/${post.slug}`}
                  className="group flex flex-col gap-4"
                >
                  <Media
                    asset={post.image}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    aspect="aspect-[4/3]"
                  />
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="capitalize">
                      {post.kind}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {post.dateLabel}
                    </span>
                  </div>
                  <h3 className="text-2xl leading-snug group-hover:underline">
                    {post.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
      <NewsletterSection />
    </>
  );
}

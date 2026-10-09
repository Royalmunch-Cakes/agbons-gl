import { FileWarningIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Container, PageHero, Section } from "@/components/site/section";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { policies, type PolicyDoc } from "@/content/legal";

export function policyMetadata(slug: PolicyDoc["slug"]): Metadata {
  const doc = policies.find((p) => p.slug === slug)!;
  return {
    title: doc.title,
    description: doc.summary,
    alternates: { canonical: `/${slug}` },
  };
}

/** Shared layout for Shipping, Returns, Privacy and Terms (fixes audit §5.3). */
export function PolicyPage({ slug }: { slug: PolicyDoc["slug"] }) {
  const doc = policies.find((p) => p.slug === slug)!;
  return (
    <>
      <PageHero
        eyebrow="Customer care"
        title={doc.title}
        description={doc.summary}
      />
      <Section>
        <Container className="grid gap-12 lg:grid-cols-[14rem_1fr] lg:gap-16">
          <nav aria-label="Customer care" className="hidden lg:block">
            <ul className="sticky top-32 flex flex-col gap-2 text-sm">
              {policies.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/${p.slug}`}
                    aria-current={p.slug === slug ? "page" : undefined}
                    className="text-muted-foreground hover:text-foreground aria-[current=page]:font-medium aria-[current=page]:text-foreground"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/faqs"
                  className="text-muted-foreground hover:text-foreground"
                >
                  FAQs
                </Link>
              </li>
            </ul>
          </nav>
          <article className="max-w-3xl">
            {!doc.reviewed && (
              <Alert className="mb-8">
                <FileWarningIcon />
                <AlertTitle>Draft — pending review</AlertTitle>
                <AlertDescription>
                  This policy is a working draft and will be finalised before
                  launch. For anything specific to your order, please contact
                  us.
                </AlertDescription>
              </Alert>
            )}
            <div className="prose-brand">
              {doc.sections.map((s) => (
                <section key={s.heading}>
                  <h2>{s.heading}</h2>
                  {s.paragraphs.map((p) => (
                    <p key={p.slice(0, 40)}>{p}</p>
                  ))}
                </section>
              ))}
            </div>
          </article>
        </Container>
      </Section>
    </>
  );
}

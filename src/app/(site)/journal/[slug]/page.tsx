import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Media } from "@/components/site/media";
import { PageSkeleton } from "@/components/site/page-skeleton";
import { Container, Section } from "@/components/site/section";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { getCollection } from "@/lib/catalog";
import { getContent, getContentForEdit } from "@/lib/content";

/** Cached lookup with a store re-check for just-published posts. */
async function findPost(slug: string) {
  return (
    (await getContent("journal")).find((p) => p.slug === slug) ??
    (await getContentForEdit("journal")).find((p) => p.slug === slug)
  );
}

export async function generateStaticParams() {
  return (await getContent("journal")).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: PageProps<"/journal/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await findPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/journal/${post.slug}` },
    openGraph: {
      type: "article",
      images: post.image.src ? [post.image.src] : undefined,
    },
  };
}

export default function JournalPostPage(props: PageProps<"/journal/[slug]">) {
  // Params are read inside Suspense so the route can be re-rendered on
  // demand (admin edits, new slugs) under Cache Components.
  return (
    <Suspense fallback={<PageSkeleton />}>
      <JournalPostView params={props.params} />
    </Suspense>
  );
}

async function JournalPostView({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await findPost(slug);
  if (!post) notFound();
  const collection = post.relatedCollection
    ? await getCollection(post.relatedCollection)
    : undefined;

  return (
    <Section className="pt-8 md:pt-12">
      <Container className="flex max-w-3xl flex-col gap-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/journal" />}>
                Journal & Press
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1">
                {post.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <header className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="capitalize">
              {post.kind}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {post.dateLabel}
            </span>
          </div>
          <h1 className="text-4xl leading-tight text-balance md:text-6xl">
            {post.title}
          </h1>
          <p className="font-heading text-xl text-muted-foreground italic md:text-2xl">
            {post.excerpt}
          </p>
        </header>
        <Media
          asset={post.image}
          priority
          sizes="(min-width: 768px) 768px, 100vw"
          aspect="aspect-[4/3]"
        />
        <article className="prose-brand">
          {post.body.map((s) => (
            <section key={s.heading}>
              <h2>{s.heading}</h2>
              {s.paragraphs.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </section>
          ))}
        </article>
        {collection && (
          <Button
            size="xl"
            className="self-start"
            nativeButton={false}
            render={<Link href={`/collections/${collection.slug}`} />}
          >
            Explore the {collection.name}
          </Button>
        )}
      </Container>
    </Section>
  );
}

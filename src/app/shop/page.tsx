import { SearchXIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { ProductGrid } from "@/components/catalog/product-card";
import { ShopFilters } from "@/components/catalog/shop-filters";
import { NewsletterSection } from "@/components/forms/newsletter-form";
import { Container, PageHero, Section } from "@/components/site/section";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getFacetCounts,
  getProducts,
  PAGE_SIZE,
  queryProducts,
  sortOptions,
  type SortKey,
} from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Discover timeless elegance — shop AGBONS-GL couture gowns, sets and tailored pieces. Order online or via WhatsApp.",
  alternates: { canonical: "/shop" },
};

type SearchParams = Awaited<PageProps<"/shop">["searchParams"]>;

const list = (v: string | string[] | undefined) =>
  (Array.isArray(v) ? v : v ? [v] : []).filter(Boolean);
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

function parse(sp: SearchParams) {
  const sort = one(sp.sort) as SortKey;
  return {
    q: one(sp.q),
    collections: list(sp.collection),
    sort: sortOptions.some((o) => o.value === sort) ? sort : ("featured" as SortKey),
    page: Math.max(1, Number.parseInt(one(sp.page), 10) || 1),
  };
}

function pageHref(sp: SearchParams, page: number) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (k === "page") continue;
    list(v).forEach((x) => params.append(k, x));
  }
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/shop?${qs}` : "/shop";
}

/** Shop / catalog (audit §3.4). */
export default function ShopPage(props: PageProps<"/shop">) {
  return (
    <>
      <PageHero
        eyebrow="Shop"
        title="Discover Timeless Elegance"
        description="Every piece, a statement. Order online, through WhatsApp, or commission it in your measurements."
      />
      <Section className="pt-10 md:pt-14">
        <Container>
          <Suspense fallback={<ShopSkeleton />}>
            <ShopResults searchParams={props.searchParams} />
          </Suspense>
        </Container>
      </Section>
      <NewsletterSection />
    </>
  );
}

async function ShopResults({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const query = parse(sp);
  const [result, facets, all] = await Promise.all([
    queryProducts(query),
    getFacetCounts(),
    getProducts(),
  ]);
  const index = all.map((p) => ({
    collections: p.collections,
    text: `${p.name} ${p.sku} ${p.shortDescription} ${p.collections.join(" ")}`.toLowerCase(),
  }));
  const from = result.total ? (result.page - 1) * PAGE_SIZE + 1 : 0;
  const to = Math.min(result.page * PAGE_SIZE, result.total);

  return (
    <div className="grid gap-8 lg:grid-cols-[16rem_1fr] lg:gap-12">
      <aside aria-label="Filters" className="lg:sticky lg:top-32 lg:self-start">
        <ShopFilters
          key={JSON.stringify(query)}
          facets={facets.collections}
          index={index}
          sortOptions={sortOptions}
          initial={query}
        />
      </aside>

      <div className="flex flex-col gap-8">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {result.total
            ? `Showing ${from}–${to} of ${result.total} ${result.total === 1 ? "piece" : "pieces"}`
            : "No pieces match your filters"}
        </p>

        {result.items.length ? (
          <ProductGrid products={result.items} />
        ) : (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <SearchXIcon />
              </EmptyMedia>
              <EmptyTitle>Nothing found</EmptyTitle>
              <EmptyDescription>
                Try a different search or fewer filters — or ask us to create
                it for you.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent className="flex-row justify-center">
              <Button variant="outline" nativeButton={false} render={<Link href="/shop" />}>
                Clear filters
              </Button>
              <Button nativeButton={false} render={<Link href="/consultation" />}>
                Commission a piece
              </Button>
            </EmptyContent>
          </Empty>
        )}

        {result.pageCount > 1 && (
          <Pagination>
            <PaginationContent>
              {result.page > 1 && (
                <PaginationItem>
                  <PaginationPrevious href={pageHref(sp, result.page - 1)} />
                </PaginationItem>
              )}
              {Array.from({ length: result.pageCount }, (_, i) => i + 1).map((n) => (
                <PaginationItem key={n}>
                  <PaginationLink href={pageHref(sp, n)} isActive={n === result.page}>
                    {n}
                  </PaginationLink>
                </PaginationItem>
              ))}
              {result.page < result.pageCount && (
                <PaginationItem>
                  <PaginationNext href={pageHref(sp, result.page + 1)} />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}

function ShopSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[16rem_1fr] lg:gap-12">
      <Skeleton className="h-10 w-40 lg:h-96 lg:w-full" />
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <Skeleton className="aspect-[4/5] w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ))}
      </div>
    </div>
  );
}

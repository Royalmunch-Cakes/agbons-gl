import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductGrid } from "@/components/catalog/product-card";
import { ProductGallery } from "@/components/catalog/product-gallery";
import { ProductPurchase } from "@/components/catalog/product-purchase";
import { Price } from "@/components/commerce/price";
import { Container, Section, SectionHeading } from "@/components/site/section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { siteConfig } from "@/config/site";
import {
  getCollections,
  getProduct,
  getProducts,
  getRelatedProducts,
} from "@/lib/catalog";
import { toSnapshot } from "@/lib/commerce";
import type { Product } from "@/lib/types";

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: PageProps<"/product/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const p = await getProduct(slug);
  if (!p) return {};
  return {
    title: p.name,
    description: p.shortDescription,
    alternates: { canonical: `/product/${p.slug}` },
    openGraph: {
      type: "website",
      images: p.images.flatMap((i) => (i.src ? [{ url: i.src, alt: i.alt }] : [])),
    },
  };
}

function stockLabel(p: Product) {
  if (p.madeToOrder) return { text: "Made to order", tone: "secondary" as const };
  if (!p.inStock) return { text: "Sold out", tone: "destructive" as const };
  if (p.stockQuantity) return { text: `${p.stockQuantity} in stock`, tone: "outline" as const };
  return { text: "In stock", tone: "outline" as const };
}

function productJsonLd(p: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    sku: p.sku,
    description: p.description || p.shortDescription,
    image: p.images.flatMap((i) => (i.src ? [`${siteConfig.url}${i.src}`] : [])),
    brand: { "@type": "Brand", name: siteConfig.name },
    offers: {
      "@type": "Offer",
      url: `${siteConfig.url}/product/${p.slug}`,
      priceCurrency: "USD",
      price: p.priceUsd,
      availability: p.madeToOrder
        ? "https://schema.org/PreOrder"
        : p.inStock
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: siteConfig.legalName },
    },
  };
}

/** Product detail page (audit §3.5). URL pattern /product/{slug} is unchanged from WordPress. */
export default async function ProductPage(props: PageProps<"/product/[slug]">) {
  const { slug } = await props.params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const [collections, related] = await Promise.all([
    getCollections(),
    getRelatedProducts(product, 3),
  ]);
  const productCollections = collections.filter((c) =>
    product.collections.includes(c.slug),
  );
  const primary =
    productCollections.find((c) => c.kind === "signature") ?? productCollections[0];
  const stock = stockLabel(product);
  const details = Object.entries({
    Fabric: product.details.fabric,
    Silhouette: product.details.silhouette,
    Embellishment: product.details.embellishment,
    "Lead time": product.details.leadTime,
  }).filter(([, v]) => v);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd(product)).replace(/</g, "\\u003c"),
        }}
      />
      <Section className="pt-6 md:pt-10">
        <Container className="flex flex-col gap-6">
          {/* 2. Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/bridal-couture" />}>
                  Bridal Couture
                </BreadcrumbLink>
              </BreadcrumbItem>
              {primary && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink render={<Link href={`/collections/${primary.slug}`} />}>
                      {primary.name}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}
              <BreadcrumbSeparator className="hidden sm:flex" />
              <BreadcrumbItem className="hidden sm:inline-flex">
                <BreadcrumbPage>{product.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="grid gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
            {/* 3. Gallery */}
            <ProductGallery images={product.images} name={product.name} />

            <div className="flex flex-col gap-6 md:sticky md:top-32 md:self-start">
              {/* 4–6. Title, price, short description, stock */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-2">
                  {productCollections.map((c) => (
                    <Badge
                      key={c.slug}
                      variant="outline"
                      render={<Link href={`/collections/${c.slug}`} />}
                    >
                      {c.name}
                    </Badge>
                  ))}
                </div>
                <h1 className="text-4xl leading-tight md:text-5xl">{product.name}</h1>
                <div className="flex items-center gap-3">
                  <Price usd={product.priceUsd} className="text-2xl" />
                  <Badge variant={stock.tone}>{stock.text}</Badge>
                </div>
                <p className="leading-relaxed text-muted-foreground">
                  {product.shortDescription}
                </p>
              </div>

              {/* 7–9. Quantity, WhatsApp order, add to bag, wishlist */}
              <ProductPurchase product={toSnapshot(product)} collectionName={primary?.name} />

              {/* 10. SKU + categories */}
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                <dt className="text-muted-foreground">SKU</dt>
                <dd>{product.sku}</dd>
                {details.map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>

              {/* 11. Information tabs — adds the size, materials/care and delivery
                  sections the audit found missing. */}
              <Accordion defaultValue={["description"]} className="border-t">
                <AccordionItem value="description">
                  <AccordionTrigger className="font-sans text-sm font-medium tracking-wide">Description</AccordionTrigger>
                  <AccordionContent className="leading-relaxed text-muted-foreground">
                    {product.description || product.shortDescription}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="fit">
                  <AccordionTrigger className="font-sans text-sm font-medium tracking-wide">Size & fit</AccordionTrigger>
                  <AccordionContent className="leading-relaxed text-muted-foreground">
                    Every AGBONS-GL piece is tailored to the client. After you
                    order, our atelier confirms your measurements — in our Benin
                    City studio, during a virtual session, or from measurements
                    you provide — before cutting begins.{" "}
                    <Link href="/consultation" className="underline underline-offset-4">
                      Book a fitting
                    </Link>
                    .
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="care">
                  <AccordionTrigger className="font-sans text-sm font-medium tracking-wide">Materials & care</AccordionTrigger>
                  <AccordionContent className="leading-relaxed text-muted-foreground">
                    {product.details.care ??
                      "Hand-finished with delicate beading and embellishment. Specialist dry clean only. Store hanging or flat in the breathable garment bag provided, away from direct sunlight."}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="delivery">
                  <AccordionTrigger className="font-sans text-sm font-medium tracking-wide">Delivery & returns</AccordionTrigger>
                  <AccordionContent className="leading-relaxed text-muted-foreground">
                    We deliver across Nigeria and internationally. Bespoke and
                    made-to-measure pieces are final sale. See{" "}
                    <Link href="/shipping" className="underline underline-offset-4">
                      Shipping & Delivery
                    </Link>{" "}
                    and{" "}
                    <Link href="/returns" className="underline underline-offset-4">
                      Returns & Exchange
                    </Link>
                    .
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </Container>
      </Section>

      {/* 12. Related products */}
      {related.length > 0 && (
        <Section className="border-t">
          <Container className="flex flex-col gap-12">
            <SectionHeading eyebrow="You may also love" title="Related Pieces" />
            <ProductGrid products={related} />
          </Container>
        </Section>
      )}
    </>
  );
}

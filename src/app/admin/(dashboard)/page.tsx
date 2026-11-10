import { ArrowRightIcon, DownloadIcon } from "lucide-react";
import Link from "next/link";

import { adminNav } from "@/components/admin/admin-nav";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getContentForEdit } from "@/lib/content";
import { requireAdmin } from "@/lib/server/admin-auth";

/** Session-checked per request; see the dashboard layout. */
export const instant = false;

const blurbs: Record<string, string> = {
  "/admin/products":
    "Add pieces, update prices and stock, upload photos, mark featured.",
  "/admin/collections":
    "Edit collection stories, hero images and commission prices.",
  "/admin/home": "Hero headline, brand story, feature tiles and bespoke steps.",
  "/admin/gallery": "Couture gallery used on the homepage and lookbook.",
  "/admin/testimonials": "Client reviews shown on the homepage.",
  "/admin/faqs": "Questions and answers on the FAQ page.",
  "/admin/journal": "Press and atelier stories.",
  "/admin/policies": "Shipping, returns, privacy and terms.",
  "/admin/settings":
    "Contact details, WhatsApp, hours, socials, exchange rate.",
};

export default async function AdminHome() {
  await requireAdmin();
  const [products, collections, journal] = await Promise.all([
    getContentForEdit("products"),
    getContentForEdit("collections"),
    getContentForEdit("journal"),
  ]);
  const stats = [
    { label: "Products", value: products.length },
    {
      label: "In stock",
      value: products.filter((p) => p.inStock && !p.madeToOrder).length,
    },
    { label: "Featured", value: products.filter((p) => p.featured).length },
    { label: "Collections", value: collections.length },
    { label: "Journal posts", value: journal.length },
  ];

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl md:text-4xl">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Changes you save here go live on the website straight away.
          </p>
        </div>
        <Button
          variant="outline"
          nativeButton={false}
          render={<a href="/api/admin/export" download />}
        >
          <DownloadIcon data-icon="inline-start" />
          Download content backup
        </Button>
      </div>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="border bg-card p-4">
            <dt className="text-xs text-muted-foreground">{s.label}</dt>
            <dd className="font-heading text-3xl">{s.value}</dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {adminNav
          .flatMap((g) => g.items)
          .filter((i) => i.href !== "/admin")
          .map((item) => (
            <Link key={item.href} href={item.href} className="group">
              <Card className="h-full transition-colors group-hover:border-foreground/40">
                <CardHeader>
                  <item.icon className="size-5 text-brand-ink" aria-hidden />
                  <CardTitle className="flex items-center justify-between font-heading text-xl font-normal">
                    {item.title}
                    <ArrowRightIcon
                      className="size-4 opacity-0 transition-opacity group-hover:opacity-100"
                      aria-hidden
                    />
                  </CardTitle>
                  <CardDescription>{blurbs[item.href]}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
      </div>
    </div>
  );
}

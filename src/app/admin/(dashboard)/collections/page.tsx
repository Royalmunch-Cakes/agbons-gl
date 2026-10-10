import { PlusIcon } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getContentForEdit } from "@/lib/content";
import { requireAdmin } from "@/lib/server/admin-auth";

export const metadata: Metadata = { title: "Collections" };

export default async function CollectionsAdminPage() {
  await requireAdmin();
  const [collections, products] = await Promise.all([
    getContentForEdit("collections"),
    getContentForEdit("products"),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl">Collections</h1>
          <p className="text-sm text-muted-foreground">
            Order here is the order on the website.
          </p>
        </div>
        <Button
          nativeButton={false}
          render={<Link href="/admin/collections/new" />}
        >
          <PlusIcon data-icon="inline-start" />
          New collection
        </Button>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((c) => {
          const count = products.filter((p) =>
            p.collections.includes(c.slug),
          ).length;
          return (
            <li key={c.slug}>
              <Link
                href={`/admin/collections/${c.slug}`}
                className="group flex h-full flex-col border bg-card transition-colors hover:border-foreground/40"
              >
                {c.hero.src ? (
                  <Image
                    src={c.hero.src}
                    alt=""
                    width={480}
                    height={300}
                    className="aspect-[16/10] w-full object-cover"
                  />
                ) : (
                  <div className="aspect-[16/10] bg-secondary" />
                )}
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {c.kind}
                    </Badge>
                    {c.year && (
                      <span className="text-xs text-muted-foreground">
                        {c.year}
                      </span>
                    )}
                  </div>
                  <p className="font-heading text-xl group-hover:underline">
                    {c.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {count} {count === 1 ? "piece" : "pieces"}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

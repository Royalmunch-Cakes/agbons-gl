"use client";

import { PlusIcon, SearchIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Product } from "@/lib/types";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function status(p: Product) {
  if (p.madeToOrder)
    return { label: "Made to order", variant: "secondary" as const };
  if (!p.inStock) return { label: "Sold out", variant: "destructive" as const };
  return {
    label:
      p.stockQuantity !== undefined
        ? `${p.stockQuantity} in stock`
        : "In stock",
    variant: "outline" as const,
  };
}

export function ProductList({
  products,
  collections,
}: {
  products: Product[];
  collections: Record<string, string>;
}) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return products;
    return products.filter((p) =>
      `${p.name} ${p.sku} ${p.collections.map((c) => collections[c]).join(" ")}`
        .toLowerCase()
        .includes(needle),
    );
  }, [q, products, collections]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl">Products</h1>
          <p className="text-sm text-muted-foreground">
            {products.length} pieces · newest first
          </p>
        </div>
        <Button
          nativeButton={false}
          render={<Link href="/admin/products/new" />}
        >
          <PlusIcon data-icon="inline-start" />
          New product
        </Button>
      </div>

      <InputGroup className="h-10 bg-card sm:max-w-sm">
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput
          type="search"
          placeholder="Search name, SKU or collection"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search products"
          className="text-base md:text-sm"
        />
      </InputGroup>

      <div className="border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Product</TableHead>
              <TableHead className="hidden md:table-cell">
                Collections
              </TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => {
              const s = status(p);
              return (
                <TableRow key={p.slug} className="relative">
                  <TableCell>
                    {p.images[0]?.src ? (
                      <Image
                        src={p.images[0].src}
                        alt=""
                        width={48}
                        height={60}
                        className="h-15 w-12 object-cover"
                      />
                    ) : (
                      <div className="h-15 w-12 bg-secondary" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/products/${p.slug}`}
                      className="font-medium after:absolute after:inset-0 hover:underline"
                    >
                      {p.name}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {p.sku}
                      {p.featured && (
                        <StarIcon
                          className="size-3 fill-current text-brand"
                          aria-label="Featured"
                        />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden max-w-56 truncate text-sm text-muted-foreground md:table-cell">
                    {p.collections.map((c) => collections[c] ?? c).join(", ") ||
                      "—"}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {usd.format(p.priceUsd)}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant={s.variant}>{s.label}</Badge>
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-10 text-center text-muted-foreground"
                >
                  No products match “{q}”.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

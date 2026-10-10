"use client";

import { ExternalLinkIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState, useTransition } from "react";

import { deleteProduct, saveProduct } from "@/app/admin/catalog-actions";
import { EditorShell, useDocEditor } from "@/components/admin/editor";
import {
  EditorSection,
  ImageListInput,
  NumberInput,
  SwitchInput,
  TextInput,
} from "@/components/admin/fields";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { toast } from "@/components/ui/toast";
import { slugify } from "@/lib/admin/slugify";
import type { Product } from "@/lib/types";

export function ProductEditor({
  initial,
  isNew,
  collections,
}: {
  initial: Product;
  isNew: boolean;
  collections: { slug: string; name: string }[];
}) {
  const router = useRouter();
  // Slug the product is stored under (null until a new product is saved).
  const [originalSlug, setOriginalSlug] = useState<string | null>(
    isNew ? null : initial.slug,
  );
  const ed = useDocEditor(initial, (p: Product) =>
    saveProduct(p, originalSlug),
  );
  const [deleting, startDelete] = useTransition();
  const p = ed.draft;
  const setDetails = (patch: Partial<Product["details"]>) =>
    ed.update({ details: { ...p.details, ...patch } });
  const groupId = useId();

  const onSave = () =>
    ed.save(undefined, (result) => {
      const slug = result.ok ? result.slug : undefined;
      if (slug && slug !== originalSlug) {
        setOriginalSlug(slug);
        router.replace(`/admin/products/${slug}`);
      }
    });

  return (
    <EditorShell
      title={
        isNew && !originalSlug ? "New product" : p.name || "Untitled product"
      }
      description={
        originalSlug ? (
          <Link
            href={`/product/${originalSlug}`}
            target="_blank"
            className="inline-flex items-center gap-1 underline underline-offset-4"
          >
            View on website <ExternalLinkIcon className="size-3" aria-hidden />
          </Link>
        ) : (
          "Fill in the details, then save to publish."
        )
      }
      dirty={ed.dirty}
      pending={ed.pending}
      onSave={onSave}
      onReset={ed.reset}
      actions={
        originalSlug && (
          <AlertDialog>
            <AlertDialogTrigger
              render={<Button variant="destructive" disabled={deleting} />}
            >
              <Trash2Icon data-icon="inline-start" />
              Delete
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete “{p.name}”?</AlertDialogTitle>
                <AlertDialogDescription>
                  It will be removed from the shop, collections and search
                  straight away. This can’t be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={() =>
                    startDelete(async () => {
                      const r = await deleteProduct(originalSlug!);
                      if (r.ok) {
                        toast.add({
                          title: "Product deleted",
                          type: "success",
                        });
                        router.push("/admin/products");
                      } else {
                        toast.add({
                          title: "Not deleted",
                          description: r.error,
                          type: "error",
                        });
                      }
                    })
                  }
                >
                  Delete product
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )
      }
    >
      <EditorSection title="Basics">
        <TextInput
          label="Name"
          value={p.name}
          onChange={(name) =>
            ed.update(
              isNew && !originalSlug ? { name, slug: slugify(name) } : { name },
            )
          }
        />
        <div className="grid gap-6 sm:grid-cols-2">
          <TextInput
            label="URL slug"
            value={p.slug}
            onChange={(slug) => ed.update({ slug: slugify(slug, true) })}
            description={`agbons-gl.com/product/${p.slug || "…"}${
              originalSlug && p.slug !== originalSlug
                ? " — changing this changes the page address"
                : ""
            }`}
          />
          <TextInput
            label="SKU"
            value={p.sku}
            onChange={(sku) => ed.update({ sku })}
          />
        </div>
        <NumberInput
          label="Price (USD)"
          value={p.priceUsd}
          min={0}
          step={1}
          onChange={(v) => ed.update({ priceUsd: v ?? 0 })}
          description="Visitors can view this in naira using the exchange rate in Settings."
        />
      </EditorSection>

      <EditorSection
        title="Photos"
        description="The first image is the main image in the shop."
      >
        <ImageListInput
          label="Product images"
          value={p.images}
          onChange={(images) => ed.update({ images })}
        />
      </EditorSection>

      <EditorSection title="Description">
        <TextInput
          label="Short description"
          multiline
          rows={2}
          value={p.shortDescription}
          onChange={(shortDescription) => ed.update({ shortDescription })}
          description="Shown under the price and in quick view."
        />
        <TextInput
          label="Full description"
          multiline
          rows={6}
          value={p.description}
          onChange={(description) => ed.update({ description })}
        />
        <div className="grid gap-6 sm:grid-cols-2">
          <TextInput
            label="Fabric"
            value={p.details.fabric ?? ""}
            onChange={(fabric) => setDetails({ fabric })}
          />
          <TextInput
            label="Silhouette"
            value={p.details.silhouette ?? ""}
            onChange={(silhouette) => setDetails({ silhouette })}
          />
          <TextInput
            label="Embellishment"
            value={p.details.embellishment ?? ""}
            onChange={(embellishment) => setDetails({ embellishment })}
          />
          <TextInput
            label="Lead time"
            placeholder="e.g. 8–10 weeks"
            value={p.details.leadTime ?? ""}
            onChange={(leadTime) => setDetails({ leadTime })}
          />
        </div>
        <TextInput
          label="Care instructions"
          multiline
          rows={2}
          value={p.details.care ?? ""}
          onChange={(care) => setDetails({ care })}
          description="Leave empty to use the standard couture care text."
        />
      </EditorSection>

      <EditorSection title="Availability">
        <SwitchInput
          label="Made to order (commission)"
          checked={p.madeToOrder}
          onChange={(madeToOrder) => ed.update({ madeToOrder })}
          description="Shows “Commission this piece” instead of Add to bag."
        />
        <SwitchInput
          label="In stock"
          checked={p.inStock}
          onChange={(inStock) => ed.update({ inStock })}
          description="Turn off to mark the piece as sold out."
        />
        <NumberInput
          label="Quantity in stock (optional)"
          optional
          min={0}
          value={p.stockQuantity}
          onChange={(stockQuantity) => ed.update({ stockQuantity })}
          description="Leave empty if you don’t track quantity. Customers can’t order more than this."
        />
        <SwitchInput
          label="Featured"
          checked={Boolean(p.featured)}
          onChange={(featured) => ed.update({ featured })}
          description="Show on the homepage and Bridal Couture page."
        />
      </EditorSection>

      <EditorSection title="Collections">
        <FieldSet>
          <FieldLegend variant="label" id={groupId}>
            Include this piece in
          </FieldLegend>
          <div
            className="grid gap-3 sm:grid-cols-2"
            role="group"
            aria-labelledby={groupId}
          >
            {collections.map((c) => {
              const id = `${groupId}-${c.slug}`;
              return (
                <Field key={c.slug} orientation="horizontal">
                  <Checkbox
                    id={id}
                    checked={p.collections.includes(c.slug)}
                    onCheckedChange={(on) =>
                      ed.update({
                        collections: on
                          ? [...p.collections, c.slug]
                          : p.collections.filter((x) => x !== c.slug),
                      })
                    }
                  />
                  <FieldLabel htmlFor={id} className="font-normal">
                    {c.name}
                  </FieldLabel>
                </Field>
              );
            })}
          </div>
        </FieldSet>
      </EditorSection>
    </EditorShell>
  );
}

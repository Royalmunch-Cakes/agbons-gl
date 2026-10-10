"use client";

import { ExternalLinkIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { deleteCollection, saveCollection } from "@/app/admin/catalog-actions";
import { EditorShell, useDocEditor } from "@/components/admin/editor";
import {
  EditorSection,
  ImageInput,
  NumberInput,
  SectionsInput,
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
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toast } from "@/components/ui/toast";
import { slugify } from "@/lib/admin/slugify";
import type { Collection } from "@/lib/types";

export function CollectionEditor({
  initial,
  isNew,
  productCount,
}: {
  initial: Collection;
  isNew: boolean;
  productCount: number;
}) {
  const router = useRouter();
  const [originalSlug, setOriginalSlug] = useState<string | null>(
    isNew ? null : initial.slug,
  );
  const ed = useDocEditor(initial, (c: Collection) =>
    saveCollection(c, originalSlug),
  );
  const [deleting, startDelete] = useTransition();
  const c = ed.draft;

  const onSave = () =>
    ed.save(undefined, (result) => {
      const slug = result.ok ? result.slug : undefined;
      if (slug && slug !== originalSlug) {
        setOriginalSlug(slug);
        router.replace(`/admin/collections/${slug}`);
      }
    });

  return (
    <EditorShell
      title={originalSlug ? c.name || "Untitled collection" : "New collection"}
      description={
        originalSlug ? (
          <Link
            href={`/collections/${originalSlug}`}
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
                <AlertDialogTitle>Delete “{c.name}”?</AlertDialogTitle>
                <AlertDialogDescription>
                  The collection page will be removed.{" "}
                  {productCount > 0 &&
                    `Its ${productCount} ${productCount === 1 ? "piece stays" : "pieces stay"} in the shop but will no longer be listed under it. `}
                  This can’t be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={() =>
                    startDelete(async () => {
                      const r = await deleteCollection(originalSlug);
                      if (r.ok) {
                        toast.add({
                          title: "Collection deleted",
                          type: "success",
                        });
                        router.push("/admin/collections");
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
                  Delete collection
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
          value={c.name}
          onChange={(name) =>
            ed.update(originalSlug ? { name } : { name, slug: slugify(name) })
          }
        />
        <div className="grid gap-6 sm:grid-cols-2">
          <TextInput
            label="URL slug"
            value={c.slug}
            onChange={(slug) => ed.update({ slug: slugify(slug, true) })}
            description={`agbons-gl.com/collections/${c.slug || "…"}`}
          />
          <TextInput
            label="SKU code"
            value={c.code}
            onChange={(code) => ed.update({ code: code.toUpperCase() })}
            description="Short code used in product SKUs, e.g. QIC."
          />
        </div>
        <Field>
          <FieldLabel>Type</FieldLabel>
          <ToggleGroup
            variant="outline"
            spacing={0}
            value={[c.kind]}
            onValueChange={(v) =>
              v[0] && ed.update({ kind: v[0] as Collection["kind"] })
            }
          >
            <ToggleGroupItem value="signature">
              Signature collection
            </ToggleGroupItem>
            <ToggleGroupItem value="season">Season</ToggleGroupItem>
          </ToggleGroup>
          <FieldDescription>
            Signature collections get an editorial page and appear on Bridal
            Couture; seasons appear under “By season”.
          </FieldDescription>
        </Field>
        <div className="grid gap-6 sm:grid-cols-2">
          <NumberInput
            label="Year (optional)"
            optional
            value={c.year}
            onChange={(year) => ed.update({ year })}
          />
          <NumberInput
            label="Commission price from (USD, optional)"
            optional
            min={0}
            value={c.fromPriceUsd}
            onChange={(fromPriceUsd) => ed.update({ fromPriceUsd })}
          />
        </div>
      </EditorSection>

      <EditorSection title="Introduction">
        <TextInput
          label="Tagline"
          value={c.tagline}
          onChange={(tagline) => ed.update({ tagline })}
        />
        <TextInput
          label="Description"
          multiline
          rows={4}
          value={c.description}
          onChange={(description) => ed.update({ description })}
        />
        <ImageInput
          label="Hero image"
          value={c.hero}
          onChange={(hero) => ed.update({ hero })}
        />
      </EditorSection>

      <EditorSection
        title="Story"
        description="Editorial sections shown on the collection page."
      >
        <SectionsInput
          label="Sections"
          value={c.story ?? []}
          onChange={(story) => ed.update({ story })}
        />
      </EditorSection>
    </EditorShell>
  );
}

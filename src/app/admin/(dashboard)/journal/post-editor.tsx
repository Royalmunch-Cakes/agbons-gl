"use client";

import { ExternalLinkIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  deleteJournalPost,
  saveJournalPost,
} from "@/app/admin/content-actions";
import { EditorShell, useDocEditor } from "@/components/admin/editor";
import {
  EditorSection,
  ImageInput,
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
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toast } from "@/components/ui/toast";
import type { JournalPost } from "@/content/journal";
import { slugify } from "@/lib/admin/slugify";

const NONE = "__none";

export function PostEditor({
  initial,
  isNew,
  collections,
}: {
  initial: JournalPost;
  isNew: boolean;
  collections: { slug: string; name: string }[];
}) {
  const router = useRouter();
  const [originalSlug, setOriginalSlug] = useState<string | null>(
    isNew ? null : initial.slug,
  );
  const ed = useDocEditor(initial, (p: JournalPost) =>
    saveJournalPost(p, originalSlug),
  );
  const [deleting, startDelete] = useTransition();
  const p = ed.draft;
  const collectionItems = [
    { value: NONE, label: "None" },
    ...collections.map((c) => ({ value: c.slug, label: c.name })),
  ];

  const onSave = () =>
    ed.save(undefined, (result) => {
      const slug = result.ok ? result.slug : undefined;
      if (slug && slug !== originalSlug) {
        setOriginalSlug(slug);
        router.replace(`/admin/journal/${slug}`);
      }
    });

  return (
    <EditorShell
      title={originalSlug ? p.title || "Untitled post" : "New post"}
      description={
        originalSlug ? (
          <Link
            href={`/journal/${originalSlug}`}
            target="_blank"
            className="inline-flex items-center gap-1 underline underline-offset-4"
          >
            View on website <ExternalLinkIcon className="size-3" aria-hidden />
          </Link>
        ) : (
          "Write the post, then save to publish."
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
                <AlertDialogTitle>Delete “{p.title}”?</AlertDialogTitle>
                <AlertDialogDescription>
                  The post will be removed from the Journal. This can’t be
                  undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={() =>
                    startDelete(async () => {
                      const r = await deleteJournalPost(originalSlug);
                      if (r.ok) {
                        toast.add({ title: "Post deleted", type: "success" });
                        router.push("/admin/journal");
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
                  Delete post
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )
      }
    >
      <EditorSection title="Post">
        <TextInput
          label="Title"
          value={p.title}
          onChange={(title) =>
            ed.update(
              originalSlug ? { title } : { title, slug: slugify(title) },
            )
          }
        />
        <TextInput
          label="URL slug"
          value={p.slug}
          onChange={(slug) => ed.update({ slug: slugify(slug, true) })}
          description={`agbons-gl.com/journal/${p.slug || "…"}`}
        />
        <div className="grid gap-6 sm:grid-cols-2">
          <Field>
            <FieldLabel>Type</FieldLabel>
            <ToggleGroup
              variant="outline"
              spacing={0}
              value={[p.kind]}
              onValueChange={(v) =>
                v[0] && ed.update({ kind: v[0] as JournalPost["kind"] })
              }
            >
              <ToggleGroupItem value="story">Atelier story</ToggleGroupItem>
              <ToggleGroupItem value="press">Press</ToggleGroupItem>
            </ToggleGroup>
          </Field>
          <TextInput
            label="Date label"
            value={p.dateLabel}
            onChange={(dateLabel) => ed.update({ dateLabel })}
            placeholder="e.g. March 2026"
          />
        </div>
        <TextInput
          label="Excerpt"
          multiline
          rows={2}
          value={p.excerpt}
          onChange={(excerpt) => ed.update({ excerpt })}
          description="Shown on the Journal page and in search results."
        />
        <ImageInput
          label="Cover image"
          value={p.image}
          onChange={(image) => ed.update({ image })}
        />
        <Field>
          <FieldLabel htmlFor="related-collection">
            Related collection
          </FieldLabel>
          <Select
            items={collectionItems}
            value={p.relatedCollection ?? NONE}
            onValueChange={(v) =>
              ed.update({
                relatedCollection: v && v !== NONE ? String(v) : undefined,
              })
            }
          >
            <SelectTrigger
              id="related-collection"
              className="h-10 w-full bg-card"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {collectionItems.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      </EditorSection>

      <EditorSection title="Body">
        <SectionsInput
          label="Sections"
          value={p.body}
          onChange={(body) => ed.update({ body })}
        />
      </EditorSection>
    </EditorShell>
  );
}

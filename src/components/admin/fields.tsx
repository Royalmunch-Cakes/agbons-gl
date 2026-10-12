"use client";

import {
  ArrowDownIcon,
  ArrowUpIcon,
  ImagePlusIcon,
  PlusIcon,
  Trash2Icon,
  UploadIcon,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useId, useRef, useState, useTransition } from "react";

import { uploadImage } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { ImageTooLargeError, prepareImage } from "@/lib/admin/prepare-image";
import type { MediaAsset, StorySection } from "@/lib/types";

/* ── Layout ───────────────────────────────────────────────────────────── */

export function EditorSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-2xl font-normal">
          {title}
        </CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        <FieldGroup>{children}</FieldGroup>
      </CardContent>
    </Card>
  );
}

/* ── Primitive fields ─────────────────────────────────────────────────── */

export function TextInput({
  label,
  value,
  onChange,
  description,
  multiline,
  rows = 4,
  ...props
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  description?: string;
  multiline?: boolean;
  rows?: number;
} & Omit<React.ComponentProps<"input">, "value" | "onChange">) {
  const id = useId();
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {multiline ? (
        <Textarea
          id={id}
          value={value}
          rows={rows}
          onChange={(e) => onChange(e.target.value)}
          className="bg-card text-base md:text-sm"
        />
      ) : (
        <Input
          {...props}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 bg-card text-base md:text-sm"
        />
      )}
      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  );
}

export function NumberInput({
  label,
  value,
  onChange,
  description,
  min,
  step = 1,
  optional,
}: {
  label: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  description?: string;
  min?: number;
  step?: number;
  optional?: boolean;
}) {
  const id = useId();
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        id={id}
        type="number"
        inputMode="decimal"
        min={min}
        step={step}
        value={value ?? ""}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v === "" ? (optional ? undefined : 0) : Number(v));
        }}
        className="h-10 bg-card text-base md:text-sm"
      />
      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  );
}

export function SwitchInput({
  label,
  checked,
  onChange,
  description,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  description?: string;
}) {
  const id = useId();
  return (
    <Field orientation="horizontal">
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
      <div className="flex flex-col gap-0.5">
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        {description && <FieldDescription>{description}</FieldDescription>}
      </div>
    </Field>
  );
}

/* ── Images ───────────────────────────────────────────────────────────── */

function useUpload(onUploaded: (asset: MediaAsset) => void) {
  const [pending, startTransition] = useTransition();
  const fail = (description: string) =>
    toast.add({ title: "Upload failed", description, type: "error" });
  const upload = (file: File, alt?: string) => {
    startTransition(async () => {
      try {
        // Resize in the browser so phone photos fit the 4 MB upload limit.
        const prepared = await prepareImage(file);
        const data = new FormData();
        data.set("file", prepared);
        if (alt) data.set("alt", alt);
        const result = await uploadImage(data);
        if (result.ok) onUploaded(result.asset);
        else fail(result.error);
      } catch (err) {
        fail(
          err instanceof ImageTooLargeError
            ? err.message
            : "The upload didn't complete. Check your connection and try again.",
        );
      }
    });
  };
  return { pending, upload };
}

function Thumb({
  asset,
  className,
}: {
  asset: MediaAsset;
  className?: string;
}) {
  return asset.src ? (
    <Image
      src={asset.src}
      alt={asset.alt}
      width={240}
      height={300}
      className={className ?? "aspect-[4/5] w-full object-cover"}
    />
  ) : (
    <div className="flex aspect-[4/5] w-full items-center justify-center bg-secondary text-xs text-muted-foreground">
      No image
    </div>
  );
}

/** Single image with upload/replace and alt text (for accessibility and SEO). */
export function ImageInput({
  label,
  value,
  onChange,
  description,
}: {
  label: string;
  value: MediaAsset;
  onChange: (value: MediaAsset) => void;
  description?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const altId = useId();
  const { pending, upload } = useUpload((asset) =>
    onChange({ ...asset, alt: value.alt || asset.alt }),
  );

  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="w-32 shrink-0 overflow-hidden border">
          <Thumb asset={value} />
        </div>
        <div className="flex flex-1 flex-col gap-3">
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) upload(file, value.alt);
              e.target.value = "";
            }}
          />
          <Button
            type="button"
            variant="outline"
            className="self-start"
            disabled={pending}
            onClick={() => fileRef.current?.click()}
          >
            {pending ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <UploadIcon data-icon="inline-start" />
            )}
            {value.src ? "Replace image" : "Upload image"}
          </Button>
          <div className="flex flex-col gap-1.5">
            <FieldLabel htmlFor={altId} className="text-xs">
              Image description (alt text)
            </FieldLabel>
            <Input
              id={altId}
              value={value.alt}
              onChange={(e) => onChange({ ...value, alt: e.target.value })}
              placeholder="Describe the image for screen readers and search engines"
              className="h-9 bg-card text-base md:text-sm"
            />
          </div>
          {description && <FieldDescription>{description}</FieldDescription>}
        </div>
      </div>
    </Field>
  );
}

/** Ordered image list: upload several, reorder, remove, edit alt text. */
export function ImageListInput({
  label,
  value,
  onChange,
  description,
}: {
  label: string;
  value: MediaAsset[];
  onChange: (value: MediaAsset[]) => void;
  description?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [queue, setQueue] = useState(0);
  // Latest list, so several uploads finishing in quick succession all append.
  const latest = useRef(value);
  useEffect(() => {
    latest.current = value;
  }, [value]);
  const { pending, upload } = useUpload((asset) => {
    latest.current = [...latest.current, asset];
    onChange(latest.current);
    setQueue((q) => Math.max(0, q - 1));
  });

  const move = (i: number, dir: -1 | 1) => {
    const next = [...value];
    [next[i], next[i + dir]] = [next[i + dir], next[i]];
    onChange(next);
  };

  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      {description && <FieldDescription>{description}</FieldDescription>}
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {value.map((img, i) => (
          <li
            key={`${img.src}-${i}`}
            className="flex flex-col gap-2 border bg-card p-2"
          >
            <Thumb asset={img} />
            <Input
              aria-label={`Alt text for image ${i + 1}`}
              value={img.alt}
              onChange={(e) =>
                onChange(
                  value.map((v, j) =>
                    j === i ? { ...v, alt: e.target.value } : v,
                  ),
                )
              }
              placeholder="Alt text"
              className="h-8 text-base md:text-xs"
            />
            <div className="flex justify-between">
              <div className="flex">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Move earlier"
                  disabled={i === 0}
                  onClick={() => move(i, -1)}
                >
                  <ArrowUpIcon />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Move later"
                  disabled={i === value.length - 1}
                  onClick={() => move(i, 1)}
                >
                  <ArrowDownIcon />
                </Button>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Remove image ${i + 1}`}
                onClick={() => onChange(value.filter((_, j) => j !== i))}
              >
                <Trash2Icon />
              </Button>
            </div>
            {i === 0 && (
              <span className="text-[0.65rem] text-muted-foreground">
                Main image
              </span>
            )}
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={pending}
            className="flex aspect-[4/5] w-full flex-col items-center justify-center gap-2 border border-dashed text-sm text-muted-foreground hover:bg-secondary disabled:opacity-60"
          >
            {pending || queue > 0 ? (
              <Spinner />
            ) : (
              <ImagePlusIcon className="size-6" />
            )}
            {pending || queue > 0 ? "Uploading…" : "Add images"}
          </button>
        </li>
      </ul>
      <input
        ref={fileRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        className="sr-only"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          setQueue(files.length);
          files.forEach((f) => upload(f));
          e.target.value = "";
        }}
      />
    </Field>
  );
}

/* ── Lists ────────────────────────────────────────────────────────────── */

/**
 * Generic repeater: renders each item with move/remove controls and an
 * "Add" button. `render` receives the item and an update callback.
 */
export function Repeater<T>({
  label,
  items,
  onChange,
  create,
  render,
  itemLabel,
  addLabel = "Add",
}: {
  label?: string;
  items: T[];
  onChange: (items: T[]) => void;
  create: () => T;
  render: (
    item: T,
    update: (patch: Partial<T>) => void,
    index: number,
  ) => React.ReactNode;
  itemLabel?: (item: T, index: number) => string;
  addLabel?: string;
}) {
  const move = (i: number, dir: -1 | 1) => {
    const next = [...items];
    [next[i], next[i + dir]] = [next[i + dir], next[i]];
    onChange(next);
  };
  return (
    <div className="flex flex-col gap-3">
      {label && <p className="text-sm font-medium">{label}</p>}
      {items.map((item, i) => (
        <div key={i} className="flex flex-col gap-3 border bg-card p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {itemLabel ? itemLabel(item, i) : `Item ${i + 1}`}
            </span>
            <div className="flex shrink-0">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Move up"
                disabled={i === 0}
                onClick={() => move(i, -1)}
              >
                <ArrowUpIcon />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Move down"
                disabled={i === items.length - 1}
                onClick={() => move(i, 1)}
              >
                <ArrowDownIcon />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Remove"
                onClick={() => onChange(items.filter((_, j) => j !== i))}
              >
                <Trash2Icon />
              </Button>
            </div>
          </div>
          {render(
            item,
            (patch) =>
              onChange(
                items.map((it, j) => (j === i ? { ...it, ...patch } : it)),
              ),
            i,
          )}
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        className="self-start"
        onClick={() => onChange([...items, create()])}
      >
        <PlusIcon data-icon="inline-start" />
        {addLabel}
      </Button>
    </div>
  );
}

/** List of paragraphs / steps. */
export function StringListInput({
  label,
  value,
  onChange,
  addLabel = "Add paragraph",
  rows = 3,
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  addLabel?: string;
  rows?: number;
}) {
  return (
    <Repeater
      label={label}
      items={value.map((text) => ({ text }))}
      onChange={(items) => onChange(items.map((i) => i.text))}
      create={() => ({ text: "" })}
      itemLabel={(_, i) => `${i + 1}`}
      addLabel={addLabel}
      render={(item, update) => (
        <Textarea
          aria-label={`${label} ${item.text.slice(0, 20)}`}
          value={item.text}
          rows={rows}
          onChange={(e) => update({ text: e.target.value })}
          className="bg-background text-base md:text-sm"
        />
      )}
    />
  );
}

/** Story sections: heading + paragraphs (collections, journal, policies). */
export function SectionsInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: StorySection[];
  onChange: (value: StorySection[]) => void;
}) {
  return (
    <Repeater
      label={label}
      items={value}
      onChange={onChange}
      create={() => ({ heading: "", paragraphs: [""] })}
      itemLabel={(s, i) => s.heading || `Section ${i + 1}`}
      addLabel="Add section"
      render={(section, update) => (
        <>
          <TextInput
            label="Heading"
            value={section.heading}
            onChange={(heading) => update({ heading })}
          />
          <StringListInput
            label="Paragraphs"
            value={section.paragraphs}
            onChange={(paragraphs) => update({ paragraphs })}
            rows={4}
          />
        </>
      )}
    />
  );
}

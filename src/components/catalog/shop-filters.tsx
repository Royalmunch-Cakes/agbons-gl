"use client";

import { SearchIcon, SlidersHorizontalIcon } from "lucide-react";
import Form from "next/form";
import { useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { SortKey } from "@/lib/catalog";

export type Facet = { slug: string; name: string; count: number };
/** Minimal per-product index for the live "Show (N)" count. */
export type FilterIndex = { collections: string[]; text: string }[];

type Props = {
  facets: Facet[];
  index: FilterIndex;
  sortOptions: { value: SortKey; label: string }[];
  initial: { q: string; collections: string[]; sort: SortKey };
};

function useFilterState(initial: Props["initial"], index: FilterIndex) {
  const [q, setQ] = useState(initial.q);
  const [selected, setSelected] = useState<string[]>(initial.collections);
  const count = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return index.filter(
      (p) =>
        (!selected.length || selected.some((c) => p.collections.includes(c))) &&
        (!needle || p.text.includes(needle)),
    ).length;
  }, [q, selected, index]);
  const toggle = (slug: string, on: boolean) =>
    setSelected((s) => (on ? [...s, slug] : s.filter((x) => x !== slug)));
  return { q, setQ, selected, toggle, count, clear: () => (setQ(""), setSelected([])) };
}

function FilterFields({
  facets,
  sortOptions,
  state,
  initialSort,
  onChange,
  idPrefix,
}: {
  facets: Facet[];
  sortOptions: Props["sortOptions"];
  state: ReturnType<typeof useFilterState>;
  initialSort: SortKey;
  onChange?: () => void;
  idPrefix: string;
}) {
  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor={`${idPrefix}-q`}>Search</FieldLabel>
        <InputGroup className="h-11 bg-card">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            id={`${idPrefix}-q`}
            name="q"
            type="search"
            placeholder="Search pieces or SKU"
            value={state.q}
            onChange={(e) => state.setQ(e.target.value)}
            className="text-base md:text-sm"
          />
        </InputGroup>
      </Field>

      <Field>
        <FieldLabel htmlFor={`${idPrefix}-sort`}>Sort by</FieldLabel>
        <Select
          name="sort"
          items={sortOptions}
          defaultValue={initialSort}
          onValueChange={() => onChange && setTimeout(onChange)}
        >
          <SelectTrigger id={`${idPrefix}-sort`} className="h-11 w-full bg-card">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {sortOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      <FieldSet>
        <FieldLegend variant="label">Collections</FieldLegend>
        <FieldGroup className="gap-3">
          {facets.map((f) => {
            const id = `${idPrefix}-c-${f.slug}`;
            return (
              <Field key={f.slug} orientation="horizontal">
                <Checkbox
                  id={id}
                  name="collection"
                  value={f.slug}
                  checked={state.selected.includes(f.slug)}
                  onCheckedChange={(on) => {
                    state.toggle(f.slug, on);
                    if (onChange) setTimeout(onChange);
                  }}
                />
                <FieldLabel htmlFor={id} className="flex-1 font-normal">
                  {f.name}
                  <span className="ml-auto text-muted-foreground tabular-nums">
                    {f.count}
                  </span>
                </FieldLabel>
              </Field>
            );
          })}
        </FieldGroup>
      </FieldSet>
    </FieldGroup>
  );
}

/**
 * Shop filters (audit §3.4 item 3): category checkboxes with counts, search
 * box and a "Show (N)" apply button. A plain GET form, so filtering works
 * without JavaScript and results are shareable URLs.
 */
export function ShopFilters({ facets, index, sortOptions, initial }: Props) {
  const desktop = useFilterState(initial, index);
  const mobile = useFilterState(initial, index);
  const desktopForm = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  const active = initial.collections.length + (initial.q ? 1 : 0);

  return (
    <>
      {/* Desktop sidebar: applies on change. */}
      <Form
        ref={desktopForm}
        action="/shop"
        scroll={false}
        className="hidden lg:block"
      >
        <FilterFields
          idPrefix="d"
          facets={facets}
          sortOptions={sortOptions}
          state={desktop}
          initialSort={initial.sort}
          onChange={() => desktopForm.current?.requestSubmit()}
        />
        <div className="mt-6 flex gap-2">
          <Button type="submit" className="flex-1">
            Show ({desktop.count})
          </Button>
          {active > 0 && (
            <Button variant="ghost" nativeButton={false} render={<a href="/shop" />}>
              Clear
            </Button>
          )}
        </div>
      </Form>

      {/* Mobile drawer: applies on "Show (N)". */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={<Button variant="outline" size="lg" className="lg:hidden" />}
        >
          <SlidersHorizontalIcon data-icon="inline-start" />
          Filter & sort{active > 0 && ` (${active})`}
        </SheetTrigger>
        <SheetContent side="bottom" className="max-h-[85dvh]">
          <SheetHeader>
            <SheetTitle className="font-heading text-2xl">Filter & sort</SheetTitle>
          </SheetHeader>
          <Form
            action="/shop"
            onSubmit={() => setOpen(false)}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="overflow-y-auto px-4">
              <FilterFields
                idPrefix="m"
                facets={facets}
                sortOptions={sortOptions}
                state={mobile}
                initialSort={initial.sort}
              />
            </div>
            <SheetFooter className="flex-row border-t">
              <Button type="button" variant="ghost" size="xl" onClick={mobile.clear}>
                Clear
              </Button>
              <Button type="submit" size="xl" className="flex-1">
                Show ({mobile.count})
              </Button>
            </SheetFooter>
          </Form>
        </SheetContent>
      </Sheet>
    </>
  );
}

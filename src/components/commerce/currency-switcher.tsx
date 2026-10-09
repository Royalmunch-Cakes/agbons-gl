"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { currencies } from "@/lib/currency";
import { currency, useCurrency } from "@/lib/store";
import type { CurrencyCode } from "@/lib/types";

export function CurrencySwitcher({ className }: { className?: string }) {
  const value = useCurrency();
  return (
    <ToggleGroup
      aria-label="Display currency"
      size="sm"
      spacing={0}
      variant="outline"
      value={[value]}
      onValueChange={(v) => v[0] && currency.set(v[0] as CurrencyCode)}
      className={className}
    >
      {currencies.map((c) => (
        <ToggleGroupItem key={c.code} value={c.code} aria-label={c.label}>
          {c.code}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

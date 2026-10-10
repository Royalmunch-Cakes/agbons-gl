"use client";

import { useSiteSettings } from "@/components/site/settings-provider";
import { formatMoney } from "@/lib/currency";
import { useCurrency } from "@/lib/store";
import { cn } from "@/lib/utils";

/** Price in the visitor's chosen display currency (audit §5.13). */
export function Price({ usd, className }: { usd: number; className?: string }) {
  const currency = useCurrency();
  const { usdToNgnRate } = useSiteSettings();
  return (
    <span className={cn("tabular-nums", className)}>
      {formatMoney(usd, currency, usdToNgnRate)}
    </span>
  );
}

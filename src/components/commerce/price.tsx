"use client";

import { formatMoney } from "@/lib/currency";
import { cn } from "@/lib/utils";

/** Price in US dollars (audit §5.13). */
export function Price({ usd, className }: { usd: number; className?: string }) {
  return (
    <span className={cn("tabular-nums", className)}>{formatMoney(usd)}</span>
  );
}

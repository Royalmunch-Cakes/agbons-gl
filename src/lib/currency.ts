import type { CurrencyCode } from "@/lib/types";

/**
 * Currency strategy (audit §5.13): prices are authored in USD for the
 * international clientele, and visitors can switch display to NGN using a
 * configurable rate. Orders are confirmed over WhatsApp at the final rate.
 */

export const currencies: { code: CurrencyCode; label: string }[] = [
  { code: "USD", label: "USD $" },
  { code: "NGN", label: "NGN ₦" },
];

/** Fallback rate from the environment; the live rate is an admin setting. */
export const defaultUsdToNgnRate =
  Number(process.env.NEXT_PUBLIC_USD_TO_NGN_RATE) || 1550;

export function convertFromUsd(
  amountUsd: number,
  currency: CurrencyCode,
  rate = defaultUsdToNgnRate,
) {
  return currency === "NGN" ? amountUsd * rate : amountUsd;
}

export function formatMoney(
  amountUsd: number,
  currency: CurrencyCode = "USD",
  rate = defaultUsdToNgnRate,
) {
  return new Intl.NumberFormat(currency === "NGN" ? "en-NG" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "NGN" ? 0 : 2,
    minimumFractionDigits: 0,
  }).format(convertFromUsd(amountUsd, currency, rate));
}

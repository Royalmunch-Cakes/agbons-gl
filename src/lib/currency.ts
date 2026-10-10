/**
 * Prices are authored and shown in US dollars (audit §5.13). The final
 * amount is confirmed with the client when the order is placed.
 */
const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatMoney(amountUsd: number) {
  return usd.format(amountUsd);
}

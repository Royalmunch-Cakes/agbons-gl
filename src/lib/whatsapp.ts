import { siteConfig } from "@/config/site";
import { formatMoney } from "@/lib/currency";
import type { CurrencyCode, Product } from "@/lib/types";

/**
 * WhatsApp deep links (audit §1 primary conversion channel; TRD §8 "replicate
 * the Complete Order via WhatsApp pattern as a first-class component").
 * Every message is generated from data, never hand-written per product.
 */

export type WhatsAppIntent =
  | "consultation"
  | "product-order"
  | "cart-order"
  | "enquiry";

export function whatsappUrl(message: string): string {
  return `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function productUrl(slug: string): string {
  return `${siteConfig.url}/product/${slug}`;
}

export function productOrderMessage(
  product: Pick<Product, "name" | "sku" | "priceUsd" | "slug">,
  currency: CurrencyCode = "USD",
  quantity = 1,
): string {
  return [
    `Hello ${siteConfig.name}, I would like to order:`,
    "",
    `• ${product.name} (${product.sku})`,
    `  Qty: ${quantity} · Price: ${formatMoney(product.priceUsd, currency)}`,
    `  ${productUrl(product.slug)}`,
    "",
    "Please let me know the next steps.",
  ].join("\n");
}

export function productEnquiryMessage(
  product: Pick<Product, "name" | "sku" | "slug">,
): string {
  return [
    `Hello ${siteConfig.name}, I'd like to commission a made-to-measure version of:`,
    "",
    `• ${product.name} (${product.sku})`,
    `  ${productUrl(product.slug)}`,
    "",
    "Could we arrange a consultation?",
  ].join("\n");
}

export type OrderLine = {
  name: string;
  sku: string;
  slug: string;
  priceUsd: number;
  quantity: number;
};

export function cartOrderMessage(
  lines: OrderLine[],
  currency: CurrencyCode,
  customer?: { name?: string; note?: string },
): string {
  const total = lines.reduce((sum, l) => sum + l.priceUsd * l.quantity, 0);
  return [
    `Hello ${siteConfig.name}, I would like to place an order:`,
    "",
    ...lines.flatMap((l) => [
      `• ${l.name} (${l.sku}) × ${l.quantity} — ${formatMoney(l.priceUsd * l.quantity, currency)}`,
      `  ${productUrl(l.slug)}`,
    ]),
    "",
    `Order total: ${formatMoney(total, currency)}`,
    ...(customer?.name ? ["", `Name: ${customer.name}`] : []),
    ...(customer?.note ? [`Note: ${customer.note}`] : []),
  ].join("\n");
}

export const consultationMessage = `Hello ${siteConfig.name}, I would like to book a bridal consultation.`;

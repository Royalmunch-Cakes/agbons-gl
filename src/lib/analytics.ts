/**
 * Analytics event helper (TRD §8: GA4 / Meta Pixel / WhatsApp click
 * tracking). Scripts are loaded by <Analytics /> only when IDs are set in
 * the environment; until then these calls are no-ops.
 */

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const META_STANDARD_EVENTS: Record<string, string> = {
  add_to_cart: "AddToCart",
  add_to_wishlist: "AddToWishlist",
  begin_checkout: "InitiateCheckout",
  generate_lead: "Lead",
  contact: "Contact",
  sign_up: "CompleteRegistration",
};

export function trackEvent(name: string, params: Params = {}) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", name, params);
  const metaEvent = META_STANDARD_EVENTS[name];
  if (metaEvent) window.fbq?.("track", metaEvent, params);
  else window.fbq?.("trackCustom", name, params);
}

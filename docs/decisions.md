# Decisions & open questions

The audit (§7, §9) leaves several product decisions to the stakeholder. The
build takes a reversible default for each so the site is complete today;
each needs client confirmation.

## Defaults taken

| # | Question (audit ref) | Default in this build | How to change |
|---|---|---|---|
| D1 | Target stack (TRD §8) | Next.js 16 custom frontend, content in typed files behind `src/lib/catalog.ts` | Swap the catalog functions for headless CMS queries (e.g. Sanity); pages are unaffected |
| D2 | Conversion model: checkout vs WhatsApp (§1, §5.12, §7) | **WhatsApp-first with a real bag.** Every product offers “Complete order via WhatsApp” and “Add to bag”; the bag checks out by sending an itemised WhatsApp message. Online card payment is shown as “coming soon”. | Add a payment provider (e.g. Paystack/Flutterwave/Stripe) behind the bag's order summary |
| D3 | Bespoke intake (§5.11, §7) | Structured consultation form (occasion, date, budget, fitting method, optional measurements, vision) delivered by email/webhook, then hand-off to WhatsApp. No size variants on products. | Fields live in `src/lib/forms/schemas.ts` and `consultation-form.tsx` |
| D4 | Currency (§5.13) | Prices authored in USD (as on WooCommerce); visitors can toggle NGN display at `NEXT_PUBLIC_USD_TO_NGN_RATE`; final amount confirmed at order | Set the rate, or author NGN prices in the content model |
| D5 | Newsletter / CRM (§5.8) | Mailchimp (double opt-in) when configured, console log otherwise | `src/lib/server/newsletter.ts` |
| D6 | Form delivery (§5.9) | Resend email and/or JSON webhook | `src/lib/server/deliver.ts` |
| D7 | Customer accounts (TRD §8) | Not in scope: bag, wishlist and currency persist in the browser | `src/lib/store.ts` is the seam for server sync |
| D8 | Analytics (TRD §8) | GA4 + Meta Pixel, loaded only when IDs are set; events for add-to-bag, wishlist, WhatsApp clicks (by intent), leads and sign-ups | `src/lib/analytics.ts` |
| D9 | Collection taxonomy (§4) | Two-axis model: product line × collection. Live data only uses the “Bridal Couture” line; products map to collections by their WooCommerce categories | `src/content/collections.ts`, `scripts/import-woocommerce.mjs` |

## Needs client confirmation

1. **Founder's name.** The About page says “Gloria Ehizuelen”; the collection
   pages say “Glory Agbonita Ehizuenlen”. Both are preserved as migrated.
   (`siteConfig.founder`, collection copy.)
2. **Social profile URLs.** The live site linked to generic homepages; the
   `.env` uses `@agbonsgl` profile URLs, which need confirming (§5.4, §9).
3. **Policy pages.** Shipping, Returns, Privacy and Terms are drafts (no fees,
   refund windows or deposit terms invented). They need legal review —
   including Nigeria Data Protection Act requirements — before launch and
   before any online payment (§5.3).
4. **FAQs.** Written from facts on the old site (the old FAQ page was
   template filler); confirm answers, especially lead times.
5. **Product descriptions** on WooCommerce are one shared template; real
   copy (fabrics, silhouettes, lead times) can go in each product's
   `details`, which the PDP already displays.
6. **SKU codes vs categories.** SKUs carry collection codes (e.g.
   `AGB-SPS-042`) that often differ from the product's WooCommerce
   category; the build follows the categories. Confirm which is correct.
7. **Commission listings.** “Crystal Drop Bridal Collections” and “Haute
   Couture Bridal Collection” are $5,000 listings without descriptions;
   they're treated as made-to-order commissions.
8. **USD→NGN rate** and whether naira prices should be fixed rather than
   converted.
9. **Ready-to-Wear line.** The brand describes RTW, but no RTW products
   exist yet; add a line in `collections.ts` when they do.
10. **Hosting.** The current host's TLS certificate chain is untrusted —
    resolve at cutover (the new site needs a valid certificate on the
    production domain).

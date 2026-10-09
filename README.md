# AGBONS-GL — website

Custom rebuild of [agbons-gl.com](https://agbons-gl.com) (bespoke bridal couture,
Benin City), replacing WordPress + WooCommerce + Elementor/Ekit. Every
requirement traces back to the
[site audit](agbons-gl-site-audit-discovery.md) — see
[docs/spec-traceability.md](docs/spec-traceability.md) — and the defaults
taken for open PRD questions are in [docs/decisions.md](docs/decisions.md).

## Stack

- **Next.js 16** (App Router, Cache Components, Partial Prefetching, Turbopack)
- **React 19**, **TypeScript**, **Tailwind CSS v4**
- **shadcn/ui** (Base UI primitives, `base-nova` style, lucide icons) themed to
  the brand (ivory / ink / logo orange-gold; Cormorant Garamond + Jost)
- **zod** for form validation; server actions for form submission
- No database: catalog and editorial content live in typed files under
  `src/content/`, accessed only through `src/lib/catalog.ts` — the seam for a
  headless CMS later.

## Getting started

```bash
npm install
cp .env.example .env          # then fill in real values (see below)
npm run media:pull -- --insecure   # fetch brand films (gitignored, ~25 MB)
npm run dev                   # http://localhost:3000
```

Production build: `npm run build && npm start`.

### Scripts

| Script | Purpose |
|---|---|
| `npm run dev` / `build` / `start` | Next.js |
| `npm run lint` | ESLint |
| `npm run import:catalog -- --insecure` | Re-import all products + images from the live WooCommerce Store API into `src/content/products.json` and `public/media/products/` |
| `npm run media:pull -- --insecure` | Download site imagery and the two brand films listed in `scripts/site-media.json` |
| `npm run icons` | Regenerate favicon, app icons and the default Open Graph image |

`--insecure` is needed only because the current WordPress host serves an
untrusted certificate chain (`SEC_E_UNTRUSTED_ROOT`); it applies to these
read-only migration downloads and nothing else.

## Environment

All settings are documented in [`.env.example`](.env.example). `NEXT_PUBLIC_*`
values are inlined at build time — rebuild after changing them.

| Area | Variables |
|---|---|
| Site | `NEXT_PUBLIC_SITE_URL` |
| Contact / WhatsApp | `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_CONTACT_PHONE` |
| Social profiles | `NEXT_PUBLIC_INSTAGRAM_URL`, `…_FACEBOOK_URL`, `…_TIKTOK_URL`, `…_X_URL` (empty = hidden) |
| Currency | `NEXT_PUBLIC_USD_TO_NGN_RATE` |
| Newsletter | `NEWSLETTER_PROVIDER` (`mailchimp` \| `log`), `MAILCHIMP_*` |
| Form delivery | `RESEND_API_KEY`, `FORMS_NOTIFY_EMAIL`, `FORMS_FROM_EMAIL`, `FORMS_WEBHOOK_URL` |
| Analytics | `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_META_PIXEL_ID` (empty = not loaded) |

With no email/webhook configured, form submissions and newsletter sign-ups are
logged to the server console, so everything works locally.

## Project structure

```
src/
  app/                 routes (pages, server actions, sitemap, robots, icons)
  components/
    ui/                shadcn/ui components (generated; brand variants added)
    site/              header, footer, layout primitives, media, analytics
    catalog/           product card/grid, quick view, gallery, purchase, shop filters
    commerce/          price, currency switcher, bag, wishlist, WhatsApp button
    forms/             form kit, newsletter, contact, consultation
    marketing/         gallery, testimonials, brand film, value props, CTA band
    content/           policy page template
  config/              site config (public) and server-only env
  content/             products.json, collections, site media, FAQs, journal, policies
  lib/                 catalog queries, store, WhatsApp, currency, analytics, forms
scripts/               WooCommerce import, media pull, icon generation
public/media/          migrated imagery (videos gitignored)
```

## Routes

`/` · `/about` · `/bridal-couture` · `/collections` · `/collections/[slug]` ·
`/shop` · `/product/[slug]` · `/consultation` · `/contact` · `/lookbook` ·
`/journal` · `/journal/[slug]` · `/faqs` · `/shipping` · `/returns` ·
`/privacy` · `/terms` · `/bag` · `/wishlist`

Old WordPress URLs (`/haute-collection/`, `/product-category/…`,
`/wishsuite/`, `/cart/`, `/checkout/`, `/faq-2/`, `/blog/`, `/services/`)
permanently redirect to their new equivalents (`next.config.ts`).
`/product/{slug}` URLs are unchanged.

## Editing content

- **Products:** re-run `npm run import:catalog` or edit
  `src/content/products.json`.
- **Collections, FAQs, journal posts, policies, testimonials:** edit the
  matching file in `src/content/`.
- **Policies** show a "Draft — pending review" notice until their `reviewed`
  flag is set to `true` in `src/content/legal.ts`.

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
- **Admin dashboard** at `/admin` (custom, shadcn) editing content stored in
  **Vercel Blob** or **Netlify Blobs** (picked by host; a local `.data/`
  folder in development). The migrated
  files in `src/content/` are the seed used until something is saved.

## Getting started

```bash
npm install
cp .env.example .env          # then fill in real values (see below)
npm run dev                   # http://localhost:3000
```

Production build: `npm run build && npm start`. Deployment: see
[docs/deploy-vercel.md](docs/deploy-vercel.md) or
[docs/deploy-netlify.md](docs/deploy-netlify.md) (each covers env vars, rate
limiting and the DNS cutover).

## Admin dashboard

Sign in at **`/admin`** with `ADMIN_PASSWORD`. Everything saved there goes
live immediately — no rebuild or deploy needed.

| Section | What can be edited |
|---|---|
| Products | Add/edit/delete pieces: name, URL, SKU, price, photos (upload, reorder, alt text), descriptions, fabric/silhouette/lead time/care, made-to-order, stock and quantity, featured, collections |
| Collections | Add/edit/delete: name, URL, signature/season, year, commission price, tagline, description, hero image, story sections |
| Homepage | Hero text and banner, brand story, feature tiles, bespoke process |
| Gallery | Couture gallery images (homepage shows the first 8, Lookbook all) |
| Testimonials, FAQs | Client reviews; grouped questions and answers |
| Journal & Press | Add/edit/delete posts with cover image and sections |
| Policies | Shipping, returns, privacy, terms; “reviewed” removes the draft notice |
| Settings | Announcement bar, email, phone, WhatsApp number, opening hours, social links |

How it works: each area is one JSON document in the content store,
validated with zod on save (`src/lib/admin/schemas.ts`); uploaded images go
to the `media` store and are served from `/media-store/…`. Saves call
`updateTag` + `revalidatePath`, so cached pages refresh on the next visit.
Use **Download content backup** on the dashboard to export everything as
JSON. Access is protected by `src/proxy.ts` plus a session check in every
admin action; sessions last 12 hours.

Locally, edits are stored in `.data/` (gitignored) — delete that folder to
reset to the migrated content.

### Scripts

| Script | Purpose |
|---|---|
| `npm run dev` / `build` / `start` | Next.js |
| `npm run lint` | ESLint |
| `npm run import:catalog -- --insecure` | Re-import all products + images from the live WooCommerce Store API into `src/content/products.json` and `public/media/products/` |
| `npm run media:pull -- --insecure` | Re-download site imagery and brand films listed in `scripts/site-media.json` (already committed) |
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
| Newsletter | `NEWSLETTER_PROVIDER` (`mailchimp` \| `log`), `MAILCHIMP_*` |
| Form delivery | `RESEND_API_KEY`, `FORMS_NOTIFY_EMAIL`, `FORMS_FROM_EMAIL`, `FORMS_WEBHOOK_URL` |
| Analytics | `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_META_PIXEL_ID` (empty = not loaded) |
| Admin | `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` (32+ chars); on Netlify also `NETLIFY_BLOBS_TOKEN`; optional `CONTENT_STORE` override |

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
    admin/             dashboard sidebar, editor shell and field kit
  app/admin/           dashboard routes, login, server actions
  config/              site config (public) and server-only env
  content/             products.json, collections, site media, FAQs, journal, policies
  lib/                 catalog queries, store, WhatsApp, currency, analytics, forms
scripts/               WooCommerce import, media pull, icon generation
public/media/          migrated imagery and brand films
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

Use the admin dashboard. The files in `src/content/` (and
`npm run import:catalog`) only define the initial seed: once a section has
been saved in the admin, the stored version takes precedence.

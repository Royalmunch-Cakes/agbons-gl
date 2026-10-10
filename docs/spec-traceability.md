# Spec traceability

Every item in the [site audit](../agbons-gl-site-audit-discovery.md) mapped to
where it's implemented. Status: ✅ done · ⚙️ done, needs client input (see
[decisions.md](decisions.md)).

## §1 Business & brand context

| Spec | Status | Implementation |
|---|---|---|
| Brand, tagline, founder, address, hours, contact | ✅ | `src/config/site.ts`, values from `.env` |
| WhatsApp as primary conversion channel | ✅ | `src/lib/whatsapp.ts`, `components/commerce/whatsapp-button.tsx` — used for consultation, product order, cart order and enquiries |
| WooCommerce cart as secondary channel | ✅ | Bag: `lib/store.ts`, `app/bag` (checkout via WhatsApp, D2) |
| Afro-global luxury positioning | ✅ | Brand theme in `app/globals.css`, real copy migrated |

## §2 Site map

| Spec | Status | Implementation |
|---|---|---|
| Home, About, Bridal Couture, Contact | ✅ | `app/page.tsx`, `app/about`, `app/bridal-couture`, `app/contact` |
| Six named collection pages | ✅ | One dynamic template `app/collections/[slug]` + 301s from old URLs |
| Shop archive, product pages, category archives | ✅ | `app/shop`, `app/product/[slug]` (same URLs), categories → `/collections/*` redirects |
| Wishlist `/wishsuite/` | ✅ | Native `app/wishlist` (redirect from `/wishsuite`) |
| Cart / checkout | ✅ | `app/bag` (redirects from `/cart`, `/checkout`) |
| Product categories & counts (§2.4) | ✅ | `getFacetCounts()` in `lib/catalog.ts`, shop filter counts |
| Footer pages (§2.5) | ✅ | `/lookbook`, `/journal`, `/faqs`, `/shipping`, `/returns`, `/privacy`, `/terms` |

## §3 Page-by-page components

| Page | Status | Notes |
|---|---|---|
| 3.1 Home — hero, story, 3-up CTAs, dream dress, value props, gallery + lightbox, testimonials, video, newsletter, footer | ✅ | `app/page.tsx`; adds featured products and the 4-step bespoke process |
| 3.2 About — hero, story, video, philosophy, 4 values, creative director, vision, mission, CTA, newsletter | ✅ | `app/about/page.tsx` |
| 3.3 Bridal Couture — hero, header, collection links, product grid (quick view, wishlist, add to bag, tag, title, price), CTA, value props, newsletter | ✅ | Collection links upgraded to image cards |
| 3.4 Shop — hero, filter (checkboxes + counts, search, “Show (N)”), grid, pagination (9/page) | ✅ | `app/shop`, `components/catalog/shop-filters.tsx`; GET form works without JS |
| 3.5 PDP — breadcrumb, image + lightbox, title, price, short description, stock, qty + add to cart, WhatsApp order, wishlist, SKU + tags, description tab, related (3) | ✅ | Adds multi-image gallery, Size & fit / Materials & care / Delivery tabs, Product JSON-LD |
| 3.6 Contact — intro + 2 CTAs, 4-image strip, details, hours, appointment notice, map, newsletter | ✅ | Adds a real contact form and weekend hours |
| 3.7 Footer — logo, tagline, consultation CTA, Explore, Customer Care, Connect, socials, copyright | ✅ | `components/site/footer.tsx`; Explore + Customer Care side by side on mobile |

## §4 Data model

| Spec | Status | Implementation |
|---|---|---|
| Product (name, SKU, USD price, image, description, stock, categories) | ✅ | `lib/types.ts` `Product`; 42 products migrated (`src/content/products.json`) |
| Two-axis taxonomy | ✅ | `ProductLine` × `Collection` (signature / season) |
| No variants; bespoke intake | ⚙️ | `madeToOrder` flag + consultation flow (D3) |

## §5 Issues fixed

| # | Issue | Fix |
|---|---|---|
| 5.1 | Header rendered 3× with 3 hidden modal triggers | Single `Header` in the root layout, no modals |
| 5.2 | “Shop Collections” parent linked to `#` | `/collections` landing page |
| 5.3 | Footer placeholder links; no legal pages | All seven pages built; crawl of 82 URLs finds no broken links and no `href="#"` |
| 5.4 | Dead/generic social links | Profile URLs from env; icons hidden when unset ⚙️ |
| 5.5 | Lorem-ipsum reviews on `/shop` | Not migrated; only the 3 real testimonials are used |
| 5.6 | Unconfigured Instagram embed | Not migrated |
| 5.7 | “Registration is currently disabled” notice | Gone (no plugin notices) |
| 5.8 | Newsletter: no success state, unknown backend | Server action, Mailchimp/log backend, visible success state |
| 5.9 | No contact form | Contact form + consultation intake with email/webhook delivery |
| 5.10 | Unevenly populated collections | Collection pages carry editorial stories and a commission CTA; empty-state when a collection has no products |
| 5.11 | No size/variant selection | Bespoke intake with measurements (D3) ⚙️ |
| 5.12 | Ambiguous dual checkout | Two explicit, labelled paths on every product; bag checks out via WhatsApp (D2) ⚙️ |
| 5.13 | USD pricing for an NGN market | USD/NGN display toggle (D4) ⚙️ |
| 5.14 | Page-builder technical debt | Custom Next.js build; static prerendering for all catalog pages |

## §6 Content migration

| Content | Status | Notes |
|---|---|---|
| 4 static pages | ✅ | Copy migrated verbatim where available |
| 42 products + images | ✅ | `scripts/import-woocommerce.mjs` (60 images) |
| 9 categories | ✅ | Mapped to 8 collections + Bridal Couture line |
| Testimonials (3 real) | ✅ | `src/content/site.ts` |
| Gallery (~14 + 4) | ✅ | `scripts/pull-site-media.mjs` |
| 2 videos | ✅ | Pulled to `public/media/video/` (gitignored); poster fallback |
| Legal/policy pages | ⚙️ | Drafts pending legal review |
| Blog/press | ✅ | Journal with 4 seed posts from published press facts |

## §7 PRD inputs

| Goal | Status | Where |
|---|---|---|
| Conversion model | ⚙️ | D2 |
| Bespoke intake | ✅ | `/consultation` |
| Currency strategy | ⚙️ | D4 |
| Unbuilt content pages | ✅ | §2.5 above |
| CMS / editorial workflow | ✅ | Custom admin dashboard at `/admin`: products, collections, homepage, gallery, testimonials, FAQs, journal, policies, settings; live on save (D1) |
| Legal pages | ⚙️ | Drafts |
| Real reviews | ✅ | Real testimonials only |
| Newsletter target | ⚙️ | Mailchimp (D5) |
| Suggested IA | ✅ | All routes in the README |

## §8 TRD inputs

| Requirement | Status | Implementation |
|---|---|---|
| Stack decision | ✅ | Next.js 16 on Netlify + admin on Netlify Blobs (D1) |
| Product/collection schema | ✅ | `lib/types.ts` |
| Media pipeline | ✅ | `next/image` responsive sizes served as WebP; migration scripts |
| WhatsApp as a first-class component | ✅ | `WhatsAppButton` + generated messages |
| Forms: newsletter, contact, consultation | ✅ | `app/actions/forms.ts`, zod schemas, character rules, custom date picker |
| Accounts | ⚙️ | Out of scope (D7) |
| Performance | ✅ | Static/partial prerendering, no page builder, fonts via `next/font` |
| Analytics | ✅ | GA4 + Meta Pixel opt-in by env (D8) |
| SEO parity (meta, OG, Twitter, canonical) | ✅ | Per-page metadata, sitemap, robots, ClothingStore/Product/FAQ JSON-LD, OG image |
| Favicon | ✅ | `src/app/icon.png`, `apple-icon.png`, `favicon.ico` |
| Content migration plan | ✅ | Scripts + legacy 301 redirects in `next.config.ts` |

## Admin dashboard (post-audit request)

| Capability | Implementation |
|---|---|
| Login | `app/admin/login`, `lib/admin-session.ts` (HMAC cookie), `proxy.ts`, `requireAdmin()` in every action |
| Content store | `lib/server/blob-store.ts` (Netlify Blobs / local `.data`), `lib/content.ts` (tagged cached reads, seeds) |
| Editors | `app/admin/(dashboard)/*` with the shared kit in `components/admin/` |
| Validation | `lib/admin/schemas.ts` (zod), friendly messages |
| Images | Upload to the media store (`uploadImage`), served by `/media-store/[...key]` |
| Freshness | `updateTag` + `revalidatePath` on save; store re-check for new slugs |
| Backup | `/api/admin/export` (dashboard button) |

## Verification

- `npm run build` prerenders all routes; `tsc` and ESLint clean.
- Browser tests (Playwright driving Edge at 390×844) covered: no horizontal
  overflow on 11 key pages; mobile menu; newsletter, contact and
  consultation validation and success; character filtering; date picker;
  WhatsApp hand-off; add to bag; shop filter drawer; footer layout;
  scroll-to-top. No failed requests.

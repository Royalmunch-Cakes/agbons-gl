# AGBONS-GL — Website Audit & Discovery Document
### Findings to inform PRD & TRD for Custom-Build Redevelopment

**Source reviewed:** https://agbons-gl.com/
**Audit date:** September 1, 2026
**Current stack (detected):** WordPress + WooCommerce, built with Elementor 4.2.4 (page builder) and the Ekit/Element Kit plugin (modals). Hosted content under `/wp-content/uploads/`.

---

## 1. Business & Brand Context

| Item | Detail |
|---|---|
| Brand name | AGBONS-GL NIG. LTD |
| Tagline | "Luxury. Confidence. Couture." |
| Founder / Creative Director | Gloria Ehizuelen |
| Location | 169 Murtala Mohammed Way, Avbiama, Benin City, Edo State, Nigeria |
| Business type | Bespoke bridal couture + ready-to-wear luxury fashion house |
| Positioning | Afro-global luxury — African craftsmanship/heritage merged with international couture standards |
| Primary conversion channel | **WhatsApp** (`wa.me/2347056814352`) — used for consultations, bridal appointments, and "Complete Order via WhatsApp" on every product |
| Secondary channel | WooCommerce cart (add-to-cart present, but checkout appears secondary to WhatsApp ordering) |
| Office hours | Mon–Fri, 09:00–17:00, "strictly by appointment" |
| Contact | info@agbons-gl.com · +234 705 681 4352 · Instagram/Facebook/TikTok @agbonsgl |

**Key business insight for PRD:** This is a **hybrid catalog-to-conversation commerce model** — the site functions primarily as a lookbook/catalog that funnels every serious inquiry to WhatsApp, with WooCommerce as a secondary/parallel cart. Any redevelopment must decide whether to formalize full e-commerce checkout or keep WhatsApp as the primary conversion path (this is a critical open question for the PRD).

---

## 2. Full Site Map / Page Inventory

### 2.1 Primary Navigation (global header, repeated in a modal 3x — see Section 5 bugs)
- Home (`/`)
- About (`/about/`)
- Bridal Couture (`/bridal-couture/`)
- Shop Collections (dropdown, no landing page of its own — `#`)
  - Haute Couture Collection (`/haute-collection/`)
  - Queen Idia Collection (`/queen-idia-collection/`)
  - Crystal Drop Collection (`/crystal-drop-collection/`)
  - Ice & Crystal Collection (`/ice-crystal-collection/`)
  - Royal Ancestors Collection (`/royal-ancestors-collection/`)
  - Stone, Petal & Sparkle Collection (`/stone-petal-sparkle-collection/`)
- Contact (`/contact/`)
- Cart icon (`$0.00 · 0 items`)

### 2.2 Commerce / Catalog Pages
- `/shop/` — Main WooCommerce shop archive (42 products, paginated, filterable by category)
- `/product/{slug}/` — Individual product detail pages (confirmed pattern via "Onyx Frost Tailored Dress")
- `/product-category/{category}/` — Category archive pages (e.g., `/product-category/bridal-couture/2024-collections/`)
- `/wishsuite/` — Wishlist page (WooCommerce Wishlist plugin)
- Cart / Checkout pages (standard WooCommerce, not directly crawled but implied by cart widget and add-to-cart links)

### 2.3 Content Pages
- `/` — Homepage
- `/about/` — Brand story, philosophy, founder bio, vision/mission
- `/bridal-couture/` — Bridal collection landing/product grid + booking CTA
- `/contact/` — Contact form, hours, map, social links

### 2.4 Product Categories Identified (from shop filters)
| Category | Product count (at audit time) |
|---|---|
| Bridal Couture | 36 |
| 2024 Collections | 20 |
| 2023 Collections | 16 |
| Royal Ancestors | 1 |
| Crystal Drop Collection | 1 |
| Ice and Crystals | 1 |
| Stone, Petal, & Sparkle | 1 |
| Haute Couture Collections | 1 |
| Queen Idia Collection | 1 |

**Note:** Total catalog = 42 products. Most named "collections" in the nav currently contain only 1 product each — likely placeholder/aspirational categories rather than fully populated collections. This is important scope context for the PRD (content population effort).

### 2.5 Footer-Linked Pages (many are placeholders / dead links — see Section 5)
- LookBook/Gallery — **`#` placeholder, not built**
- Blog & Press — **`#` placeholder, not built**
- FAQs — **`#` placeholder, not built**
- Shipping & Delivery — **`#` placeholder, not built**
- Returns & Exchange — **`#` placeholder, not built**
- Privacy Policy — **`#` placeholder, not built**
- Terms & Conditions — **`#` placeholder, not built**
- Instagram / Facebook / X (footer social icons) — **`#` placeholder, not linked** (contact page has real links to facebook.com/instagram.com/tiktok.com as generic homepages, not brand profiles)

---

## 3. Page-by-Page Content & Component Breakdown

### 3.1 Homepage (`/`)
1. Header with logo, nav, cart icon, 3× duplicate popup-modal triggers (likely newsletter/promo modals — see bugs)
2. Hero banner: "Bespoke Bridal Couture / Crafted for Your Moment" + WhatsApp CTA ("Book A Bridal Consultation")
3. "Our Story, Our Craft" — brand narrative block with founder name, image, "Read About Us" link
4. 3-column feature/CTA strip: Signature Bridal 2025 / Book a Bridal Consultation / Bridal Collections (each with its own CTA link)
5. "Your Dream Dress Begins Here" — bespoke process narrative + image + WhatsApp CTA
6. 3-column value props: Exquisite Craftsmanship / Proudly African / Personalized Experience (icon + image + short copy each)
7. Couture Gallery — masonry/lightbox image grid (~14 images, click-to-enlarge)
8. Testimonials carousel — 3 written reviews with client name/location
9. Embedded video (MP4, autoplay/loop likely — brand film)
10. Newsletter signup form (email field + Subscribe) — **note: "Registration is currently disabled" message appears near this block, suggesting a broken/disabled plugin feature**
11. Footer (see 3.6)

### 3.2 About Page (`/about/`)
1. Header (same as all pages)
2. Hero image banner + "A Legacy of Elegance, Crafted in Nigeria"
3. "Our Story" narrative (founder, studio location, brand values)
4. Embedded brand video
5. "Our Philosophy" statement
6. 4-column value props: Quality Craftsmanship / Bespoke Experience / Globally Inspired / Sustainable Elegance
7. "Meet the Creative Director" — bio + portrait image
8. "Our Vision" statement
9. "Our Mission" statement
10. CTA band: "Ready to experience luxury..." + WhatsApp booking CTA
11. Newsletter signup
12. Footer

### 3.3 Bridal Couture Page (`/bridal-couture/`)
1. Header
2. Hero: "Where Every Stitch Whispers Elegance" + descriptive image
3. "For the woman who deserves a masterpiece" section header
4. Collection quick-links (6 collection links, text list)
5. Product grid (6 featured products shown) — each card: image, quick view, wishlist icon, add-to-cart, category tag, title, price
6. CTA band: "Don't know where to begin?" + WhatsApp booking
7. 3-column value props (repeated from homepage)
8. Newsletter signup
9. Footer

### 3.4 Shop Page (`/shop/`)
1. Header
2. Hero copy: "Discover Timeless Elegance — Every Piece, A Statement"
3. **Filter sidebar/drawer**: category checkboxes with counts, search box, "Show (N)" apply button
4. Product grid: image, add-to-cart, title (linked), price, category tag — paginated (5 pages for 42 products, so ~9/page)
5. Pagination controls
6. Instagram feed embed placeholder ("gallery to showcase recent social posts" — appears unconfigured)
7. Customer reviews section — **contains Lorem-ipsum-style placeholder review text ("A review from a customer who benefited from your product...")** — not real content
8. Newsletter signup
9. Footer

### 3.5 Product Detail Page (`/product/{slug}/`) — pattern confirmed via Onyx Frost Tailored Dress
1. Header
2. Breadcrumb: Home / Bridal Couture / {Category} / {Product Name}
3. Product image (single, click to view full-size lightbox)
4. Product title, price
5. Short description
6. Stock indicator ("1 in stock")
7. Quantity selector + "Add to cart" (WooCommerce native)
8. **"Complete Order Via WhatsApp"** — pre-filled WhatsApp deep link with product name, price, and URL (custom integration)
9. Wishlist link
10. SKU + category tags
11. Description tab (expandable, currently only one tab — no size guide, materials, or care instructions tabs present)
12. Related products (3 shown, WooCommerce cross-sell/related logic)
13. Footer

### 3.6 Contact Page (`/contact/`)
1. Header
2. "We'd Love to Hear From You" intro + two CTA buttons: "Make an Order" (→ shop) / "Book a Consultation" (→ WhatsApp)
3. 4-image gallery strip
4. "Let's Talk" contact details: phone (tel: link), email (mailto: link), social handles (text only, generic links)
5. Office hours table (Mon–Fri only — no weekend hours shown)
6. "Office Visits are Strictly by Appointment" notice
7. Embedded Google Map (static/embed, address-based)
8. Newsletter signup
9. Footer
10. **No visible contact form** — despite meta description implying an inquiry form, the crawled page shows only CTA buttons and static contact info, no form fields captured

### 3.7 Global Footer (present on every page)
- Logo + brand tagline
- "Book a consultation" CTA (WhatsApp)
- "EXPLORE" link column (Home, About, Shop Bridal Couture, LookBook/Gallery*, Blog & Press*, Contact)
- "CUSTOMER CARE" link column (Book Appointment, FAQs*, Shipping & Delivery*, Returns & Exchange*, Privacy Policy*, Terms & Conditions*)
- "Connect with Us": address (Google Maps deep link), email, phone
- Social icons (Instagram, Facebook, X — all placeholder `#` links)
- Copyright line: "© 2026 All Rights Reserved"

**\*starred items = unbuilt placeholder pages**

---

## 4. E-commerce Data Model (inferred from WooCommerce markup)

| Entity | Observed fields |
|---|---|
| Product | Name, SKU (e.g., `AGB-CDC-033`), price (USD), single featured image, description (single block, no rich variants), stock quantity/status, category/collection tag(s) |
| Category/Collection | Name, slug, product count, parent grouping (e.g., "Bridal Couture" > "2024 Collections") — appears to be a **two-axis taxonomy**: garment type/collection line (Bridal Couture) crossed with year/named collection (2024 Collections, Queen Idia Collection, etc.) |
| Cart | Standard WooCommerce cart, USD currency, $0.00 default |
| Checkout | Not directly observed — WooCommerce default assumed; WhatsApp is the de facto checkout for most flows |
| Wishlist | Separate `/wishsuite/` page — third-party WooCommerce wishlist plugin |

**No variants observed:** no size, color, or fabric selectors on the product page — each product is a single fixed SKU. For couture/bespoke goods this may be intentional (each dress is unique/made-to-order), but this is a key clarifying question for the PRD (does the new build need size/measurement intake at product or order level?).

---

## 5. Technical & UX Issues Found (candidates for redevelopment scope)

1. **Header renders 3 times with 3 separate hidden modal triggers** (`#ekit_modal-popup-302472d1`, `-3c2ea68`, `-7687d25`) on every single page — strongly suggests a broken/duplicated Elementor template or unintentional popup stacking. Needs investigation; likely a bug to eliminate in rebuild.
2. **"Shop Collections" nav item has no landing page** — dropdown parent link is `#` (dead), only children are real pages.
3. **Six footer links are placeholders** (`#`): LookBook/Gallery, Blog & Press, FAQs, Shipping & Delivery, Returns & Exchange, Privacy Policy, Terms & Conditions. None are built. Legal pages (Privacy/Terms) missing is a compliance gap, especially if checkout/payment is to be formalized.
4. **Footer social icons (Instagram/Facebook/X) are dead `#` links**, while the Contact page links to generic homepages (facebook.com, instagram.com, tiktok.com) rather than the brand's actual profiles.
5. **Placeholder/Lorem-ipsum review content** live on the `/shop/` page ("A review from a customer who benefited from your product...", "Customer Name").
6. **Instagram feed embed on `/shop/` is unconfigured** ("This is a gallery to showcase images from your recent social posts").
7. **"Registration is currently disabled" message** appears mid-page on the homepage near the newsletter block — looks like a stray plugin notice leaking into production markup (WooCommerce or membership plugin), should not be customer-facing.
8. **Newsletter form has no visible confirmation/success state** captured, and its backend integration (Mailchimp? WP native?) is unknown — needs discovery with the client.
9. **No visible dedicated contact form** despite it being implied by meta descriptions — current contact page relies solely on WhatsApp/tel/mailto CTAs.
10. **Collections are unevenly populated** — 5 of 9 filterable categories have exactly 1 product, suggesting incomplete catalog buildout or aspirational IA that outpaced content.
11. **No size/fit/variant selection on product pages** — unclear if intentional (bespoke/made-to-order) or a missing feature.
12. **Dual checkout paths (WooCommerce cart vs. WhatsApp)** create ambiguous purchase flow — needs a definitive decision in the PRD.
13. **Pricing shown in USD** for a Nigeria-based/Naira-market business — worth confirming currency strategy (USD for international clientele vs. local NGN pricing) with stakeholders.
14. **Elementor + Ekit plugin stack** = page-builder technical debt (slower load, plugin lock-in) — a natural motivator for the custom-build migration, but all current visual patterns should be captured before cutover (this document + visual screenshots should accompany the TRD).

---

## 6. Content Inventory Summary (for migration planning)

| Content type | Volume | Notes |
|---|---|---|
| Static pages | 4 (Home, About, Bridal Couture, Contact) | Fully copy-written, ready to migrate/rewrite |
| Products | 42 | Each has: 1 image, name, price, SKU, short description, category |
| Product categories | 9 | Uneven population (see Section 4) |
| Testimonials | 3 (homepage) + 2 placeholder (shop page) | Only homepage testimonials are real content |
| Gallery images | ~14 (homepage) + 4 (contact page) | Reused across pages; likely a shared media library |
| Video assets | 2 confirmed (.mp4) — homepage brand film, About page story video | Self-hosted MP4, not YouTube/Vimeo embedded |
| Legal/policy content | 0 of 4 required pages exist | Privacy Policy, Terms, Shipping, Returns all need to be authored |
| Blog/Press content | 0 | Nav item exists, no content or CMS structure yet |

---

## 7. Inputs for PRD (Product Requirements Document)

Use this section as the seed outline for the PRD's "current state" and "goals" sections.

**Goals to define with stakeholder:**
- Primary conversion model: formalize WooCommerce-style checkout, keep WhatsApp-first, or support both explicitly by design (e.g., "Buy Now" vs "Enquire via WhatsApp" as parallel, clearly labeled paths)
- Whether bespoke/made-to-order intake (measurements, fabric choice, timeline) needs a structured form/flow, replacing ad hoc WhatsApp conversations
- Currency and market strategy (USD vs. NGN, international shipping)
- Content strategy for unbuilt pages (Blog & Press, LookBook/Gallery as a distinct experience from the homepage gallery, FAQs)
- CMS/editorial workflow for the founder/team to add new collections, products, testimonials without developer involvement
- Legal/compliance pages (Privacy Policy, Terms, Returns & Shipping) — required before any real payment processing
- Social proof strategy: replace placeholder reviews with real, verified review collection mechanism
- Newsletter/CRM integration target (Mailchimp, Klaviyo, or custom)

**Suggested IA for redevelopment (candidate site map):**
- Home
- About / Our Story
- Collections (parent landing page — fixing the current dead-end nav item)
  - Individual collection pages (dynamic, CMS-driven instead of one-off Elementor pages)
- Shop / Catalog (with working filters, real variant/bespoke intake where applicable)
- Product Detail Page
- Bridal / Bespoke Consultation flow (structured intake, not just a WhatsApp link)
- Lookbook / Gallery (distinct from homepage teaser)
- Blog & Press
- Contact (with real form + map + hours)
- FAQs
- Shipping & Delivery
- Returns & Exchange
- Privacy Policy
- Terms & Conditions
- Cart / Checkout / Wishlist / Account (if formal e-commerce retained)

---

## 8. Inputs for TRD (Technical Requirements Document)

**Current architecture to replace:**
- CMS/Framework: WordPress (self-hosted, `/wp-content/uploads/` media paths)
- Page builder: Elementor 4.2.4 + Ekit Elements plugin (accounts for the duplicated-modal bug and heavy DOM)
- Commerce: WooCommerce (products, categories, cart, wishlist via a separate wishlist plugin)
- Media: Self-hosted images (WebP + JPG mixed) and self-hosted MP4 video, multiple responsive image sizes generated (e.g., `-300x300`, `-650x650`, `-768x954` suffixes indicate WordPress's automatic image-size generation)
- Fonts: Google Fonts, enabled with `font-display: swap`
- SEO: Meta tags present (OG, Twitter Card, canonical) — likely Yoast SEO or RankMath, should be replicated in new build

**Recommended discovery/spec items for the TRD:**
- Target stack decision (headless CMS + custom frontend, e.g., Next.js/Sanity or similar, vs. another WordPress rebuild without page-builder bloat)
- Product/collection data model: formalize the two-axis taxonomy (garment line × named/year collection) as first-class schema, including whether SKUs, stock, and pricing need multi-currency support
- Media pipeline: automated responsive image generation/CDN delivery to replace WordPress's default behavior
- WhatsApp integration: replicate the "Complete Order via WhatsApp" deep-link pattern (pre-filled message with product name/price/URL) as a first-class component, not a manual link per product
- Forms: newsletter signup (target ESP integration), contact form (currently absent — needs a real endpoint), bespoke consultation intake form (new)
- Auth/account requirements: determine if customer accounts (order history, saved measurements, wishlist persistence) are in scope
- Performance targets: current Elementor-based site likely has heavy JS/CSS payload from multiple plugins — set explicit Core Web Vitals / Lighthouse targets for the rebuild
- Analytics/tracking: no analytics tags were detected in the crawled markup — define GA4/Meta Pixel/WhatsApp click-tracking requirements
- Hosting/infra: define target hosting (current appears to be standard WP hosting), CDN, SSL, backup/versioning strategy
- Content migration plan: 42 products, 4 core pages, ~18 images, 2 videos, 3 testimonials to migrate; 7 pages to be authored fresh (legal + blog + FAQ + gallery)

---

## 9. Assumptions & Gaps (things this audit could not confirm)

- Could not access cart/checkout page content directly (no items were added to cart during this read-only crawl) — checkout flow, payment gateway, and shipping calculation logic are unconfirmed and need direct client access or a live test transaction to document.
- Could not confirm mobile-specific layout/behavior (crawl was content/DOM-based, not visual/responsive rendering).
- Could not confirm whether the contact page has a hidden/JS-rendered form not captured in the fetched HTML — recommend a live browser check before finalizing TRD.
- Newsletter and review-plugin backends are unidentified — need admin access or client input.
- Actual social media profile URLs are unconfirmed (site links to generic platform homepages).

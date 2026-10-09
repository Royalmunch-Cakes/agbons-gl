# Deploying to Netlify

The site deploys to Netlify from the GitHub repository. Netlify's OpenNext
adapter is applied automatically and supports everything this app uses:
Cache Components, Server Actions (forms), `next/image` (served through
Netlify Image CDN), the redirects in `next.config.ts`, and Netlify Blobs
(admin content store).

DNS stays at **Namecheap**; only the website records change. Email
(info@agbons-gl.com) keeps running on the Namecheap hosting account.

## 1. Create the site

1. Netlify → **Add new project → Import from Git** → choose the repository.
2. Build settings are read from `netlify.toml` (`npm run build`, Node 22).
3. Add the environment variables below, then deploy.
4. Check the `*.netlify.app` URL end to end before touching DNS.

## 2. Environment variables

Set these in **Site configuration → Environment variables** (see
`.env.example` for descriptions). `NEXT_PUBLIC_*` values are baked in at
build time; trigger a new deploy after changing them.

| Variable | Production value |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://agbons-gl.com` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `2347056814352` |
| `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_CONTACT_PHONE` | as today |
| `NEXT_PUBLIC_INSTAGRAM_URL`, `…_FACEBOOK_URL`, `…_TIKTOK_URL` | confirmed profile URLs |
| `NEXT_PUBLIC_USD_TO_NGN_RATE` | current rate |
| `RESEND_API_KEY`, `FORMS_NOTIFY_EMAIL`, `FORMS_FROM_EMAIL` and/or `FORMS_WEBHOOK_URL` | **required** — without them form submissions are only logged |
| `NEWSLETTER_PROVIDER=mailchimp` + `MAILCHIMP_*` | **required** to collect sign-ups |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_META_PIXEL_ID` | optional |
| `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` | **required** for the admin dashboard (see README) |

## 3. Before switching DNS

- [ ] Export WooCommerce orders and customers, and the newsletter list
      (import subscribers into Mailchimp).
- [ ] Set up Resend (add its DNS records at Namecheap) or a form webhook,
      and submit a test enquiry from the Netlify URL.
- [ ] Finalise the policy pages (set `reviewed: true`).
- [ ] **Fix SPF** (see below) — do this *before* the A record changes.

## 4. DNS changes at Namecheap

Today the website and mail server share one IP (`66.29.132.122`). Change
**only** these records:

| Host | Type | Old value | New value |
|---|---|---|---|
| `@` | A | `66.29.132.122` | `75.2.60.5` (Netlify load balancer — confirm in Netlify's domain panel) |
| `www` | CNAME | `agbons-gl.com` | `<your-site>.netlify.app` |
| `@` | TXT (SPF) | `v=spf1 +a +mx +ip4:66.29.132.112 +ip4:162.0.232.66 include:spf.web-hosting.com ~all` | `v=spf1 +mx +ip4:66.29.132.122 +ip4:66.29.132.112 +ip4:162.0.232.66 include:spf.web-hosting.com ~all` |

**Why the SPF change matters:** `+a` authorises "whatever server the website
points at" to send mail. After the A record moves to Netlify, the mail
server (`66.29.132.122`) would no longer be covered and mail from
info@agbons-gl.com could start landing in spam. The new record lists it
explicitly and drops `+a`. If you send through Resend, add its `include:`
as instructed by Resend.

**Leave unchanged** (email and verification depend on them):

| Host | Type | Value |
|---|---|---|
| `@` | MX | `mx1/mx2/mx3-hosting.jellyfish.systems` |
| `mail`, `webmail`, `autodiscover`, `autoconfig` | A | `66.29.132.122` |
| `_autodiscover._tcp` | SRV | `0 0 443 cpanelemaildiscovery.cpanel.net` |
| `default._domainkey` | TXT | DKIM key |
| `_dmarc` | TXT | `v=DMARC1; p=none;` |
| `@` | TXT | `google-site-verification=…` (Search Console) |

Then in Netlify: **Domain management → Add domain** `agbons-gl.com`, set it
as primary, and let Netlify provision the Let's Encrypt certificate (this
also fixes the old site's untrusted certificate).

## 5. After cutover

- [ ] Submit `https://agbons-gl.com/sitemap.xml` in Google Search Console.
- [ ] Spot-check old URLs (e.g. `/haute-collection/`, `/wishsuite/`,
      `/product-category/bridal-couture/2024-collections/`) redirect.
- [ ] Send a test email from info@agbons-gl.com to Gmail and confirm SPF
      passes ("Show original").
- [ ] **Do not cancel the Namecheap hosting plan** while email runs on it.
      If you want to retire it, move email (e.g. Google Workspace) first.

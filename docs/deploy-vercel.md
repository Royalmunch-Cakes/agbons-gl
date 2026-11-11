# Deploying to Vercel

The app runs on Vercel unchanged; admin content and uploads use **Vercel
Blob** automatically when deployed there (`src/lib/server/blob-store.ts`
picks the backend from the platform — Netlify Blobs on Netlify, local files
in development). DNS stays at **Namecheap**; email keeps running there.

## 1. Create the project

1. Vercel → **Add New → Project** → import the GitHub repository.
   Framework preset: Next.js (detected). No `vercel.json` is needed.
2. **Settings → Functions:** keep **Fluid compute** on (default). Set the
   **function region** close to your Blob store and visitors — for a
   Nigeria-based audience, London (`lhr1`) is a good default.

## 2. Connect a Blob store (admin content + uploads)

1. Project → **Storage → Create → Blob**, access **Private**, same region
   as the functions.
2. **Connect** it to the project for Production, Preview and Development.
   Vercel then injects the credentials (`BLOB_STORE_ID` + OIDC, or
   `BLOB_READ_WRITE_TOKEN`) into builds and functions — no manual token step
   (unlike Netlify's `NETLIFY_BLOBS_TOKEN`).

If the store isn't connected, admin saves fail with a message saying so.

**Local development is never connected to this store.** Even after
`vercel env pull`, `npm run dev` uses the local `.data/` folder. To test
against the real store deliberately, set `CONTENT_STORE=vercel` (this writes
to live content).

## 3. Environment variables

**Settings → Environment Variables** (see `.env.example`). `NEXT_PUBLIC_*`
values are baked in at build time — redeploy after changing them.

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://agbons-gl.com` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_CONTACT_PHONE` | as today (admin Settings can override contact details) |
| `NEXT_PUBLIC_INSTAGRAM_URL`, `…_FACEBOOK_URL`, `…_TIKTOK_URL` | profile URLs |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | `G-YBQZ4PY08E` |
| `RESEND_API_KEY`, `FORMS_NOTIFY_EMAIL`, `FORMS_FROM_EMAIL` and/or `FORMS_WEBHOOK_URL` | **required** for form delivery |
| `NEWSLETTER_PROVIDER=mailchimp` + `MAILCHIMP_*` | **required** to collect sign-ups |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_FOLDER` | **required** — site media is served from Cloudinary and admin uploads go there (key needs upload permission) |
| `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` | **required** for `/admin` |

`NETLIFY_BLOBS_TOKEN` is not used on Vercel.

## 4. Rate limiting (Firewall)

Rate-limited requests are blocked at Vercel's edge, before any function
runs — no Active CPU is used. Add this in **Firewall → Configure → New Rule**:

| Field | Value |
|---|---|
| Name | Throttle form posts |
| If | **Request Method** equals `POST` **and** **Request Path** does not start with `/admin/` |
| Then | **Rate Limit** — Fixed window, **10 requests / 60 s**, key **IP**, action **Default (429)** |

This covers the contact, consultation and newsletter forms (they post to
the page they're on). Hobby allows one rate-limit rule; on Pro also add:

| Name | If | Limit |
|---|---|---|
| Throttle admin sign-in | Method `POST` and Path equals `/admin/login` | 10 / 600 s per IP |
| Cap scrapers | Path does not start with `/_next/` | 300 / 60 s per IP |

Publish the changes (no redeploy needed). Start with action **Log** if you
want to watch traffic first. The app also has its own limiter
(`src/lib/server/rate-limit.ts`: 5 valid form submissions per 10 minutes,
10 sign-in attempts per 15 minutes per IP) as a second layer.

In an attack, **Firewall → Attack Challenge Mode** challenges all visitors
until it's switched off.

## 5. What keeps Active CPU (and bills) low

- Pages are prerendered and cached (`cacheComponents`, `cacheLife("max")`);
  functions run only after an admin save (one re-render per page) or for
  the first visit to a new URL.
- Storefront pages never read storage on a request — only cached data.
- All images and videos are delivered by Cloudinary (resizing, AVIF/WebP)
  through a custom `next/image` loader, so Vercel never optimizes images.
  Old `/media/...` URLs redirect to Cloudinary.
- Admin uploads are resized in the browser, then sent to Cloudinary.
- Rate limits stop form spam before it reaches functions, Resend or
  Mailchimp (whose APIs are themselves rate-limited).

## 6. DNS at Namecheap

Use the exact values Vercel shows under **Settings → Domains** after adding
`agbons-gl.com` and `www.agbons-gl.com` (typically an `A` record for `@`
and a `CNAME` for `www` pointing at Vercel).

**Fix SPF first** — same as the Netlify guide: today's record relies on
`+a`, which stops covering the mail server (`66.29.132.122`) once the A
record points at Vercel:

```
v=spf1 +mx +ip4:66.29.132.122 +ip4:66.29.132.112 +ip4:162.0.232.66 include:spf.web-hosting.com ~all
```

Leave MX, `mail`/`webmail`/`autodiscover`, DKIM, DMARC and the Google
verification TXT records unchanged, and keep the Namecheap hosting plan while
email runs on it. Vercel issues the SSL certificate automatically.

## 7. After deploy

- [ ] Sign in to `/admin`, save Settings once, upload a test image.
- [ ] Submit the contact form; confirm the email/webhook arrives.
- [ ] Submit `https://agbons-gl.com/sitemap.xml` in Search Console.
- [ ] Check the Firewall overview shows the rule matching POSTs.

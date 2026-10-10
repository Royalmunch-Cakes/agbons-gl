import { z } from "zod";

import type { ContentKey } from "@/lib/content";

/**
 * Server-side validation for every admin-editable document. The editors
 * send whole documents; nothing is stored unless it parses here.
 */

const text = (max = 2000) => z.string().trim().max(max);
const required = (label: string, max = 200) =>
  z.string().trim().min(1, `${label} is required.`).max(max);
const slug = z
  .string()
  .trim()
  .min(1, "Slug is required.")
  .max(100)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use lowercase letters, numbers and hyphens only.",
  );
const href = z
  .string()
  .trim()
  .max(500)
  .refine(
    (v) => v === "" || v.startsWith("/") || /^https?:\/\//.test(v),
    "Use a /path or full https:// URL.",
  );
const url = z
  .string()
  .trim()
  .max(500)
  .refine(
    (v) => v === "" || /^https:\/\//.test(v),
    "Use a full https:// URL, or leave empty.",
  );

export const mediaSchema = z.object({
  src: z
    .string()
    .trim()
    .max(500)
    .refine(
      (v) => v === "" || v.startsWith("/"),
      "Images must be uploaded to the site.",
    )
    .optional(),
  alt: text(300),
});

const story = z.array(
  z.object({
    heading: required("Heading"),
    paragraphs: z.array(text(5000)).max(20),
  }),
);

export const productSchema = z.object({
  slug,
  sku: required("SKU", 60),
  name: required("Name"),
  line: required("Line", 60),
  collections: z.array(z.string()).max(20),
  priceUsd: z.number().min(0, "Price can't be negative.").max(1_000_000),
  images: z.array(mediaSchema).max(20),
  shortDescription: text(600),
  description: text(8000),
  details: z.object({
    fabric: text(200).optional(),
    silhouette: text(200).optional(),
    embellishment: text(200).optional(),
    care: text(1000).optional(),
    leadTime: text(100).optional(),
  }),
  inStock: z.boolean(),
  stockQuantity: z.number().int().min(0).max(10_000).optional(),
  madeToOrder: z.boolean(),
  featured: z.boolean().optional(),
  sortOrder: z.number(),
  sourceUrl: z.string().optional(),
});

export const collectionSchema = z.object({
  slug,
  name: required("Name"),
  kind: z.enum(["signature", "season"]),
  code: required("Code", 12),
  year: z.number().int().min(1990).max(2100).optional(),
  tagline: text(300),
  description: text(2000),
  hero: mediaSchema,
  story: story.optional(),
  fromPriceUsd: z.number().min(0).max(1_000_000).optional(),
  legacyPath: z.string().optional(),
});

export const settingsSchema = z.object({
  announcement: text(200),
  contact: z.object({
    email: z.email("Enter a valid email."),
    phone: required("Phone", 40),
    whatsapp: z
      .string()
      .trim()
      .regex(
        /^\d{8,15}$/,
        "WhatsApp number: digits only in international format, e.g. 2347056814352.",
      ),
  }),
  socials: z.object({ instagram: url, facebook: url, tiktok: url, x: url }),
  hours: z
    .array(z.object({ days: required("Days", 60), time: required("Time", 60) }))
    .max(10),
  hoursNote: text(200),
  usdToNgnRate: z
    .number()
    .positive("Rate must be greater than 0.")
    .max(1_000_000),
});

export const homeSchema = z.object({
  heroEyebrow: text(120),
  heroTitle: required("Hero title"),
  heroAccent: text(200),
  heroSubtitle: text(400),
  heroImage: mediaSchema,
  storyEyebrow: text(120),
  storyHeading: required("Story heading"),
  storyParagraphs: z.array(text(3000)).max(6),
  storyImage: mediaSchema,
  features: z
    .array(
      z.object({
        title: required("Title"),
        cta: required("Button text", 60),
        href,
        image: mediaSchema,
      }),
    )
    .max(6),
  dreamHeading: required("Heading"),
  dreamBody: text(2000),
  dreamSteps: z.array(text(300)).max(8),
  dreamImage: mediaSchema,
});

export const documentSchemas = {
  settings: settingsSchema,
  home: homeSchema,
  products: z.array(productSchema),
  collections: z.array(collectionSchema),
  gallery: z.array(mediaSchema).max(200),
  testimonials: z
    .array(
      z.object({
        quote: required("Quote", 3000),
        name: required("Name", 120),
        location: text(120),
      }),
    )
    .max(50),
  faqs: z
    .array(
      z.object({
        title: required("Group title"),
        items: z
          .array(
            z.object({
              q: required("Question", 300),
              a: required("Answer", 3000),
            }),
          )
          .max(50),
      }),
    )
    .max(20),
  journal: z
    .array(
      z.object({
        slug,
        title: required("Title"),
        kind: z.enum(["press", "story"]),
        dateLabel: text(40),
        excerpt: text(600),
        image: mediaSchema,
        body: story,
        relatedCollection: z.string().optional(),
      }),
    )
    .max(500),
  policies: z.array(
    z.object({
      slug: z.enum(["shipping", "returns", "privacy", "terms"]),
      title: required("Title"),
      summary: text(400),
      reviewed: z.boolean(),
      sections: story,
    }),
  ),
} satisfies Record<ContentKey, z.ZodType>;

/** Uniqueness checks the per-item schemas can't express. */
export function checkUnique(items: { slug: string }[], label: string) {
  const seen = new Set<string>();
  for (const i of items) {
    if (seen.has(i.slug)) return `Two ${label} share the slug “${i.slug}”.`;
    seen.add(i.slug);
  }
  return null;
}

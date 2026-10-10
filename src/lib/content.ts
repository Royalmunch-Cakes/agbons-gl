import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { siteConfig } from "@/config/site";
import { collections as seedCollections } from "@/content/collections";
import { faqGroups, type Faq } from "@/content/faqs";
import { journalPosts, type JournalPost } from "@/content/journal";
import { policies, type PolicyDoc } from "@/content/legal";
import { products as seedProducts } from "@/content/products";
import { gallery as seedGallery, pageMedia, testimonials } from "@/content/site";
import { defaultUsdToNgnRate } from "@/lib/currency";
import { blobs } from "@/lib/server/blob-store";
import type {
  Collection,
  HomeContent,
  MediaAsset,
  Product,
  SiteSettings,
  Testimonial,
} from "@/lib/types";

/**
 * Admin-editable content documents. Each is stored as one JSON document in
 * the "content" blob store; when absent, the seed (the migrated content in
 * src/content/) is used. Reads are cached with a tag per document; admin
 * saves call `updateTag(contentTag(key))` so the site updates immediately.
 */
export type ContentMap = {
  settings: SiteSettings;
  home: HomeContent;
  products: Product[];
  collections: Collection[];
  gallery: MediaAsset[];
  testimonials: Testimonial[];
  faqs: { title: string; items: Faq[] }[];
  journal: JournalPost[];
  policies: PolicyDoc[];
};

export type ContentKey = keyof ContentMap;

const seeds: { [K in ContentKey]: () => ContentMap[K] } = {
  settings: () => ({
    announcement: "Bespoke bridal consultations — strictly by appointment",
    contact: {
      email: siteConfig.contact.email,
      phone: siteConfig.contact.phone,
      whatsapp: siteConfig.contact.whatsapp,
    },
    socials: {
      instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "",
      facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "",
      tiktok: process.env.NEXT_PUBLIC_TIKTOK_URL || "",
      x: process.env.NEXT_PUBLIC_X_URL || "",
    },
    hours: siteConfig.hours.map((h) => ({ ...h })),
    hoursNote: siteConfig.hoursNote,
    usdToNgnRate: defaultUsdToNgnRate,
  }),
  home: () => ({
    heroEyebrow: siteConfig.tagline,
    heroTitle: "Bespoke Bridal Couture",
    heroAccent: "Crafted for Your Moment",
    heroSubtitle:
      "Luxury, hand-finished gowns and couture pieces — made in Nigeria, designed for the world.",
    heroImage: pageMedia.homeHero,
    storyEyebrow: "A Legacy of Elegance, Crafted in Nigeria",
    storyHeading: "“Our Story, Our Craft”",
    storyParagraphs: [
      `Founded by ${siteConfig.founder}, AGBONS-GL is more than a fashion brand — it’s an embodiment of artistry and heritage. From our Benin City studio, we merge traditional craftsmanship with modern couture to create pieces that celebrate the strength and grace of today’s woman.`,
      "AGBONS-GL blends modern silhouettes with artisanal African detailing to create bridal and couture pieces that feel personal and timeless. Each creation is made to measure and finished by skilled artisans in Benin City.",
    ],
    storyImage: pageMedia.homeStory,
    features: [
      {
        title: "Signature Bridal 2025",
        cta: "Explore collection",
        href: "/collections/ice-crystal",
        image: pageMedia.featureSignature,
      },
      {
        title: "Book a Bridal Consultation",
        cta: "Schedule appointment",
        href: "/consultation",
        image: pageMedia.featureConsultation,
      },
      {
        title: "Bridal Collections",
        cta: "View collections",
        href: "/collections",
        image: pageMedia.featureCollections,
      },
    ],
    dreamHeading: "Your Dream Dress Begins Here",
    dreamBody:
      "Every bride deserves couture as unique as her love story. Our bespoke bridal process takes you from sketch to silhouette, ensuring every detail reflects your personal style and vision.",
    dreamSteps: [
      "Consultation — share your vision, date and budget.",
      "Design & measurements — sketches, fabrics and a fitting in-studio or virtually.",
      "Atelier craft — hand-beading and finishing by our Benin City artisans.",
      "Final fitting & reveal — perfected for your moment.",
    ],
    dreamImage: pageMedia.dreamDress,
  }),
  products: () => seedProducts,
  collections: () => seedCollections,
  gallery: () => seedGallery,
  testimonials: () => testimonials,
  faqs: () => faqGroups,
  journal: () => journalPosts,
  policies: () => policies,
};

export function contentTag(key: ContentKey) {
  return `content:${key}`;
}

/** Cached read of a content document (falls back to the migrated seed). */
export async function getContent<K extends ContentKey>(
  key: K,
): Promise<ContentMap[K]> {
  "use cache";
  cacheLife("max");
  cacheTag(contentTag(key));
  const stored = await blobs("content").getJSON<ContentMap[K]>(key);
  return stored ?? seeds[key]();
}

/** Uncached read for the admin editor (always the latest saved version). */
export async function getContentForEdit<K extends ContentKey>(
  key: K,
): Promise<ContentMap[K]> {
  const stored = await blobs("content").getJSON<ContentMap[K]>(key);
  return stored ?? seeds[key]();
}

/** Persist a content document. Callers must also `updateTag(contentTag(key))`. */
export async function saveContent<K extends ContentKey>(
  key: K,
  value: ContentMap[K],
): Promise<void> {
  await blobs("content").setJSON(key, value);
}

export const getSettings = () => getContent("settings");

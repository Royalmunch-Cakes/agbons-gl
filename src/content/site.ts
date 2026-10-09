import type { MediaAsset, Testimonial } from "@/lib/types";

/**
 * Shared editorial content and media, migrated from the WordPress pages
 * (audit §3, §6). Regenerate media with `npm run media:pull -- --insecure`.
 */

export const brandMedia = {
  logo: { src: "/media/brand/logo.webp", alt: "AGBONS-GL Nigeria Limited" },
  logoWhite: { src: "/media/brand/logo-white.webp", alt: "AGBONS-GL" },
  monogram: { src: "/media/brand/monogram.webp", alt: "AGBONS-GL monogram" },
} satisfies Record<string, MediaAsset>;

export const pageMedia = {
  homeHero: { src: "/media/site/home-hero.png", alt: "Five AGBONS-GL couture gowns — new collection" },
  homeStory: { src: "/media/site/home-story.jpg", alt: "AGBONS-GL bride in a bespoke gown" },
  featureSignature: { src: "/media/site/feature-signature.webp", alt: "Signature Bridal 2025 look" },
  featureConsultation: { src: "/media/site/feature-consultation.jpg", alt: "Bridal consultation look" },
  featureCollections: { src: "/media/site/feature-collections.jpg", alt: "Bridal collections look" },
  dreamDress: { src: "/media/site/dream-dress.jpg", alt: "Bride in a sculpted couture gown" },
  aboutHero: { src: "/media/site/about-hero.webp", alt: "AGBONS-GL couture gown" },
  founder: { src: "/media/site/founder.jpg", alt: "Creative Director of AGBONS-GL" },
  bridalHero: { src: "/media/site/bridal-hero.jpg", alt: "Bride in an AGBONS-GL couture gown" },
} satisfies Record<string, MediaAsset>;

/** Self-hosted brand films (audit §6: 2 MP4s). Gitignored — see README. */
export const videos = {
  brandFilm: { src: "/media/video/brand-film.mp4", poster: pageMedia.homeHero.src },
  ourStory: { src: "/media/video/our-story.mp4", poster: pageMedia.aboutHero.src },
};

/** Couture gallery (audit §3.1 item 7 — ~14 images). */
export const gallery: MediaAsset[] = [
  "01.jpg", "02.jpg", "03.webp", "04.webp", "05.jpg", "06.jpg", "07.webp",
  "08.jpg", "09.jpg", "10.jpg", "11.jpg", "12.webp", "13.webp", "14.webp",
].map((file, i) => ({
  src: `/media/gallery/${file}`,
  alt: `AGBONS-GL couture — gallery image ${i + 1}`,
}));

/** Contact page image strip (audit §3.6 item 3). */
export const contactGallery: MediaAsset[] = [
  "contact-1.webp", "contact-2.jpg", "contact-3.jpg", "contact-4.jpg",
].map((file, i) => ({
  src: `/media/gallery/${file}`,
  alt: `AGBONS-GL client look ${i + 1}`,
}));

/**
 * Real client testimonials from the homepage (audit §3.1 item 8).
 * The shop page's lorem-ipsum reviews (audit §5.5) are intentionally not migrated.
 */
export const testimonials: Testimonial[] = [
  {
    quote:
      "Every detail was perfect — from my first fitting to my wedding day. AGBONS-GL made me feel like royalty.",
    name: "Oluwatoyin",
    location: "Lagos Bride",
  },
  {
    quote:
      "Choosing AGBONS-GL for my wedding dress was the best decision. They didn't just design a gown; they crafted a legacy. The fit was perfection, the lace was exquisite, and the entire process made me feel like royalty. My dress was truly a masterpiece — a reflection of Afro Global elegance.",
    name: "Amara O.",
    location: "Lagos, Nigeria (2025)",
  },
  {
    quote:
      "From my initial sketch to the final fitting, the team was brilliant. I wanted something modern but with a touch of traditional African flair, and they delivered a bespoke gown that exceeded my wildest dreams. I felt confident, beautiful, and absolutely unique. Thank you for making my Afro Global vision a reality.",
    name: "Tami W.",
    location: "London, UK (September 2024)",
  },
];

/** Value propositions (audit §3.1 item 6, §3.3 item 7). */
export const valueProps = [
  {
    title: "Exquisite Craftsmanship",
    body: "Each piece is handmade with precision and care.",
  },
  {
    title: "Proudly African",
    body: "We blend authentic African creativity with international couture standards.",
  },
  {
    title: "Personalized Experience",
    body: "From first fitting to final reveal, your journey is curated just for you.",
  },
];

import type { MediaAsset, StorySection } from "@/lib/types";

/**
 * Journal & Press (audit §2.5, §6: no blog content or CMS structure existed).
 * Seed entries are drawn from press facts already published on the
 * WordPress collection pages; add new posts here (or via a CMS later).
 */
export type JournalPost = {
  slug: string;
  title: string;
  kind: "press" | "story";
  /** Display label; exact publish dates weren't available from the old site. */
  dateLabel: string;
  excerpt: string;
  image: MediaAsset;
  body: StorySection[];
  relatedCollection?: string;
};

export const journalPosts: JournalPost[] = [
  {
    slug: "crystal-drop-eko-fashion-week-2023",
    title: "Crystal Drop debuts at Eko Fashion Week 2023",
    kind: "press",
    dateLabel: "2023",
    excerpt:
      "The first African collection to use crystal droplets as a structural design language was hailed as “transformational” on the runway.",
    image: {
      src: "https://res.cloudinary.com/mgioqhn4/image/upload/agbons-gl/collections/crystal-drop.jpg",
      alt: "Crystal Drop Collection gown on the runway",
    },
    relatedCollection: "crystal-drop",
    body: [
      {
        heading: "A continental first",
        paragraphs: [
          "Glory Agbonita Ehizuenlen's Crystal Drop Collection 2023 introduced crystal droplets as a foundational design element — a first in Africa — transforming light into motion.",
        ],
      },
      {
        heading: "Critical acclaim",
        paragraphs: [
          "The collection debuted at Eko Fashion Week 2023 and the Green October Event, where it was described as “transformational” and “a new bar for African couture.” Fashion icons including Jose Hendo, Toyin Lawani and Rougue praised its innovation and artistry.",
        ],
      },
    ],
  },
  {
    slug: "moyo-lawal-crystal-armour-gown",
    title: "Moyo Lawal wears the Crystal Armour Gown",
    kind: "press",
    dateLabel: "2023",
    excerpt:
      "From the Stone, Petal & Sparkle collection — nude illusion mesh, thousands of hand-placed crystals and a trailing tulle cape.",
    image: {
      src: "https://res.cloudinary.com/mgioqhn4/image/upload/agbons-gl/collections/stone-petal-sparkle.jpg",
      alt: "Stone, Petal & Sparkle Collection gown",
    },
    relatedCollection: "stone-petal-sparkle",
    body: [
      {
        heading: "Strength meets sensuality",
        paragraphs: [
          "Celebrated actress Moyo Lawal wore the Crystal Armour Gown from our “Empress of the Earth” Stone, Petal & Sparkle collection — the body wrapped in nude illusion mesh adorned with thousands of hand-placed crystals that shimmer like liquid diamonds.",
          "Exaggerated organza shoulder florals add drama and structure, while a trailing tulle cape completes the regal impression: bridal meets avant-garde.",
        ],
      },
    ],
  },
  {
    slug: "making-the-ice-dress",
    title: "Inside the atelier: making “The Ice Dress”",
    kind: "story",
    dateLabel: "2024",
    excerpt:
      "30,000 crystal beads, 6,000 droplets and over 200 yards of hand-cut tulle — the story behind the Queen Idia Collection's standout look.",
    image: {
      src: "https://res.cloudinary.com/mgioqhn4/image/upload/agbons-gl/collections/queen-idia.jpg",
      alt: "Queen Idia Collection bridal look",
    },
    relatedCollection: "queen-idia",
    body: [
      {
        heading: "Three to four months per look",
        paragraphs: [
          "Each look in the Queen Idia Collection took three to four months to craft — an extraordinary feat of hand-beading, textural layering and crystal embroidery.",
          "One standout creation, nicknamed “The Ice Dress”, was adorned with over 30,000 crystal beads, 6,000 droplets and Swarovski stones, while its sculpted tulle petals required over 200 yards of fabric — each hand-cut and hand-stitched.",
        ],
      },
      {
        heading: "Heritage, reimagined",
        paragraphs: [
          "Coral motifs reimagined in crystal and traditional Edo structures refined with Western tailoring: the collection honours Queen Idia, mother of Oba Esigie of the Benin Kingdom, as a symbol of feminine strength, wisdom and regal presence.",
        ],
      },
    ],
  },
  {
    slug: "haute-couture-2024-celebrated",
    title: "Haute Couture 2024 celebrated by icons",
    kind: "press",
    dateLabel: "2024",
    excerpt:
      "An ode to the modern mermaid, celebrated by Senator Ita Giwa, Lady Betsy Obaseki and Toke Makinwa.",
    image: {
      src: "https://res.cloudinary.com/mgioqhn4/image/upload/agbons-gl/collections/haute-couture.webp",
      alt: "Haute Couture Collection mermaid gown",
    },
    relatedCollection: "haute-couture",
    body: [
      {
        heading: "Where myth meets mastery",
        paragraphs: [
          "The Haute Couture Collection 2024 reinterprets the mythical mermaid as a symbol of modern womanhood, in Mikado silk, French lace and intricate hand-beading.",
          "Celebrated by icons like Senator Ita Giwa, Lady Betsy Obaseki and Toke Makinwa, the collection captured the attention of global fashion editors and industry leaders.",
        ],
      },
    ],
  },
];

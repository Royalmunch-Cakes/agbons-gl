import type { Collection, ProductLine } from "@/lib/types";

/**
 * Garment lines — axis 1 of the taxonomy (audit §4). The live catalog only
 * uses Bridal Couture; add Ready-to-Wear here when those products are listed.
 */
export const productLines: ProductLine[] = [
  {
    slug: "bridal-couture",
    name: "Bridal Couture",
    description:
      "Bespoke bridal and couture pieces hand-finished in our Benin City atelier.",
  },
];

/**
 * Named and seasonal collections — axis 2 of the taxonomy (audit §2.4).
 * Copy is migrated from the WordPress collection pages. `legacyPath`
 * preserves the old URL so it can 301 to the new route.
 */
export const collections: Collection[] = [
  {
    slug: "haute-couture",
    name: "Haute Couture Collection",
    kind: "signature",
    code: "HCC",
    year: 2024,
    tagline: "An Ode to the Modern Mermaid — Where Myth Meets Mastery",
    description:
      "A story of transformation — inspired by the mythical mermaid, reimagined through African craftsmanship and modern couture. Each silhouette represents the strength and grace of womanhood, flowing yet fierce.",
    hero: {
      src: "/media/collections/haute-couture.webp",
      alt: "Mermaid-silhouette gown from the Haute Couture Collection",
    },
    fromPriceUsd: 5000,
    legacyPath: "/haute-collection",
    story: [
      {
        heading: "Designer’s Note",
        paragraphs: [
          "We’ve woven the opulent textures of Mikado silk, delicate French lace, and intricate hand-beading to capture the elusive shimmer of the ocean and the enduring spirit of our continent.",
          "It is an exploration of legacy, designed for the woman who owns her power and her elegance, turning every entrance into a powerful tide.",
        ],
      },
      {
        heading: "The Vision",
        paragraphs: [
          "Renowned Nigerian designer Glory Agbonita Ehizuenlen redefines couture with her Haute Couture Collection 2024, a stunning exploration of myth, femininity, and structure. The collection draws on the mythical mermaid, reinterpreting her fluidity as a symbol of modern womanhood.",
        ],
      },
      {
        heading: "The Design",
        paragraphs: [
          "The hallmark silhouette hugs the torso and thighs before dramatically flaring beneath the knees — a breathtaking mermaid form that exudes elegance, sensuality, and power. Each gown’s construction balances architectural precision with masterful handcrafted artistry, elevating every design to wearable art.",
        ],
      },
      {
        heading: "The Craft",
        paragraphs: [
          "Ornate beadwork, layered tulle, and intricate embroidery accentuate the flared hemlines of each piece. Every stunning detail is handcrafted using indigenous African techniques seamlessly fused with the demanding precision of Parisian haute couture.",
        ],
      },
      {
        heading: "The Legacy",
        paragraphs: [
          "Celebrated by icons like Senator Ita Giwa, Lady Betsy Obaseki, and Toke Makinwa, the collection has captured the attention of global fashion editors and industry leaders — affirming AGBONS-GL’s place in the international world of haute couture.",
        ],
      },
    ],
  },
  {
    slug: "queen-idia",
    name: "Queen Idia Collection",
    kind: "signature",
    code: "QIC",
    year: 2024,
    tagline: "Luxury Edo Bridal Fashion by AGBONS-GL",
    description:
      "A timeless ode to heritage, beauty, and craftsmanship. Released in mid-2024, the collection reimagines the splendour of Edo royal tradition through the lens of haute couture.",
    hero: {
      src: "/media/collections/queen-idia.jpg",
      alt: "Edo bridal look from the Queen Idia Collection",
    },
    fromPriceUsd: 5000,
    legacyPath: "/queen-idia-collection",
    story: [
      {
        heading: "Collection Overview",
        paragraphs: [
          "Each design reflects the legendary grace of Queen Idia, mother of Oba Esigie of the Benin Kingdom — a symbol of feminine strength, wisdom, and regal presence.",
          "The collection fuses classic Edo bridal style with modern couture detailing, delivering pieces that embody luxury, power, and cultural reverence.",
        ],
      },
      {
        heading: "Design Story",
        paragraphs: [
          "Each look took three to four months to craft — an extraordinary feat of hand-beading, textural layering, and crystal embroidery. One standout creation, nicknamed “The Ice Dress”, was adorned with over 30,000 crystal beads, 6,000 droplets, and Swarovski stones, while the sculpted tulle petals required over 200 yards of fabric — each hand-cut and hand-stitched.",
        ],
      },
      {
        heading: "Craftsmanship",
        paragraphs: [
          "The craftsmanship blends ancestral techniques with modern couture precision: coral motifs reimagined in crystal, traditional Edo structures redefined with Western tailoring finesse. This harmony of heritage and innovation transforms cultural symbols into couture expressions of power, beauty, and pride.",
        ],
      },
      {
        heading: "Cultural Note",
        paragraphs: [
          "A traditional Edo bridal look is more than fashion — it is a declaration of identity. Each handcrafted detail pays homage to generations of artistry and the symbolic power of adornment. With this collection, AGBONS-GL invites every modern bride to step into her royal story — to wear not just a gown, but a crown of legacy.",
        ],
      },
    ],
  },
  {
    slug: "crystal-drop",
    name: "Crystal Drop Collection",
    kind: "signature",
    code: "CDC",
    year: 2023,
    tagline: "Where Light Becomes Couture",
    description:
      "The first African collection to employ crystal droplets as a structural design language. Each piece transforms light into motion, redefining luxury as art.",
    hero: {
      src: "/media/collections/crystal-drop.jpg",
      alt: "Crystal-droplet gown from the Crystal Drop Collection",
    },
    fromPriceUsd: 5000,
    legacyPath: "/crystal-drop-collection",
    story: [
      {
        heading: "The Vision — Designer’s Note",
        paragraphs: [
          "“With Crystal Drop, I wanted to capture the mesmerizing beauty of falling water — the way light dances on water, the way beauty flows when given freedom. This collection is about embracing uninhibited elegance. Each gown is a story of brilliance, innovation, and identity.” — Glory A. E.",
          "We used intricately arranged crystal droplets as a foundational design element (first in Africa) to give every woman a garment that is luminous, revolutionary, and moves with her, making her feel as free and powerful as water.",
        ],
      },
      {
        heading: "Design Philosophy",
        paragraphs: [
          "Inspired by the mesmerising fall of water, each gown integrates hand-applied crystals that reflect and refract light, producing an ethereal glow as the wearer moves. Every pattern of crystals is individually designed, ensuring no two dresses are alike — each a bespoke work of wearable sculpture.",
        ],
      },
      {
        heading: "A Vision in Motion",
        paragraphs: [
          "The gowns merge precision engineering and organic grace, showcasing flowing silhouettes and crystal structures that echo rainfall suspended in time. Each look embodies modern femininity — luminous, confident, and fluid.",
        ],
      },
      {
        heading: "Critical Acclaim",
        paragraphs: [
          "The collection debuted to acclaim at Eko Fashion Week 2023 and the Green October Event, hailed as “transformational” and “a new bar for African couture.” Fashion icons like Jose Hendo, Toyin Lawani, and Rougue praised the collection’s innovation and artistry.",
        ],
      },
    ],
  },
  {
    slug: "ice-crystal",
    name: "Ice & Crystals Collection",
    kind: "signature",
    code: "IAC",
    year: 2025,
    tagline: "Frozen Brilliance, African Craftsmanship",
    description:
      "If winter ever wore a crown, it would be dressed by AGBONS-GL. Each gown is a masterpiece of shimmer, sharpness, and sculptural elegance.",
    hero: {
      src: "/media/collections/ice-crystal.webp",
      alt: "Crystal-embellished gown from the Ice & Crystals Collection",
    },
    fromPriceUsd: 5000,
    legacyPath: "/ice-crystal-collection",
    story: [
      {
        heading: "The Collection",
        paragraphs: [
          "Glory Agbonita Ehizuenlen’s Ice and Crystals 2025 Collection glides through the runway like frost over marble. The haute couture segment fuses architectural precision with luminescent materials — tulle, organdy, wire, crinoline mesh, beads, and Swarovski stones — redefining the language of African couture.",
        ],
      },
      {
        heading: "Metallic Mirror Gown — A Modern Masterpiece",
        paragraphs: [
          "The collection’s signature look — a mosaic of gold reflective fragments — forms a gown that mirrors light from every angle. Its fishtail silhouette hugs the hips before blossoming in full flare. Each reflection is a dance of light and precision — a spectacle of movement captured in couture.",
        ],
      },
      {
        heading: "Romance Reimagined",
        paragraphs: [
          "The bridal line within Ice & Crystals weaves softness and structure. Luxurious fabrics — mikado silk, satin, lace, chiffon, tulle, and organdy — come together to form silhouettes that whisper elegance and strength.",
        ],
      },
      {
        heading: "Celestial Whisper",
        paragraphs: [
          "A corseted bodice encrusted with icy stones meets a structured Mikado silk skirt. Its elegant slit reveals just enough grace, while crystal embellishments shimmer like starlight. Power meets purity. Modern meets timeless.",
        ],
      },
      {
        heading: "The Frosted Bloom",
        paragraphs: [
          "A sweeping gown of crinoline mesh with a structured sweetheart bodice adorned with pearls and lace. Its volume flows like a dream — soft, floating, ethereal — a bridal fantasy turned tangible.",
        ],
      },
    ],
  },
  {
    slug: "royal-ancestors",
    name: "Royal Ancestors Collection",
    kind: "signature",
    code: "RAC",
    tagline: "Where Ancestry Meets Artistry",
    description:
      "A symphony of heritage, craftsmanship, and grandeur. Each gown is not merely worn — it is inherited, woven with the spirit of queens who walked before us.",
    hero: {
      src: "/media/collections/royal-ancestors.jpg",
      alt: "Red ruffled-tulle gown from the Royal Ancestors Collection",
    },
    fromPriceUsd: 5000,
    legacyPath: "/royal-ancestors-collection",
    story: [
      {
        heading: "A Legacy in Motion",
        paragraphs: [
          "Stepping into the world of the Royal Ancestors Collection is like entering a grand hall where history and fantasy dance together. This is not just bridal couture — it’s a bold challenge to the conventions of modern bridalwear. Every silhouette carries the whisper of heritage and the roar of modern identity.",
        ],
      },
      {
        heading: "Where Fabric Becomes Royal Decree",
        paragraphs: [
          "Crinoline mesh and tulle create dramatic, voluminous silhouettes that command movement. Mikado silk and satin bring regal sheen and architectural formality. Chiffon and organdy introduce softness, translucence, and breathability, while bridal lace acts as a visual narrative — ancestral motifs interwoven with modern grace.",
        ],
      },
      {
        heading: "The Scarlet Majesty",
        paragraphs: [
          "A breathtaking gown in fiery red. The strapless corseted bodice plunges into a sea of ruffled tulle, forming a silhouette that’s both statuesque and theatrical — a spectacle for the confident bride who carries her crown in her stride. A gown not just for a moment — but for a memory.",
        ],
      },
      {
        heading: "The White Modern Muse",
        paragraphs: [
          "A study in contrast and courage. This asymmetrical masterpiece pairs a structured corset with a high-low skirt in frothy tulle. The transparent bodice and boning detail offer a modern reinterpretation of bridal grace — for the bride who wants to own tradition, yet redefine it.",
        ],
      },
      {
        heading: "Power, Precision, and Presence",
        paragraphs: [
          "Red — a symbol of life, courage, and ancestral fire — meets the purity of white, creating a palette that transcends convention. Every gown is an heirloom reborn, designed to celebrate the continuum of womanhood — past, present, and future.",
        ],
      },
    ],
  },
  {
    slug: "stone-petal-sparkle",
    name: "Stone, Petal & Sparkle Collection",
    kind: "signature",
    code: "SPS",
    year: 2023,
    tagline: "Empress of the Earth",
    description:
      "A poetic fusion of nature’s splendour and royal finesse — each gown crafted not merely to be worn, but to crown its wearer.",
    hero: {
      src: "/media/collections/stone-petal-sparkle.jpg",
      alt: "Metallic floral ball gown from the Stone, Petal & Sparkle Collection",
    },
    fromPriceUsd: 5000,
    legacyPath: "/stone-petal-sparkle-collection",
    story: [
      {
        heading: "The Story",
        paragraphs: [
          "Here, Agbonita explores the divine duality of womanhood — delicate yet commanding, radiant yet resolute — using form, texture, and light as her language. Deep, rich earth tones contrast with brilliant metallic embellishments, symbolising strength rooted in natural beauty.",
          "Drapes mimic cascading waterfalls, while intricate beadwork suggests the hidden treasures of the soil — a tribute to the woman who is a gentle force and an unquestioned sovereign of her own domain.",
        ],
      },
      {
        heading: "The Solar Bloom Ball Gown",
        paragraphs: [
          "A sculpted strapless bodice defines a powerful silhouette, while the voluminous skirt bursts into life — a cascade of oversized metallic florals layered like petals in motion. Each petal, hand-cut in gold and silver appliqué, catches the light like a living mirror.",
        ],
      },
      {
        heading: "The Crystal Armour Gown",
        paragraphs: [
          "Worn by celebrated actress Moyo Lawal, this piece wraps the body in nude illusion mesh adorned with thousands of hand-placed crystals that shimmer like liquid diamonds. Exaggerated organza shoulder florals add drama, while a trailing tulle cape completes the regal impression.",
        ],
      },
      {
        heading: "The Rose Garden Siren Gown",
        paragraphs: [
          "A corseted bodice encrusted with crystal embroidery mimics the flow of water, gliding over the curves like waves under light. Below, a sweeping train of hand-twirled roses unfurls — hundreds of delicate white blooms stitched into a full cascading skirt.",
        ],
      },
    ],
  },
  {
    slug: "2024",
    name: "2024 Collections",
    kind: "season",
    code: "C24",
    year: 2024,
    tagline: "The 2024 season.",
    description:
      "Every piece from our 2024 season — statement gowns, sets and tailored silhouettes.",
    hero: {
      src: "/media/site/feature-signature.webp",
      alt: "Look from the 2024 collections",
    },
  },
  {
    slug: "2023",
    name: "2023 Collections",
    kind: "season",
    code: "C23",
    year: 2023,
    tagline: "The 2023 season.",
    description:
      "Signature pieces from our 2023 season, available to order or commission in your measurements.",
    hero: {
      src: "/media/site/feature-collections.jpg",
      alt: "Look from the 2023 collections",
    },
  },
];

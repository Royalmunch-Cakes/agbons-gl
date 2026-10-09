/**
 * Business & brand context (audit §1). Contact details and social URLs come
 * from environment variables so they can be changed without a code release;
 * see `.env.example`.
 */

const env = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2347056814352",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@agbons-gl.com",
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "+234 705 681 4352",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "",
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "",
  tiktok: process.env.NEXT_PUBLIC_TIKTOK_URL || "",
  x: process.env.NEXT_PUBLIC_X_URL || "",
};

const address = {
  street: "169 Murtala Mohammed Way",
  locality: "Avbiama",
  city: "Benin City",
  region: "Edo State",
  country: "Nigeria",
  countryCode: "NG",
};

const addressLine = [
  address.street,
  address.locality,
  address.city,
  address.region,
  address.country,
].join(", ");

export const siteConfig = {
  name: "AGBONS-GL",
  legalName: "AGBONS-GL NIG. LTD",
  tagline: "Luxury. Confidence. Couture.",
  description:
    "Afro-global luxury fashion house crafting bespoke bridal couture and ready-to-wear pieces in Benin City, Nigeria — African heritage meets international couture standards.",
  founder: "Gloria Ehizuelen",
  url: env.siteUrl.replace(/\/$/, ""),
  address,
  addressLine,
  mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressLine)}`,
  mapsEmbedUrl: `https://www.google.com/maps?q=${encodeURIComponent(addressLine)}&output=embed`,
  contact: {
    email: env.email,
    phone: env.phone,
    phoneHref: `tel:${env.phone.replace(/[^\d+]/g, "")}`,
    whatsapp: env.whatsapp,
  },
  hours: [
    { days: "Monday – Friday", time: "09:00 – 17:00" },
    { days: "Saturday – Sunday", time: "Closed" },
  ],
  hoursNote: "Office visits are strictly by appointment.",
  socials: [
    { name: "Instagram", href: env.instagram },
    { name: "Facebook", href: env.facebook },
    { name: "TikTok", href: env.tiktok },
    { name: "X", href: env.x },
  ].filter((s) => s.href),
  handle: "@agbonsgl",
} as const;

export type NavItem = { title: string; href: string; description?: string };

/**
 * Primary navigation (audit §2.1). "Collections" now has a real landing page
 * (fixes audit §5.2 — the old dropdown parent linked to `#`).
 */
export const mainNav: NavItem[] = [
  { title: "Home", href: "/" },
  { title: "About", href: "/about" },
  { title: "Bridal Couture", href: "/bridal-couture" },
  { title: "Collections", href: "/collections" },
  { title: "Shop", href: "/shop" },
  { title: "Lookbook", href: "/lookbook" },
  { title: "Contact", href: "/contact" },
];

/** Footer columns (audit §3.7). Every link resolves to a built page (fixes §5.3). */
export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Explore",
    items: [
      { title: "Home", href: "/" },
      { title: "About", href: "/about" },
      { title: "Shop Bridal Couture", href: "/bridal-couture" },
      { title: "Collections", href: "/collections" },
      { title: "Lookbook / Gallery", href: "/lookbook" },
      { title: "Journal & Press", href: "/journal" },
      { title: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Customer Care",
    items: [
      { title: "Book an Appointment", href: "/consultation" },
      { title: "FAQs", href: "/faqs" },
      { title: "Shipping & Delivery", href: "/shipping" },
      { title: "Returns & Exchange", href: "/returns" },
      { title: "Privacy Policy", href: "/privacy" },
      { title: "Terms & Conditions", href: "/terms" },
    ],
  },
];

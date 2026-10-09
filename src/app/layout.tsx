import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";

import { Analytics } from "@/components/site/analytics";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { ScrollToTop } from "@/components/site/scroll-to-top";
import { Toaster } from "@/components/ui/toast";
import { siteConfig } from "@/config/site";
import { getCollections } from "@/lib/catalog";

import "./globals.css";

// Google Fonts with font-display: swap, matching the current site (audit §8).
const jost = Jost({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: "en_NG",
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

/** LocalBusiness structured data (TRD §8 SEO; audit §1 business context). */
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  name: siteConfig.legalName,
  alternateName: siteConfig.name,
  slogan: siteConfig.tagline,
  description: siteConfig.description,
  url: siteConfig.url,
  logo: `${siteConfig.url}/media/brand/logo.webp`,
  image: `${siteConfig.url}/media/site/home-hero.png`,
  email: siteConfig.contact.email,
  telephone: siteConfig.contact.phone,
  founder: { "@type": "Person", name: siteConfig.founder },
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address.street,
    addressLocality: siteConfig.address.city,
    addressRegion: siteConfig.address.region,
    addressCountry: siteConfig.address.countryCode,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "17:00",
  },
  sameAs: siteConfig.socials.map((s) => s.href),
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const collections = (await getCollections()).map(
    ({ slug, name, tagline }) => ({
      slug,
      name,
      tagline,
    }),
  );

  return (
    <html
      lang="en"
      className={`${jost.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <Toaster>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-background focus:px-4 focus:py-2"
          >
            Skip to content
          </a>
          <Header collections={collections} />
          <main id="main" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <Footer />
          <ScrollToTop />
        </Toaster>
        <Analytics />
      </body>
    </html>
  );
}

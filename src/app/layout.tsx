import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";

import { Analytics } from "@/components/site/analytics";
import { SettingsProvider } from "@/components/site/settings-provider";
import { Toaster } from "@/components/ui/toast";
import { siteConfig } from "@/config/site";
import { getSettings } from "@/lib/content";
import type { SiteSettings } from "@/lib/types";

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
const organizationJsonLd = (settings: SiteSettings) => ({
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  name: siteConfig.legalName,
  alternateName: siteConfig.name,
  slogan: siteConfig.tagline,
  description: siteConfig.description,
  url: siteConfig.url,
  logo: `${siteConfig.url}/media/brand/logo.webp`,
  image: `${siteConfig.url}/media/site/home-hero.png`,
  email: settings.contact.email,
  telephone: settings.contact.phone,
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
  sameAs: Object.values(settings.socials).filter(Boolean),
});

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const settings = await getSettings();

  return (
    <html
      lang="en"
      className={`${jost.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd(settings)).replace(
              /</g,
              "\\u003c",
            ),
          }}
        />
        <SettingsProvider
          value={{
            whatsapp: settings.contact.whatsapp,
            usdToNgnRate: settings.usdToNgnRate,
          }}
        >
          <Toaster>{children}</Toaster>
        </SettingsProvider>
        <Analytics />
      </body>
    </html>
  );
}

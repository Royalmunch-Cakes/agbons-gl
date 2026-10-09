import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";

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
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const collections = (await getCollections()).map(({ slug, name, tagline }) => ({
    slug,
    name,
    tagline,
  }));

  return (
    <html
      lang="en"
      className={`${jost.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
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
      </body>
    </html>
  );
}

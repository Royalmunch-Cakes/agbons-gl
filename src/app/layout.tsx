import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";

import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { Toaster } from "@/components/ui/toast";
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
  title: "AGBONS-GL — Luxury. Confidence. Couture.",
  description:
    "Bespoke bridal couture and ready-to-wear luxury from Benin City, Nigeria.",
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
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </Toaster>
      </body>
    </html>
  );
}

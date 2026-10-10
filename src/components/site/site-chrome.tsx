import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { ScrollToTop } from "@/components/site/scroll-to-top";
import { getCollections } from "@/lib/catalog";
import { getSettings } from "@/lib/content";

/** Public storefront chrome: header, footer, scroll-to-top. */
export async function SiteChrome({ children }: { children: React.ReactNode }) {
  const [collections, settings] = await Promise.all([
    getCollections(),
    getSettings(),
  ]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-background focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <Header
        announcement={settings.announcement}
        collections={collections.map(({ slug, name, tagline }) => ({
          slug,
          name,
          tagline,
        }))}
      />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}

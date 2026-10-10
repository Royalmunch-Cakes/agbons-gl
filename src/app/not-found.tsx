import { NotFoundContent } from "@/components/site/not-found-content";
import { SiteChrome } from "@/components/site/site-chrome";

/** Unmatched URLs: rendered outside the (site) layout, so it adds the chrome. */
export default function NotFound() {
  return (
    <SiteChrome>
      <NotFoundContent />
    </SiteChrome>
  );
}

import type { SiteSettings } from "@/lib/types";

const SOCIAL_NAMES: Record<keyof SiteSettings["socials"], string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
  x: "X",
};

/** Configured social profiles as display links (empty URLs are hidden). */
export function socialLinks(settings: SiteSettings) {
  return (Object.keys(SOCIAL_NAMES) as (keyof SiteSettings["socials"])[])
    .filter((k) => settings.socials[k])
    .map((k) => ({ name: SOCIAL_NAMES[k], href: settings.socials[k] }));
}

export function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

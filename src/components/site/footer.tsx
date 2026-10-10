import { MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";

import { WhatsAppButton } from "@/components/commerce/whatsapp-button";
import { Container } from "@/components/site/section";
import { socialIcons } from "@/components/site/social-icons";
import { Separator } from "@/components/ui/separator";
import { footerNav, siteConfig } from "@/config/site";
import { brandMedia } from "@/content/site";
import { getSettings } from "@/lib/content";
import { phoneHref, socialLinks } from "@/lib/settings";
import { consultationMessage } from "@/lib/whatsapp";

async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

/**
 * Global footer (audit §3.7). Every link resolves to a built page (fixes
 * §5.3) and social icons link to real profiles from env config (fixes §5.4).
 */
export async function Footer() {
  const settings = await getSettings();
  const socials = socialLinks(settings);
  return (
    <footer className="bg-primary text-primary-foreground">
      <Container className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_2fr_1.3fr]">
        <div className="flex flex-col items-start gap-5">
          <Image
            src={brandMedia.logoWhite.src}
            alt={brandMedia.logoWhite.alt}
            width={180}
            height={180}
            className="-my-4 size-32"
          />
          <p className="font-heading text-2xl italic">{siteConfig.tagline}</p>
          <p className="max-w-xs text-sm leading-relaxed text-primary-foreground/70">
            Bespoke bridal couture and luxury fashion, hand-finished in Benin
            City and made for the world.
          </p>
          <WhatsAppButton
            message={consultationMessage}
            intent="consultation"
            variant="brand"
          >
            Book a consultation
          </WhatsAppButton>
        </div>

        {/* Explore + Customer Care sit side by side, including on mobile. */}
        <div className="grid grid-cols-2 gap-8">
          {footerNav.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="mb-4 text-xs font-medium tracking-[0.25em] text-primary-foreground/60 uppercase">
                {column.title}
              </p>
              <ul className="flex flex-col gap-2.5 text-sm">
                {column.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-primary-foreground/85 transition-colors hover:text-brand"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div>
          <p className="mb-4 text-xs font-medium tracking-[0.25em] text-primary-foreground/60 uppercase">
            Connect with us
          </p>
          <ul className="flex flex-col gap-3 text-sm text-primary-foreground/85">
            <li>
              <a
                href={siteConfig.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 hover:text-brand"
              >
                <MapPinIcon className="mt-0.5 size-4 shrink-0" aria-hidden />
                <span>{siteConfig.addressLine}</span>
              </a>
            </li>
            <li>
              <a
                href={`mailto:${settings.contact.email}`}
                className="flex gap-3 hover:text-brand"
              >
                <MailIcon className="mt-0.5 size-4 shrink-0" aria-hidden />
                {settings.contact.email}
              </a>
            </li>
            <li>
              <a
                href={phoneHref(settings.contact.phone)}
                className="flex gap-3 hover:text-brand"
              >
                <PhoneIcon className="mt-0.5 size-4 shrink-0" aria-hidden />
                {settings.contact.phone}
              </a>
            </li>
          </ul>
          {socials.length > 0 && (
            <ul className="mt-6 flex gap-3">
              {socials.map((s) => {
                const Icon = socialIcons[s.name];
                return (
                  <li key={s.name}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${siteConfig.name} on ${s.name}`}
                      className="flex size-10 items-center justify-center rounded-full border border-primary-foreground/25 transition-colors hover:border-brand hover:text-brand"
                    >
                      {Icon && <Icon className="size-4" />}
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </Container>
      <Separator className="bg-primary-foreground/15" />
      <Container className="flex flex-col gap-2 py-6 text-xs text-primary-foreground/60 md:flex-row md:justify-between">
        <p>
          © <CopyrightYear /> {siteConfig.legalName}. All rights reserved.
        </p>
        <p>Follow {siteConfig.handle} on Instagram, Facebook and TikTok</p>
      </Container>
    </footer>
  );
}

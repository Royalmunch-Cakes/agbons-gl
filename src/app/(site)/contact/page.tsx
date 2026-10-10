import { CalendarCheckIcon, MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { WhatsAppButton } from "@/components/commerce/whatsapp-button";
import { ContactForm } from "@/components/forms/contact-form";
import { NewsletterSection } from "@/components/forms/newsletter-form";
import { Media } from "@/components/site/media";
import { Container, PageHero, Section } from "@/components/site/section";
import { socialIcons } from "@/components/site/social-icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";
import { contactGallery } from "@/content/site";
import { getSettings } from "@/lib/content";
import { phoneHref, socialLinks } from "@/lib/settings";
import { consultationMessage } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book a fitting, request a custom piece, or ask about our designs. Visit the AGBONS-GL studio in Benin City by appointment, or reach us by phone, email or WhatsApp.",
  alternates: { canonical: "/contact" },
};

/** Contact page (audit §3.6) — now with a real enquiry form (fixes §5.9). */
export default async function ContactPage() {
  const settings = await getSettings();
  const socials = socialLinks(settings);
  return (
    <>
      {/* 2. Intro + CTAs */}
      <PageHero
        eyebrow="Contact"
        title="We’d Love to Hear From You"
        description="Whether you’re ready to book a fitting, request a custom piece, or simply learn more about our designs — our team is here to assist."
      >
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button size="xl" nativeButton={false} render={<Link href="/shop" />}>
            Make an order
          </Button>
          <WhatsAppButton
            message={consultationMessage}
            intent="consultation"
            variant="outline"
          >
            Book a consultation
          </WhatsAppButton>
        </div>
      </PageHero>

      {/* 3. Gallery strip */}
      <div className="grid grid-cols-2 md:grid-cols-4">
        {contactGallery.map((img) => (
          <Media key={img.src} asset={img} sizes="(min-width: 768px) 25vw, 50vw" aspect="aspect-square" />
        ))}
      </div>

      <Section>
        <Container className="grid gap-14 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          {/* 4–6. Let's Talk, hours, appointment notice */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <p className="eyebrow">Let’s talk</p>
              <h2 className="text-4xl md:text-5xl">Visit, call or write</h2>
            </div>
            <ul className="flex flex-col gap-4">
              <li>
                <a href={phoneHref(settings.contact.phone)} className="flex items-center gap-4 hover:underline">
                  <PhoneIcon className="size-5 text-brand-ink" aria-hidden />
                  {settings.contact.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${settings.contact.email}`} className="flex items-center gap-4 hover:underline">
                  <MailIcon className="size-5 text-brand-ink" aria-hidden />
                  {settings.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-4 hover:underline"
                >
                  <MapPinIcon className="mt-0.5 size-5 shrink-0 text-brand-ink" aria-hidden />
                  {siteConfig.addressLine}
                </a>
              </li>
            </ul>
            {socials.length > 0 && (
              <div className="flex flex-col gap-3">
                <p className="text-sm text-muted-foreground">
                  Follow {siteConfig.handle}
                </p>
                <ul className="flex gap-3">
                  {socials.map((s) => {
                    const Icon = socialIcons[s.name];
                    return (
                      <li key={s.name}>
                        <Button
                          variant="outline"
                          size="icon-lg"
                          nativeButton={false}
                          aria-label={`${siteConfig.name} on ${s.name}`}
                          render={<a href={s.href} target="_blank" rel="noopener noreferrer" />}
                        >
                          {Icon && <Icon />}
                        </Button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            <Separator />
            <div className="flex flex-col gap-3">
              <h3 className="text-2xl">Office hours</h3>
              <dl className="grid grid-cols-[1fr_auto] gap-y-2 text-sm">
                {settings.hours.map((h) => (
                  <div key={h.days} className="contents">
                    <dt className="text-muted-foreground">{h.days}</dt>
                    <dd className="tabular-nums">{h.time}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <Alert>
              <CalendarCheckIcon />
              <AlertTitle>{settings.hoursNote}</AlertTitle>
              <AlertDescription>
                <Link href="/consultation" className="underline underline-offset-4">
                  Request an appointment
                </Link>{" "}
                and we’ll confirm a time that suits you.
              </AlertDescription>
            </Alert>
          </div>

          {/* New: enquiry form */}
          <div className="flex flex-col gap-6 border bg-card p-6 md:p-10">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl md:text-4xl">Send us a message</h2>
              <p className="text-sm text-muted-foreground">
                We reply within one working day.
              </p>
            </div>
            <ContactForm />
          </div>
        </Container>
      </Section>

      {/* 7. Map */}
      <section aria-label="Map to our studio" className="border-y">
        <iframe
          title={`Map: ${siteConfig.addressLine}`}
          src={siteConfig.mapsEmbedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="block h-80 w-full grayscale md:h-[28rem]"
        />
      </section>

      <NewsletterSection />
    </>
  );
}

import Link from "next/link";

import { WhatsAppButton } from "@/components/commerce/whatsapp-button";
import { Container, Section } from "@/components/site/section";
import { Button } from "@/components/ui/button";
import { consultationMessage } from "@/lib/whatsapp";

/**
 * Consultation CTA band (audit §3.2 item 10, §3.3 item 6). Offers the
 * structured intake form and WhatsApp as parallel, clearly labelled paths.
 */
export function CtaBand({
  title,
  body = "Every bride deserves couture as unique as her love story. Our bespoke bridal process takes you from sketch to silhouette, ensuring every detail reflects your personal style and vision.",
}: {
  title: string;
  body?: string;
}) {
  return (
    <Section className="bg-primary text-primary-foreground">
      <Container className="flex flex-col items-center gap-6 text-center">
        <h2 className="max-w-2xl text-4xl leading-tight text-balance md:text-5xl">
          {title}
        </h2>
        <p className="max-w-2xl leading-relaxed text-primary-foreground/75">
          {body}
        </p>
        <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <Button
            variant="brand"
            size="xl"
            nativeButton={false}
            render={<Link href="/consultation" />}
          >
            Book a consultation
          </Button>
          <WhatsAppButton
            message={consultationMessage}
            intent="consultation"
            variant="outline"
            className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            Chat on WhatsApp
          </WhatsAppButton>
        </div>
      </Container>
    </Section>
  );
}

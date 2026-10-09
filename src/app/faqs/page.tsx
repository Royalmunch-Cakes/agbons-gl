import type { Metadata } from "next";
import Link from "next/link";

import { WhatsAppButton } from "@/components/commerce/whatsapp-button";
import { Container, PageHero, Section } from "@/components/site/section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { faqGroups } from "@/content/faqs";
import { consultationMessage } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "FAQs",
  description:
    "Answers about AGBONS-GL bespoke bridal couture: the consultation process, timelines, virtual fittings, ordering, currency and studio visits.",
  alternates: { canonical: "/faqs" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqGroups.flatMap((g) =>
    g.items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  ),
};

/** FAQs (audit §2.5 — the WordPress page held template placeholders). */
export default function FaqsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <PageHero
        eyebrow="Customer care"
        title="Frequently Asked Questions"
        description="Everything you need to know about commissioning couture with AGBONS-GL."
      />
      <Section>
        <Container className="flex max-w-3xl flex-col gap-12">
          {faqGroups.map((group) => (
            <section key={group.title} className="flex flex-col gap-4">
              <h2 className="text-3xl">{group.title}</h2>
              <Accordion className="border-t">
                {group.items.map((f) => (
                  <AccordionItem key={f.q} value={f.q}>
                    <AccordionTrigger className="font-sans text-base font-medium">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="leading-relaxed text-muted-foreground">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          ))}
          <div className="flex flex-col items-start gap-4 border bg-secondary p-6 md:p-8">
            <h2 className="text-3xl">Still have a question?</h2>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <WhatsAppButton message={consultationMessage} intent="enquiry">
                Ask on WhatsApp
              </WhatsAppButton>
              <Button
                variant="outline"
                size="xl"
                nativeButton={false}
                render={<Link href="/contact" />}
              >
                Contact us
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

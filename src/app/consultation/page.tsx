import { ClockIcon, MapPinIcon } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";

import { WhatsAppButton } from "@/components/commerce/whatsapp-button";
import { ConsultationForm } from "@/components/forms/consultation-form";
import { Container, PageHero, Section } from "@/components/site/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/config/site";
import { getCollections } from "@/lib/catalog";
import { consultationMessage } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Book a Bridal Consultation",
  description:
    "Request a bespoke bridal consultation with AGBONS-GL — share your occasion, date, budget and vision, and our Benin City atelier will be in touch within one working day.",
  alternates: { canonical: "/consultation" },
};

const steps = [
  { title: "Request", body: "Tell us about your occasion, date, budget and vision." },
  { title: "Consult", body: "We confirm an in-studio or virtual appointment within one working day." },
  { title: "Design & fit", body: "Sketches, fabric selection and precise measurements." },
  { title: "Reveal", body: "Hand-finished couture, perfected at your final fitting." },
];

/**
 * Structured bespoke consultation flow (audit §7 suggested IA: "Bridal /
 * Bespoke Consultation flow (structured intake, not just a WhatsApp link)").
 */
export default function ConsultationPage(props: PageProps<"/consultation">) {
  return (
    <>
      <PageHero
        eyebrow="Bespoke bridal"
        title="Book a Bridal Consultation"
        description="Every bride deserves couture as unique as her love story. Share a few details and our atelier will prepare for your appointment."
      />

      <Section className="pt-10 md:pt-14">
        <Container className="flex flex-col gap-12">
          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <span className="font-heading text-4xl leading-none text-brand-ink">
                  {i + 1}
                </span>
                <div>
                  <p className="font-medium">{s.title}</p>
                  <p className="text-sm text-muted-foreground">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="grid gap-10 lg:grid-cols-[1fr_20rem] lg:gap-14">
            <div className="border bg-card p-6 md:p-10">
              <Suspense fallback={<FormSkeleton />}>
                <IntakeForm searchParams={props.searchParams} />
              </Suspense>
            </div>

            <aside className="flex flex-col gap-6 lg:sticky lg:top-32 lg:self-start">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading text-2xl font-normal">
                    Prefer to chat?
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 text-sm text-muted-foreground">
                  <p>
                    Message our team directly on WhatsApp — we’ll guide you
                    through the same steps.
                  </p>
                  <WhatsAppButton message={consultationMessage} intent="consultation" size="lg">
                    Chat on WhatsApp
                  </WhatsAppButton>
                  <Separator />
                  <p className="flex gap-3">
                    <ClockIcon className="mt-0.5 size-4 shrink-0" aria-hidden />
                    <span>
                      {siteConfig.hours[0].days}, {siteConfig.hours[0].time}.{" "}
                      {siteConfig.hoursNote}
                    </span>
                  </p>
                  <p className="flex gap-3">
                    <MapPinIcon className="mt-0.5 size-4 shrink-0" aria-hidden />
                    <span>{siteConfig.addressLine}</span>
                  </p>
                </CardContent>
              </Card>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}

async function IntakeForm({
  searchParams,
}: {
  searchParams: PageProps<"/consultation">["searchParams"];
}) {
  const [sp, collections] = await Promise.all([searchParams, getCollections()]);
  const names = collections.filter((c) => c.kind === "signature").map((c) => c.name);
  const requested = typeof sp.collection === "string" ? sp.collection : undefined;
  const defaultCollection = names.find((n) => n === requested);
  return <ConsultationForm collections={names} defaultCollection={defaultCollection} />;
}

function FormSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-8 w-40" />
      {Array.from({ length: 4 }, (_, i) => (
        <Skeleton key={i} className="h-11 w-full" />
      ))}
    </div>
  );
}

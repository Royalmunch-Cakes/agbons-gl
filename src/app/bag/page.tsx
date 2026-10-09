import type { Metadata } from "next";

import { BagView } from "@/components/commerce/bag-view";
import { Container, Section } from "@/components/site/section";

export const metadata: Metadata = {
  title: "Your Bag",
  robots: { index: false },
};

export default function BagPage() {
  return (
    <Section className="pt-10 md:pt-14">
      <Container className="flex flex-col gap-8">
        <h1 className="text-5xl">Your Bag</h1>
        <BagView />
      </Container>
    </Section>
  );
}

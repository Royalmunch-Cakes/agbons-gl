import type { Metadata } from "next";

import { WishlistView } from "@/components/commerce/wishlist-view";
import { Container, Section } from "@/components/site/section";

export const metadata: Metadata = {
  title: "Wishlist",
  robots: { index: false },
};

export default function WishlistPage() {
  return (
    <Section className="pt-10 md:pt-14">
      <Container className="flex flex-col gap-8">
        <h1 className="text-5xl">Wishlist</h1>
        <WishlistView />
      </Container>
    </Section>
  );
}

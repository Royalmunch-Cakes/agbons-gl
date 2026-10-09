import Link from "next/link";

import { Container, Section } from "@/components/site/section";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Section>
      <Container className="flex flex-col items-center gap-6 py-10 text-center">
        <p className="eyebrow">404</p>
        <h1 className="max-w-xl text-5xl leading-tight text-balance md:text-6xl">
          This page has slipped off the runway
        </h1>
        <p className="max-w-md text-muted-foreground">
          The page you’re looking for doesn’t exist or has moved. Our
          collections are just a step away.
        </p>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button size="xl" nativeButton={false} render={<Link href="/shop" />}>
            Shop the collections
          </Button>
          <Button
            variant="outline"
            size="xl"
            nativeButton={false}
            render={<Link href="/" />}
          >
            Back to home
          </Button>
        </div>
      </Container>
    </Section>
  );
}

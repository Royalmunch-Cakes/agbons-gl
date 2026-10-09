"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Container, Section } from "@/components/site/section";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Section>
      <Container className="flex flex-col items-center gap-6 py-10 text-center">
        <p className="eyebrow">Something went wrong</p>
        <h1 className="max-w-xl text-5xl leading-tight text-balance">
          We couldn’t load this page
        </h1>
        <p className="max-w-md text-muted-foreground">
          Please try again. If the problem continues, reach us on WhatsApp or
          through the contact page.
        </p>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button size="xl" onClick={() => retry()}>
            Try again
          </Button>
          <Button
            variant="outline"
            size="xl"
            nativeButton={false}
            render={<Link href="/contact" />}
          >
            Contact us
          </Button>
        </div>
      </Container>
    </Section>
  );
}

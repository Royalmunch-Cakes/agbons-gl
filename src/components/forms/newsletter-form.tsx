"use client";

import { useActionState } from "react";

import { subscribeNewsletter } from "@/app/actions/forms";
import {
  FormStatus,
  Honeypot,
  SubmitButton,
  fieldProps,
  withAttempt,
} from "@/components/forms/form-kit";
import { Container, Section } from "@/components/site/section";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { trackEvent } from "@/lib/analytics";
import { idleState } from "@/lib/forms/schemas";

/**
 * Newsletter signup with a visible success state (fixes audit §5.8) and no
 * stray plugin notices (fixes §5.7 "Registration is currently disabled").
 */
export function NewsletterForm() {
  const [state, action, pending] = useActionState(
    withAttempt(async (prev: Parameters<typeof subscribeNewsletter>[0], data: FormData) => {
      const next = await subscribeNewsletter(prev, data);
      if (next.status === "success") trackEvent("sign_up", { method: "newsletter" });
      return next;
    }),
    idleState,
  );
  const email = fieldProps(state, "email");

  if (state.status === "success") return <FormStatus state={state} />;

  return (
    <form key={state.attempt} action={action} className="relative flex w-full flex-col gap-3" noValidate>
      <Honeypot />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <Field data-invalid={email.invalid || undefined} className="flex-1">
          <FieldLabel htmlFor="newsletter-email" className="sr-only">
            Email address
          </FieldLabel>
          <Input
            id="newsletter-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Your email address"
            defaultValue={email.defaultValue}
            aria-invalid={email.invalid || undefined}
            required
            className="h-12 bg-card px-4 text-base md:text-sm"
          />
          <FieldError errors={email.errors} />
        </Field>
        <SubmitButton pending={pending}>Subscribe</SubmitButton>
      </div>
      {state.status === "error" && !email.invalid && <FormStatus state={state} />}
      <p className="text-xs text-muted-foreground">
        New collections, trunk shows and atelier stories. Unsubscribe anytime.
      </p>
    </form>
  );
}

export function NewsletterSection() {
  return (
    <Section className="border-t">
      <Container className="flex max-w-3xl flex-col items-center gap-6 text-center">
        <p className="eyebrow">The AGBONS-GL circle</p>
        <h2 className="text-4xl md:text-5xl">Join Our Newsletter</h2>
        <NewsletterForm />
      </Container>
    </Section>
  );
}

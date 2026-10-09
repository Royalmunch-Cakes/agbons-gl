"use client";

import { useActionState } from "react";

import { sendContact } from "@/app/actions/forms";
import {
  ConsentField,
  FormStatus,
  Honeypot,
  SelectField,
  SubmitButton,
  TextField,
} from "@/components/forms/form-kit";
import { FieldGroup } from "@/components/ui/field";
import { trackEvent } from "@/lib/analytics";
import { consultationLabels, idleState } from "@/lib/forms/schemas";

/** Contact form with a real backend (fixes audit §5.9 — no form existed). */
export function ContactForm() {
  const [state, action, pending] = useActionState(
    async (prev: Parameters<typeof sendContact>[0], data: FormData) => {
      const next = await sendContact(prev, data);
      if (next.status === "success") trackEvent("contact", { method: "form" });
      return next;
    },
    idleState,
  );

  if (state.status === "success") return <FormStatus state={state} />;

  return (
    <form action={action} className="relative" noValidate>
      <Honeypot />
      <FieldGroup>
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField state={state} name="name" label="Full name" autoComplete="name" required />
          <TextField
            state={state}
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            required
          />
          <TextField
            state={state}
            name="phone"
            label="Phone / WhatsApp (optional)"
            type="tel"
            autoComplete="tel"
          />
          <SelectField
            state={state}
            name="subject"
            label="I'm enquiring about"
            placeholder="Choose a subject"
            options={consultationLabels.subject}
            required
          />
        </div>
        <TextField state={state} name="message" label="Message" multiline required />
        <ConsentField state={state} />
        {state.status === "error" && <FormStatus state={state} />}
        <SubmitButton pending={pending} className="self-start">
          Send message
        </SubmitButton>
      </FieldGroup>
    </form>
  );
}

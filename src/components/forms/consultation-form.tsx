"use client";

import { MessageCircleIcon } from "lucide-react";
import { useActionState } from "react";

import { submitConsultation } from "@/app/actions/forms";
import {
  ConsentField,
  DatePickerField,
  FormStatus,
  Honeypot,
  SelectField,
  SubmitButton,
  TextField,
  fieldProps,
  withAttempt,
} from "@/components/forms/form-kit";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { trackEvent } from "@/lib/analytics";
import { consultationLabels, idleState } from "@/lib/forms/schemas";

/**
 * Structured bespoke consultation intake (audit §7: replaces ad hoc
 * WhatsApp conversations with measurements, occasion, timeline and budget).
 * On success the client can continue on WhatsApp with a pre-filled summary.
 */
export function ConsultationForm({
  collections,
  defaultCollection,
}: {
  collections: string[];
  defaultCollection?: string;
}) {
  const [state, action, pending] = useActionState(
    withAttempt(async (prev: Parameters<typeof submitConsultation>[0], data: FormData) => {
      const next = await submitConsultation(prev, data);
      if (next.status === "success")
        trackEvent("generate_lead", { form: "consultation" });
      return next;
    }),
    idleState,
  );

  if (state.status === "success") {
    return (
      <div className="flex flex-col gap-4">
        <FormStatus state={state} />
        {state.whatsappUrl && (
          <Button
            size="xl"
            className="self-start"
            nativeButton={false}
            render={
              <a
                href={state.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("whatsapp_click", { intent: "consultation" })}
              />
            }
          >
            <MessageCircleIcon data-icon="inline-start" />
            Continue on WhatsApp
          </Button>
        )}
      </div>
    );
  }

  const fitting = fieldProps(state, "fitting");
  const collectionOptions = Object.fromEntries(
    [...collections, "Not sure yet — I'd like guidance"].map((c) => [c, c]),
  );

  return (
    <form key={state.attempt} action={action} className="relative" noValidate>
      <Honeypot />
      <FieldGroup className="gap-10">
        <FieldSet>
          <FieldLegend className="font-heading text-2xl">About you</FieldLegend>
          <div className="grid gap-6 sm:grid-cols-2">
            <TextField state={state} name="name" label="Full name" autoComplete="name" allow="name" required />
            <TextField state={state} name="email" label="Email" type="email" autoComplete="email" required />
            <TextField
              state={state}
              name="phone"
              label="Phone / WhatsApp"
              type="tel"
              autoComplete="tel"
              placeholder="+234 705 000 0000"
              allow="phone"
              required
            />
            <TextField
              state={state}
              name="location"
              label="City & country"
              autoComplete="address-level2"
              placeholder="e.g. Lagos, Nigeria"
              allow="place"
              required
            />
          </div>
        </FieldSet>

        <FieldSet>
          <FieldLegend className="font-heading text-2xl">Your occasion</FieldLegend>
          <div className="grid gap-6 sm:grid-cols-2">
            <SelectField
              state={state}
              name="eventType"
              label="Occasion"
              placeholder="Choose the occasion"
              options={consultationLabels.eventType}
              required
            />
            <DatePickerField state={state} name="eventDate" label="Event date" />
            <SelectField
              state={state}
              name="collection"
              defaultValue={defaultCollection}
              label="Collection of interest (optional)"
              placeholder="Choose a collection"
              options={collectionOptions}
            />
            <SelectField
              state={state}
              name="budget"
              label="Budget"
              placeholder="Choose a range"
              options={consultationLabels.budget}
              required
            />
          </div>
        </FieldSet>

        <FieldSet>
          <FieldLegend className="font-heading text-2xl">Fitting & measurements</FieldLegend>
          <FieldDescription>
            Couture is made to your measurements. Choose how you&apos;d like to be measured.
          </FieldDescription>
          <Field data-invalid={fitting.invalid || undefined}>
            <RadioGroup
              name="fitting"
              defaultValue={fitting.defaultValue}
              aria-invalid={fitting.invalid || undefined}
              className="gap-3"
            >
              {Object.entries(consultationLabels.fitting).map(([value, label]) => (
                <FieldLabel
                  key={value}
                  htmlFor={`fitting-${value}`}
                  className="flex items-center gap-3 border bg-card p-4 font-normal has-data-checked:border-primary"
                >
                  <RadioGroupItem id={`fitting-${value}`} value={value} />
                  {label}
                </FieldLabel>
              ))}
            </RadioGroup>
            <FieldError errors={fitting.errors} />
          </Field>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {(["bust", "waist", "hips", "height"] as const).map((m) => (
              <TextField
                key={m}
                state={state}
                name={m}
                label={`${m[0].toUpperCase()}${m.slice(1)} (cm)`}
                allow="measurement"
              />
            ))}
          </div>
          <FieldDescription>Measurements are optional — we&apos;ll confirm them at your fitting.</FieldDescription>
        </FieldSet>

        <FieldSet>
          <FieldLegend className="font-heading text-2xl">Your vision</FieldLegend>
          <TextField
            state={state}
            name="vision"
            label="Tell us about the look you imagine (optional)"
            description="Silhouettes, fabrics, colours, inspiration — anything that helps us prepare."
            multiline
          />
        </FieldSet>

        <ConsentField state={state} />
        {state.status === "error" && <FormStatus state={state} />}
        <SubmitButton pending={pending} className="self-start">
          Request consultation
        </SubmitButton>
      </FieldGroup>
    </form>
  );
}

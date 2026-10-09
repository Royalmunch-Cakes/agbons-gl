"use client";

import { CircleAlertIcon, CircleCheckIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import type { FormState } from "@/lib/forms/schemas";

/** Comfortable mobile tap target for every control (44px). */
export const controlClass = "h-11 w-full bg-card px-3 text-base md:text-sm";

export function fieldProps(state: FormState, name: string) {
  const errors = state.status === "error" ? state.fieldErrors?.[name] : undefined;
  const defaultValue = state.status === "error" ? state.values?.[name] : undefined;
  return {
    invalid: Boolean(errors?.length),
    errors: errors?.map((message) => ({ message })),
    defaultValue,
  };
}

/** Hidden honeypot field; see isBot() in app/actions/forms.ts. */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Company
        <input type="text" name="company" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

export function FormStatus({ state }: { state: FormState }) {
  if (state.status === "idle") return null;
  const success = state.status === "success";
  return (
    <Alert variant={success ? "default" : "destructive"} aria-live="polite">
      {success ? <CircleCheckIcon /> : <CircleAlertIcon />}
      <AlertTitle>{success ? "Thank you" : "Please try again"}</AlertTitle>
      <AlertDescription>{state.message}</AlertDescription>
    </Alert>
  );
}

export function SubmitButton({
  pending,
  children,
  className,
}: {
  pending: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Button type="submit" size="xl" disabled={pending} className={className}>
      {pending && <Spinner data-icon="inline-start" />}
      {children}
    </Button>
  );
}

/** Labelled Select bound to a form field via a hidden input. */
export function SelectField({
  state,
  name,
  label,
  placeholder,
  options,
  required,
  defaultValue,
}: {
  state: FormState;
  name: string;
  label: string;
  placeholder: string;
  options: Record<string, string>;
  required?: boolean;
  defaultValue?: string;
}) {
  const f = fieldProps(state, name);
  const items = Object.entries(options).map(([value, label]) => ({ value, label }));
  return (
    <Field data-invalid={f.invalid || undefined}>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <Select
        name={name}
        items={items}
        defaultValue={f.defaultValue ?? defaultValue ?? null}
        required={required}
      >
        <SelectTrigger id={name} aria-invalid={f.invalid || undefined} className={controlClass}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <FieldError errors={f.errors} />
    </Field>
  );
}

export function TextField({
  state,
  name,
  label,
  description,
  multiline,
  className,
  ...inputProps
}: {
  state: FormState;
  name: string;
  label: string;
  description?: string;
  multiline?: boolean;
  className?: string;
} & Omit<React.ComponentProps<"input">, "name" | "defaultValue" | "className">) {
  const f = fieldProps(state, name);
  const common = {
    id: name,
    name,
    defaultValue: f.defaultValue,
    "aria-invalid": f.invalid || undefined,
    required: inputProps.required,
    placeholder: inputProps.placeholder,
  };
  return (
    <Field data-invalid={f.invalid || undefined} className={className}>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      {multiline ? (
        <Textarea {...common} rows={5} className="min-h-32 bg-card px-3 text-base md:text-sm" />
      ) : (
        <Input {...inputProps} {...common} className={controlClass} />
      )}
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError errors={f.errors} />
    </Field>
  );
}

export function ConsentField({ state }: { state: FormState }) {
  const f = fieldProps(state, "consent");
  return (
    <Field orientation="horizontal" data-invalid={f.invalid || undefined}>
      <Checkbox
        id="consent"
        name="consent"
        required
        aria-invalid={f.invalid || undefined}
      />
      <div className="flex flex-col gap-1">
        <FieldLabel htmlFor="consent" className="font-normal">
          I agree to AGBONS-GL contacting me about this enquiry, as described in
          the privacy policy.
        </FieldLabel>
        <FieldError errors={f.errors} />
      </div>
    </Field>
  );
}

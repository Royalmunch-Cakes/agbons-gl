import { z } from "zod";

import {
  MEASUREMENT_PATTERN,
  NAME_PATTERN,
  PHONE_PATTERN,
  PLACE_PATTERN,
} from "@/lib/forms/input-rules";

/** Shared validation for every public form (TRD §8 forms). */

const name = z
  .string()
  .trim()
  .min(2, "Please enter your name.")
  .max(120)
  .regex(
    NAME_PATTERN,
    "Names can only contain letters, spaces, hyphens and apostrophes.",
  );
const email = z.email("Please enter a valid email address.").max(200);
const phone = z
  .string()
  .trim()
  .min(7, "Please enter a phone or WhatsApp number.")
  .max(30)
  .regex(
    PHONE_PATTERN,
    "Phone numbers can only contain digits, spaces, brackets, dashes and a leading +.",
  )
  .refine((v) => {
    const digits = v.replace(/\D/g, "").length;
    return digits >= 7 && digits <= 15;
  }, "Please enter a phone number with 7–15 digits.");
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal("").transform(() => undefined));
/** Optional measurement in cm, digits with one optional decimal place, within a sane range. */
const measurement = (min: number, max: number) =>
  z
    .string()
    .trim()
    .optional()
    .transform((v) => v || undefined)
    .refine(
      (v) => v === undefined || MEASUREMENT_PATTERN.test(v),
      "Numbers only, e.g. 92 or 92.5.",
    )
    .refine(
      (v) => v === undefined || (Number(v) >= min && Number(v) <= max),
      `Please enter a value between ${min} and ${max} cm.`,
    );
const consent = z.literal("on", {
  error: "Please agree to be contacted about your enquiry.",
});

export const newsletterSchema = z.object({
  email,
});

export const contactSchema = z.object({
  name,
  email,
  phone: phone.optional().or(z.literal("").transform(() => undefined)),
  subject: z.enum(["order", "bespoke", "fitting", "press", "other"], {
    error: "Please choose a subject.",
  }),
  message: z
    .string()
    .trim()
    .min(10, "Please tell us a little more (at least 10 characters).")
    .max(4000),
  consent,
});

export const consultationSchema = z.object({
  name,
  email,
  phone,
  location: z
    .string()
    .trim()
    .min(2, "Please tell us where you are based.")
    .max(120)
    .regex(
      PLACE_PATTERN,
      "Please use letters, spaces and commas only, e.g. Lagos, Nigeria.",
    ),
  eventType: z.enum(["white-wedding", "traditional", "reception", "other"], {
    error: "Please choose the occasion.",
  }),
  eventDate: z.iso
    .date("Please choose your event date.")
    .refine(
      (d) => d >= new Date().toISOString().slice(0, 10),
      "Please choose a date in the future.",
    ),
  collection: optionalText(80),
  budget: z.enum(["under-2k", "2k-5k", "5k-10k", "10k-plus", "unsure"], {
    error: "Please choose a budget range.",
  }),
  fitting: z.enum(["studio", "virtual", "own-measurements"], {
    error: "Please choose how you'd like to be measured.",
  }),
  bust: measurement(50, 200),
  waist: measurement(40, 200),
  hips: measurement(50, 220),
  height: measurement(100, 230),
  vision: optionalText(4000),
  consent,
});

export type FieldErrors = Record<string, string[] | undefined>;

/**
 * `attempt` increments on every submission; forms use it as a React key so
 * all controls (incl. radios/checkboxes) remount with the submitted values
 * after React's automatic post-action form reset.
 */
export type FormState = { attempt?: number } & (
  | { status: "idle" }
  | { status: "success"; message: string; whatsappUrl?: string }
  | {
      status: "error";
      message: string;
      fieldErrors?: FieldErrors;
      values?: Record<string, string>;
    }
);

export const idleState: FormState = { status: "idle" };

export const consultationLabels = {
  eventType: {
    "white-wedding": "White wedding",
    traditional: "Traditional wedding",
    reception: "Reception / after-party",
    other: "Other occasion",
  },
  budget: {
    "under-2k": "Under $2,000",
    "2k-5k": "$2,000 – $5,000",
    "5k-10k": "$5,000 – $10,000",
    "10k-plus": "$10,000+",
    unsure: "Not sure yet",
  },
  fitting: {
    studio: "In-studio fitting in Benin City",
    virtual: "Virtual measurement session",
    "own-measurements": "I'll provide my own measurements",
  },
  subject: {
    order: "An order",
    bespoke: "A bespoke piece",
    fitting: "A fitting or appointment",
    press: "Press & collaborations",
    other: "Something else",
  },
} as const;

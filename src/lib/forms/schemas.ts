import { z } from "zod";

/** Shared validation for every public form (TRD §8 forms). */

const name = z.string().trim().min(2, "Please enter your name.").max(120);
const email = z.email("Please enter a valid email address.").max(200);
const phone = z
  .string()
  .trim()
  .min(7, "Please enter a phone or WhatsApp number.")
  .max(30)
  .regex(/^[+\d][\d\s()-]+$/, "Please enter a valid phone number.");
const optionalText = (max: number) =>
  z.string().trim().max(max).optional().or(z.literal("").transform(() => undefined));
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
  location: z.string().trim().min(2, "Please tell us where you are based.").max(120),
  eventType: z.enum(["white-wedding", "traditional", "reception", "other"], {
    error: "Please choose the occasion.",
  }),
  eventDate: z.iso.date("Please choose your event date."),
  collection: optionalText(80),
  budget: z.enum(["under-2k", "2k-5k", "5k-10k", "10k-plus", "unsure"], {
    error: "Please choose a budget range.",
  }),
  fitting: z.enum(["studio", "virtual", "own-measurements"], {
    error: "Please choose how you'd like to be measured.",
  }),
  bust: optionalText(10),
  waist: optionalText(10),
  hips: optionalText(10),
  height: optionalText(10),
  vision: optionalText(4000),
  consent,
});

export type FieldErrors = Record<string, string[] | undefined>;

export type FormState =
  | { status: "idle" }
  | { status: "success"; message: string; whatsappUrl?: string }
  | {
      status: "error";
      message: string;
      fieldErrors?: FieldErrors;
      values?: Record<string, string>;
    };

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

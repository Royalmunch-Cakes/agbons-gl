"use server";

import { z } from "zod";

import { siteConfig } from "@/config/site";
import { getSettings } from "@/lib/content";
import {
  consultationLabels,
  consultationSchema,
  contactSchema,
  newsletterSchema,
  type FormState,
} from "@/lib/forms/schemas";
import { deliverSubmission } from "@/lib/server/deliver";
import { subscribe } from "@/lib/server/newsletter";
import { whatsappUrl } from "@/lib/whatsapp";

const genericError = async () =>
  `Something went wrong sending your message. Please try again, or reach us on WhatsApp at ${(await getSettings()).contact.phone}.`;

function values(formData: FormData) {
  const out: Record<string, string> = {};
  formData.forEach((v, k) => {
    if (typeof v === "string" && !k.startsWith("$")) out[k] = v;
  });
  return out;
}

/** Honeypot: real visitors never fill the hidden `company` field. */
function isBot(formData: FormData) {
  return Boolean(formData.get("company"));
}

function invalid(error: z.ZodError, formData: FormData): FormState {
  return {
    status: "error",
    message: "Please check the highlighted fields.",
    fieldErrors: z.flattenError(error).fieldErrors,
    values: values(formData),
  };
}

export async function subscribeNewsletter(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (isBot(formData)) return { status: "success", message: "Thank you." };
  const parsed = newsletterSchema.safeParse(values(formData));
  if (!parsed.success) return invalid(parsed.error, formData);

  try {
    await subscribe(parsed.data.email);
  } catch (err) {
    console.error("[newsletter]", err);
    return { status: "error", message: "We couldn't subscribe you just now. Please try again shortly.", values: values(formData) };
  }
  return {
    status: "success",
    message: "Welcome to the AGBONS-GL circle. Please check your inbox to confirm your subscription.",
  };
}

export async function sendContact(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (isBot(formData)) return { status: "success", message: "Thank you." };
  const parsed = contactSchema.safeParse(values(formData));
  if (!parsed.success) return invalid(parsed.error, formData);
  const d = parsed.data;

  try {
    await deliverSubmission({
      kind: "contact",
      subject: `Website enquiry: ${consultationLabels.subject[d.subject]} — ${d.name}`,
      replyTo: d.email,
      fields: {
        Name: d.name,
        Email: d.email,
        Phone: d.phone,
        Subject: consultationLabels.subject[d.subject],
        Message: d.message,
      },
    });
  } catch {
    return { status: "error", message: await genericError(), values: values(formData) };
  }
  return {
    status: "success",
    message: `Thank you, ${d.name.split(" ")[0]}. Our team will reply within one working day.`,
  };
}

/** Structured bespoke intake (audit §7: replace ad hoc WhatsApp conversations). */
export async function submitConsultation(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (isBot(formData)) return { status: "success", message: "Thank you." };
  const parsed = consultationSchema.safeParse(values(formData));
  if (!parsed.success) return invalid(parsed.error, formData);
  const d = parsed.data;

  const measurements = [
    d.bust && `Bust ${d.bust}`,
    d.waist && `Waist ${d.waist}`,
    d.hips && `Hips ${d.hips}`,
    d.height && `Height ${d.height}`,
  ]
    .filter(Boolean)
    .join(", ");

  const fields = {
    Name: d.name,
    Email: d.email,
    "Phone / WhatsApp": d.phone,
    Location: d.location,
    Occasion: consultationLabels.eventType[d.eventType],
    "Event date": d.eventDate,
    "Collection of interest": d.collection,
    Budget: consultationLabels.budget[d.budget],
    Measuring: consultationLabels.fitting[d.fitting],
    "Measurements (cm)": measurements || undefined,
    Vision: d.vision,
  };

  try {
    await deliverSubmission({
      kind: "consultation",
      subject: `Bridal consultation request — ${d.name} (${d.eventDate})`,
      replyTo: d.email,
      fields,
    });
  } catch {
    return { status: "error", message: await genericError(), values: values(formData) };
  }

  const summary = [
    `Hello ${siteConfig.name}, I've just submitted a consultation request on your website.`,
    "",
    `Name: ${d.name}`,
    `Occasion: ${fields.Occasion} on ${d.eventDate}`,
    `Budget: ${fields.Budget}`,
    ...(d.collection ? [`Interested in: ${d.collection}`] : []),
  ].join("\n");

  return {
    status: "success",
    message: `Thank you, ${d.name.split(" ")[0]}. Your request is with our atelier team — we'll contact you within one working day to confirm your appointment.`,
    whatsappUrl: whatsappUrl(summary, (await getSettings()).contact.whatsapp),
  };
}

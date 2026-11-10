import "server-only";

/**
 * Server-only settings for form delivery and the newsletter ESP
 * (TRD §8 forms). See `.env.example` for documentation of each value.
 */
const mailchimpKey = (process.env.MAILCHIMP_API_KEY || "").trim();

/**
 * Mailchimp keys end with their datacenter ("…-us21"), and the API only
 * accepts calls to that datacenter. Take it from the key so a mistyped
 * MAILCHIMP_SERVER_PREFIX can't break sign-ups; the variable is only a
 * fallback for keys without a suffix.
 */
const mailchimpDatacenter =
  mailchimpKey.match(/-([a-z]+\d+)$/)?.[1] ??
  (process.env.MAILCHIMP_SERVER_PREFIX || "").trim();

export const serverEnv = {
  newsletterProvider: (process.env.NEWSLETTER_PROVIDER || "log") as
    | "mailchimp"
    | "log",
  mailchimp: {
    apiKey: mailchimpKey,
    serverPrefix: mailchimpDatacenter,
    audienceId: (process.env.MAILCHIMP_AUDIENCE_ID || "").trim(),
  },
  resendApiKey: process.env.RESEND_API_KEY || "",
  notifyEmail: process.env.FORMS_NOTIFY_EMAIL || "",
  fromEmail: process.env.FORMS_FROM_EMAIL || "",
  webhookUrl: process.env.FORMS_WEBHOOK_URL || "",
};

import "server-only";

/**
 * Server-only settings for form delivery and the newsletter ESP
 * (TRD §8 forms). See `.env.example` for documentation of each value.
 */
export const serverEnv = {
  newsletterProvider: (process.env.NEWSLETTER_PROVIDER || "log") as
    | "mailchimp"
    | "log",
  mailchimp: {
    apiKey: process.env.MAILCHIMP_API_KEY || "",
    serverPrefix: process.env.MAILCHIMP_SERVER_PREFIX || "",
    audienceId: process.env.MAILCHIMP_AUDIENCE_ID || "",
  },
  resendApiKey: process.env.RESEND_API_KEY || "",
  notifyEmail: process.env.FORMS_NOTIFY_EMAIL || "",
  fromEmail: process.env.FORMS_FROM_EMAIL || "",
  webhookUrl: process.env.FORMS_WEBHOOK_URL || "",
};

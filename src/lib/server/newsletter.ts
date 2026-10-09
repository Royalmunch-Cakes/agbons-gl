import "server-only";

import { createHash } from "node:crypto";

import { serverEnv } from "@/config/server-env";

/**
 * Newsletter subscription (audit §5.8: backend previously unknown). Upserts
 * the contact into a Mailchimp audience; `NEWSLETTER_PROVIDER=log` logs
 * instead, for local development.
 */
export async function subscribe(email: string): Promise<void> {
  if (serverEnv.newsletterProvider !== "mailchimp") {
    console.info(`[newsletter] subscribe ${email}`);
    return;
  }

  const { apiKey, serverPrefix, audienceId } = serverEnv.mailchimp;
  if (!apiKey || !serverPrefix || !audienceId) {
    throw new Error("Mailchimp is not configured");
  }

  const hash = createHash("md5").update(email.toLowerCase()).digest("hex");
  const res = await fetch(
    `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceId}/members/${hash}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Basic ${Buffer.from(`agbons:${apiKey}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: email,
        status_if_new: "pending", // double opt-in
      }),
    },
  );
  if (!res.ok) throw new Error(`Mailchimp ${res.status}: ${await res.text()}`);
}

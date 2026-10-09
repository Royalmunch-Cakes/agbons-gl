import "server-only";

import { serverEnv } from "@/config/server-env";

type Submission = {
  kind: "contact" | "consultation";
  subject: string;
  replyTo: string;
  fields: Record<string, string | undefined>;
};

/**
 * Delivers a form submission (TRD §8: contact form needs a real endpoint).
 * Sends email via Resend and/or POSTs JSON to a webhook (Zapier, Make,
 * Slack, CRM). With neither configured, logs to the server console so
 * local development still works.
 */
export async function deliverSubmission(s: Submission): Promise<void> {
  const tasks: Promise<void>[] = [];
  const lines = Object.entries(s.fields)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`);

  if (serverEnv.resendApiKey && serverEnv.notifyEmail && serverEnv.fromEmail) {
    tasks.push(
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${serverEnv.resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: serverEnv.fromEmail,
          to: [serverEnv.notifyEmail],
          reply_to: s.replyTo,
          subject: s.subject,
          text: lines.join("\n"),
        }),
      }).then(async (res) => {
        if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
      }),
    );
  }

  if (serverEnv.webhookUrl) {
    tasks.push(
      fetch(serverEnv.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: s.kind,
          subject: s.subject,
          submittedAt: new Date().toISOString(),
          ...s.fields,
        }),
      }).then((res) => {
        if (!res.ok) throw new Error(`Webhook ${res.status}`);
      }),
    );
  }

  if (!tasks.length) {
    console.info(`[forms] ${s.subject}\n  ${lines.join("\n  ")}`);
    return;
  }

  const results = await Promise.allSettled(tasks);
  const failures = results.filter((r) => r.status === "rejected");
  failures.forEach((f) => console.error("[forms] delivery failed:", f.reason));
  // Succeed if at least one channel delivered.
  if (failures.length === results.length) {
    throw new Error("All delivery channels failed");
  }
}

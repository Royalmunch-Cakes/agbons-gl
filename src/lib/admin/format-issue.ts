import type { z } from "zod";

/**
 * Editor-friendly validation message: "Question is required. (#1 › items #5)".
 * Array positions are shown 1-based and the final field name is dropped
 * (the message already names it).
 */
export function formatIssue(error: z.ZodError) {
  const issue = error.issues[0];
  const parts: string[] = [];
  issue.path.forEach((seg, i) => {
    const last = i === issue.path.length - 1;
    if (typeof seg === "number") {
      if (parts.length && !parts[parts.length - 1].includes("#")) {
        parts[parts.length - 1] += ` #${seg + 1}`;
      } else {
        parts.push(`#${seg + 1}`);
      }
    } else if (!last) {
      parts.push(String(seg));
    }
  });
  return parts.length
    ? `${issue.message} (${parts.join(" › ")})`
    : issue.message;
}

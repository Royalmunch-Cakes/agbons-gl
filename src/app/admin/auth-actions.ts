"use server";

import { redirect } from "next/navigation";

import { adminConfigured, passwordMatches } from "@/lib/admin-session";
import { endSession, startSession } from "@/lib/server/admin-auth";

export type LoginState = { error?: string };

/** Only allow redirects back into the admin area. */
function safeNext(value: FormDataEntryValue | null) {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin";
}

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  if (!adminConfigured()) {
    return {
      error:
        "The admin dashboard isn't configured. Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET (32+ characters).",
    };
  }
  const password = formData.get("password");
  if (typeof password !== "string" || !(await passwordMatches(password))) {
    // Slow down guessing.
    await new Promise((r) => setTimeout(r, 800));
    return { error: "That password isn't correct." };
  }
  await startSession();
  redirect(safeNext(formData.get("next")));
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

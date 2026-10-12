import "server-only";

import { headers } from "next/headers";

/**
 * In-memory fixed-window rate limiter for public server actions (forms,
 * admin login). Cheap — a Map lookup, no network calls — so it adds no
 * meaningful CPU and never calls a paid API.
 *
 * Counters live per server instance. On Vercel (Fluid compute) and Netlify,
 * warm instances are reused, so this stops bursts from one visitor; the
 * platform firewall rule in the deploy docs is the stronger, global layer
 * that blocks abuse before any function runs.
 */

type Window = { count: number; resetAt: number };

const windows = new Map<string, Window>();
const MAX_TRACKED = 10_000;

export type RateRule = { limit: number; windowMs: number };

export const RATE_RULES = {
  /** Contact, consultation and newsletter submissions per IP. */
  form: { limit: 5, windowMs: 10 * 60_000 },
  /** Admin sign-in attempts per IP. */
  login: { limit: 10, windowMs: 15 * 60_000 },
} satisfies Record<string, RateRule>;

async function clientIp() {
  const h = await headers();
  // Platform-set headers first (clients can't spoof these); the first
  // x-forwarded-for entry is only a fallback for local/other hosts.
  return (
    h.get("x-nf-client-connection-ip") ??
    h.get("x-real-ip") ??
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

function prune(now: number) {
  for (const [key, w] of windows) if (w.resetAt <= now) windows.delete(key);
  // Hard cap so a flood of spoofed IPs can't grow memory without bound.
  if (windows.size > MAX_TRACKED) windows.clear();
}

/**
 * Counts one request for `bucket` from the current visitor. Returns
 * `{ ok: false, retryAfter }` (seconds) once the limit is exceeded.
 */
export async function rateLimit(
  bucket: keyof typeof RATE_RULES,
): Promise<{ ok: true } | { ok: false; retryAfter: number }> {
  const rule = RATE_RULES[bucket];
  const now = Date.now();
  if (windows.size > MAX_TRACKED / 2) prune(now);

  const key = `${bucket}:${await clientIp()}`;
  const w = windows.get(key);
  if (!w || w.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + rule.windowMs });
    return { ok: true };
  }
  w.count += 1;
  if (w.count > rule.limit) {
    return { ok: false, retryAfter: Math.ceil((w.resetAt - now) / 1000) };
  }
  return { ok: true };
}

export function retryMessage(retryAfter: number) {
  const minutes = Math.max(1, Math.ceil(retryAfter / 60));
  return `Too many attempts. Please try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`;
}

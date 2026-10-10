/**
 * Admin session tokens (shared between proxy.ts and server code; Web Crypto
 * only, so it runs in any runtime).
 *
 * Token: base64url(JSON payload) + "." + base64url(HMAC-SHA256(payload)).
 */

export const ADMIN_COOKIE = "agbons_admin";
export const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours

type Payload = { exp: number };

const enc = new TextEncoder();

function b64url(bytes: ArrayBuffer | Uint8Array) {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let s = "";
  for (const b of arr) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64url(s: string) {
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 32) return null;
  return value;
}

async function hmac(data: string, key: string) {
  const k = await crypto.subtle.importKey(
    "raw",
    enc.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return crypto.subtle.sign("HMAC", k, enc.encode(data));
}

/** Constant-time comparison of two byte arrays. */
function equal(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export function adminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD && secret());
}

export async function createSessionToken(): Promise<string> {
  const key = secret();
  if (!key)
    throw new Error("ADMIN_SESSION_SECRET must be at least 32 characters.");
  const payload: Payload = {
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const body = b64url(enc.encode(JSON.stringify(payload)));
  return `${body}.${b64url(await hmac(body, key))}`;
}

export async function verifySessionToken(
  token: string | undefined,
): Promise<boolean> {
  const key = secret();
  if (!token || !key) return false;
  const [body, sig] = token.split(".");
  if (!body || !sig) return false;
  try {
    const expected = new Uint8Array(await hmac(body, key));
    if (!equal(expected, fromB64url(sig))) return false;
    const payload = JSON.parse(
      new TextDecoder().decode(fromB64url(body)),
    ) as Payload;
    return typeof payload.exp === "number" && payload.exp > Date.now() / 1000;
  } catch {
    return false;
  }
}

/** Constant-time password check (compares SHA-256 digests). */
export async function passwordMatches(candidate: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const [a, b] = await Promise.all([
    crypto.subtle.digest("SHA-256", enc.encode(candidate)),
    crypto.subtle.digest("SHA-256", enc.encode(expected)),
  ]);
  return equal(new Uint8Array(a), new Uint8Array(b));
}

import "server-only";

import { createHash, randomUUID } from "node:crypto";

import { serverEnv } from "@/config/server-env";

/** True when admin uploads can go to Cloudinary. */
export function cloudinaryConfigured() {
  const c = serverEnv.cloudinary;
  return Boolean(c.cloudName && c.apiKey && c.apiSecret);
}

function sign(params: Record<string, string>, secret: string) {
  const str = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return createHash("sha1").update(str + secret).digest("hex");
}

/**
 * Signed upload of an admin image to `<folder>/uploads/<year>/<uuid>`.
 * Returns the Cloudinary delivery URL that content documents store.
 */
export async function uploadImageToCloudinary(file: File): Promise<string> {
  const { cloudName, apiKey, apiSecret, folder } = serverEnv.cloudinary;
  const year = new Date().getFullYear();
  const params = {
    asset_folder: `${folder}/uploads/${year}`,
    public_id: `${folder}/uploads/${year}/${randomUUID()}`,
    timestamp: String(Math.floor(Date.now() / 1000)),
  };
  const form = new FormData();
  for (const [k, v] of Object.entries(params)) form.append(k, v);
  form.append("api_key", apiKey);
  form.append("signature", sign(params, apiSecret));
  form.append("file", file, file.name);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: form, signal: AbortSignal.timeout(30_000) },
  );
  const json = (await res.json().catch(() => ({}))) as {
    secure_url?: string;
    error?: { message?: string };
  };
  if (!res.ok || !json.secure_url) {
    throw new Error(
      `Cloudinary upload failed (${res.status}): ${json.error?.message ?? "no URL returned"}`,
    );
  }
  return json.secure_url;
}

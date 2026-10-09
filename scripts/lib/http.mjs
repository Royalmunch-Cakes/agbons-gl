import fs from "node:fs";
import https from "node:https";
import path from "node:path";

/**
 * Minimal HTTPS helpers for the migration scripts.
 *
 * `insecure` disables TLS certificate verification. The current WordPress
 * host serves an untrusted certificate chain (SEC_E_UNTRUSTED_ROOT), so the
 * one-off migration needs it; never use it for anything but reading public
 * content from that host.
 */
function agent(insecure) {
  return new https.Agent({ rejectUnauthorized: !insecure });
}

function get(url, insecure, redirects = 5) {
  return new Promise((resolve, reject) => {
    https
      .get(
        url,
        { agent: agent(insecure), headers: { "User-Agent": "agbons-gl-migration/1.0" } },
        (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && redirects > 0) {
            res.resume();
            resolve(get(new URL(res.headers.location, url).toString(), insecure, redirects - 1));
            return;
          }
          if (res.statusCode !== 200) {
            res.resume();
            reject(new Error(`GET ${url} → HTTP ${res.statusCode}`));
            return;
          }
          resolve(res);
        },
      )
      .on("error", reject);
  });
}

export async function getJson(url, insecure) {
  const res = await get(url, insecure);
  const chunks = [];
  for await (const chunk of res) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

/** Downloads `url` to `dest`, skipping files that already exist. Returns true if downloaded. */
export async function download(url, dest, insecure) {
  if (fs.existsSync(dest)) return false;
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const res = await get(url, insecure);
  const tmp = `${dest}.part`;
  await new Promise((resolve, reject) => {
    const out = fs.createWriteStream(tmp);
    res.pipe(out);
    out.on("finish", resolve);
    out.on("error", reject);
    res.on("error", reject);
  });
  fs.renameSync(tmp, dest);
  return true;
}

export function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        args[key] = next;
        i++;
      } else {
        args[key] = true;
      }
    } else {
      args._.push(a);
    }
  }
  return args;
}

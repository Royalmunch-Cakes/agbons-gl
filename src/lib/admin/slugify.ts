/**
 * URL slug from a title: lowercase ASCII letters, digits and single hyphens.
 * `typing` keeps a trailing hyphen so it can be typed between words.
 */
export function slugify(value: string, typing = false) {
  const slug = value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+/, "")
    .replace(/-{2,}/g, "-");
  return typing ? slug : slug.replace(/-+$/, "");
}

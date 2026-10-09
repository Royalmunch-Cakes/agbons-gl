/**
 * Character rules for form inputs. Applied while typing/pasting on the
 * client (form-kit TextField `allow`) and mirrored by the zod schemas in
 * ./schemas.ts, which remain the source of truth on the server.
 */

export type InputRule = "name" | "place" | "phone" | "measurement";

type Rule = {
  sanitize: (value: string) => string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoCapitalize?: string;
  maxLength?: number;
};

/** Letters (any language), spaces, hyphens, apostrophes and full stops. */
export const NAME_PATTERN = /^\p{L}[\p{L}\s'’.-]*$/u;
/** As names, plus commas — e.g. "Port Harcourt, Nigeria". */
export const PLACE_PATTERN = /^\p{L}[\p{L}\s'’.,-]*$/u;
/** Digits with an optional leading +, spaces, brackets and dashes. */
export const PHONE_PATTERN = /^\+?[\d\s()-]+$/;
/** Up to 3 digits with an optional single decimal place. */
export const MEASUREMENT_PATTERN = /^\d{1,3}(\.\d)?$/;

/** Collapses doubled spaces and spaces before commas left by stripped characters. */
const tidy = (v: string) => v.replace(/\s+,/g, ",").replace(/\s{2,}/g, " ");

export const inputRules: Record<InputRule, Rule> = {
  name: {
    sanitize: (v) => tidy(v.replace(/[^\p{L}\s'’.-]/gu, "")),
    autoCapitalize: "words",
    maxLength: 120,
  },
  place: {
    sanitize: (v) => tidy(v.replace(/[^\p{L}\s'’.,-]/gu, "")),
    autoCapitalize: "words",
    maxLength: 120,
  },
  phone: {
    // Keep a single leading "+" and only digits, spaces, brackets, dashes.
    sanitize: (v) => {
      const kept = v.replace(/[^\d\s()+-]/g, "").trimStart();
      const plus = kept.startsWith("+") ? "+" : "";
      return plus + kept.replace(/\+/g, "").trimStart();
    },
    inputMode: "tel",
    maxLength: 20,
  },
  measurement: {
    // Digits and at most one decimal point, one decimal place.
    sanitize: (v) => {
      const [int = "", ...rest] = v.replace(/[^\d.]/g, "").split(".");
      return rest.length ? `${int.slice(0, 3)}.${rest.join("").slice(0, 1)}` : int.slice(0, 3);
    },
    inputMode: "decimal",
    maxLength: 5,
  },
};

import { omr } from "./format";

/** Sample promo rules (concept store). Money is integer baisa (1 OMR = 1000 baisa). */
export const FREE_EXPRESS_AT = 15000; // OMR 15.000: subtotal at or above this unlocks free express delivery

type Rule = { min: number; off: (subtotal: number) => number; label: string };
const rules: Record<string, Rule> = {
  ONTREND10: { min: 0, off: (s) => Math.round(s * 0.1), label: "10% off" },
  WELCOME1: { min: 10000, off: () => 1000, label: "OMR 1.000 off" },
};

export const normaliseCode = (s: string) => s.replace(/\s+/g, "").toUpperCase();
export const isKnownCode = (code: string) => code in rules;

/** The discount a code gives on this subtotal (0 when the minimum is not met). */
export const discountFor = (code: string | null, subtotal: number) => {
  const r = code ? rules[code] : undefined;
  return r && subtotal >= r.min ? Math.min(r.off(subtotal), subtotal) : 0;
};

/** Why a known code gives nothing right now, or null. */
export const codeNote = (code: string | null, subtotal: number) => {
  const r = code ? rules[code] : undefined;
  return r && subtotal < r.min ? `needs ${omr(r.min)} in your cart` : null;
};

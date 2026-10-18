"use client";

import { MAX_QTY } from "./CartProvider";

export function Stepper({
  value, onChange, label, small = false,
}: { value: number; onChange: (n: number) => void; label: string; small?: boolean }) {
  return (
    <div className={`stepper${small ? " stepper-sm" : ""}`} role="group" aria-label={label}>
      <button type="button" onClick={() => onChange(value - 1)} aria-label="Decrease quantity" disabled={value <= 1}>
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
      </button>
      <span aria-live="polite">{value}</span>
      <button type="button" onClick={() => onChange(value + 1)} aria-label="Increase quantity" disabled={value >= MAX_QTY}>
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7h10M7 2v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
      </button>
    </div>
  );
}

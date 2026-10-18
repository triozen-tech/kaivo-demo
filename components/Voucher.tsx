"use client";

import { useId, useRef, useState } from "react";
import { useCart } from "./CartProvider";

/** Promo code box. Sample codes: ONTREND10, WELCOME1. */
export function Voucher() {
  const { code, codeNote, applyCode, removeCode } = useCart();
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const id = useId();

  const submit = () => {
    const r = applyCode(text);
    if (r.ok) { setText(""); setError(""); return; }
    setError(r.message ?? "That code isn't valid");
    setShake((n) => n + 1);
    input.current?.focus();
  };

  if (code)
    return (
      <div className="voucher">
        <div className={`chip${codeNote ? " chip-warn" : ""}`}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8.5l3.2 3L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <span>{codeNote ? `${code} ${codeNote}` : `${code} applied`}</span>
          <button type="button" onClick={removeCode} aria-label={`Remove code ${code}`}>
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </button>
        </div>
      </div>
    );

  return (
    <div className="voucher">
      <label htmlFor={id} className="voucher-label">Promo code</label>
      <div key={shake} className={`voucher-row${shake ? " is-shaking" : ""}${error ? " has-error" : ""}`}>
        <input
          id={id} ref={input} value={text} autoComplete="off" autoCapitalize="characters" spellCheck={false} placeholder="ONTREND10"
          onChange={(e) => { setText(e.target.value); if (error) setError(""); }}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); submit(); } }}
          aria-invalid={!!error} aria-describedby={error ? `${id}-e` : undefined}
        />
        <button type="button" className="btn btn-outline btn-sm" onClick={submit}>Apply</button>
      </div>
      {error && <p className="err" id={`${id}-e`} role="alert">{error}</p>}
    </div>
  );
}

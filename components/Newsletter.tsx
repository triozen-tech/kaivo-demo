"use client";

import { useState } from "react";

/** Demo only: validates the email, stores nothing. */
export function Newsletter() {
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  return (
    <form className="news" noValidate onSubmit={(e) => {
      e.preventDefault();
      const f = e.currentTarget, v = (new FormData(f).get("email") as string).trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { setMsg({ ok: false, text: "Enter a valid email address." }); return; }
      f.reset();
      setMsg({ ok: true, text: "Thanks. This is a demo, nothing was saved." });
    }}>
      <div className="news-copy">
        <h3 className="news-h">Slow letters, now and then</h3>
        <p>New arrivals and quiet offers. Demo form: nothing is stored.</p>
      </div>
      <div className="news-form">
        <label htmlFor="news-email" className="sr-only">Email address</label>
        <input id="news-email" name="email" type="email" inputMode="email" autoComplete="email" placeholder="you@example.com" aria-invalid={msg && !msg.ok ? true : undefined} aria-describedby="news-msg" />
        <button type="submit" className="btn btn-solid">Subscribe</button>
      </div>
      <p id="news-msg" className={`news-msg${msg ? (msg.ok ? " is-ok" : " is-err") : ""}`} role="status" aria-live="polite">{msg?.text}</p>
    </form>
  );
}

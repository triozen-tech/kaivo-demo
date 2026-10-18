"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getProduct } from "@/data/products";
import { useCart } from "./CartProvider";
import { Pic } from "./ProductImage";
import { inr } from "@/lib/format";
import { deliveryOptions, orderNumber, ORDER_KEY, type Order } from "@/lib/order";

const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
  "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha",
  "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh",
  "Lakshadweep", "Puducherry",
];

type Values = { name: string; email: string; phone: string; address: string; city: string; state: string; pincode: string; delivery: string };
type Errors = Partial<Record<keyof Values, string>>;

const empty: Values = { name: "", email: "", phone: "", address: "", city: "", state: "", pincode: "", delivery: "standard" };

function validate(v: Values): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = "Enter a valid email address.";
  if (!/^[6-9]\d{9}$/.test(v.phone.replace(/[\s-]/g, ""))) e.phone = "Enter a 10-digit mobile number.";
  if (v.address.trim().length < 6) e.address = "Enter your street address.";
  if (v.city.trim().length < 2) e.city = "Enter your city.";
  if (!v.state) e.state = "Choose your state.";
  if (!/^[1-9]\d{5}$/.test(v.pincode.trim())) e.pincode = "Enter a 6-digit pincode.";
  return e;
}

export function CheckoutForm() {
  const { lines, subtotal, ready, clear } = useCart();
  const router = useRouter();
  const [v, setV] = useState<Values>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const form = useRef<HTMLFormElement>(null);

  const delivery = deliveryOptions.find((d) => d.id === v.delivery) ?? deliveryOptions[0];
  const total = subtotal + delivery.price;

  const set = (k: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setV((cur) => ({ ...cur, [k]: e.target.value }));
    if (errors[k]) setErrors((cur) => ({ ...cur, [k]: undefined }));
  };

  if (!ready) return <div className="skeleton" aria-hidden="true" />;
  if (lines.length === 0)
    return (
      <div className="empty">
        <p className="lead">Your cart is empty, so there is nothing to check out.</p>
        <Link href="/" className="btn btn-solid">Back to the shop</Link>
      </div>
    );

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const found = validate(v);
    setErrors(found);
    const firstKey = Object.keys(found)[0];
    if (firstKey) {
      form.current?.querySelector<HTMLElement>(`[name="${firstKey}"]`)?.focus();
      return;
    }
    setBusy(true);
    const order: Order = {
      number: orderNumber(),
      date: new Date().toISOString(),
      name: v.name.trim(),
      city: v.city.trim(),
      delivery: delivery.label,
      lines: lines.map((l) => { const p = getProduct(l.slug)!; return { name: p.name, qty: l.qty, price: p.price }; }),
      subtotal, shipping: delivery.price, total,
    };
    try { sessionStorage.setItem(ORDER_KEY, JSON.stringify(order)); } catch { /* summary page falls back */ }
    clear();
    router.push("/order/success");
  };

  const field = (k: keyof Values, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div className={`field${errors[k] ? " has-error" : ""}`}>
      <label htmlFor={`f-${k}`}>{label}</label>
      <input id={`f-${k}`} name={k} value={v[k]} onChange={set(k)} aria-invalid={!!errors[k]} aria-describedby={errors[k] ? `e-${k}` : undefined} {...props} />
      {errors[k] && <p className="err" id={`e-${k}`}>{errors[k]}</p>}
    </div>
  );

  return (
    <form ref={form} className="checkout" onSubmit={submit} noValidate>
      <div className="checkout-fields">
        <fieldset>
          <legend className="h4">Contact</legend>
          <div className="row">
            {field("name", "Full name", { autoComplete: "name" })}
            {field("phone", "Mobile number", { autoComplete: "tel-national", inputMode: "numeric", placeholder: "10 digits" })}
          </div>
          {field("email", "Email", { type: "email", autoComplete: "email" })}
        </fieldset>

        <fieldset>
          <legend className="h4">Delivery address</legend>
          {field("address", "Address", { autoComplete: "street-address" })}
          <div className="row">
            {field("city", "City", { autoComplete: "address-level2" })}
            <div className={`field${errors.state ? " has-error" : ""}`}>
              <label htmlFor="f-state">State</label>
              <select id="f-state" name="state" value={v.state} onChange={set("state")} aria-invalid={!!errors.state} aria-describedby={errors.state ? "e-state" : undefined} autoComplete="address-level1">
                <option value="">Select state</option>
                {states.map((s) => <option key={s}>{s}</option>)}
              </select>
              {errors.state && <p className="err" id="e-state">{errors.state}</p>}
            </div>
          </div>
          {field("pincode", "Pincode", { autoComplete: "postal-code", inputMode: "numeric", maxLength: 6, placeholder: "6 digits" })}
        </fieldset>

        <fieldset>
          <legend className="h4">Delivery</legend>
          <div className="radios">
            {deliveryOptions.map((d) => (
              <label key={d.id} className={`radio${v.delivery === d.id ? " is-on" : ""}`}>
                <input type="radio" name="delivery" value={d.id} checked={v.delivery === d.id} onChange={set("delivery")} />
                <span className="radio-text"><strong>{d.label}</strong><span>{d.note}</span></span>
                <span className="radio-price">{d.price === 0 ? "Free" : inr(d.price)}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <aside className="summary" aria-label="Order summary">
        <h2 className="h4">Order summary</h2>
        <ul className="mini">
          {lines.map((l) => {
            const p = getProduct(l.slug)!;
            return (
              <li key={l.slug}>
                <span className="mini-img"><Pic name={p.image} alt="" sizes="64px" /><span className="mini-qty">{l.qty}</span></span>
                <span className="mini-name">{p.name}</span>
                <span>{inr(p.price * l.qty)}</span>
              </li>
            );
          })}
        </ul>
        <div className="sum-row"><span>Subtotal</span><span>{inr(subtotal)}</span></div>
        <div className="sum-row"><span>Shipping</span><span>{delivery.price === 0 ? "Free" : inr(delivery.price)}</span></div>
        <div className="sum-row sum-total"><span>Total</span><strong>{inr(total)}</strong></div>
        <p className="fine">All prices are sample prices. Demo checkout: no payment is taken.</p>
        <button type="submit" className="btn btn-solid btn-block" disabled={busy}>{busy ? "Placing order…" : "Place demo order"}</button>
      </aside>
    </form>
  );
}

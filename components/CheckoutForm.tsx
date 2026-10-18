"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getProduct } from "@/data/products";
import { useCart } from "./CartProvider";
import { Pic } from "./ProductImage";
import { omr } from "@/lib/format";
import { Voucher } from "./Voucher";
import { Money } from "./Money";
import { FREE_EXPRESS_AT } from "@/lib/promo";
import { deliveryOptions, orderNumber, ORDER_KEY, type Order } from "@/lib/order";

const governorates = [
  "Muscat", "Dhofar", "Musandam", "Al Buraimi", "Al Dakhiliyah", "Al Dhahirah",
  "Al Batinah North", "Al Batinah South", "Al Sharqiyah North", "Al Sharqiyah South", "Al Wusta",
];

type Values = { name: string; email: string; phone: string; address: string; city: string; governorate: string; postal: string; delivery: string };
type Errors = Partial<Record<keyof Values, string>>;

const empty: Values = { name: "", email: "", phone: "", address: "", city: "", governorate: "", postal: "", delivery: "standard" };

function validate(v: Values): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = "Enter a valid email address.";
  if (!/^\d{8}$/.test(v.phone.replace(/[\s-]/g, ""))) e.phone = "Enter an 8-digit Oman mobile number, without +968.";
  if (v.address.trim().length < 6) e.address = "Enter your street address.";
  if (v.city.trim().length < 2) e.city = "Enter your city.";
  if (!v.governorate) e.governorate = "Choose your governorate.";
  if (v.postal.trim() && !/^\d{3}$/.test(v.postal.trim())) e.postal = "A postal code has 3 digits, or leave it empty.";
  return e;
}

export function CheckoutForm() {
  const { lines, subtotal, discount, code, net, ready, clear, removeCode } = useCart();
  const router = useRouter();
  const [v, setV] = useState<Values>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [sumOpen, setSumOpen] = useState(false);
  const form = useRef<HTMLFormElement>(null);

  const picked = deliveryOptions.find((d) => d.id === v.delivery) ?? deliveryOptions[0];
  const freeExpress = subtotal >= FREE_EXPRESS_AT;
  const shipFor = (d: (typeof deliveryOptions)[number]) => (d.id === "express" && freeExpress ? 0 : d.price);
  const delivery = { ...picked, price: shipFor(picked) };
  const total = net + delivery.price;

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
      city: v.city.trim().toLowerCase() === v.governorate.toLowerCase() ? v.governorate : `${v.city.trim()}, ${v.governorate}`,
      delivery: delivery.label,
      lines: lines.map((l) => { const p = getProduct(l.slug)!; return { name: p.name, qty: l.qty, price: p.price }; }),
      subtotal, discount: discount || undefined, code: discount ? code ?? undefined : undefined, shipping: delivery.price, total,
    };
    try { sessionStorage.setItem(ORDER_KEY, JSON.stringify(order)); } catch { /* summary page falls back */ }
    clear();
    removeCode();
    router.push("/order/success");
  };

  const field = (k: keyof Values, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}, prefix?: string) => (
    <div className={`field${errors[k] ? " has-error" : ""}`}>
      <label htmlFor={`f-${k}`}>{label}</label>
      <div className={prefix ? "field-pre" : undefined}>
        {prefix && <span className="pre" aria-hidden="true">{prefix}</span>}
        <input id={`f-${k}`} name={k} value={v[k]} onChange={set(k)} aria-invalid={!!errors[k]} aria-describedby={errors[k] ? `e-${k}` : undefined} {...props} />
      </div>
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
            {field("phone", "Mobile number", { type: "tel", autoComplete: "tel-national", inputMode: "numeric", placeholder: "8 digits", maxLength: 9 }, "+968")}
          </div>
          {field("email", "Email", { type: "email", autoComplete: "email" })}
        </fieldset>

        <fieldset>
          <legend className="h4">Delivery address</legend>
          {field("address", "Address", { autoComplete: "street-address" })}
          <div className="row">
            {field("city", "City", { autoComplete: "address-level2" })}
            <div className={`field${errors.governorate ? " has-error" : ""}`}>
              <label htmlFor="f-governorate">Governorate</label>
              <select id="f-governorate" name="governorate" value={v.governorate} onChange={set("governorate")} aria-invalid={!!errors.governorate} aria-describedby={errors.governorate ? "e-governorate" : undefined} autoComplete="address-level1">
                <option value="">Select governorate</option>
                {governorates.map((g) => <option key={g}>{g}</option>)}
              </select>
              {errors.governorate && <p className="err" id="e-governorate">{errors.governorate}</p>}
            </div>
          </div>
          <div className="row">
            <div className="field">
              <label htmlFor="f-country">Country</label>
              <input id="f-country" name="country" value="Oman" readOnly aria-readonly="true" />
            </div>
            {field("postal", "Postal code (optional)", { autoComplete: "postal-code", inputMode: "numeric", maxLength: 3, placeholder: "e.g. 112" })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="h4">Delivery</legend>
          <div className="radios">
            {deliveryOptions.map((d) => (
              <label key={d.id} className={`radio${v.delivery === d.id ? " is-on" : ""}`}>
                <input type="radio" name="delivery" value={d.id} checked={v.delivery === d.id} onChange={set("delivery")} />
                <span className="radio-text"><strong>{d.label}</strong><span>{d.id === "express" && freeExpress ? "Free, you passed " + omr(FREE_EXPRESS_AT) : d.note}</span></span>
                <span className="radio-price">{shipFor(d) === 0 ? "Free" : omr(d.price)}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <aside className={`summary${sumOpen ? " is-open" : ""}`} aria-label="Order summary">
        <button type="button" className="sum-toggle" aria-expanded={sumOpen} aria-controls="sum-body" onClick={() => setSumOpen((o) => !o)}>
          <span>Order summary</span><span className="sum-toggle-total"><Money value={total} /></span><i className="sum-chev" aria-hidden="true" />
        </button>
        <div className="sum-body" id="sum-body"><div className="sum-in">
        <h2 className="h4 sum-h">Order summary</h2>
        <ul className="mini">
          {lines.map((l) => {
            const p = getProduct(l.slug)!;
            return (
              <li key={l.slug}>
                <span className="mini-img"><Pic name={p.image} alt="" sizes="64px" /><span className="mini-qty">{l.qty}</span></span>
                <span className="mini-name">{p.name}</span>
                <span>{omr(p.price * l.qty)}</span>
              </li>
            );
          })}
        </ul>
        <Voucher />
        <div className="sum-row"><span>Subtotal</span><Money value={subtotal} /></div>
        {discount > 0 && <div className="sum-row sum-disc"><span>Discount ({code})</span><span>−<Money value={discount} /></span></div>}
        <div className="sum-row"><span>Shipping</span><span>{delivery.price === 0 ? "Free" : omr(delivery.price)}</span></div>
        <div className="sum-row sum-total"><span>Total</span><strong><Money value={total} /></strong></div>
        <p className="fine">All prices are sample prices. Demo checkout: no payment is taken.</p>
        </div></div>
        <div className="place-bar">
          <span className="place-total"><small>Total (sample)</small><strong><Money value={total} /></strong></span>
          <button type="submit" className="btn btn-solid btn-block" disabled={busy}>{busy ? "Placing order…" : "Place demo order"}</button>
        </div>
      </aside>
    </form>
  );
}

// Round 8: a visitor with rupee-era data (same keys) opens the new build.
import { chromium } from "playwright";
const U = process.env.U || "http://localhost:3019";
const b = await chromium.launch({ channel: "chrome" });
const out = []; const rec = (n, ok, d = "") => out.push((ok ? "PASS " : "FAIL ") + n + (d ? " | " + d : ""));
for (const [w, h] of [[390, 844], [1440, 900]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h } }); const p = await ctx.newPage(); const errs = [];
  p.on("console", (m) => m.type() === "error" && errs.push(m.text())); p.on("pageerror", (e) => errs.push(String(e)));
  // old data goes in BEFORE any page script runs, on first load only (like the old browser state)
  await ctx.addInitScript(() => {
    if (localStorage.getItem("seeded")) return; localStorage.setItem("seeded", "1");
    localStorage.setItem("kaivo-cart", JSON.stringify([{ slug: "tumbler-halo", qty: 2 }]));
    localStorage.setItem("kaivo-code", "KAIVO10");
    localStorage.setItem("kaivo-wish", JSON.stringify(["jar-hearth", "beauty-serum"]));
    sessionStorage.setItem("kaivo-intro", "1");
    sessionStorage.setItem("kaivo-last-order", JSON.stringify({ number: "KV-20260101-AAAAA", date: "x", name: "Old", city: "Pune", delivery: "standard", lines: [{ name: "Halo", qty: 2, price: 1499 }], subtotal: 2998, code: "KAIVO10", discount: 300, shipping: 0, total: 2698 }));
  });
  const txt = () => p.evaluate(() => document.querySelector("main").innerText.replace(/\s+/g, " "));
  await p.goto(U + "/", { waitUntil: "commit" }); await p.waitForTimeout(500);
  rec(`${w} loader plays on /`, await p.evaluate(() => document.documentElement.classList.contains("intro")));
  await p.waitForTimeout(3500);
  const st = await p.evaluate(() => ({ cart: localStorage.getItem("kaivo-cart"), code: localStorage.getItem("kaivo-code"), wish: localStorage.getItem("kaivo-wish"), ver: localStorage.getItem("kaivo-ver"), order: sessionStorage.getItem("kaivo-last-order"), intro: sessionStorage.getItem("kaivo-intro") }));
  rec(`${w} old cart/code dropped, wishlist kept`, st.cart === "[]" || st.cart === null, JSON.stringify(st).slice(0, 200));
  rec(`${w} wishlist kept`, st.wish && st.wish.includes("jar-hearth"));
  rec(`${w} old order dropped`, !st.order);
  await p.goto(U + "/", { waitUntil: "commit" }); await p.waitForTimeout(500);
  rec(`${w} loader plays only once (2nd visit)`, !(await p.evaluate(() => document.documentElement.classList.contains("intro"))));
  await p.goto(U + "/cart", { waitUntil: "load" }); await p.waitForTimeout(1200); let t = await txt();
  rec(`${w} /cart empty, no KAIVO10`, /Nothing here yet/.test(t) && !/KAIVO/i.test(t), t.slice(0, 80));
  await p.goto(U + "/checkout", { waitUntil: "load" }); await p.waitForTimeout(1200); t = await txt();
  rec(`${w} /checkout empty state`, /cart is empty/.test(t) && !/KAIVO|₹/.test(t));
  await p.goto(U + "/order/success", { waitUntil: "load" }); await p.waitForTimeout(1500); t = await txt();
  rec(`${w} /order/success no old order`, !/KV-2026|Pune|KAIVO|₹|2,698/.test(t), t.slice(0, 100));
  const body = await p.evaluate(() => document.body.innerText);
  rec(`${w} no KAIVO10 / rupee anywhere`, !/KAIVO|₹/.test(body));
  rec(`${w} no console errors`, errs.length === 0, errs.join(" ; ").slice(0, 200));
  await ctx.close();
}
await b.close(); console.log(out.join("\n"));

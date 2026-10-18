// Full-page screenshots of every route at 5 widths + a contact sheet per width (python PIL).
import { chromium } from "playwright";
const U = process.env.U || "http://localhost:3019", O = "shots/r6c/raw";
const routes = ["/", "/shop", "/c/tumblers", "/c/retro-kitchen", "/p/retro-kettle", "/p/beauty-serum", "/wishlist", "/cart", "/checkout", "/order/success", "/404"];
const order = { number: "KV-20261018-AB12C", date: "18 Oct 2026", name: "Asha Rao", city: "Muscat", delivery: "Standard, 4 to 6 days", lines: [{ name: "Retro Kettle", qty: 1, price: 6499 }, { name: "Halo Tumbler 600 ml", qty: 2, price: 1499 }], subtotal: 9497, shipping: 0, total: 9497 };
const b = await chromium.launch({ channel: "chrome" });
for (const w of [360, 390, 412, 768, 1440]) {
  const t = w < 1000;
  const ctx = await b.newContext({ viewport: { width: w, height: t ? 844 : 900 }, isMobile: t, hasTouch: t });
  await ctx.addInitScript((o) => { sessionStorage.setItem("kaivo-intro", "1"); sessionStorage.setItem("kaivo-last-order", JSON.stringify(o)); if (!sessionStorage.getItem("seeded")) { sessionStorage.setItem("seeded", "1"); localStorage.setItem("kaivo-cart", JSON.stringify([{ slug: "retro-kettle", qty: 1 }, { slug: "tumbler-halo", qty: 2 }])); localStorage.setItem("kaivo-wish", JSON.stringify(["tumbler-halo", "retro-kettle", "beauty-serum"])); } }, order);
  const p = await ctx.newPage();
  for (const r of routes) {
    const url = U + (r === "/404" ? "/nope-404" : r) + "?static=1";
    await p.goto(url, { waitUntil: "load" }); await p.waitForTimeout(900);
    // load every lazy image by scrolling through
    await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } scrollTo(0, 0); });
    await p.waitForTimeout(500);
    await p.screenshot({ path: `${O}/${w}${r.replace(/\//g, "_") || "_"}.png`, fullPage: true });
  }
  await ctx.close();
}
await b.close();

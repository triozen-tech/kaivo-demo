// Round 7: money rules in integer baisa: shipbar, express fee, free express, both vouchers.
import { chromium } from "playwright";
const U = process.env.U || "http://localhost:3019";
const b = await chromium.launch({ channel: "chrome" });
const out = [];
const rec = (n, ok, d = "") => { out.push((ok ? "PASS " : "FAIL ") + n + (d ? " | " + d : "")); };
for (const [w, h] of [[390, 844], [1440, 900]]) {
  let ctx, p;
  const go = async (cart, path) => { if (ctx) await ctx.close(); ctx = await b.newContext({ viewport: { width: w, height: h } }); await ctx.addInitScript(() => sessionStorage.setItem("kaivo-intro", "1")); p = await ctx.newPage(); for (const l of cart) { await p.goto(U + "/p/" + l.slug + "?static=1", { waitUntil: "load" }); await p.waitForTimeout(800); await p.getByRole("button", { name: /add to cart/i }).first().click(); await p.waitForTimeout(900); } await p.goto(U + path + "?static=1", { waitUntil: "load" }); await p.waitForTimeout(1200); };
  const open = async () => { const t = p.locator(".sum-toggle"); if (await t.isVisible() && (await t.getAttribute("aria-expanded")) !== "true") { await t.click(); await p.waitForTimeout(700); } };
  const txt = () => p.evaluate(() => document.querySelector("main").innerText.replace(/\s+/g, " "));
  await go([{ slug: "jar-hearth", qty: 1 }], "/cart"); let t = await txt();
  rec(`${w} shipbar below threshold`, /Add OMR.8\.000 more for free express/.test(t), t.match(/Add OMR[^a-z]*more for free express/)?.[0]);
  await go([{ slug: "jar-hearth", qty: 1 }], "/checkout"); t = await txt();
  rec(`${w} express fee OMR 1.000`, /Express, 1 to 2 days[^]*OMR.1\.000/.test(t));
  await go([{ slug: "retro-kettle", qty: 1 }], "/checkout"); t = await txt();
  rec(`${w} free express at OMR 25`, /Free, you passed OMR.15\.000/.test(t));
  await open(); await p.fill("main .voucher input", "WELCOME1"); await p.locator("main .voucher .btn").click(); await p.waitForTimeout(1200); t = await txt();
  rec(`${w} WELCOME1 = OMR 1.000 off`, /Discount \(WELCOME1\)\s*−OMR.1\.000/.test(t) && /Total\s*OMR.24\.000/.test(t), t.match(/Subtotal[^]{0,120}/)?.[0]);
  await go([{ slug: "retro-kettle", qty: 1 }], "/checkout"); await open();
  await p.fill("main .voucher input", "ONTREND10"); await p.locator("main .voucher .btn").click(); await p.waitForTimeout(1200); t = await txt();
  rec(`${w} ONTREND10 = 10% (OMR 2.500)`, /Discount \(ONTREND10\)\s*−OMR.2\.500/.test(t) && /Total\s*OMR.22\.500/.test(t));
  await go([{ slug: "jar-hearth", qty: 1 }], "/cart"); await p.fill("main .voucher input", "WELCOME1"); await p.locator("main .voucher .btn").click(); await p.waitForTimeout(900); t = await txt();
  rec(`${w} WELCOME1 below min refused`, /OMR.10\.000/.test(t) && !/WELCOME1 applied/.test(t));
  await ctx.close(); ctx = null;
}
await b.close(); console.log(out.join("\n"));

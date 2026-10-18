// Round 7: rebrand screenshots + checks (header at five widths, footer, loader, menu, product, cart, checkout, success).
import { chromium } from "playwright";
const U = process.env.U || "http://localhost:3019";
const b = await chromium.launch({ channel: "chrome" });
const res = {};
const sizes = [[360, 740], [390, 844], [412, 915], [768, 1024], [1440, 900]];
for (const [w, h] of sizes) {
  const touch = w < 1000;
  const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: touch, hasTouch: touch, deviceScaleFactor: 2 });
  const p = await ctx.newPage(); const errs = []; p.on("console", (m) => m.type() === "error" && errs.push(m.text())); p.on("pageerror", (e) => errs.push(String(e)));
  const o = (res[w] = {});
  // loader: fresh session, shortly after load
  await p.goto(U + "/", { waitUntil: "commit" }); await p.waitForTimeout(550); await p.screenshot({ path: `shots/r7/loader-${w}.png` });
  await p.waitForTimeout(3200);
  await p.screenshot({ path: `shots/r7/header-${w}.png`, clip: { x: 0, y: 0, width: w, height: Math.min(h, 200) } });
  o.logo = await p.evaluate(() => { const i = document.querySelector(".header .logo-img"); const r = i.getBoundingClientRect(); const icons = [...document.querySelectorAll(".header-actions .icon-btn,.menu-btn")].filter((e) => e.offsetParent).map((e) => e.getBoundingClientRect()); const lo = r.right; const nav = document.querySelector(".nav"); return { h: Math.round(r.height), w: Math.round(r.width), left: Math.round(r.left), right: Math.round(r.right), natural: [i.naturalWidth, i.naturalHeight], overlapIcons: icons.some((q) => q.width && !(q.right <= r.left || q.left >= r.right)), navLeft: nav && nav.offsetParent ? Math.round(nav.getBoundingClientRect().left) : null }; });
  await p.evaluate(() => scrollTo(0, document.body.scrollHeight)); await p.waitForTimeout(900);
  await p.screenshot({ path: `shots/r7/footer-${w}.png` });
  if (touch && (w === 390)) { await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(500); await p.locator(".menu-btn").tap(); await p.waitForTimeout(900); await p.screenshot({ path: `shots/r7/menu-${w}.png` }); await p.keyboard.press("Escape"); }
  if (w === 390 || w === 1440) {
    await p.goto(U + "/p/retro-kettle", { waitUntil: "load" }); await p.waitForTimeout(1200); await p.screenshot({ path: `shots/r7/product-${w}.png` });
    await p.getByRole("button", { name: /add to cart/i }).first().click(); await p.waitForTimeout(1200);
    await p.goto(U + "/cart", { waitUntil: "load" }); await p.waitForTimeout(1200); await p.screenshot({ path: `shots/r7/cart-${w}.png` });
    o.cartText = await p.evaluate(() => document.querySelector("main")?.innerText.replace(/\s+/g, " ").slice(0, 260));
    await p.goto(U + "/checkout", { waitUntil: "load" }); await p.waitForTimeout(1200); await p.screenshot({ path: `shots/r7/checkout-${w}.png`, fullPage: true });
    // checkout errors then valid order
    await p.locator(".place-bar button[type=submit]").click(); await p.waitForTimeout(500); o.errs = await p.evaluate(() => [...document.querySelectorAll(".err")].map((e) => e.textContent));
    await p.fill('input[name="name"]', "Asha Demo"); await p.fill('input[name="phone"]', "9123456"); await p.fill('input[name="email"]', "asha@example.com"); await p.fill('input[name="address"]', "12 Sample Street, Al Khuwair"); await p.fill('input[name="city"]', "Muscat"); await p.selectOption('select[name="governorate"]', "Muscat");
    await p.locator(".place-bar button[type=submit]").click(); await p.waitForTimeout(400); o.phoneErr = await p.evaluate(() => document.querySelector("#e-phone")?.textContent);
    await p.fill('input[name="phone"]', "91234567"); await p.locator(".place-bar button[type=submit]").click(); await p.waitForURL(/order\/success/, { timeout: 8000 }); await p.waitForTimeout(1500);
    await p.screenshot({ path: `shots/r7/success-${w}.png`, fullPage: true });
    o.success = await p.evaluate(() => document.querySelector("main")?.innerText.replace(/\s+/g, " ").slice(0, 400));
  }
  o.overflow = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth); o.errors = errs;
  await ctx.close();
}
await b.close();
console.log(JSON.stringify(res, null, 1));

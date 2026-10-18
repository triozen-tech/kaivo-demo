import { chromium } from "playwright";
const b = await chromium.launch({ channel: "chrome" });
const errs = [];
for (const [w, touch] of [[390, true], [1440, false]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 850 }, ...(touch ? { isMobile: true, hasTouch: true } : {}) });
  const p = await ctx.newPage();
  p.on("console", (m) => m.type() === "error" && errs.push(w + " " + m.text())); p.on("pageerror", (e) => errs.push(w + " " + e.message));
  await p.goto("http://localhost:3018/c/tumblers"); await p.waitForTimeout(2500);
  const url0 = p.url();
  const tap = (loc) => touch ? loc.tap() : loc.click();
  await tap(p.locator(".quick-add").first()); await p.waitForTimeout(1600);
  console.log(w, "url unchanged:", p.url() === url0, "badge:", await p.locator(".cart-btn .badge").innerText());
  await tap(p.locator(".heart-card").first()); await p.waitForTimeout(400);
  await tap(p.locator(".heart-card").nth(2)); await p.waitForTimeout(400);
  console.log(w, "wish badge:", await p.locator('a[href="/wishlist"] .badge').innerText(), "stored:", await p.evaluate(() => localStorage.getItem("kaivo-wish")));
  const grid = p.locator(".grid").first(); await grid.scrollIntoViewIfNeeded();
  await p.screenshot({ path: `shots/r5/a-cards-${w}.png` });
  await p.goto("http://localhost:3018/wishlist"); await p.waitForTimeout(1500);
  console.log(w, "wishlist items:", await p.locator(".wish-item").count());
  await p.screenshot({ path: `shots/r5/wishlist-${w}.png` });
  await tap(p.locator(".wish-remove").first()); await p.waitForTimeout(300);
  console.log(w, "after remove:", await p.locator(".wish-item").count());
  await ctx.close();
}
console.log("errs", errs); await b.close();

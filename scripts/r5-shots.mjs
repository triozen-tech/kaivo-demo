import { chromium } from "playwright";
const O = "shots/r5", U = "http://localhost:3018";
const b = await chromium.launch({ channel: "chrome" });
for (const [w, h] of [[390, 844], [1440, 900]]) {
  const t = w < 1000;
  const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: t, hasTouch: t, deviceScaleFactor: t ? 2 : 1 });
  await ctx.addInitScript(() => sessionStorage.setItem("kaivo-intro", "1"));
  const p = await ctx.newPage(); const click = l => t ? l.tap() : l.click(); const q = t ? "" : "?static=1";
  const go = async (path, ms = 1600) => { await p.goto(U + path, { waitUntil: "load" }); await p.waitForTimeout(ms); };
  await go("/" + q); await p.screenshot({ path: `${O}/home-${w}.png` });
  await p.evaluate(() => document.querySelector(".band-wrap").scrollIntoView({ block: "center" })); await p.waitForTimeout(900); await p.screenshot({ path: `${O}/home-promo-${w}.png` });
  await p.evaluate(() => document.querySelector(".social").scrollIntoView({ block: "center" })); await p.waitForTimeout(900); await p.screenshot({ path: `${O}/home-social-${w}.png` });
  await go("/shop");
  if (t) { await click(p.locator(".fb-open")); await p.waitForTimeout(800); } else { const f = p.locator(".fb-open, .filterbar"); await p.waitForTimeout(300); }
  await p.screenshot({ path: `${O}/shop-filters-${w}.png` });
  if (t) { await click(p.getByRole("button", { name: /apply|show|done/i }).first()); await p.waitForTimeout(500); }
  await go("/c/retro-kitchen"); await p.screenshot({ path: `${O}/category-${w}.png` });
  await go("/p/tumbler-halo"); const rv = p.getByRole("button", { name: /Customer reviews/i }); await rv.scrollIntoViewIfNeeded(); await click(rv); await p.waitForTimeout(900);
  await p.evaluate(() => window.scrollBy(0, (document.querySelector(".acc").getBoundingClientRect().top - 120) + 380)); await p.waitForTimeout(900); await p.screenshot({ path: `${O}/product-reviews-${w}.png` });
  await go("/shop"); await p.locator(".heart-card").first().scrollIntoViewIfNeeded(); if (!t) await p.locator(".heart-card").first().locator("xpath=..").hover(); await click(p.locator(".heart-card").first()); await p.waitForTimeout(500);
  await go("/wishlist"); await p.screenshot({ path: `${O}/wishlist-${w}.png` });
  await click(p.getByRole("button", { name: "Search", exact: true })); await p.fill(".search-panel input", "jar"); await p.waitForTimeout(900); await p.screenshot({ path: `${O}/search-${w}.png` });
  await click(p.getByRole("button", { name: "Close search" })); await p.waitForTimeout(400);
  await go("/p/tumbler-halo"); await click(p.getByRole("button", { name: /add to cart/i }).first()); await p.waitForTimeout(2000); await p.screenshot({ path: `${O}/${t ? "cart-sheet" : "cart-drawer"}-${w}.png` });
  await go("/checkout"); await p.screenshot({ path: `${O}/checkout-${w}.png` });
  if (t) { await click(p.locator(".sum-toggle")); await p.waitForTimeout(700); await p.screenshot({ path: `${O}/checkout-summary-${w}.png` }); }
  await ctx.close();
}
await b.close();

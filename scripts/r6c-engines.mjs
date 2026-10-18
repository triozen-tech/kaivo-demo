// Round 6C: the same layout measurements and screenshots in Chrome and WebKit (ENGINE=webkit), phone sizes.
import { chromium, webkit } from "playwright";
const U = process.env.U || "http://localhost:3019", wk = process.env.ENGINE === "webkit", tag = wk ? "wk" : "cr";
const b = await (wk ? webkit.launch() : chromium.launch({ channel: "chrome" }));
const out = {};
for (const [w, h] of [[390, 844], [412, 915]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => sessionStorage.setItem("kaivo-intro", "1"));
  const p = await ctx.newPage(); const k = `${w}x${h}`; const o = (out[k] = {}); const S = (n) => p.screenshot({ path: `shots/r6c/${tag}-${n}-${k}.png` });
  const rect = (sel) => p.evaluate((s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return [Math.round(r.top), Math.round(r.bottom), Math.round(r.height)]; }, sel);
  await p.goto(U + "/", { waitUntil: "load" }); await p.waitForTimeout(2800);
  o.hero = await rect(".hero"); o.topbar = await rect(".topbar"); o.svh = await p.evaluate(() => { const d = document.createElement("div"); d.style.cssText = "position:fixed;height:100svh;width:1px"; document.body.append(d); const v = d.getBoundingClientRect().height; d.remove(); return [Math.round(v), innerHeight]; });
  await S("hero");
  await p.evaluate(() => scrollTo(0, 1500)); await p.waitForTimeout(900); o.topbarAfterScroll = await rect(".topbar"); await S("scrolled");
  await p.evaluate(() => scrollTo(0, 0));
  // stacked category tiles
  const tiles = p.locator(".cat-tile"); await tiles.first().scrollIntoViewIfNeeded(); await p.waitForTimeout(700); o.tiles = await p.evaluate(() => [...document.querySelectorAll(".cat-tile")].map((e) => Math.round(e.getBoundingClientRect().width)).join(",")); await S("tiles");
  // product sticky bar
  await p.goto(U + "/p/retro-kettle", { waitUntil: "load" }); await p.waitForTimeout(900); await p.evaluate(() => scrollTo(0, 1500)); await p.waitForTimeout(1000);
  o.sticky = await p.evaluate(() => { const e = document.querySelector(".sticky-buy"); const r = e.getBoundingClientRect(); return { on: e.classList.contains("is-on"), bottom: Math.round(r.bottom), vh: innerHeight, padBottom: getComputedStyle(e).paddingBottom }; }); await S("sticky");
  await p.locator(".sticky-buy .btn, main .btn-solid").first().tap().catch(() => {}); await p.waitForTimeout(1200);
  // bottom-sheet cart
  await p.goto(U + "/shop", { waitUntil: "load" }); await p.waitForTimeout(900);
  await p.locator(".pcard .qa, .pcard button[aria-label*='Add']").first().tap(); await p.waitForTimeout(1500);
  await p.locator("button[aria-label*='cart' i], a[aria-label*='cart' i]").first().tap(); await p.waitForTimeout(1000);
  o.drawer = await p.evaluate(() => { const e = document.querySelector(".drawer.is-open .drawer-panel, .drawer.is-open"); const r = e && e.getBoundingClientRect(); return r && [Math.round(r.top), Math.round(r.bottom)]; }); await S("cart-sheet");
  await p.keyboard.press("Escape");
  // filter sheet
  await p.goto(U + "/shop", { waitUntil: "load" }); await p.waitForTimeout(800); await p.locator(".fb-open").tap(); await p.waitForTimeout(900); await S("filters");
  // checkout (with items)
  await p.goto(U + "/checkout", { waitUntil: "load" }); await p.waitForTimeout(1000);
  o.placeBar = await p.evaluate(() => { const e = document.querySelector(".place-bar"); if (!e) return null; const r = e.getBoundingClientRect(); return { bottom: Math.round(r.bottom), vh: innerHeight, fixed: getComputedStyle(e).position }; }); await S("checkout");
  o.overflow = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  await ctx.close();
}
await b.close();
console.log(tag, JSON.stringify(out, null, 1));

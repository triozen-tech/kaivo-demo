// Browse, search, sort, load more, wishlist add/remove, cart sheet/drawer, newsletter, product accordions, at five widths.
import { chromium, webkit } from "playwright";
const b = await (process.env.ENGINE === "webkit" ? webkit.launch() : chromium.launch({ channel: "chrome" })); const U = process.env.U || "http://localhost:3019"; let bad = 0;
for (const [w, h] of [[360, 740], [390, 844], [412, 915], [768, 1024], [1440, 900]].filter(([w]) => !process.env.WIDTHS || process.env.WIDTHS.split(",").includes(String(w)))) {
  const t = w < 1000;
  const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: t, hasTouch: t });
  await ctx.addInitScript(() => sessionStorage.setItem("kaivo-intro", "1"));
  const p = await ctx.newPage(); const errs = [], notes = [];
  p.on("console", m => m.type() === "error" && errs.push(m.text())); p.on("pageerror", e => errs.push(e.message));
  const click = l => t ? l.tap() : l.click();
  const step = async (n, f) => { try { await f(); } catch (e) { notes.push(n + ": " + e.message.split("\n")[0]); } };
  const ov = async tag => { if (await p.evaluate(() => document.documentElement.scrollWidth > innerWidth)) notes.push("overflow@" + tag); };
  await p.goto(U + "/shop", { waitUntil: "load" }); await p.waitForTimeout(1500); await ov("shop");
  await step("search", async () => { await click(p.getByRole("button", { name: "Search", exact: true })); await p.fill(".search-panel input", "kettle"); await p.waitForTimeout(700); if (!(await p.locator(".search-panel a[href^='/p/']").count())) throw new Error("no results"); await click(p.getByRole("button", { name: "Close search" })); await p.waitForTimeout(500); });
  await step("sort", async () => { if (t) { await click(p.locator(".fb-open")); await p.waitForTimeout(600); } const sel = p.locator("select").first(); await sel.selectOption({ index: 1 }); if (t) { await click(p.getByRole("button", { name: /apply|show|done/i }).first()); await p.waitForTimeout(500); } });
  await step("load more", async () => { const n0 = await p.locator(".pcard").count(); const lm = p.getByRole("button", { name: /load more/i }); await lm.scrollIntoViewIfNeeded(); await click(lm); await p.waitForTimeout(600); if ((await p.locator(".pcard").count()) <= n0) throw new Error("no more cards"); });
  await step("wishlist", async () => { const hh = p.locator(".heart-card").first(); await hh.scrollIntoViewIfNeeded(); if (!t) await hh.locator("xpath=..").hover(); await click(hh); await p.waitForTimeout(500); await p.goto(U + "/wishlist", { waitUntil: "load" }); await p.waitForTimeout(1000); if (!(await p.locator(".wish-item").count())) throw new Error("not saved"); await click(p.locator(".wish-item").getByRole("button", { name: /remove/i }).first()); await p.waitForTimeout(700); if (await p.locator(".wish-item").count()) throw new Error("not removed"); });
  await step("newsletter", async () => { await p.goto(U + "/", { waitUntil: "load" }); await p.waitForTimeout(1200); await p.fill("#news-email", "bad"); await p.locator(".news-form .btn").scrollIntoViewIfNeeded(); await click(p.locator(".news-form .btn")); await p.waitForTimeout(300); if (!/valid/.test(await p.locator("#news-msg").innerText())) throw new Error("no error"); await p.fill("#news-email", "a@b.co"); await click(p.locator(".news-form .btn")); await p.waitForTimeout(300); if (!/nothing was saved/.test(await p.locator("#news-msg").innerText())) throw new Error("no thanks"); });
  await step("accordion", async () => { await p.goto(U + "/p/tumbler-halo", { waitUntil: "load" }); await p.waitForTimeout(1500); const r = p.getByRole("button", { name: /Customer reviews/i }); await r.scrollIntoViewIfNeeded(); await click(r); await p.waitForTimeout(700); if ((await r.getAttribute("aria-expanded")) !== "true") throw new Error("not open"); const rv = await p.locator(".review").count(); if (rv !== 3) throw new Error("reviews " + rv); await ov("pdp"); });
  await step("sheet", async () => { await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(700); await click(p.locator(".cart-btn")); await p.waitForTimeout(900); if (!(await p.locator(".drawer-right.is-open").count())) throw new Error("cart not open"); await click(p.locator(".drawer-right .drawer-head .icon-btn")); await p.waitForTimeout(800); if (await p.locator(".drawer-right.is-open").count()) throw new Error("not closed"); });
  console.log(w, notes.length || errs.length ? "FAIL" : "OK", JSON.stringify({ errs, notes })); bad += notes.length + errs.length; await ctx.close();
}
await b.close(); process.exit(bad ? 1 : 0);

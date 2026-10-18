import { chromium, webkit } from "playwright";
const b = await (process.env.ENGINE === "webkit" ? webkit.launch() : chromium.launch({ channel: "chrome" }));
const U = process.env.U || "http://localhost:3019"; let bad = 0;
for (const [w, h] of [[360, 740], [390, 844], [412, 915], [768, 1024], [1440, 900]].filter(([w]) => !process.env.WIDTHS || process.env.WIDTHS.split(",").includes(String(w)))) {
  const t = w < 1000;
  const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: t, hasTouch: t });
  await ctx.addInitScript(() => sessionStorage.setItem("kaivo-intro", "1"));
  const p = await ctx.newPage(); const errs = [], notes = [];
  p.on("console", m => m.type() === "error" && errs.push(m.text())); p.on("pageerror", e => errs.push(e.message));
  const click = l => t ? l.tap() : l.click();
  const ov = async tag => { if (await p.evaluate(() => document.documentElement.scrollWidth > innerWidth)) notes.push("overflow@" + tag); };
  const step = async (n, f) => { try { await f(); } catch (e) { notes.push(n + ": " + e.message.split("\n")[0]); } };
  await p.goto(U + (t ? "" : "?static=1"), { waitUntil: "load" }); await p.waitForTimeout(1200); await ov("home");
  if (w === 390 || w === 1440) await p.screenshot({ path: `shots/r6a/home-${w}.png` });
  await step("tile", async () => { const tile = p.locator(".cat-tile").nth(1); await tile.scrollIntoViewIfNeeded(); await click(tile); await p.waitForURL(/\/c\//, { timeout: 6000 }); await p.waitForTimeout(2200); });
  await ov("cat"); if (w === 390 || w === 1440) await p.screenshot({ path: `shots/r6a/category-${w}.png` });
  await step("filter", async () => { if (t) { await click(p.locator(".fb-open")); await p.waitForTimeout(600); await click(p.getByRole("button", { name: "Under OMR 5" })); await click(p.getByRole("button", { name: "Apply" })); } else await click(p.getByRole("button", { name: "Under OMR 5" })); await p.waitForTimeout(400); });
  await p.goto(U + "/shop", { waitUntil: "load" }); await p.waitForTimeout(1500); await ov("shop");
  if (w === 390 || w === 1440) await p.screenshot({ path: `shots/r6a/shop-${w}.png` });
  await step("quick-add", async () => { await (async()=>{const q=p.locator(".quick-add").first(); await q.scrollIntoViewIfNeeded(); if(!t) await q.locator("xpath=..").hover(); await click(q);})(); await p.waitForTimeout(900); });
  await p.goto(U + "/p/tumbler-halo", { waitUntil: "load" }); await p.waitForTimeout(1500); await ov("pdp");
  if (w === 390 || w === 1440) await p.screenshot({ path: `shots/r6a/product-${w}.png` });
  await step("add", async () => { await click(p.getByRole("button", { name: /add to cart/i }).first()); await p.waitForTimeout(1200); });
  await step("voucher", async () => { await p.fill(".voucher input", "ONTREND10"); await click(p.locator(".voucher .btn")); await p.waitForTimeout(900); });
  await p.goto(U + "/checkout", { waitUntil: "load" }); await p.waitForTimeout(1000); await ov("checkout");
  await step("errors", async () => { await click(p.locator(".place-bar button[type=submit]")); await p.waitForTimeout(500); if (!/checkout/.test(p.url())) throw new Error("left checkout with empty form"); });
  await step("order", async () => {
    for (const l of await p.locator("input[name]:not([type=radio]):not([type=checkbox]):not([name=search])").all()) { const n = (await l.getAttribute("name")) || "", ty = (await l.getAttribute("type")) || ""; if (n === "email") await l.fill("a@b.com"); else if (/phone/i.test(n)) await l.fill("91234567"); else if (/postal/i.test(n)) await l.fill("112"); else if (ty !== "hidden" && !(await l.inputValue())) await l.fill("Test value"); }
    for (const s of await p.locator("select").all()) await s.selectOption({ index: 1 });
    await click(p.locator(".place-bar button[type=submit]")); await p.waitForURL(/success/, { timeout: 8000 }); await p.waitForTimeout(1500); await ov("success"); });
  const bw = errs.length + notes.length; bad += bw;
  console.log(w, bw ? "ISSUES" : "OK", JSON.stringify({ errs: errs.slice(0, 3), notes }));
  await ctx.close();
}
await b.close(); process.exit(bad ? 1 : 0);

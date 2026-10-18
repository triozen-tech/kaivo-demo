import { chromium } from "playwright";
const b = await chromium.launch({ channel: "chrome" });
const U = "http://localhost:3018";
const cats = ["tumblers", "retro-kitchen", "shakers", "food-jars", "beauty"];
for (const [w, h, mobile, qs] of [[390, 844, true, ""], [1440, 900, false, "?static=1"]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: mobile, hasTouch: mobile });
  await ctx.addInitScript(() => sessionStorage.setItem("kaivo-intro", "1"));
  const p = await ctx.newPage();
  await p.goto(U + "/" + qs, { waitUntil: "load" }); await p.waitForTimeout(1200);
  await p.locator(".cat-grid").screenshot({ path: `shots/r6a/category-tiles-${w}.png` });
  for (const c of cats) { await p.goto(U + "/c/" + c + qs, { waitUntil: "load" }); await p.waitForTimeout(2500); await p.screenshot({ path: `shots/r6a/banner-${c}-${w}.png` }); }
  await ctx.close();
}
await b.close();

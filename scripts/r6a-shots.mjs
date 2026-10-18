import { chromium } from "playwright";
const b = await chromium.launch({ channel: "chrome" });
const URL = "http://localhost:3018";
for (const [w, h] of [[360, 640], [390, 844], [412, 915], [768, 1024]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: true, hasTouch: true });
  await ctx.addInitScript(() => sessionStorage.setItem("kaivo-intro", "1"));
  const p = await ctx.newPage();
  await p.goto(URL + "/", { waitUntil: "load" }); await p.waitForTimeout(2500);
  await p.screenshot({ path: `shots/r6a/hero-${w}.png` });
  if (w !== 768) {
    await p.locator(".cats-stack").scrollIntoViewIfNeeded();
    await p.evaluate(() => document.querySelector(".cat-grid").scrollIntoView()); await p.waitForTimeout(1200);
    await p.screenshot({ path: `shots/r6a/tiles-${w}.png` });
  }
  await ctx.close();
}
await b.close();

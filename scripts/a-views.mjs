import { chromium } from "playwright";
const b = await chromium.launch({ channel: "chrome" });
for (const w of [390, 768, 1280, 1440, 1920]) {
  const p = await (await b.newContext({ viewport: { width: w, height: w < 800 ? 844 : 900 } })).newPage();
  await p.goto("http://localhost:3018/?static=1", { waitUntil: "networkidle" }); await p.waitForTimeout(1200);
  await p.screenshot({ path: `shots/r4/hero-${w}.png` });
  if (w !== 1280 && w !== 1920) await p.locator(".cat-grid").screenshot({ path: `shots/r4/tiles-${w}.png` });
}
await b.close();

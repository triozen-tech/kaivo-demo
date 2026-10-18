// Home category tiles + hero at 390 / 768 / 1440 (motion off so they are in place)
import { chromium } from "playwright";
import fs from "node:fs";
const base = process.env.BASE || "http://localhost:3018";
fs.mkdirSync("shots/final", { recursive: true });
const b = await chromium.launch({ channel: "chrome" }).catch(() => chromium.launch());
for (const [w, h] of [[390, 844], [768, 1024], [1440, 900]]) {
  const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage();
  await p.goto(base + "/?static=1", { waitUntil: "networkidle" });
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 90)); } window.scrollTo(0, 0); });
  await p.waitForTimeout(600);
  await p.screenshot({ path: `shots/final/hero-${w}.png` });
  await p.locator(".cat-grid").screenshot({ path: `shots/final/tiles-${w}.png` });
}
await b.close();

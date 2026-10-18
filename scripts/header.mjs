// Part A1 proof: real wheel scroll down 1500, up 200, VIEWPORT screenshot; header must sit at top 0.
import { chromium } from "playwright";
const base = process.env.BASE || "http://localhost:3018";
const b = await chromium.launch({ channel: "chrome" });
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await p.addInitScript(() => { try { localStorage.setItem("kaivo-cart", JSON.stringify([{ slug: "retro-kettle", qty: 1 }])); } catch {} });
for (const [name, path] of [["home", "/"], ["category", "/c/retro-kitchen"], ["product", "/p/retro-kettle"], ["cart", "/cart"], ["checkout", "/checkout"]]) {
  await p.goto(base + path, { waitUntil: "networkidle" }); await p.waitForTimeout(1800);
  await p.mouse.move(700, 450);
  for (let i = 0; i < 15; i++) { await p.mouse.wheel(0, 100); await p.waitForTimeout(40); }
  await p.waitForTimeout(900);
  const y1 = await p.evaluate(() => Math.round(scrollY));
  for (let i = 0; i < 2; i++) { await p.mouse.wheel(0, -100); await p.waitForTimeout(40); }
  await p.waitForTimeout(1000);
  const r = await p.evaluate(() => { const h = document.querySelector(".header").getBoundingClientRect(); return { top: Math.round(h.top), bottom: Math.round(h.bottom), y: Math.round(scrollY), z: getComputedStyle(document.querySelector(".header")).zIndex, topEl: document.elementFromPoint(300, 30)?.closest(".header") ? "header" : document.elementFromPoint(300, 30)?.className }; });
  console.log(name, "scrolled to", y1, "then", JSON.stringify(r), r.top === 0 ? "PINNED" : "NOT PINNED");
  await p.screenshot({ path: `shots/r4/header-${name}.png` });
}
await b.close();

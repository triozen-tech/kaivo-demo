import { chromium } from "playwright";
const b = await chromium.launch({ channel: "chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = []; p.on("console", (m) => m.type() === "error" && errs.push(m.text())); p.on("pageerror", (e) => errs.push(e.message));
await p.goto("http://localhost:3018/"); await p.waitForTimeout(3500);
await p.mouse.move(700, 500);
const top = await p.evaluate(() => { const r = document.querySelector(".showcase").closest(".pin-spacer") || document.querySelector(".showcase"); return r.getBoundingClientRect().top + scrollY; });
console.log("showcase top", top);
const total = await p.evaluate(() => document.querySelector(".sc-track").scrollWidth - innerWidth);
console.log("distance", total);
const goto = async (y) => { await p.evaluate((y) => window.scrollTo(0, y), y); await p.waitForTimeout(1500); };
const shots = { 1: 0, 3: total / 2, 5: total };
for (const [n, off] of Object.entries(shots)) { await goto(top + off); await p.screenshot({ path: `shots/r4/showcase-${n}.png` }); console.log(n, await p.locator(".sc-count").innerText(), "x", await p.locator(".sc-track").evaluate((e) => new DOMMatrix(getComputedStyle(e).transform).m41)); }
await goto(0); await p.screenshot({ path: "shots/r4/strip-hero.png" });
await goto(top + total + 900); await p.screenshot({ path: "shots/r4/after-showcase.png" });
console.log("bg after", await p.evaluate(() => getComputedStyle(document.body).backgroundColor), "overflowX", await p.evaluate(() => document.documentElement.scrollWidth > innerWidth));
console.log("errs", errs); await b.close();

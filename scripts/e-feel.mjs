import { chromium } from "playwright";
const b = await chromium.launch({ channel: "chrome" });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
const errs = []; p.on("console", (m) => m.type() === "error" && errs.push(m.text())); p.on("pageerror", (e) => errs.push(e.message));
await p.goto("http://localhost:3018/"); await p.waitForTimeout(500);
console.log("intro class at 0.5s:", await p.evaluate(() => document.documentElement.classList.contains("intro")));
await p.screenshot({ path: "shots/r4/intro.png" });
await p.waitForTimeout(1800);
console.log("intro class at 2.3s:", await p.evaluate(() => document.documentElement.classList.contains("intro")), "storage", await p.evaluate(() => sessionStorage.getItem("kaivo-intro")));
await p.reload(); await p.waitForTimeout(300);
console.log("return visit intro:", await p.evaluate(() => document.documentElement.classList.contains("intro")));
const s = await ctx.newPage(); await s.goto("http://localhost:3018/?static=1"); console.log("static intro:", await s.evaluate(() => document.documentElement.classList.contains("intro") + "/" + document.documentElement.classList.contains("has-cursor"))); await s.close();
await p.waitForTimeout(2500);
// cursor over a product card
await p.goto("http://localhost:3018/c/tumblers"); await p.waitForTimeout(2500);
const bb = await p.locator(".pcard-img").first().boundingBox();
await p.mouse.move(bb.x + 60, bb.y + 80); await p.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2, { steps: 10 }); await p.waitForTimeout(900);
console.log("ring label class:", await p.locator(".cur-ring").getAttribute("class"), await p.locator(".cur-label").innerText());
await p.screenshot({ path: "shots/r4/cursor-view.png", clip: { x: bb.x - 20, y: bb.y - 20, width: bb.width + 40, height: bb.height + 40 } });
// pdp sticky
await p.goto("http://localhost:3018/p/tumbler-halo"); await p.waitForTimeout(2500);
console.log("sticky before scroll:", await p.locator(".sticky-buy").getAttribute("class"));
await p.mouse.move(300, 400); await p.mouse.wheel(0, 1100); await p.waitForTimeout(1500);
console.log("sticky after scroll:", await p.locator(".sticky-buy").getAttribute("class"));
await p.screenshot({ path: "shots/r4/sticky-bar.png" });
await p.locator(".sticky-buy .btn").click(); await p.waitForTimeout(1800);
console.log("cart count:", await p.locator(".badge").innerText(), "drawer open:", await p.locator(".drawer").evaluate((e) => getComputedStyle(e).visibility));
// magnet
await p.keyboard.press("Escape"); await p.waitForTimeout(800);
console.log("errs", errs); await b.close();

// Round 9: logo centred between the menu button and the first right-hand icon.
import { chromium } from "playwright";
const U = process.env.U || "http://localhost:3019";
const b = await chromium.launch({ channel: "chrome" });
for (const [w, h] of [[360, 740], [390, 844], [393, 852], [412, 915], [768, 1024], [1440, 900]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: w < 1000, hasTouch: w < 1000, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { sessionStorage.setItem("kaivo-intro", "1"); sessionStorage.setItem("kaivo-ver", "2"); localStorage.setItem("kaivo-ver", "2"); localStorage.setItem("kaivo-cart", JSON.stringify([{ slug: "tumbler-halo", qty: 2 }])); localStorage.setItem("kaivo-wish", JSON.stringify(["jar-hearth"])); });
  const p = await ctx.newPage(); const errs = []; p.on("pageerror", (e) => errs.push(String(e))); p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  await p.goto(U + "/", { waitUntil: "load" }); await p.waitForTimeout(1800);
  const r = await p.evaluate(() => {
    const q = (s) => document.querySelector(s)?.getBoundingClientRect();
    const logo = q(".header .logo-img"), menu = q(".menu-btn"), icons = [...document.querySelectorAll(".header-actions .icon-btn")].map((e) => e.getBoundingClientRect());
    const badges = [...document.querySelectorAll(".header-actions .badge")].map((e) => e.getBoundingClientRect());
    const mv = menu && getComputedStyle(document.querySelector(".menu-btn")).display !== "none";
    const left = mv ? logo.left - menu.right : null, right = icons[0].left - logo.right;
    return { logoH: Math.round(logo.height), logoW: Math.round(logo.width), left: left && +left.toFixed(1), right: +right.toFixed(1), tap: [menu?.width, menu?.height, icons[0].width, icons[0].height], badgeClipped: badges.some((x) => x.right > innerWidth || x.left < 0), overflow: document.documentElement.scrollWidth - innerWidth };
  });
  console.log(w, JSON.stringify(r), errs.length ? "ERR " + errs[0] : "noerr");
  await p.screenshot({ path: `shots/r9/header-${w}.png`, clip: { x: 0, y: 0, width: w, height: 100 } });
  await ctx.close();
}
await b.close();

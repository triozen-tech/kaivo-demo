// Crawl every internal link from every page; report broken ones, missing alt, sample labels, footer credit.
import { chromium } from "playwright";
const base = process.env.U || "http://localhost:3018";
const b = await chromium.launch({ channel: "chrome" });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.addInitScript(() => sessionStorage.setItem("kaivo-intro", "1"));
const seen = new Set(), queue = ["/"], broken = [], report = [];
while (queue.length) {
  const path = queue.shift(); if (seen.has(path)) continue; seen.add(path);
  const p = await ctx.newPage();
  const res = await p.goto(base + path + "?static=1", { waitUntil: "load" }).catch(() => null);
  const status = res ? res.status() : 0;
  if (status >= 400 || !status) { if (path !== "/404-test") broken.push(path + " -> " + status); }
  await p.waitForTimeout(500);
  const d = await p.evaluate(() => {
    const links = [...document.querySelectorAll("a[href]")].map(a => a.getAttribute("href")).filter(h => h && h.startsWith("/") && !h.startsWith("//"));
    const imgs = [...document.querySelectorAll("img")].filter(i => !(i.alt || "").trim() && i.getAttribute("role") !== "presentation" && i.getAttribute("aria-hidden") !== "true").map(i => i.currentSrc.slice(-50));
    const text = document.body.innerText;
    const prices = [...document.querySelectorAll(".price")].filter(e => !/sample/i.test(e.innerText)).map(e => e.innerText.slice(0, 30));
    return { links, imgs, prices, footer: /Concept website by Triozen Tech/.test(text), ratings: /Sample ratings/.test(text), revs: /Sample reviews for this concept demo/.test(text), hasRating: !!document.querySelector(".rating,.stars"), hasReviews: !!document.querySelector(".review") };
  });
  for (const l of d.links) { const u = l.split("#")[0].split("?")[0]; if (u && !seen.has(u) && !queue.includes(u)) queue.push(u); }
  report.push({ path, status, noAlt: d.imgs.length, priceNoLabel: d.prices.length, footer: d.footer, ratings: d.ratings, revs: d.revs, hasRating: d.hasRating, hasReviews: d.hasReviews, imgs: d.imgs.slice(0, 3), prices: d.prices.slice(0, 3) });
  await p.close();
}
console.log("pages crawled:", seen.size, "broken:", broken.length, broken);
for (const r of report) console.log(JSON.stringify(r));
await b.close();

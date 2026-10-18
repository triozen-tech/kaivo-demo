// Layout audit: overflow culprit, text <12px, interactive/text touching screen edge (<12px), uneven card heights per row, radii inventory.
import { chromium } from "playwright";
const U = process.env.U || "http://localhost:3018";
const routes = ["/", "/shop", "/c/tumblers", "/c/retro-kitchen", "/p/retro-kettle", "/p/beauty-serum", "/wishlist", "/cart", "/checkout", "/order/success", "/nope-404"];
const order = { number: "KV-1", date: "x", name: "Asha", city: "Pune", delivery: "Standard", lines: [{ name: "Retro Kettle", qty: 1, price: 6499 }], subtotal: 6499, shipping: 0, total: 6499 };
const b = await chromium.launch({ channel: "chrome" });
for (const w of [360, 390, 412, 768, 1440]) {
  const t = w < 1000;
  const ctx = await b.newContext({ viewport: { width: w, height: t ? 844 : 900 }, isMobile: t, hasTouch: t });
  await ctx.addInitScript((o) => { sessionStorage.setItem("kaivo-intro", "1"); sessionStorage.setItem("kaivo-last-order", JSON.stringify(o)); localStorage.setItem("kaivo-cart", JSON.stringify([{ slug: "retro-kettle", qty: 1 }, { slug: "tumbler-halo", qty: 2 }])); localStorage.setItem("kaivo-wish", JSON.stringify(["tumbler-halo", "retro-kettle"])); }, order);
  const p = await ctx.newPage();
  for (const r of routes) {
    await p.goto(U + r + "?static=1", { waitUntil: "load" }); await p.waitForTimeout(900);
    const res = await p.evaluate(() => {
      const W = innerWidth, out = { over: [], tiny: [], edge: [], rows: [] };
      for (const el of document.body.querySelectorAll("*")) {
        const cs = getComputedStyle(el); if (cs.display === "none" || cs.visibility === "hidden" || cs.position === "fixed") continue;
        const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
        if (r.right > W + 1 && !el.closest(".marquee,.strip,.cat-row,.chips,.topbar,[data-scroller]") && getComputedStyle(el.parentElement).overflowX === "visible") out.over.push(`${el.tagName}.${(el.className + "").slice(0, 30)} r=${r.right.toFixed(0)}`);
        const direct = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
        if (direct && parseFloat(cs.fontSize) < 11.5 && !el.closest("svg")) out.tiny.push(`${el.textContent.trim().slice(0, 24)} ${cs.fontSize}`);
        if ((el.matches("a,button,input,select,h1,h2,h3,p") ) && direct || el.matches("button,input")) { if (r.left < 10 || W - r.right < 10) if (!el.closest(".topbar,.marquee,.hero-img,.band-img,.cat-row,.chips")) out.edge.push(`${el.tagName}.${(el.className + "").slice(0, 24)} L${r.left.toFixed(0)} R${(W - r.right).toFixed(0)}`); }
      }
      // card rows: same top => same height
      const cards = [...document.querySelectorAll(".pcard")]; const byTop = {};
      cards.forEach((c) => { const r = c.getBoundingClientRect(); const k = Math.round(r.top + scrollY); (byTop[k] ||= []).push(r.height); });
      Object.values(byTop).forEach((hs) => { if (hs.length > 1 && Math.max(...hs) - Math.min(...hs) > 2) out.rows.push(hs.map(Math.round).join("/")); });
      out.sw = document.documentElement.scrollWidth; return out;
    });
    const f = (a) => [...new Set(a)].slice(0, 4).join(" | ");
    const bad = res.sw > w || res.over.length || res.tiny.length || res.edge.length || res.rows.length;
    if (bad) console.log(w, r, "sw", res.sw, "\n   over:", f(res.over), "\n   tiny:", f(res.tiny), "\n   edge:", f(res.edge), "\n   rows:", f(res.rows));
  }
  await ctx.close();
}
await b.close();

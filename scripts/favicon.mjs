// Renders the favicon: a K in Instrument Serif on the clay colour -> app/icon.png (512) + app/apple-icon.png (180)
import { chromium } from "playwright";
import fs from "node:fs";
const font = fs.readFileSync("node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2").toString("base64");
const html = (n) => `<style>@font-face{font-family:IS;src:url(data:font/woff2;base64,${font})}
html,body{margin:0}div{width:${n}px;height:${n}px;background:#b4583a;color:#f4efe7;display:grid;place-items:center;font:${n * 0.78}px/1 IS;padding-bottom:${n * 0.04}px;box-sizing:border-box;border-radius:${n * 0.22}px}</style><div>K</div>`;
const b = await chromium.launch({ channel: "chrome" }).catch(() => chromium.launch());
for (const [n, out] of [[512, "app/icon.png"], [180, "app/apple-icon.png"]]) {
  const p = await b.newPage({ viewport: { width: n, height: n } });
  await p.setContent(html(n)); await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: out, omitBackground: true });
}
await b.close();

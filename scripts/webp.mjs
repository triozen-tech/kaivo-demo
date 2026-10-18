import sharp from "sharp";
import fs from "node:fs";
const dir="/Users/hosanna/3D Websites/kaivo/";
for (const f of fs.readdirSync(dir+"raw")) {
  if(!f.endsWith(".jpg")) continue;
  const i=await sharp(dir+"raw/"+f).rotate().webp({quality:92}).toFile(dir+"public/images/kaivo/"+f.replace(".jpg",".webp"));
  console.log(f,i.width,i.height,Math.round(i.size/1024)+"KB");
}
// contact sheet
const names=fs.readdirSync(dir+"raw").filter(f=>f.endsWith(".jpg"));
const tiles=await Promise.all(names.map(async(n,k)=>({input:await sharp(dir+"raw/"+n).resize(300,200,{fit:"cover"}).toBuffer(),left:(k%6)*300,top:Math.floor(k/6)*200})));
await sharp({create:{width:1800,height:800,channels:3,background:"#fff"}}).composite(tiles).jpeg({quality:70}).toFile("/private/tmp/claude-501/-Users-hosanna-3D-Websites-showreel-kit/09d94035-7f8b-4361-8265-5ca38b1b9aa9/scratchpad/sheet.jpg");
console.log(names.join(" "));

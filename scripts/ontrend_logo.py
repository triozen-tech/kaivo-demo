"""OnTrend Oman logo files from raw/ontrend-logo.jpg (never edited). Keys the white background out
with a soft alpha ramp, un-premultiplying the colour against white; makes a reverse version for dark
backgrounds and a square symbol icon set."""
import numpy as np
from PIL import Image, ImageDraw
SRC, OUT = "raw/ontrend-logo.jpg", "public/images/ontrend"
LO, HI = 0.05, 0.30          # alpha ramp on the raw coverage: kills JPEG noise near white, full colour above HI
CREAM = np.array([244, 239, 231], float)

im = np.asarray(Image.open(SRC).convert("RGB")).astype(float)
raw_a = np.clip((255 - im).max(axis=2) / 255, 0, 1)                  # minimal coverage that explains the pixel against white
a = np.clip((raw_a - LO) / (HI - LO), 0, 1); a = a * a * (3 - 2 * a)  # smoothstep ramp
safe = np.maximum(raw_a, 1e-3)[..., None]
col = np.clip((im - 255 * (1 - safe)) / safe, 0, 255)                # un-premultiplied colour
# anti-aliased edge pixels of navy letters keep their navy colour through the un-premultiply, so no white fringe

def rgba(c, al): return np.dstack([c, al * 255]).clip(0, 255).astype(np.uint8)

def trim(arr, pad=0):
    ys, xs = np.where(arr[..., 3] > 8)
    y0, y1, x0, x1 = ys.min() - pad, ys.max() + 1 + pad, xs.min() - pad, xs.max() + 1 + pad
    return arr[max(y0, 0):y1, max(x0, 0):x1], (max(y0, 0), y1, max(x0, 0), x1)

navy = np.median(col[(raw_a > 0.9) & (col[..., 2] > col[..., 0] + 40) & (col.sum(axis=2) < 300)], axis=0)
print("navy sample", navy)
d = np.linalg.norm(col - navy, axis=2)
w = 1 - np.clip((d - 45) / 70, 0, 1)                                  # 1 = navy, 0 = pin colours
rev = col * (1 - w[..., None]) + CREAM * w[..., None]

main, box = trim(rgba(col, a))
y0, y1, x0, x1 = box
rev_main = rgba(rev, a)[y0:y1, x0:x1]
for name, arr in (("logo", main), ("logo-reverse", rev_main)):
    Image.fromarray(arr).save(f"{OUT}/{name}.png", optimize=True)
    Image.fromarray(arr).save(f"{OUT}/{name}.webp", quality=92, method=6, exact=True)
    print(name, arr.shape)

# symbol: pieces that are not navy (the pin ring and point)
sym_mask = (a > 0.3) & (w < 0.5)
ys, xs = np.where(sym_mask)
# keep only the left-most cluster (the pin), drop stray pixels
xcut = xs.min() + int((xs.max() - xs.min()) * 0.0)
cols = np.bincount(xs, minlength=im.shape[1])
sx0 = xs.min(); sx1 = sx0
while sx1 < len(cols) - 1 and cols[sx1:sx1 + 25].sum() > 0: sx1 += 1
sel = sym_mask.copy(); sel[:, sx1:] = False
ys, xs = np.where(sel)
sy0, sy1, sx0 = ys.min(), ys.max() + 1, xs.min()
sym_a = np.where(sel, a, 0)
sym = rgba(col, sym_a)[sy0:sy1, sx0:sx1 + 0 if False else sx1]
sym, _ = trim(sym)
Image.fromarray(sym).save(f"{OUT}/symbol.png", optimize=True)
Image.fromarray(sym).save(f"{OUT}/symbol.webp", quality=92, method=6, exact=True)
print("symbol", sym.shape)

def icon(size, fill=0.66, radius=0.22):
    S = size * 4                                                       # draw 4x then downsample for smooth corners
    bg = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    ImageDraw.Draw(bg).rounded_rectangle([0, 0, S - 1, S - 1], radius=int(S * radius), fill=tuple(CREAM.astype(int)) + (255,))
    s = Image.fromarray(sym); k = S * fill / max(s.size)
    s = s.resize((round(s.width * k), round(s.height * k)), Image.LANCZOS)
    bg.alpha_composite(s, ((S - s.width) // 2, (S - s.height) // 2))
    return bg.resize((size, size), Image.LANCZOS)
for n in (32, 180, 512): icon(n).save(f"{OUT}/icon-{n}.png", optimize=True)

# contact sheet: a, b, c on cream and on ink
INK = (30, 27, 24)
sheet = Image.new("RGB", (1500, 760))
for row, bgc in enumerate(((244, 239, 231), INK)):
    ImageDraw.Draw(sheet).rectangle([0, row * 380, 1500, row * 380 + 380], fill=bgc)
    for i, p in enumerate(("logo", "logo-reverse", "symbol")):
        t = Image.open(f"{OUT}/{p}.png"); k = 300 / max(t.size); t = t.resize((round(t.width * k), round(t.height * k)), Image.LANCZOS)
        sheet.paste(t, (30 + i * 480 + (440 - t.width) // 2, row * 380 + (380 - t.height) // 2), t)
    ic = Image.open(f"{OUT}/icon-180.png"); sheet.paste(ic, (1340, row * 380 + 100), ic)
sheet.save("/private/tmp/logo-sheet.png")

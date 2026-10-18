"""Paint out the ✦ mark (bottom right) on every raw/*.jpg -> raw/clean/*.jpg (originals untouched).
Same method as showreel-kit's clean_mark.py: fill the circle with the blurred colour of its surroundings
(mark excluded) plus fine texture borrowed from a patch to the left, feathered.
RUN: python3 scripts/clean_marks.py [radius=46] [offset=115]"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image

def _box(a, k, axis):
    pad = k // 2; w = [(0, 0)] * a.ndim; w[axis] = (pad + 1, pad)
    c = np.cumsum(np.pad(a, w, mode="edge"), axis=axis, dtype=np.float64)
    return ((np.take(c, np.arange(k, c.shape[axis]), axis=axis) - np.take(c, np.arange(0, c.shape[axis] - k), axis=axis)) / k).astype(np.float32)

def blur(a, s):
    k = max(1, int(round(np.sqrt(4 * s * s + 1)))) | 1
    for ax in (0, 1):
        for _ in range(3):
            a = _box(a, k, ax)
    return a

R = float(sys.argv[1]) if len(sys.argv) > 1 else 46
OFF = float(sys.argv[2]) if len(sys.argv) > 2 else 115
root = Path(__file__).resolve().parent.parent
out_dir = root / "raw" / "clean"; out_dir.mkdir(exist_ok=True)
for path in sorted((root / "raw").glob("*.jpg")):
    src = np.asarray(Image.open(path).convert("RGB")).astype(np.float32) / 255
    H, W, _ = src.shape
    # work on the corner only (fast)
    x0, y0 = W - 420, H - 420
    c = src[y0:, x0:]
    h, w, _ = c.shape
    yy, xx = np.mgrid[0:h, 0:w]
    mark = ((xx - (W - OFF - x0)) ** 2 + (yy - (H - OFF - y0)) ** 2 <= R * R).astype(np.float32)
    keep = 1 - mark
    ck = c * keep[..., None]
    n12, n30 = blur(keep, 12), blur(keep, 30)
    s12 = blur(ck, 12) / np.maximum(n12, 1e-4)[..., None]
    s30 = blur(ck, 30) / np.maximum(n30, 1e-4)[..., None]
    a = np.clip(n12 / 0.2, 0, 1)[..., None]
    smooth = a * s12 + (1 - a) * s30
    shifted = np.roll(c, 140, axis=1)
    texture = shifted - blur(shifted, 3)
    fill = smooth + texture * 0.8
    f = np.clip(blur(mark, 5) * 1.6, 0, 1)[..., None]
    out = src.copy()
    out[y0:, x0:] = c * (1 - f) + fill * f
    Image.fromarray(np.clip(out * 255 + 0.5, 0, 255).astype(np.uint8)).save(out_dir / path.name, quality=97, subsampling=0)
    print("cleaned", path.name)

# Images where the fill still smudges strong structure: crop the original in so the mark falls outside.
CROP = ["b-jars", "b-retro", "b-shakers", "b-tumblers", "hero"]
M = 170
for n in CROP:
    im = Image.open(root / "raw" / f"{n}.jpg").convert("RGB")
    w, h = im.size
    im.crop((0, 0, w - M, h - M)).save(out_dir / f"{n}.jpg", quality=97, subsampling=0)
    print("cropped", n, (w - M, h - M))

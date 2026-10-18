import Image from "next/image";
import boxes from "@/data/cutbox.json";

type Box = { l: number; r: number; t: number; b: number };

/** A cut-out trimmed to its own outline (the PNGs keep the photo's 3:4 canvas), so it can be sized and placed freely. */
export function CutCrop({ name, className, style }: { name: string; className?: string; style?: React.CSSProperties }) {
  const b = (boxes as Record<string, Box>)[name];
  if (!b) return null;
  const w = b.r - b.l, h = b.b - b.t;
  return (
    <span className={className} style={{ ...style, aspectRatio: `${(w * 1792) / (h * 2400)}` }} aria-hidden="true">
      <Image
        src={`/images/kaivo/cut/${name}.png`} alt="" width={1792} height={2400} sizes="320px" quality={90}
        style={{ position: "absolute", width: `${100 / w}%`, height: `${100 / h}%`, left: `${(-b.l / w) * 100}%`, top: `${(-b.t / h) * 100}%`, maxWidth: "none" }}
      />
    </span>
  );
}

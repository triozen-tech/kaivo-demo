import type { Product } from "./products";
import type { CategorySlug } from "./categories";

/** SAMPLE reviews for the concept demo: generic names, short generic comments. Never real people. */
export type SampleReview = { who: string; stars: number; title: string; text: string };

const pool: Record<CategorySlug, SampleReview[]> = {
  tumblers: [
    { who: "Sample customer A", stars: 5, title: "Sits right in the car", text: "Fits the cup holder and the lid feels secure. Easy to carry around all day." },
    { who: "Sample customer B", stars: 4, title: "Nice weight", text: "Feels solid without being heavy. The finish is pleasant to hold." },
    { who: "Sample customer C", stars: 5, title: "Desk companion", text: "Stays on my desk all day and looks good doing it." },
  ],
  "retro-kitchen": [
    { who: "Sample customer A", stars: 5, title: "Brightens the counter", text: "The colour is soft and cheerful. It works as well as it looks." },
    { who: "Sample customer B", stars: 4, title: "Simple to use", text: "Straightforward controls and a tidy shape that fits a small kitchen." },
    { who: "Sample customer C", stars: 5, title: "Feels well made", text: "Rounded edges and a calm palette. A good fit for a morning routine." },
  ],
  shakers: [
    { who: "Sample customer A", stars: 5, title: "Mixes smoothly", text: "No lumps and the lid closes firmly. Easy to rinse afterwards." },
    { who: "Sample customer B", stars: 4, title: "Good for the bag", text: "Slim enough to carry and the cap stays shut." },
    { who: "Sample customer C", stars: 5, title: "Daily habit", text: "Used it every day this week. Simple and dependable." },
  ],
  "food-jars": [
    { who: "Sample customer A", stars: 5, title: "Keeps things tidy", text: "The lid seals well and the shape stacks neatly on the shelf." },
    { who: "Sample customer B", stars: 4, title: "Looks lovely", text: "Clean lines and easy to fill. Lovely on an open shelf." },
    { who: "Sample customer C", stars: 5, title: "Handy size", text: "Just the right size for pantry basics or a packed lunch." },
  ],
  beauty: [
    { who: "Sample customer A", stars: 5, title: "Calm on the shelf", text: "Quiet colours and a good feel in the hand. Looks right in the bathroom." },
    { who: "Sample customer B", stars: 4, title: "Easy to use", text: "The pump and cap work smoothly and nothing leaks in a bag." },
    { who: "Sample customer C", stars: 5, title: "Pretty and practical", text: "A small daily pleasure. I would happily buy another." },
  ],
};

export const reviewsFor = (p: Product): SampleReview[] => pool[p.category];

/** Splits `count` reviews across 5..1 stars so the weighted mean matches `rating` (SAMPLE numbers). */
export function breakdown(rating: number, count: number): { star: number; n: number; pct: number }[] {
  let lo = -2, hi = 6;
  const mean = (l: number) => { let s = 0, w = 0; for (let k = 1; k <= 5; k++) { const x = Math.exp(l * k); s += x * k; w += x; } return s / w; };
  for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (mean(m) < rating) lo = m; else hi = m; }
  const l = (lo + hi) / 2;
  const ws = [5, 4, 3, 2, 1].map((k) => Math.exp(l * k));
  const tot = ws.reduce((a, b) => a + b, 0);
  const ns = ws.map((w) => Math.round((w / tot) * count));
  ns[0] += count - ns.reduce((a, b) => a + b, 0);
  return ns.map((n, i) => ({ star: 5 - i, n, pct: Math.round((n / count) * 100) }));
}

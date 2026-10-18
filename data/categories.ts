export type CategorySlug = "tumblers" | "retro-kitchen" | "shakers" | "food-jars" | "beauty";

export type Category = {
  slug: CategorySlug;
  name: string;
  tagline: string;
  banner: string;
  /** object-position for the 16:9 banner when it is cropped */
  focal: string;
  /** object-position for the home tile (a narrower crop than the banner, so the subject sits further right) */
  tile: string;
  /** phone tile crop: scale and transform-origin, so the products fill the frame */
  zoom?: { s: number; o: string };
  /** banner gradient strength: phone (ink, bottom) and desktop (cream, left) */
  shade?: { m: number; d: number };
  /** desktop: the picture starts this far from the left (when the subject sits mid-frame), the cream carries the text */
  inset?: string;
};

export const categories: Category[] = [
  { slug: "tumblers", name: "Tumblers", tagline: "Insulated companions for the desk, the commute and the trail.", banner: "b-tumblers", focal: "85% 50%", tile: "85% 50%", zoom: { s: 1.45, o: "85% 92%" } },
  { slug: "retro-kitchen", name: "Retro Kitchen", tagline: "Soft colours and rounded edges for a counter that feels like home.", banner: "b-retro", focal: "70% 55%", tile: "80% 60%", zoom: { s: 1.35, o: "90% 100%" } },
  { slug: "shakers", name: "Shakers", tagline: "Mix it, shake it, carry it. Simple bottles for busy mornings.", banner: "b-shakers", focal: "80% 50%", tile: "88% 55%" },
  { slug: "food-jars", name: "Food Jars", tagline: "Keep it fresh on the shelf, or hot on the move.", banner: "b-jars", focal: "60% 55%", tile: "100% 60%" },
  { slug: "beauty", name: "Beauty", tagline: "Quiet daily rituals, kept in frosted glass.", banner: "b-beauty", focal: "50% 62%", tile: "50% 60%", inset: "34%" },
];

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);

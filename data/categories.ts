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
};

export const categories: Category[] = [
  { slug: "tumblers", name: "Tumblers", tagline: "Insulated companions for the desk, the commute and the trail.", banner: "b-tumblers", focal: "80% 50%", tile: "80% 50%" },
  { slug: "retro-kitchen", name: "Retro Kitchen", tagline: "Soft colours and rounded edges for a counter that feels like home.", banner: "b-retro", focal: "70% 55%", tile: "88% 60%" },
  { slug: "shakers", name: "Shakers", tagline: "Mix it, shake it, carry it. Simple bottles for busy mornings.", banner: "b-shakers", focal: "80% 50%", tile: "88% 55%" },
  { slug: "food-jars", name: "Food Jars", tagline: "Keep it fresh on the shelf, or hot on the move.", banner: "b-jars", focal: "60% 55%", tile: "100% 60%" },
  { slug: "beauty", name: "Beauty", tagline: "Quiet daily rituals, kept in frosted glass.", banner: "b-beauty", focal: "50% 62%", tile: "50% 60%" },
];

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);

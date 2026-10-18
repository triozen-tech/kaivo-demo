export type CategorySlug = "tumblers" | "retro-kitchen" | "shakers" | "food-jars" | "beauty";

export type Category = {
  slug: CategorySlug;
  name: string;
  tagline: string;
  banner: string;
  /** object-position for the 16:9 banner when it is cropped */
  focal: string;
};

export const categories: Category[] = [
  { slug: "tumblers", name: "Tumblers", tagline: "Insulated companions for the desk, the commute and the trail.", banner: "b-tumblers", focal: "50% 50%" },
  { slug: "retro-kitchen", name: "Retro Kitchen", tagline: "Soft colours and rounded edges for a counter that feels like home.", banner: "b-retro", focal: "65% 55%" },
  { slug: "shakers", name: "Shakers", tagline: "Mix it, shake it, carry it. Simple bottles for busy mornings.", banner: "b-shakers", focal: "40% 50%" },
  { slug: "food-jars", name: "Food Jars", tagline: "Keep it fresh on the shelf, or hot on the move.", banner: "b-jars", focal: "55% 55%" },
  { slug: "beauty", name: "Beauty", tagline: "Quiet daily rituals, kept in frosted glass.", banner: "b-beauty", focal: "78% 50%" },
];

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);

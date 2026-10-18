import { categories, type CategorySlug } from "./categories";

export type Product = {
  slug: string;
  name: string;
  category: CategorySlug;
  /** sample price in INR (concept store, not a real price) */
  price: number;
  image: string;
  /** transparent cut-out exists at /images/kaivo/cut/<image>.png and its edge is clean */
  cut: boolean;
  summary: string;
  features: string[];
  details: { label: string; value: string }[];
  /** SAMPLE rating (concept demo, not real reviews) */
  rating: number;
  reviewCount: number;
  featured?: number;
  tag?: "New" | "Bestseller" | "Sample offer";
};

export const products: Product[] = [
  {
    slug: "tumbler-halo", rating: 4.8, reviewCount: 186, name: "Halo Tumbler 600 ml", category: "tumblers", price: 1499, image: "p-tumbler-1", cut: true, tag: "Bestseller", featured: 1,
    summary: "A slim, double-walled tumbler in soft cream that fits most cup holders.",
    features: ["Double-wall body keeps drinks cooler or warmer for longer", "Slide-lock lid with a small sip opening", "Powder-coated finish that is pleasant to hold", "Fits standard cup holders"],
    details: [{ label: "Size", value: "600 ml" }, { label: "Material", value: "Stainless steel body, BPA-free lid" }, { label: "Care", value: "Hand wash recommended. Lid is top-rack dishwasher safe." }],
  },
  {
    slug: "tumbler-moss", rating: 4.5, reviewCount: 74, name: "Moss Travel Tumbler 450 ml", category: "tumblers", price: 1299, image: "p-tumbler-2", cut: true, tag: "New",
    summary: "A compact moss-green tumbler made for short commutes and desk days.",
    features: ["Compact 450 ml size", "Insulated double-wall construction", "Flip lid with a sip opening", "Matte finish resists fingerprints"],
    details: [{ label: "Size", value: "450 ml" }, { label: "Material", value: "Stainless steel, silicone seal" }, { label: "Care", value: "Hand wash with mild soap. Do not microwave." }],
  },
  {
    slug: "tumbler-clay", rating: 4.7, reviewCount: 142, name: "Clay Straw Tumbler 900 ml", category: "tumblers", price: 1799, image: "p-tumbler-3", cut: true, featured: 4,
    summary: "A large clay-toned tumbler with a handle and a reusable straw.",
    features: ["Generous 900 ml capacity", "Comfortable carry handle", "Reusable straw with a splash-resistant lid", "Insulated walls for long, cold sips"],
    details: [{ label: "Size", value: "900 ml" }, { label: "Material", value: "Stainless steel, food-grade plastic lid and straw" }, { label: "Care", value: "Hand wash. Straw brush included in the set." }],
  },
  {
    slug: "retro-kettle", rating: 4.9, reviewCount: 203, name: "Butter Retro Kettle 1.7 L", category: "retro-kitchen", price: 4999, image: "p-retro-1", cut: true, tag: "Bestseller", featured: 2,
    summary: "A stovetop kettle in butter yellow with a curved handle and a rounded lid.",
    features: ["Stovetop kettle for gas and induction hobs", "Enamel-style glossy finish", "Cool-touch curved handle", "1.7 L capacity for the whole pot"],
    details: [{ label: "Size", value: "1.7 L" }, { label: "Material", value: "Enamelled steel, heat-resistant handle" }, { label: "Care", value: "Wipe clean with a soft cloth. Do not use abrasive pads." }],
  },
  {
    slug: "retro-toaster", rating: 4.4, reviewCount: 58, name: "Sage Retro Toaster 2-slice", category: "retro-kitchen", price: 4499, image: "p-retro-2", cut: true, featured: 5,
    summary: "A rounded two-slice toaster in sage green with a chrome lever.",
    features: ["Two wide slots", "Browning dial with several levels", "Defrost and cancel functions", "Removable crumb tray"],
    details: [{ label: "Size", value: "2 slices" }, { label: "Material", value: "Painted steel body, chrome trim" }, { label: "Care", value: "Unplug and cool before emptying the crumb tray." }],
  },
  {
    slug: "retro-coffee", rating: 4.6, reviewCount: 97, name: "Cream Retro Coffee Maker", category: "retro-kitchen", price: 6999, image: "p-retro-3", cut: true, tag: "New",
    summary: "A cream drip coffee maker with a glass carafe and a rounded body.",
    features: ["Glass carafe with a comfortable handle", "Reusable mesh filter", "Warming plate keeps the pot ready", "Simple one-switch operation"],
    details: [{ label: "Size", value: "Carafe for several cups" }, { label: "Material", value: "Painted body, glass carafe" }, { label: "Care", value: "Rinse carafe and filter after each use." }],
  },
  {
    slug: "shaker-frost", rating: 4.3, reviewCount: 164, name: "Frost Shaker 700 ml", category: "shakers", price: 799, image: "p-shaker-1", cut: false, tag: "Bestseller",
    summary: "A frosted shaker bottle with a mixing ball and a secure screw lid.",
    features: ["Frosted body with measuring marks", "Wire mixing ball included", "Screw lid with a flip spout", "Wide mouth for easy filling"],
    details: [{ label: "Size", value: "700 ml" }, { label: "Material", value: "BPA-free plastic, steel mixing ball" }, { label: "Care", value: "Top-rack dishwasher safe." }],
  },
  {
    slug: "shaker-duo", rating: 4.2, reviewCount: 41, name: "Duo Shaker with Storage", category: "shakers", price: 999, image: "p-shaker-2", cut: true, tag: "Sample offer", featured: 3,
    summary: "A blush shaker with a screw-on storage cup in the base.",
    features: ["Storage compartment in the base", "Wire mixing ball included", "Carry loop on the lid", "Wide mouth for easy filling"],
    details: [{ label: "Size", value: "Bottle with storage cup" }, { label: "Material", value: "BPA-free plastic" }, { label: "Care", value: "Hand wash recommended." }],
  },
  {
    slug: "shaker-steel", rating: 4.5, reviewCount: 88, name: "Steel Shaker 750 ml", category: "shakers", price: 1199, image: "p-shaker-3", cut: true,
    summary: "A brushed steel shaker bottle with a loop cap for everyday carry.",
    features: ["Brushed steel body", "Loop cap that clips to a bag", "Does not hold on to smells or stains", "Mixing ball included"],
    details: [{ label: "Size", value: "750 ml" }, { label: "Material", value: "Stainless steel, silicone seal" }, { label: "Care", value: "Hand wash. Do not microwave." }],
  },
  {
    slug: "jar-hearth", rating: 4.7, reviewCount: 119, name: "Hearth Insulated Food Jar 500 ml", category: "food-jars", price: 1399, image: "p-jar-1", cut: true,
    summary: "A sage insulated jar with a wide mouth for soups, dals and porridge.",
    features: ["Wide mouth for easy filling and eating", "Double-wall insulated body", "Screw lid with a silicone seal", "Matte sage finish"],
    details: [{ label: "Size", value: "500 ml" }, { label: "Material", value: "Stainless steel, silicone seal" }, { label: "Care", value: "Hand wash. Do not microwave." }],
  },
  {
    slug: "jar-pantry", rating: 4.1, reviewCount: 23, name: "Glass Pantry Jar Set of 3", category: "food-jars", price: 1599, image: "p-jar-2", cut: false, tag: "Sample offer", featured: 6,
    summary: "Three clear glass jars with bamboo lids for grains, spices and snacks.",
    features: ["Set of three jars in graduated sizes", "Natural bamboo lids", "Clear glass so you can see what is inside", "Stacks neatly on a shelf"],
    details: [{ label: "Size", value: "Set of 3, small to large" }, { label: "Material", value: "Glass jars, bamboo lids" }, { label: "Care", value: "Wash jars in warm soapy water. Wipe the lids; do not soak." }],
  },
  {
    slug: "jar-lunch", rating: 4.4, reviewCount: 66, name: "Lunch Jar with Spoon Lid 700 ml", category: "food-jars", price: 1699, image: "p-jar-3", cut: true, tag: "New",
    summary: "A white lunch jar with a carry loop and a lid that holds a spoon.",
    features: ["Spoon stored in the lid", "Soft carry loop", "Large 700 ml capacity", "Wide mouth for easy cleaning"],
    details: [{ label: "Size", value: "700 ml" }, { label: "Material", value: "Stainless steel, food-grade plastic lid" }, { label: "Care", value: "Hand wash. Lid is top-rack dishwasher safe." }],
  },
  {
    slug: "beauty-serum", rating: 4.8, reviewCount: 176, name: "Dew Serum 30 ml", category: "beauty", price: 1299, image: "p-beauty-1", cut: true, tag: "Bestseller",
    summary: "A lightweight daily serum in a frosted glass dropper bottle.",
    features: ["Lightweight, non-greasy feel", "Frosted glass bottle with a gold-tone cap", "Dropper for easy, measured use", "Suitable for morning or evening"],
    details: [{ label: "Size", value: "30 ml" }, { label: "Material", value: "Frosted glass, metal-finish cap" }, { label: "Care", value: "Store in a cool, dry place with the cap closed." }],
  },
  {
    slug: "beauty-cream", rating: 4.6, reviewCount: 132, name: "Silk Cream Jar 50 g", category: "beauty", price: 1499, image: "p-beauty-2", cut: true,
    summary: "A soft, creamy moisturiser in a white jar with a gold-tone lid.",
    features: ["Soft, creamy texture", "Weighted jar with a gold-tone lid", "Refillable-style jar you can keep on a shelf", "Scented lightly"],
    details: [{ label: "Size", value: "50 g" }, { label: "Material", value: "Ceramic-look jar, metal-finish lid" }, { label: "Care", value: "Keep the lid closed and out of direct sun." }],
  },
  {
    slug: "beauty-mist", rating: 4.3, reviewCount: 35, name: "Mist Facial Spray 100 ml", category: "beauty", price: 899, image: "p-beauty-3", cut: false, tag: "New",
    summary: "A fine facial mist in a tall frosted bottle with a gold-tone cap.",
    features: ["Fine, even mist", "Tall frosted bottle that is easy to hold", "Small enough for a bag or a desk", "Gold-tone cap"],
    details: [{ label: "Size", value: "100 ml" }, { label: "Material", value: "Frosted glass, metal-finish cap" }, { label: "Care", value: "Store upright, away from heat." }],
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const productsIn = (category: string) => products.filter((p) => p.category === category);
export const featuredProducts = () =>
  products.filter((p) => p.featured).sort((a, b) => a.featured! - b.featured!).slice(0, 6);

/** Always `n` other products: the same category first, then the following categories in menu order. */
export const relatedProducts = (slug: string, n = 3) => {
  const p = getProduct(slug);
  if (!p) return [];
  const order = categories.map((c) => c.slug);
  const start = order.indexOf(p.category);
  const ranked = [...products.filter((x) => x.slug !== slug)].sort((a, b) => {
    const da = (order.indexOf(a.category) - start + order.length) % order.length;
    const db = (order.indexOf(b.category) - start + order.length) % order.length;
    return da - db;
  });
  return ranked.slice(0, n);
};

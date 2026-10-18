import { Suspense } from "react";
import type { Product } from "@/data/products";
import { ShopBrowser } from "./ShopBrowser";

export function CategoryGrid({ products }: { products: Product[] }) {
  return <Suspense><ShopBrowser products={products} /></Suspense>;
}

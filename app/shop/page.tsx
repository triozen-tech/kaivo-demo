import { Suspense } from "react";
import type { Metadata } from "next";
import { products } from "@/data/products";
import { ShopBrowser } from "@/components/ShopBrowser";

export const metadata: Metadata = { title: "Shop all", description: "Every Kaivo product in one place. Sample prices, concept store." };

export default function ShopPage() {
  return (
    <>
      <div className="container page shop-page">
        <p className="label">The full range</p>
        <h1 className="h1">Shop all</h1>
        <Suspense><ShopBrowser products={products} paged /></Suspense>
      </div>
    </>
  );
}

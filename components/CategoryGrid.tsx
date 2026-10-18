"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/data/products";
import { ProductCard } from "./ProductCard";

type Sort = "featured" | "low" | "high";

export function CategoryGrid({ products }: { products: Product[] }) {
  const [sort, setSort] = useState<Sort>("featured");
  const list = useMemo(() => {
    if (sort === "low") return [...products].sort((a, b) => a.price - b.price);
    if (sort === "high") return [...products].sort((a, b) => b.price - a.price);
    return products;
  }, [products, sort]);

  return (
    <>
      <div className="sortbar">
        <p>{products.length} products</p>
        <label>
          <span>Sort by</span>
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
            <option value="featured">Featured</option>
            <option value="low">Price, low to high</option>
            <option value="high">Price, high to low</option>
          </select>
        </label>
      </div>
      <div className="grid">
        {list.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </>
  );
}

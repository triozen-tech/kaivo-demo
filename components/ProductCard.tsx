import Link from "next/link";
import type { Product } from "@/data/products";
import { categories } from "@/data/categories";
import { Pic } from "./ProductImage";
import { Price } from "./Price";

export function ProductCard({ product }: { product: Product }) {
  const cat = categories.find((c) => c.slug === product.category);
  return (
    <Link href={`/p/${product.slug}`} className="pcard">
      <span className="pcard-img">
        <Pic name={product.image} alt={product.name} sizes="(max-width: 700px) 50vw, (max-width: 1100px) 33vw, 380px" />
      </span>
      <span className="pcard-meta">
        <span className="pcard-cat">{cat?.name}</span>
        <span className="pcard-name">{product.name}</span>
        <Price value={product.price} />
      </span>
    </Link>
  );
}

import { MorphLink } from "./MorphLink";
import type { Product } from "@/data/products";
import { categories } from "@/data/categories";
import { Pic } from "./ProductImage";
import { CutPic } from "./CutPic";
import { Price } from "./Price";

export function ProductCard({ product }: { product: Product }) {
  const cat = categories.find((c) => c.slug === product.category);
  return (
    <MorphLink href={`/p/${product.slug}`} className="pcard" morph=".pcard-img">
      <span className="pcard-in">
      <span className={`pcard-img${product.cut ? " cut-host" : ""}`} data-tilt-host={product.cut ? "" : undefined}>
        {product.tag && <span className={`tagpill tag-${product.tag === "Bestseller" ? "best" : product.tag === "New" ? "new" : "offer"}`}>{product.tag}</span>}
        {product.cut
          ? <CutPic name={product.image} alt={product.name} sizes="(max-width: 700px) 50vw, (max-width: 1100px) 33vw, 380px" />
          : <Pic name={product.image} alt={product.name} sizes="(max-width: 700px) 50vw, (max-width: 1100px) 33vw, 380px" />}
      </span>
      <span className="pcard-meta">
        <span className="pcard-cat">{cat?.name}</span>
        <span className="pcard-name">{product.name}</span>
        <Price value={product.price} />
      </span>
      </span>
    </MorphLink>
  );
}

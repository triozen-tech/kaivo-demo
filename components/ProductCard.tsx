import { MorphLink } from "./MorphLink";
import type { Product } from "@/data/products";
import { categories } from "@/data/categories";
import { Pic } from "./ProductImage";
import { CutPic } from "./CutPic";
import { Price } from "./Price";
import { Rating } from "./Rating";
import { HeartButton } from "./HeartButton";
import { QuickAdd } from "./QuickAdd";

/** The picture and text are one link; the heart and the quick-add button sit beside it (a button must not live inside a link). */
export function ProductCard({ product }: { product: Product }) {
  const cat = categories.find((c) => c.slug === product.category);
  return (
    <div className="pcard">
      <div className="pcard-in">
        <MorphLink href={`/p/${product.slug}`} className="pcard-link" morph=".pcard-img" data-cursor="View">
          <span className={`pcard-img${product.cut ? " cut-host" : ""}`} data-tilt-host={product.cut ? "" : undefined}>
            {product.tag && <span className={`tagpill tag-${product.tag === "Bestseller" ? "best" : product.tag === "New" ? "new" : "offer"}`}>{product.tag}</span>}
            {product.cut
              ? <CutPic name={product.image} alt={product.name} sizes="(max-width: 700px) 50vw, (max-width: 1100px) 33vw, 380px" />
              : <Pic name={product.image} alt={product.name} sizes="(max-width: 700px) 50vw, (max-width: 1100px) 33vw, 380px" />}
          </span>
          <span className="pcard-meta">
            <span className="pcard-cat">{cat?.name}</span>
            <span className="pcard-name">{product.name}</span>
            <Rating value={product.rating} count={product.reviewCount} />
          </span>
        </MorphLink>
        <HeartButton slug={product.slug} name={product.name} className="heart-card" />
        <div className="pcard-foot">
          <Price value={product.price} />
          <QuickAdd slug={product.slug} name={product.name} />
        </div>
      </div>
    </div>
  );
}

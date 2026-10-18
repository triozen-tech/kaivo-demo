import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategory } from "@/data/categories";
import { getProduct, products, productsIn } from "@/data/products";
import { Pic } from "@/components/ProductImage";
import { Price } from "@/components/Price";
import { ProductBuy } from "@/components/ProductBuy";
import { ProductCard } from "@/components/ProductCard";

export const dynamicParams = false;
export const generateStaticParams = () => products.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: PageProps<"/p/[slug]">): Promise<Metadata> {
  const p = getProduct((await params).slug);
  return { title: p?.name, description: p?.summary };
}

export default async function ProductPage({ params }: PageProps<"/p/[slug]">) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const cat = getCategory(p.category)!;
  const related = productsIn(p.category).filter((x) => x.slug !== p.slug).slice(0, 3);

  return (
    <>
      <div className="container crumbs">
        <Link href="/">Home</Link><span aria-hidden="true">/</span>
        <Link href={`/c/${cat.slug}`}>{cat.name}</Link><span aria-hidden="true">/</span>
        <span aria-current="page">{p.name}</span>
      </div>

      <section className="container pdp">
        <div className="pdp-media">
          <Pic name={p.image} alt={p.name} sizes="(max-width: 900px) 100vw, 50vw" priority />
        </div>
        <div className="pdp-info">
          <p className="label">{cat.name}</p>
          <h1 className="h1">{p.name}</h1>
          <Price value={p.price} className="price-lg" />
          <p className="lead">{p.summary}</p>
          <ProductBuy slug={p.slug} />
          <div className="pdp-block">
            <h2 className="h4">Features</h2>
            <ul className="ticks">{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
          </div>
          <div className="pdp-block">
            <h2 className="h4">Details</h2>
            <dl className="details">
              {p.details.map((d) => (<div key={d.label}><dt>{d.label}</dt><dd>{d.value}</dd></div>))}
            </dl>
          </div>
        </div>
      </section>

      <section className="section container" aria-labelledby="also">
        <div className="section-head"><h2 id="also" className="h2">You may also like</h2></div>
        <div className="grid">{related.map((r) => <ProductCard key={r.slug} product={r} />)}</div>
      </section>
    </>
  );
}

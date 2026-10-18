import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategory } from "@/data/categories";
import { getProduct, products, relatedProducts } from "@/data/products";
import { lifestyle } from "@/data/lifestyle";
import { ProductGallery } from "@/components/ProductGallery";
import { Price } from "@/components/Price";
import { ProductBuy } from "@/components/ProductBuy";
import { ProductCard } from "@/components/ProductCard";

export const dynamicParams = false;
export const generateStaticParams = () => products.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: PageProps<"/p/[slug]">): Promise<Metadata> {
  const p = getProduct((await params).slug);
  return { title: p?.name, description: p ? `${p.summary} Sample price, Kaivo demo store.` : undefined };
}

export default async function ProductPage({ params }: PageProps<"/p/[slug]">) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const cat = getCategory(p.category)!;
  const related = relatedProducts(p.slug, 3);
  const life = lifestyle[products.findIndex((x) => x.slug === p.slug) % lifestyle.length];
  const gallery = [
    { name: p.image, alt: p.name, label: "Product", position: undefined },
    { name: cat.banner, alt: `${cat.name} in the Kaivo range`, label: "In the range", position: cat.focal, zoom: 1.35 },
    { name: life.img, alt: life.alt, label: "At home", position: life.pos, zoom: 1.2 },
  ];

  return (
    <>
      <div className="container crumbs">
        <Link href="/">Home</Link><span aria-hidden="true">/</span>
        <Link href={`/c/${cat.slug}`}>{cat.name}</Link><span aria-hidden="true">/</span>
        <span aria-current="page">{p.name}</span>
      </div>

      <section className="container pdp">
        <ProductGallery items={gallery} />
        <div className="pdp-info" data-stagger>
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
        <div className="section-head" data-reveal><h2 id="also" className="h2">You may also like</h2></div>
        <div className="grid" data-stagger>{related.map((r) => <ProductCard key={r.slug} product={r} />)}</div>
      </section>
    </>
  );
}

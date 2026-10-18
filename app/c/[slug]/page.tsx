import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { categories, getCategory } from "@/data/categories";
import { productsIn } from "@/data/products";
import { Pic } from "@/components/ProductImage";
import { CategoryGrid } from "@/components/CategoryGrid";

export const dynamicParams = false;
export const generateStaticParams = () => categories.map((c) => ({ slug: c.slug }));

export async function generateMetadata({ params }: PageProps<"/c/[slug]">): Promise<Metadata> {
  const c = getCategory((await params).slug);
  return { title: c?.name, description: c ? `${c.tagline} Shop ${c.name.toLowerCase()} at the Kaivo demo store.` : undefined };
}

export default async function CategoryPage({ params }: PageProps<"/c/[slug]">) {
  const cat = getCategory((await params).slug);
  if (!cat) notFound();
  return (
    <>
      <section className="cat-banner" style={{ "--sm": cat.shade?.m ?? 0.75, "--sd": cat.shade?.d ?? 0.92, "--inset": cat.inset ?? "0%" } as React.CSSProperties}>
        <div className="cat-banner-img" data-img-reveal data-morph-target>
          <Pic name={cat.banner} alt={`${cat.name}: a styled scene from the Kaivo range`} sizes="100vw" position={cat.focal} priority />
        </div>
        <div className="cat-banner-shade" aria-hidden="true" />
        <div className="cat-banner-copy container" data-stagger>
          <p className="label">Category</p>
          <h1 className="display">{cat.name}</h1>
          <p className="lead">{cat.tagline}</p>
        </div>
      </section>
      <section className="section container cat-products" aria-label={`${cat.name} products`}>
        <CategoryGrid products={productsIn(cat.slug)} />
      </section>
    </>
  );
}

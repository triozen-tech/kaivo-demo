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
      <section className="cat-hero container">
        <div className="cat-hero-copy" data-stagger>
          <p className="label">Category</p>
          <h1 className="display">{cat.name}</h1>
          <p className="lead">{cat.tagline}</p>
        </div>
        <div className="cat-hero-img" data-img-reveal>
          <Pic name={cat.banner} alt="" sizes="(max-width: 900px) 100vw, 60vw" position={cat.focal} priority />
        </div>
      </section>
      <section className="section container" aria-label={`${cat.name} products`}>
        <CategoryGrid products={productsIn(cat.slug)} />
      </section>
    </>
  );
}

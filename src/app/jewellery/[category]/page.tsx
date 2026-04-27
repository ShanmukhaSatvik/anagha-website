import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JewelleryListing from '@/components/JewelleryListing';
import { PRODUCTS } from '@/lib/data';
import { notFound } from 'next/navigation';

// All known category slugs for static generation
export function generateStaticParams() {
  const categories = [...new Set(PRODUCTS.map((p) => p.category))];
  return categories.map((category) => ({ category }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const title = category.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${title} | Sri Sresta`,
    description: `Shop our exclusive collection of ${title} jewellery. Handcrafted with precision and love.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;

  // Validate the category exists in our data
  const exists = PRODUCTS.some((p) => p.category === category);
  if (!exists) notFound();

  return (
    <>
      <Header />
      <JewelleryListing category={category} />
      <Footer />
    </>
  );
}

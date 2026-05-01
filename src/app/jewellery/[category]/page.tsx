import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JewelleryListing from '@/components/JewelleryListing';
import { PRODUCTS } from '@/lib/data';
import { notFound } from 'next/navigation';

// Disable static generation to support dynamic categories
export const dynamic = 'force-dynamic';

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

  // Validate the category exists in our data (check both hardcoded and dynamic)
  let categories = [...new Set(PRODUCTS.map((p) => p.category))];
  try {
    const fs = require('fs/promises');
    const path = require('path');
    const metaPath = path.join(process.cwd(), 'public', 'uploads', 'metadata.json');
    const raw = await fs.readFile(metaPath, 'utf-8');
    const meta = JSON.parse(raw);
    if (meta.jewelleryCategories) {
      const dynamicSlugs = meta.jewelleryCategories.map((c: any) => c.name.toLowerCase().replace(/ /g, '-'));
      categories = [...new Set([...categories, ...dynamicSlugs])];
    }
  } catch (e) { }

  if (!categories.includes(category)) {
    // Also allow parent haram slug — it shows all haram subcategory products
    const haramSlugs = ['guttapusala-haram', 'kasulaperu-haram', 'gundla-haram', 'pachala-haram', 'nakshi-haram'];
    const isHaramParent = category === 'haram' && haramSlugs.some(s => categories.includes(s));
    if (!isHaramParent) notFound();
  }

  return (
    <>
      <Header />
      <JewelleryListing category={category} />
      <Footer />
    </>
  );
}

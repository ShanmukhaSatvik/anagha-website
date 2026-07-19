import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JewelleryListing from '@/components/JewelleryListing';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const title = category.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${title} | Anagha`,
    description: `Shop our exclusive collection of ${title} jewellery from live store inventory.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;

  return (
    <>
      <Header />
      <JewelleryListing category={category} />
      <Footer />
    </>
  );
}

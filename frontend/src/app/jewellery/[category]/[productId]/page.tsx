import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BuyNowButton from '@/components/BuyNowButton';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatDisplayPrice } from '@/lib/erpCatalog';

export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4001';

async function loadItem(tag: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/catalog/items/${encodeURIComponent(tag)}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const body = await res.json();
    return body.data || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; productId: string }>;
}) {
  const { productId } = await params;
  const item = await loadItem(productId);
  return {
    title: item ? `${item.name} | Anagha` : 'Product | Anagha',
    description: item?.description || 'View details from live store inventory.',
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ category: string; productId: string }>;
}) {
  const { category, productId } = await params;
  const product = await loadItem(productId);

  if (!product) {
    notFound();
  }

  const priceLabel = formatDisplayPrice(product.display_price);
  const typeSlug = product.type_slug || category;
  const whatsappText = encodeURIComponent(
    `Hi, I'm interested in ${product.name} (Tag: ${product.tag_number}).`,
  );

  return (
    <>
      <Header />
      <main className="w-full bg-white min-h-screen font-sans pb-20">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-6 pb-2">
          <p className="text-[11px] text-gray-400 uppercase tracking-widest">
            <Link href="/" className="hover:text-[#f1592a] transition-colors">Home</Link>
            {' '}/ <Link href="/jewellery" className="hover:text-[#f1592a] transition-colors">Jewellery</Link>
            {' '}/{' '}
            <Link href={`/jewellery/${typeSlug}`} className="hover:text-[#f1592a] transition-colors capitalize">
              {(product.type || category).replace(/-/g, ' ')}
            </Link>
            {' '}/ <span className="text-gray-600">{product.name}</span>
          </p>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-8">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            <div className="w-full lg:w-[45%] flex flex-col items-center">
              <div className="w-full aspect-square bg-[#f8f8f8] rounded-lg overflow-hidden flex items-center justify-center p-12 relative max-w-[500px]">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-gray-300">No image available</span>
                )}
              </div>
            </div>

            <div className="w-full lg:w-[55%]">
              <p className="text-[12px] text-gray-400 uppercase tracking-widest mb-2">
                Tag {product.tag_number}
              </p>
              <h1 className="font-domine text-[28px] md:text-[34px] text-[#032C5E] font-bold leading-tight mb-3">
                {product.name}
              </h1>
              <p className="text-[22px] font-bold text-[#222] mb-6">{priceLabel}</p>

              <div className="grid grid-cols-2 gap-3 mb-8 text-[13px]">
                {product.type ? (
                  <div className="border border-gray-100 rounded p-3">
                    <p className="text-gray-400 text-[11px] uppercase">Type</p>
                    <p className="text-[#222] font-medium">{product.type}</p>
                  </div>
                ) : null}
                {product.group ? (
                  <div className="border border-gray-100 rounded p-3">
                    <p className="text-gray-400 text-[11px] uppercase">Group</p>
                    <p className="text-[#222] font-medium">{product.group}</p>
                  </div>
                ) : null}
                {product.article ? (
                  <div className="border border-gray-100 rounded p-3">
                    <p className="text-gray-400 text-[11px] uppercase">Article</p>
                    <p className="text-[#222] font-medium">{product.article}</p>
                  </div>
                ) : null}
                {product.purity ? (
                  <div className="border border-gray-100 rounded p-3">
                    <p className="text-gray-400 text-[11px] uppercase">Purity</p>
                    <p className="text-[#222] font-medium">{product.purity}</p>
                  </div>
                ) : null}
                {product.net_weight != null ? (
                  <div className="border border-gray-100 rounded p-3">
                    <p className="text-gray-400 text-[11px] uppercase">Net weight</p>
                    <p className="text-[#222] font-medium">{product.net_weight} g</p>
                  </div>
                ) : null}
                {product.gross_weight != null ? (
                  <div className="border border-gray-100 rounded p-3">
                    <p className="text-gray-400 text-[11px] uppercase">Gross weight</p>
                    <p className="text-[#222] font-medium">{product.gross_weight} g</p>
                  </div>
                ) : null}
                {product.metal_type ? (
                  <div className="border border-gray-100 rounded p-3">
                    <p className="text-gray-400 text-[11px] uppercase">Metal</p>
                    <p className="text-[#222] font-medium capitalize">{product.metal_type}</p>
                  </div>
                ) : null}
                <div className="border border-gray-100 rounded p-3">
                  <p className="text-gray-400 text-[11px] uppercase">Availability</p>
                  <p className="text-emerald-600 font-medium capitalize">{product.status || 'available'}</p>
                </div>
              </div>

              {product.description ? (
                <p className="text-[14px] text-gray-600 leading-relaxed mb-8">{product.description}</p>
              ) : null}

              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                {product.display_price != null && Number(product.display_price) > 0 ? (
                  <BuyNowButton
                    item={{
                      tag_number: product.tag_number,
                      name: product.name,
                      display_price: product.display_price,
                      image_url: product.image_url,
                      type_slug: product.type_slug || typeSlug,
                    }}
                  />
                ) : null}
                <a
                  href={`https://wa.me/?text=${whatsappText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-3 px-10 rounded-full hover:bg-[#128C7E] transition-colors uppercase tracking-widest text-[12px]"
                >
                  Connect with us on WhatsApp
                </a>
              </div>

              <p className="text-[12px] text-gray-400">
                Live inventory from store ERP. Online pay reserves the tag; collect from store (no shipping in this release).
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

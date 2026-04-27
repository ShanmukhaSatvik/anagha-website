'use client';

import Link from 'next/link';
import { PRODUCTS } from '@/lib/data';

interface Props {
  category?: string; // if undefined, show all
}

const FilterGroup = ({ title, items, showMore }: { title: string; items: { label: string; count: number }[]; showMore?: string }) => (
  <div>
    <h3 className="font-domine text-[#222] text-[16px] mb-4 font-bold border-b border-gray-100 pb-2">{title}</h3>
    <div className="space-y-3">
      {items.map((f, i) => (
        <label key={i} className="flex items-center gap-3 cursor-pointer group">
          <div className="w-4 h-4 border border-gray-300 rounded-[2px] bg-white group-hover:border-[#2e6da4] transition-colors flex-shrink-0" />
          <span className="text-[#444] text-[13px]">{f.label} <span className="text-gray-400">({f.count})</span></span>
        </label>
      ))}
    </div>
    {showMore && <button className="text-[#e2574c] text-[12px] mt-3 hover:underline">{showMore}</button>}
  </div>
);

export default function JewelleryListing({ category }: Props) {
  const displayProducts = category
    ? PRODUCTS.filter((p) => p.category === category)
    : PRODUCTS;

  const title = category
    ? category.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : 'All Jewellery';

  const count = displayProducts.length;

  return (
    <main className="w-full bg-[#f9f9f9] min-h-screen font-sans pb-20">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-6">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="font-domine text-[#222] text-2xl font-bold">{title}</h1>
          <p className="text-gray-400 text-[13px] mt-1">{count} product{count !== 1 ? 's' : ''} found</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Left Sidebar (Filters) */}
          <div className="w-full lg:w-[280px] shrink-0 bg-white shadow-sm border border-gray-100 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
            <div className="bg-[#2e6da4] text-white px-4 py-3 font-medium tracking-wide sticky top-0 z-10">
              FILTERS
            </div>
            <div className="p-5 space-y-8">
              <FilterGroup title="Price" items={[
                { label: 'Below Rs. 10,000', count: 208 },
                { label: 'Rs. 10,000 - Rs. 20,000', count: 614 },
                { label: 'Rs. 20,000 - Rs. 30,000', count: 671 },
                { label: 'Rs. 30,000 - Rs. 40,000', count: 660 },
                { label: 'Rs. 40,000 - Rs. 50,000', count: 731 },
                { label: 'Rs. 50,000 and Above', count: 7186 },
              ]} />
              <FilterGroup title="Type" items={[
                { label: 'Earrings', count: 3020 }, { label: 'Rings', count: 2583 }, { label: 'Pendants', count: 1128 },
                { label: 'Necklaces', count: 855 }, { label: 'Bangles', count: 624 }, { label: 'Bracelets', count: 462 },
              ]} showMore="+ 21 more" />
              <FilterGroup title="Metal" items={[
                { label: 'Gold', count: 7716 }, { label: 'Plain Gold/Platinum', count: 2348 }, { label: 'Rose Gold', count: 1618 },
                { label: 'White Gold', count: 572 }, { label: 'Platinum', count: 164 },
              ]} />
              <FilterGroup title="Gender" items={[
                { label: 'Women', count: 8486 }, { label: 'Men', count: 977 }, { label: 'Kids', count: 507 }, { label: 'Unisex', count: 336 },
              ]} />
              <FilterGroup title="Offers" items={[
                { label: '0% Making Charge', count: 6 }, { label: 'Offers', count: 6 },
              ]} />
              <FilterGroup title="Gold Purity" items={[
                { label: '18k', count: 7460 }, { label: '14k', count: 1110 }, { label: '22k', count: 1335 },
              ]} />
              <FilterGroup title="Stones" items={[
                { label: 'Diamond', count: 5355 }, { label: 'Diamond And Gemstone', count: 1403 }, { label: 'Gemstone', count: 791 },
                { label: 'Pearl', count: 540 }, { label: 'Ruby', count: 453 }, { label: 'Sapphire', count: 358 },
              ]} showMore="+ 21 more" />
              <FilterGroup title="Occasion" items={[
                { label: 'Akshaya Tritiya', count: 8758 }, { label: 'Weekend', count: 8218 }, { label: 'Romance', count: 7307 },
                { label: 'Party', count: 7271 }, { label: 'Workwear', count: 6464 }, { label: 'Vacation', count: 4644 },
              ]} showMore="+ 25 more" />
              <FilterGroup title="# Of Stones" items={[
                { label: 'Multistone', count: 6255 }, { label: 'Single Stone', count: 839 }, { label: 'Solitaire', count: 255 },
                { label: 'Three Stone', count: 144 }, { label: 'Five Stone', count: 73 },
              ]} />
              <FilterGroup title="Style" items={[
                { label: 'Light Weight Jewellery', count: 2004 }, { label: 'Studs', count: 1356 }, { label: 'Band', count: 675 },
                { label: 'Hoops', count: 540 }, { label: 'Drops', count: 453 }, { label: 'Couple Band', count: 293 },
              ]} showMore="+ 45 more" />
              <FilterGroup title="Design" items={[
                { label: 'Classic', count: 6150 }, { label: 'Fashion', count: 5976 }, { label: 'Fusion', count: 2996 },
                { label: 'Valentine Designers Pick', count: 2664 }, { label: 'Enamel', count: 888 }, { label: 'Floral', count: 864 },
              ]} showMore="+ 52 more" />
              <FilterGroup title="Stone Color" items={[
                { label: 'White', count: 6963 }, { label: 'Red', count: 469 }, { label: 'Blue', count: 310 },
                { label: 'Green', count: 281 }, { label: 'Pink', count: 193 }, { label: 'Yellow', count: 129 },
              ]} showMore="+ 4 more" />
              <FilterGroup title="Zodiac" items={[
                { label: 'Gemini', count: 3 }, { label: 'Scorpio', count: 3 }, { label: 'Libra', count: 2 },
                { label: 'Virgo', count: 2 }, { label: 'Aquarius', count: 1 }, { label: 'Cancer', count: 1 },
              ]} showMore="+ 5 more" />
              <FilterGroup title="Stone Shape" items={[
                { label: 'Round', count: 2591 }, { label: 'Pear', count: 402 }, { label: 'Marquise', count: 321 },
                { label: 'Princess', count: 307 }, { label: 'Baguette', count: 265 }, { label: 'Oval', count: 128 },
              ]} showMore="+ 12 more" />
            </div>
          </div>

          {/* Right Content (Product Grid) */}
          <div className="flex-1 w-full">
            {displayProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-xl font-domine text-gray-400 mb-2">No products found</h2>
                <p className="text-gray-400 text-sm">We couldn&apos;t find any items in this category.</p>
                <Link href="/jewellery" className="mt-6 text-[#2e6da4] text-sm font-medium hover:underline">Browse All Jewellery →</Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {displayProducts.map((product) => (
                  <Link
                    href={`/jewellery/${product.category}/${product.id}`}
                    key={product.id}
                    className="group flex flex-col bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300 h-full"
                  >
                    {/* Image Area (Bulletproof 1:1 Aspect Ratio) */}
                    <div className="relative w-full pt-[100%] bg-[#fafafa] overflow-hidden">
                      <div className="absolute inset-0 p-4 sm:p-6 flex items-center justify-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
                        />
                      </div>
                    </div>
                    {/* Details Area */}
                    <div className="p-4 flex flex-col flex-1 items-start text-left bg-white">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="font-bold text-[#222] text-[15px] md:text-[16px]">₹{product.price}</span>
                        <span className="text-gray-400 text-[12px] md:text-[13px] line-through">₹{product.originalPrice}</span>
                      </div>
                      <h3 className="text-[#666] text-[12px] md:text-[13px] line-clamp-2 leading-snug h-[38px] w-full">
                        {product.name}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}

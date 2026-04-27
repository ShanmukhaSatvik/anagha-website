import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'All Jewellery | Sri Sresta',
  description: 'Explore our complete collection of exquisite jewellery.',
};

import { PRODUCTS } from '@/lib/data';


export default function JewelleryPage() {
  return (
    <>
      <Header />
      <main className="w-full bg-[#f9f9f9] min-h-screen font-sans pb-20">
        


        <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-6">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Left Sidebar (Filters) */}
            <div className="w-full lg:w-[280px] shrink-0 bg-white shadow-sm border border-gray-100 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
              <div className="bg-[#2e6da4] text-white px-4 py-3 font-medium tracking-wide sticky top-0 z-10">
                FILTERS
              </div>
              
              <div className="p-5 space-y-8">
                {/* 1. Price */}
                <div>
                  <h3 className="font-domine text-[#222] text-[16px] mb-4 font-bold border-b border-gray-100 pb-2">Price</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Below Rs. 10,000', count: 208 },
                      { label: 'Rs. 10,000 - Rs. 20,000', count: 614 },
                      { label: 'Rs. 20,000 - Rs. 30,000', count: 671 },
                      { label: 'Rs. 30,000 - Rs. 40,000', count: 660 },
                      { label: 'Rs. 40,000 - Rs. 50,000', count: 731 },
                      { label: 'Rs. 50,000 and Above', count: 7186 },
                    ].map((f, i) => (
                      <label key={i} className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-4 h-4 border border-gray-300 rounded-[2px] bg-white group-hover:border-[#2e6da4] transition-colors flex-shrink-0" />
                        <span className="text-[#444] text-[13px]">{f.label} <span className="text-gray-400">({f.count})</span></span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 2. Type */}
                <div>
                  <h3 className="font-domine text-[#222] text-[16px] mb-4 font-bold border-b border-gray-100 pb-2">Type</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Earrings', count: 3020 }, { label: 'Rings', count: 2583 }, { label: 'Pendants', count: 1128 },
                      { label: 'Necklaces', count: 855 }, { label: 'Bangles', count: 624 }, { label: 'Bracelets', count: 462 },
                    ].map((f, i) => (
                      <label key={i} className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-4 h-4 border border-gray-300 rounded-[2px] bg-white group-hover:border-[#2e6da4] transition-colors flex-shrink-0" />
                        <span className="text-[#444] text-[13px]">{f.label} <span className="text-gray-400">({f.count})</span></span>
                      </label>
                    ))}
                  </div>
                  <button className="text-[#e2574c] text-[12px] mt-3 hover:underline">+ 21 more</button>
                </div>

                {/* 3. Metal */}
                <div>
                  <h3 className="font-domine text-[#222] text-[16px] mb-4 font-bold border-b border-gray-100 pb-2">Metal</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Gold', count: 7716 }, { label: 'Plain Gold/Platinum', count: 2348 }, { label: 'Rose Gold', count: 1618 },
                      { label: 'White Gold', count: 572 }, { label: 'Platinum', count: 164 },
                    ].map((f, i) => (
                      <label key={i} className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-4 h-4 border border-gray-300 rounded-[2px] bg-white group-hover:border-[#2e6da4] transition-colors flex-shrink-0" />
                        <span className="text-[#444] text-[13px]">{f.label} <span className="text-gray-400">({f.count})</span></span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 4. Gender */}
                <div>
                  <h3 className="font-domine text-[#222] text-[16px] mb-4 font-bold border-b border-gray-100 pb-2">Gender</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Women', count: 8486 }, { label: 'Men', count: 977 }, { label: 'Kids', count: 507 }, { label: 'Unisex', count: 336 },
                    ].map((f, i) => (
                      <label key={i} className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-4 h-4 border border-gray-300 rounded-[2px] bg-white group-hover:border-[#2e6da4] transition-colors flex-shrink-0" />
                        <span className="text-[#444] text-[13px]">{f.label} <span className="text-gray-400">({f.count})</span></span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 5. Offers */}
                <div>
                  <h3 className="font-domine text-[#222] text-[16px] mb-4 font-bold border-b border-gray-100 pb-2">Offers</h3>
                  <div className="space-y-3">
                    {[
                      { label: '0% Making Charge', count: 6 }, { label: 'Offers', count: 6 },
                    ].map((f, i) => (
                      <label key={i} className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-4 h-4 border border-gray-300 rounded-[2px] bg-white group-hover:border-[#2e6da4] transition-colors flex-shrink-0" />
                        <span className="text-[#444] text-[13px]">{f.label} <span className="text-gray-400">({f.count})</span></span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 6. Gold Purity */}
                <div>
                  <h3 className="font-domine text-[#222] text-[16px] mb-4 font-bold border-b border-gray-100 pb-2">Gold Purity</h3>
                  <div className="space-y-3">
                    {[
                      { label: '18k', count: 7460 }, { label: '14k', count: 1110 }, { label: '22k', count: 1335 },
                    ].map((f, i) => (
                      <label key={i} className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-4 h-4 border border-gray-300 rounded-[2px] bg-white group-hover:border-[#2e6da4] transition-colors flex-shrink-0" />
                        <span className="text-[#444] text-[13px]">{f.label} <span className="text-gray-400">({f.count})</span></span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 7. Stones */}
                <div>
                  <h3 className="font-domine text-[#222] text-[16px] mb-4 font-bold border-b border-gray-100 pb-2">Stones</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Diamond', count: 5355 }, { label: 'Diamond And Gemstone', count: 1403 }, { label: 'Gemstone', count: 791 },
                      { label: 'Pearl', count: 540 }, { label: 'Ruby', count: 453 }, { label: 'Sapphire', count: 358 },
                    ].map((f, i) => (
                      <label key={i} className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-4 h-4 border border-gray-300 rounded-[2px] bg-white group-hover:border-[#2e6da4] transition-colors flex-shrink-0" />
                        <span className="text-[#444] text-[13px]">{f.label} <span className="text-gray-400">({f.count})</span></span>
                      </label>
                    ))}
                  </div>
                  <button className="text-[#e2574c] text-[12px] mt-3 hover:underline">+ 21 more</button>
                </div>

                {/* 8. Occasion */}
                <div>
                  <h3 className="font-domine text-[#222] text-[16px] mb-4 font-bold border-b border-gray-100 pb-2">Occasion</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Akshaya Tritiya', count: 8758 }, { label: 'Weekend', count: 8218 }, { label: 'Romance', count: 7307 },
                      { label: 'Party', count: 7271 }, { label: 'Workwear', count: 6464 }, { label: 'Vacation', count: 4644 },
                    ].map((f, i) => (
                      <label key={i} className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-4 h-4 border border-gray-300 rounded-[2px] bg-white group-hover:border-[#2e6da4] transition-colors flex-shrink-0" />
                        <span className="text-[#444] text-[13px]">{f.label} <span className="text-gray-400">({f.count})</span></span>
                      </label>
                    ))}
                  </div>
                  <button className="text-[#e2574c] text-[12px] mt-3 hover:underline">+ 25 more</button>
                </div>

                {/* 9. # Of Stones */}
                <div>
                  <h3 className="font-domine text-[#222] text-[16px] mb-4 font-bold border-b border-gray-100 pb-2"># Of Stones</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Multistone', count: 6255 }, { label: 'Single Stone', count: 839 }, { label: 'Solitaire', count: 255 },
                      { label: 'Three Stone', count: 144 }, { label: 'Five Stone', count: 73 },
                    ].map((f, i) => (
                      <label key={i} className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-4 h-4 border border-gray-300 rounded-[2px] bg-white group-hover:border-[#2e6da4] transition-colors flex-shrink-0" />
                        <span className="text-[#444] text-[13px]">{f.label} <span className="text-gray-400">({f.count})</span></span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 10. Style */}
                <div>
                  <h3 className="font-domine text-[#222] text-[16px] mb-4 font-bold border-b border-gray-100 pb-2">Style</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Light Weight Jewellery', count: 2004 }, { label: 'Studs', count: 1356 }, { label: 'Band', count: 675 },
                      { label: 'Hoops', count: 540 }, { label: 'Drops', count: 453 }, { label: 'Couple Band', count: 293 },
                    ].map((f, i) => (
                      <label key={i} className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-4 h-4 border border-gray-300 rounded-[2px] bg-white group-hover:border-[#2e6da4] transition-colors flex-shrink-0" />
                        <span className="text-[#444] text-[13px]">{f.label} <span className="text-gray-400">({f.count})</span></span>
                      </label>
                    ))}
                  </div>
                  <button className="text-[#e2574c] text-[12px] mt-3 hover:underline">+ 45 more</button>
                </div>

                {/* 11. Design */}
                <div>
                  <h3 className="font-domine text-[#222] text-[16px] mb-4 font-bold border-b border-gray-100 pb-2">Design</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Classic', count: 6150 }, { label: 'Fashion', count: 5976 }, { label: 'Fusion', count: 2996 },
                      { label: 'Valentine Designers Pick', count: 2664 }, { label: 'Enamel', count: 888 }, { label: 'Floral', count: 864 },
                    ].map((f, i) => (
                      <label key={i} className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-4 h-4 border border-gray-300 rounded-[2px] bg-white group-hover:border-[#2e6da4] transition-colors flex-shrink-0" />
                        <span className="text-[#444] text-[13px]">{f.label} <span className="text-gray-400">({f.count})</span></span>
                      </label>
                    ))}
                  </div>
                  <button className="text-[#e2574c] text-[12px] mt-3 hover:underline">+ 52 more</button>
                </div>

                {/* 12. Stone Color */}
                <div>
                  <h3 className="font-domine text-[#222] text-[16px] mb-4 font-bold border-b border-gray-100 pb-2">Stone Color</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'White', count: 6963 }, { label: 'Red', count: 469 }, { label: 'Blue', count: 310 },
                      { label: 'Green', count: 281 }, { label: 'Pink', count: 193 }, { label: 'Yellow', count: 129 },
                    ].map((f, i) => (
                      <label key={i} className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-4 h-4 border border-gray-300 rounded-[2px] bg-white group-hover:border-[#2e6da4] transition-colors flex-shrink-0" />
                        <span className="text-[#444] text-[13px]">{f.label} <span className="text-gray-400">({f.count})</span></span>
                      </label>
                    ))}
                  </div>
                  <button className="text-[#e2574c] text-[12px] mt-3 hover:underline">+ 4 more</button>
                </div>

                {/* 13. Zodiac */}
                <div>
                  <h3 className="font-domine text-[#222] text-[16px] mb-4 font-bold border-b border-gray-100 pb-2">Zodiac</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Gemini', count: 3 }, { label: 'Scorpio', count: 3 }, { label: 'Libra', count: 2 },
                      { label: 'Virgo', count: 2 }, { label: 'Aquarius', count: 1 }, { label: 'Cancer', count: 1 },
                    ].map((f, i) => (
                      <label key={i} className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-4 h-4 border border-gray-300 rounded-[2px] bg-white group-hover:border-[#2e6da4] transition-colors flex-shrink-0" />
                        <span className="text-[#444] text-[13px]">{f.label} <span className="text-gray-400">({f.count})</span></span>
                      </label>
                    ))}
                  </div>
                  <button className="text-[#e2574c] text-[12px] mt-3 hover:underline">+ 5 more</button>
                </div>

                {/* 14. Stone Shape */}
                <div>
                  <h3 className="font-domine text-[#222] text-[16px] mb-4 font-bold border-b border-gray-100 pb-2">Stone Shape</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Round', count: 2591 }, { label: 'Pear', count: 402 }, { label: 'Marquise', count: 321 },
                      { label: 'Princess', count: 307 }, { label: 'Baguette', count: 265 }, { label: 'Oval', count: 128 },
                    ].map((f, i) => (
                      <label key={i} className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-4 h-4 border border-gray-300 rounded-[2px] bg-white group-hover:border-[#2e6da4] transition-colors flex-shrink-0" />
                        <span className="text-[#444] text-[13px]">{f.label} <span className="text-gray-400">({f.count})</span></span>
                      </label>
                    ))}
                  </div>
                  <button className="text-[#e2574c] text-[12px] mt-3 hover:underline">+ 12 more</button>
                </div>
              </div>
            </div>

            {/* Right Content (Product Grid) */}
            <div className="flex-1 w-full">
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {PRODUCTS.map((product) => (
                  <Link href={`/jewellery/${product.category}/${product.id}`} key={product.id} className="group flex flex-col bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300 h-full">
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
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

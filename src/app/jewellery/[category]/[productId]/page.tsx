import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { PRODUCTS } from '@/lib/data';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Product Detail | Sri Sresta',
  description: 'View details of our exquisite jewellery collection.',
};

export default async function ProductDetailPage({ params }: { params: Promise<{ category: string, productId: string }> }) {
  const resolvedParams = await params;
  const category = resolvedParams.category;
  const productId = parseInt(resolvedParams.productId, 10);

  // Read dynamic products
  let dynamicProducts = PRODUCTS;
  try {
    const fs = require('fs/promises');
    const path = require('path');
    const metaPath = path.join(process.cwd(), 'public', 'uploads', 'metadata.json');
    const raw = await fs.readFile(metaPath, 'utf-8');
    const meta = JSON.parse(raw);
    if (meta.jewelleryProducts) dynamicProducts = meta.jewelleryProducts;
  } catch (e) {}

  const productData = dynamicProducts.find((p) => p.id === productId);

  if (!productData) {
    notFound();
  }

  // Extend the base product with mock details if missing
  const product = {
    description: `Premium ${productData.name} crafted with the finest materials. This exquisite piece features intricate detailing, perfect for elevating your everyday style or making a statement at special events.`,
    offer: '30% off on Making Charges: Use SUMMER30',
    ...productData,
  };

  return (
    <>
      <Header />
      <main className="w-full bg-white min-h-screen font-sans pb-20">
        
        {/* Breadcrumb */}
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-6 pb-2">
          <p className="text-[11px] text-gray-400 uppercase tracking-widest">
            <Link href="/" className="hover:text-[#f1592a] transition-colors">Home</Link>
            {' '}/ <Link href="/jewellery" className="hover:text-[#f1592a] transition-colors">Jewellery</Link>
            {' '}/ <span className="text-gray-600 capitalize">{category.replace(/-/g, ' ')}</span>
            {' '}/ <span className="text-gray-600">{product.name}</span>
          </p>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-8">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            
            {/* LEFT: Image Gallery */}
            <div className="w-full lg:w-[45%] flex flex-col items-center">
              {/* Main Image */}
              <div className="w-full aspect-square bg-[#f8f8f8] rounded-lg overflow-hidden flex items-center justify-center p-12 relative group max-w-[500px]">
                <button className="absolute top-6 right-6 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors z-10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Thumbnails (5 Assets: 1 Real, 2 Videos, 2 Image Placeholders) */}
              <div className="mt-8 w-full relative flex items-center justify-center gap-3">
                {/* 1. Main Image Thumb */}
                <div className="w-20 h-20 border-2 border-[#2e6da4] p-1 flex items-center justify-center cursor-pointer">
                  <img src={product.image} className="w-full h-full object-contain" />
                </div>
                
                {/* 2. Video Placeholder 1 */}
                <div className="w-20 h-20 bg-gray-50 border border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Video</span>
                </div>

                {/* 3. Video Placeholder 2 */}
                <div className="w-20 h-20 bg-gray-50 border border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Video</span>
                </div>

                {/* 4. Image Placeholder 1 */}
                <div className="w-20 h-20 bg-gray-50 border border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Image</span>
                </div>

                {/* 5. Image Placeholder 2 */}
                <div className="w-20 h-20 bg-gray-50 border border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Image</span>
                </div>
              </div>

            </div>

            {/* RIGHT: Product Details */}
            <div className="flex-1 lg:pl-4">
              <h1 className="font-domine text-[#222] text-2xl font-bold mb-2">{product.name}</h1>
              
              <div className="mb-4">
                <div className="text-2xl font-bold text-[#222] mb-0.5">₹ {product.price}</div>
                <p className="text-gray-400 text-[11px]">MRP Incl. of all taxes</p>
              </div>

              <p className="text-[12px] text-gray-600 mb-6 font-medium leading-relaxed">
                {product.description}
              </p>

              {/* Customize Section */}
              <div className="border-y border-gray-100 py-3 mb-6 flex items-center justify-between cursor-pointer group">
                <span className="text-[12px] text-[#222] font-bold uppercase tracking-wide group-hover:text-[#2e6da4] transition-colors">Customize this design</span>
                <span className="text-lg text-gray-400 group-hover:text-[#2e6da4] transition-colors">+</span>
              </div>

              {/* Size Selector */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 relative">
                  <select className="w-full border border-gray-200 rounded px-3 py-2 text-[12px] outline-none appearance-none cursor-pointer">
                    <option>Select Size</option>
                    <option>10</option>
                    <option>12</option>
                    <option>14</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <button className="text-[12px] text-[#2e6da4] hover:underline whitespace-nowrap">Not sure about the size?</button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mb-6 justify-center">
                <button className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-3 px-10 rounded-full hover:bg-[#128C7E] transition-colors uppercase tracking-widest text-[12px]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Connect with us on WhatsApp
                </button>
              </div>


              {/* Video Call */}
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-5 h-5 flex items-center justify-center text-[#00a699]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-[12px] text-gray-500">
                  Schedule video call <span className="text-[#2e6da4] font-medium cursor-pointer ml-0.5 underline underline-offset-4">Book Now</span>
                </p>
              </div>

              {/* Trust Markers */}
              <div className="grid grid-cols-2 gap-3 border-t border-b border-gray-300 pt-1.5 pb-1.5 mb-6">
                <div className="flex flex-col items-center text-center">
                   <div className="w-7 h-7 flex items-center justify-center mb-1.5">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#2e6da4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                     </svg>
                   </div>
                   <span className="text-[11px] text-[#2e6da4] uppercase font-bold leading-tight px-1 tracking-tight">Lifetime Exchange &amp; Buy-Back</span>
                </div>
                <div className="flex flex-col items-center text-center border-l border-gray-300">
                   <div className="w-7 h-7 flex items-center justify-center mb-1.5">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#2e6da4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                     </svg>
                   </div>
                   <span className="text-[11px] text-[#2e6da4] uppercase font-bold tracking-tight">Certified Jewellery</span>
                </div>
              </div>

              {/* Pincode Check */}
              <div className="bg-[#fcfcfc] border border-gray-100 p-4 rounded-md mb-6">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[12px] text-gray-500">Your pincode</span>
                  <div className="flex border border-gray-200 rounded overflow-hidden">
                    <input type="text" placeholder="Pincode" className="px-2.5 py-1 text-[12px] outline-none w-28" />
                    <button className="bg-gray-100 px-2.5 py-1 text-[10px] font-bold text-gray-500 hover:bg-gray-200 transition-colors uppercase">Update</button>
                  </div>
                </div>
                <p className="text-[10px] text-orange-500">Provide pincode for delivery date & nearby stores!</p>
              </div>

            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

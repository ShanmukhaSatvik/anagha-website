'use client';

import { motion } from 'framer-motion';

export default function AboutCompany() {
  return (
    <section className="bg-[#fffbfa] py-16 relative overflow-hidden">
      <div className="max-w-[1300px] mx-auto px-4 lg:px-8 relative z-10">
        
        {/* Horizontal Line connecting icons (visible on desktop) */}
        <div className="hidden md:block absolute top-[28px] left-[15%] right-[15%] h-[1px] bg-[#e5e7eb] z-[-1]" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
          
          {/* Column 1 */}
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center gap-4">
              <div className="w-[56px] h-[56px] shrink-0 bg-white border border-gray-200 rounded-lg flex items-center justify-center shadow-sm">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a08a90" strokeWidth="1.5">
                  {/* India Map outline approximation or a simple map icon */}
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </div>
              <h3 className="text-[16px] font-domine text-[#715c62] leading-tight pr-4">
                Sri Sresta Jewellery Store - A Stellar Omnichannel Presence
              </h3>
            </div>
            {/* Box */}
            <div className="bg-white border border-gray-100 rounded-lg p-6 lg:p-8 shadow-sm flex-1">
              <p className="text-[13.5px] text-gray-500 leading-relaxed font-sans text-justify">
                Sri Sresta, founded in 2011, is one of India's largest e-commerce portals for fine jewellery. By seamlessly integrating online and physical retail channels, Sri Sresta has transformed the way consumers experience jewellery shopping. With over <strong className="font-medium text-gray-700">344 retail stores</strong> spread across the nation, we are committed to making exquisite fine jewellery accessible. Our omnichannel approach ensures that customers can explore Sri Sresta's extensive collection of fine jewellery at our online jewellery store or a retail store near them. Whether browsing through the curated selection on the website or visiting one of our retail stores, customers have access to a wide range of exquisite designs crafted with precision and attention to detail.
              </p>
            </div>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center gap-4">
              <div className="w-[56px] h-[56px] shrink-0 bg-white border border-gray-200 rounded-lg flex items-center justify-center shadow-sm">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a08a90" strokeWidth="1.5">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
                </svg>
              </div>
              <h3 className="text-[16px] font-domine text-[#715c62] leading-tight pr-4">
                Redefining the Jewellery Shopping Experience
              </h3>
            </div>
            {/* Box */}
            <div className="bg-white border border-gray-100 rounded-lg p-6 lg:p-8 shadow-sm flex-1">
              <p className="text-[13.5px] text-gray-500 leading-relaxed font-sans text-justify">
                At Sri Sresta, we're dedicated to enhancing your jewellery shopping experience with unmatched convenience through a highly developed team that ensures every question about your products gets answered. We also have a <strong className="font-medium text-gray-700">Lifetime Exchange and Buyback Policy</strong> ensuring you can shop with the peace of mind that your investment lasts a lifetime. If you're bored of hoarding outdated gold jewellery, our <strong className="font-medium text-gray-700">Big Gold Upgrade</strong> enables you to get an instant 1% benefit over the current market gold rate on all purities, while exploring Sri Sresta's exquisite curated collections. To benchmark your jewellery shopping experience a step further, we offer <strong className="font-medium text-gray-700">free shipping</strong> on all online orders. And in case things don't work out as planned, you can rely on a hassle-free <strong className="font-medium text-gray-700">30 Day Free Returns Policy</strong> so you can shop without a care in the world.
              </p>
            </div>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center gap-4">
              <div className="w-[56px] h-[56px] shrink-0 bg-white border border-gray-200 rounded-lg flex items-center justify-center shadow-sm">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a08a90" strokeWidth="1.5">
                  <path d="M12 2l3 6 6 1-4 4 1 6-6-3-6 3 1-6-4-4 6-1 3-6z" />
                </svg>
              </div>
              <h3 className="text-[16px] font-domine text-[#715c62] leading-tight pr-4">
                7000+ Certified Jewellery Designs
              </h3>
            </div>
            {/* Box */}
            <div className="bg-white border border-gray-100 rounded-lg p-6 lg:p-8 shadow-sm flex-1">
              <p className="text-[13.5px] text-gray-500 leading-relaxed font-sans text-justify">
                Our jewellery is certified by prestigious authorities such as <strong className="font-medium text-gray-700">BIS Hallmark, SGL, IGI, and GSI</strong> to ensure the authenticity and quality of every piece. Our extensive range of <strong className="font-medium text-gray-700">7000+ contemporary creations</strong> across 100+ collections tells a unique story, each inspired by different facets of life. From gold and platinum to diamonds and gemstones, Sri Sresta offers 100% certified jewellery designs, promising something to suit every mood, moment, and budget. Explore our wide range of categories, which includes gold and diamond <a href="#" className="underline hover:text-coral transition-colors">rings</a>, <a href="#" className="underline hover:text-coral transition-colors">earrings</a>, <a href="#" className="underline hover:text-coral transition-colors">pendants</a>, <a href="#" className="underline hover:text-coral transition-colors">mangalsutras</a>, <a href="#" className="underline hover:text-coral transition-colors">bangles</a>, <a href="#" className="underline hover:text-coral transition-colors">engagement rings</a>, <a href="#" className="underline hover:text-coral transition-colors">bracelets</a> and more.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

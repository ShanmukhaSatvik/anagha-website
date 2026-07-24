'use client';

import { use } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';

export default function NewProductPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = use(params);

  return (
    <div className="min-h-screen bg-[#fffbfa] flex flex-col">
      <Header />
      <main className="flex-1 max-w-xl mx-auto w-full px-4 py-20 text-center">
        <h1 className="text-2xl font-display font-bold text-navy mb-3">Create tags in ERP</h1>
        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
          Website inventory is live from Octis ERP. Add new jewellery tags, prices, and images in the
          ERP inventory module — they appear on the storefront automatically when status is available.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={`/upload/jewellery/${categorySlug}`}
            className="px-8 py-3 rounded-full bg-navy text-white text-xs font-black uppercase tracking-widest"
          >
            Back to group
          </Link>
          <Link
            href={`/jewellery/${categorySlug}`}
            className="px-8 py-3 rounded-full border border-gray-200 text-navy text-xs font-black uppercase tracking-widest"
          >
            View storefront
          </Link>
        </div>
      </main>
    </div>
  );
}

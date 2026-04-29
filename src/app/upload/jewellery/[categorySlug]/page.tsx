'use client';

import { useState, useEffect, useRef, use } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  id: number;
  category: string;
  name: string;
  price: string;
  originalPrice: string;
  image: string;
}

export default function CategoryProductsEditor({ params }: { params: Promise<{ categorySlug: string }> }) {
  const { categorySlug } = use(params);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/upload/jewellery/products?category=${categorySlug}`)
      .then(r => r.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, [categorySlug]);

  const deleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setDeletingId(id);
    const res = await fetch(`/api/upload/jewellery/products?id=${id}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (data.success) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
    setDeletingId(null);
  };

  const categoryTitle = categorySlug.replace(/-/g, ' ').toUpperCase();

  return (
    <div className="min-h-screen bg-[#fffbfa] flex flex-col">
      <Header />

      <main className="flex-1 max-w-[1200px] mx-auto w-full px-4 py-12">
        {/* Breadcrumbs / Header */}
        <div className="flex items-center gap-4 mb-12">
          <Link href="/upload/jewellery" className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-rose-600 hover:border-rose-100 transition-all shadow-sm">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </Link>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
              <Link href="/upload/jewellery" className="hover:text-rose-600 transition-colors">Jewellery</Link>
              <span>/</span>
              <span className="text-gray-600">{categoryTitle}</span>
            </div>
            <h1 className="text-3xl font-display font-bold text-navy tracking-tight">{categoryTitle} Management</h1>
          </div>
        </div>

        <div className="w-full">
          {/* Products List */}
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-50">
              <div>
                <h2 className="text-xl font-bold text-navy">Current Inventory ({products.length})</h2>
                <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-1">Live Data</div>
              </div>
              <Link 
                href={`/upload/jewellery/${categorySlug}/new`}
                className="px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-md bg-navy text-white hover:bg-rose-600 shadow-navy/10"
              >
                + New Product
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  [1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="h-40 bg-gray-50 rounded-2xl animate-pulse" />
                  ))
                ) : products.length === 0 ? (
                  <div className="md:col-span-2 lg:col-span-3 py-20 text-center flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-200">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                      </svg>
                    </div>
                    <p className="text-gray-400 text-sm font-medium">No products in this category yet.</p>
                  </div>
                ) : (
                  products.map((p) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={p.id} 
                    >
                      <Link 
                        href={`/upload/jewellery/${categorySlug}/${p.id}`}
                        className="group flex gap-4 p-4 border border-gray-100 rounded-2xl hover:border-rose-100 hover:shadow-md transition-all relative bg-white cursor-pointer"
                      >
                        <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-2">
                          <img src={p.image} alt={p.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center min-w-0">
                          <h4 className="text-sm font-bold text-navy truncate pr-6">{p.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-rose-500 font-bold text-xs">₹{p.price}</span>
                            {p.originalPrice && p.originalPrice !== p.price && (
                              <span className="text-gray-300 text-[10px] line-through">₹{p.originalPrice}</span>
                            )}
                          </div>
                        </div>

                        {/* Delete Button (Stop Propagation to prevent Link click) */}
                        <button 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); deleteProduct(p.id); }}
                          disabled={deletingId === p.id}
                          className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-gray-50 text-gray-300 hover:bg-rose-50 hover:text-rose-500 flex items-center justify-center transition-all shadow-sm"
                        >
                          {deletingId === p.id ? (
                            <div className="w-3 h-3 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/>
                            </svg>
                          )}
                        </button>
                      </Link>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

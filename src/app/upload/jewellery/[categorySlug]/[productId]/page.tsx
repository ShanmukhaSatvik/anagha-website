'use client';

import { useState, useEffect, useRef, use } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface Product {
  id: number;
  category: string;
  name: string;
  price: string;
  originalPrice: string;
  image: string;
  description?: string;
  offer?: string;
}

export default function ProductEditor({ params }: { params: Promise<{ categorySlug: string, productId: string }> }) {
  const { categorySlug, productId } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [description, setDescription] = useState('');
  const [offer, setOffer] = useState('');
  const [newFile, setNewFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`/api/upload/jewellery/products?id=${productId}`)
      .then(r => r.json())
      .then(data => {
        const p = Array.isArray(data) ? data.find((x: any) => x.id === Number(productId)) : data;
        if (p) {
          setProduct(p);
          setName(p.name);
          setPrice(p.price);
          setOriginalPrice(p.originalPrice);
          setDescription(p.description || '');
          setOffer(p.offer || '');
        }
        setLoading(false);
      });
  }, [productId]);

  const saveProduct = async () => {
    setSaving(true);
    const fd = new FormData();
    fd.append('id', productId);
    fd.append('name', name);
    fd.append('price', price);
    fd.append('originalPrice', originalPrice);
    fd.append('description', description);
    fd.append('offer', offer);
    if (newFile) fd.append('file', newFile);

    const res = await fetch('/api/upload/jewellery/products', {
      method: 'PATCH',
      body: fd
    });
    const data = await res.json();
    if (data.success) {
      alert('Product updated successfully!');
      router.push(`/upload/jewellery/${categorySlug}`);
    } else {
      alert('Error saving product');
    }
    setSaving(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-navy uppercase tracking-widest animate-pulse">Loading Product...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center font-black text-rose-500 uppercase tracking-widest">Product Not Found</div>;

  return (
    <div className="min-h-screen bg-[#fffbfa] flex flex-col">
      <Header />

      <main className="flex-1 max-w-[1000px] mx-auto w-full px-4 py-12">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-6">
            <Link href={`/upload/jewellery/${categorySlug}`} className="w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-navy hover:border-navy transition-all shadow-sm">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </Link>
            <div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Editing Product</div>
              <h1 className="text-3xl font-display font-bold text-navy tracking-tight">{product.name}</h1>
            </div>
          </div>
          <button 
            onClick={saveProduct}
            disabled={saving}
            className="bg-navy text-white px-10 py-4 rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg shadow-navy/10 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Image Management */}
          <div className="space-y-6">
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Product Image</h3>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 flex items-center justify-center cursor-pointer hover:border-rose-300 transition-all overflow-hidden relative group"
              >
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={e => setNewFile(e.target.files?.[0] || null)} />
                <img 
                  src={newFile ? URL.createObjectURL(newFile) : product.image} 
                  className="w-full h-full object-contain p-8 mix-blend-multiply" 
                  alt="Product" 
                />
                <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/5 transition-colors flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-xl font-black text-[10px] uppercase tracking-widest text-navy opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all">
                    Change Image
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Details Management */}
          <div className="space-y-6">
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Product Name</label>
                <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:bg-white focus:border-rose-300 transition-all text-sm font-bold text-navy" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Current Price (₹)</label>
                  <input value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:bg-white focus:border-rose-300 transition-all text-sm font-bold text-navy" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Original Price (₹)</label>
                  <input value={originalPrice} onChange={e => setOriginalPrice(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:bg-white focus:border-rose-300 transition-all text-sm font-bold text-navy" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Active Offer Text</label>
                <input value={offer} onChange={e => setOffer(e.target.value)} placeholder="e.g. 30% off on Making Charges" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:bg-white focus:border-rose-300 transition-all text-sm font-bold text-navy" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Description</label>
                <textarea 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  rows={5}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:bg-white focus:border-rose-300 transition-all text-sm font-medium leading-relaxed text-gray-600 resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

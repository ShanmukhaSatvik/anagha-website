'use client';

import { useState, useRef, use } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NewProductPage({ params }: { params: Promise<{ categorySlug: string }> }) {
  const { categorySlug } = use(params);
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [description, setDescription] = useState('');
  const [offer, setOffer] = useState('');
  const [newFile, setNewFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createProduct = async () => {
    if (!name || !price || !newFile) {
      alert('Please fill in Name, Price and upload an Image.');
      return;
    }
    setSaving(true);
    const fd = new FormData();
    fd.append('name', name);
    fd.append('category', categorySlug);
    fd.append('price', price);
    fd.append('originalPrice', originalPrice || price);
    fd.append('description', description);
    fd.append('offer', offer);
    fd.append('file', newFile);

    const res = await fetch('/api/upload/jewellery/products', {
      method: 'POST',
      body: fd
    });
    const data = await res.json();
    if (data.success) {
      alert('Product created successfully!');
      router.push(`/upload/jewellery/${categorySlug}`);
    } else {
      alert('Error creating product');
    }
    setSaving(false);
  };

  const categoryTitle = categorySlug.replace(/-/g, ' ').toUpperCase();

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
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">New Jewellery Item</div>
              <h1 className="text-3xl font-display font-bold text-navy tracking-tight">Add to {categoryTitle}</h1>
            </div>
          </div>
          <button 
            onClick={createProduct}
            disabled={saving}
            className="bg-rose-500 text-white px-10 py-4 rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg shadow-rose-100 disabled:opacity-50"
          >
            {saving ? 'Creating...' : 'Create Product'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Image Upload */}
          <div className="space-y-6">
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Product Image</h3>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-rose-300 transition-all overflow-hidden relative group"
              >
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={e => setNewFile(e.target.files?.[0] || null)} />
                
                {newFile ? (
                  <img 
                    src={URL.createObjectURL(newFile)} 
                    className="w-full h-full object-contain p-8 mix-blend-multiply" 
                    alt="Preview" 
                  />
                ) : (
                  <div className="flex flex-col items-center gap-4 text-gray-300 group-hover:text-rose-400 transition-colors">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4m4-5l5-5 5 5m-5-5v12"/>
                    </svg>
                    <span className="text-[10px] font-black uppercase tracking-[3px]">Upload Photo</span>
                  </div>
                )}

                <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/5 transition-colors" />
              </div>
              <p className="mt-4 text-[10px] text-gray-400 text-center uppercase font-medium">WEBP or JPG with white background preferred</p>
            </div>
          </div>

          {/* Right: Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Product Name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Diamond Studded Gold Ring" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:bg-white focus:border-rose-300 transition-all text-sm font-bold text-navy" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Price (₹)</label>
                  <input value={price} onChange={e => setPrice(e.target.value)} placeholder="45,000" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:bg-white focus:border-rose-300 transition-all text-sm font-bold text-navy" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Original MRP (₹)</label>
                  <input value={originalPrice} onChange={e => setOriginalPrice(e.target.value)} placeholder="52,000" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:bg-white focus:border-rose-300 transition-all text-sm font-bold text-navy" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Offer Message</label>
                <input value={offer} onChange={e => setOffer(e.target.value)} placeholder="e.g. 30% off on Making Charges" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:bg-white focus:border-rose-300 transition-all text-sm font-bold text-navy" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Product Description</label>
                <textarea 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  placeholder="Tell customers about the craftsmanship, materials, and style..."
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

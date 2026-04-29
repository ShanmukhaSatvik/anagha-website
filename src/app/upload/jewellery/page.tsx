'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface Category {
  name: string;
  image: string | null;
}

export default function JewelleryEditor() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setLoadingIndex] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempName, setTempName] = useState('');
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    fetch('/api/upload/jewellery/categories')
      .then(r => r.json())
      .then(data => {
        setCategories(data);
        setLoading(false);
      });
  }, []);

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    setAdding(true);
    const fd = new FormData();
    fd.append('name', newCategory.trim());
    
    const res = await fetch('/api/upload/jewellery/categories', {
      method: 'POST',
      body: fd
    });
    const data = await res.json();
    if (data.success) {
      setCategories(data.categories);
      setNewCategory('');
      alert('Category created successfully!');
    }
    setAdding(false);
  };

  const renameCategory = async (index: number) => {
    if (!tempName.trim()) return;
    setLoadingIndex(index);
    const fd = new FormData();
    fd.append('name', tempName.trim());
    fd.append('index', String(index));

    const res = await fetch('/api/upload/jewellery/categories', {
      method: 'POST',
      body: fd
    });
    const data = await res.json();
    if (data.success) {
      setCategories(data.categories);
      setEditingIndex(null);
    }
    setLoadingIndex(null);
  };

  const updateImage = async (index: number, file: File) => {
    setLoadingIndex(index);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('index', String(index));
    fd.append('name', categories[index].name);

    const res = await fetch('/api/upload/jewellery/categories', {
      method: 'POST',
      body: fd
    });
    const data = await res.json();
    if (data.success) {
      setCategories(data.categories);
    }
    setLoadingIndex(null);
  };

  const removeCategory = async (name: string) => {
    if (!confirm(`Are you sure you want to delete the "${name}" category?`)) return;
    const res = await fetch(`/api/upload/jewellery/categories?name=${encodeURIComponent(name)}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (data.success) {
      setCategories(data.categories);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffbfa] flex flex-col">
      <Header />

      <main className="flex-1 max-w-[1200px] mx-auto w-full px-4 py-12 md:py-16">
        <div className="flex items-center gap-4 mb-12">
          <Link href="/upload" className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-rose-600 hover:border-rose-100 transition-all shadow-sm">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </Link>
          <div>
            <h1 className="text-3xl font-display font-bold text-navy uppercase tracking-widest">Jewellery Catalog</h1>
            <p className="text-gray-500 text-sm">Organize your store by adding categories and uploading featured images.</p>
          </div>
        </div>

        {/* Add Category Bar */}
        <div className="bg-white rounded-[32px] p-4 pl-8 shadow-sm border border-gray-100 mb-12 flex items-center gap-4">
          <input 
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCategory()}
            placeholder="Add new category name..." 
            className="flex-1 bg-transparent outline-none font-bold text-navy placeholder:text-gray-300"
          />
          <button 
            onClick={addCategory}
            disabled={adding || !newCategory.trim()}
            className="bg-navy text-white px-8 py-4 rounded-[24px] font-bold hover:bg-rose-600 transition-all disabled:opacity-50 active:scale-95 uppercase text-xs tracking-widest"
          >
            {adding ? 'Adding...' : 'Create Category'}
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <AnimatePresence mode="popLayout">
            {loading ? (
              [1, 2, 3, 4, 5].map(i => (
                <div key={i} className="aspect-[4/5] bg-gray-100 rounded-[24px] animate-pulse" />
              ))
            ) : (
              categories.map((cat, i) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={cat.name}
                  className="group relative bg-white border border-gray-100 rounded-[28px] overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Delete Button */}
                  <button 
                    onClick={() => removeCategory(cat.name)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-gray-400 hover:text-rose-500 hover:bg-white flex items-center justify-center z-20 shadow-sm transition-all active:scale-90"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                  </button>

                  {/* Product Management Link (Wrapped around Image only) */}
                  <Link href={`/upload/jewellery/${cat.name.toLowerCase().replace(/ /g, '-')}`} className="block relative z-10">
                    {/* Image Area */}
                    <div className="aspect-square bg-[#fcf8f8] relative overflow-hidden group/img">
                      {cat.image ? (
                        <img src={cat.image} alt={cat.name} className="w-full h-full object-contain p-6 group-hover/img:scale-110 transition-transform duration-500 mix-blend-multiply" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-300">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                          </svg>
                          <span className="text-[9px] font-black uppercase">Category</span>
                        </div>
                      )}

                      {/* Overlay (Matches hover) */}
                      <div className="absolute inset-0 bg-navy/0 group-hover/img:bg-navy/10 transition-colors flex items-center justify-center">
                        <span className="bg-white text-navy text-[9px] font-black px-4 py-2 rounded-full opacity-0 group-hover/img:opacity-100 transition-all transform translate-y-2 group-hover/img:translate-y-0 shadow-md uppercase">
                          Manage Products
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Name Area (Renaming Trigger) */}
                  <div 
                    onClick={() => { setEditingIndex(i); setTempName(cat.name); }}
                    className="p-5 text-center bg-white hover:bg-rose-50 transition-colors cursor-pointer border-t border-gray-50"
                  >
                    {editingIndex === i ? (
                      <div className="flex flex-col gap-2" onClick={e => e.stopPropagation()}>
                        <input 
                          autoFocus
                          value={tempName}
                          onChange={e => setTempName(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && renameCategory(i)}
                          className="w-full text-xs font-bold text-navy border-b-2 border-rose-400 outline-none bg-transparent py-1 text-center"
                        />
                        <div className="flex gap-2">
                          <button onClick={() => renameCategory(i)} className="flex-1 text-[8px] font-black bg-rose-500 text-white py-1 rounded-full uppercase">Save</button>
                          <button onClick={() => setEditingIndex(null)} className="flex-1 text-[8px] font-black bg-gray-200 text-gray-500 py-1 rounded-full uppercase">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="font-bold text-navy text-sm uppercase tracking-wider line-clamp-1 group-hover:text-rose-600">{cat.name}</h3>
                        <p className="text-[10px] text-gray-400 mt-1 uppercase font-medium">Click to rename</p>
                      </>
                    )}
                  </div>

                  {/* Independent Image Edit Button (Small icon on the bottom right of image area) */}
                  <button 
                    onClick={() => fileInputRefs.current[i]?.click()}
                    className="absolute bottom-16 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-gray-400 hover:text-indigo-500 hover:bg-white flex items-center justify-center z-20 shadow-sm transition-all active:scale-90"
                    title="Change Category Image"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/>
                    </svg>
                    <input 
                      type="file" 
                      ref={el => { fileInputRefs.current[i] = el; }} 
                      className="hidden" 
                      accept="image/*"
                      onChange={e => e.target.files?.[0] && updateImage(i, e.target.files[0])}
                    />
                  </button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Dynamic Storefront Link */}
        <div className="mt-16 flex justify-center">
          <Link href="/jewellery" className="flex items-center gap-3 text-gray-400 hover:text-navy transition-colors font-bold text-xs uppercase tracking-widest bg-white px-8 py-4 rounded-full border border-gray-100 shadow-sm">
            <span>View Live Jewellery Page</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14m-7-7l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </main>

      <footer className="py-8 text-center text-gray-400 text-[10px] tracking-widest uppercase border-t border-gray-50/50">
        © 2026 Sri Sresta Administrative Portal
      </footer>
    </div>
  );
}

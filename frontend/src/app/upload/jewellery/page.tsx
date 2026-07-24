'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  fetchCatalog,
  fetchCatalogFilters,
  groupImageForSlug,
  slugifyName,
  type CatalogFilterOption,
} from '@/lib/erpCatalog';

export default function JewelleryEditor() {
  const [groups, setGroups] = useState<CatalogFilterOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const payload = await fetchCatalogFilters();
        if (cancelled) return;
        const base = [...(payload.filters?.group || [])];

        // Facet `count` from /filters can under-count (ERP row page cap). Use catalog
        // exact `total` per group — same source as the group detail page.
        const withExactCounts = await Promise.all(
          base.map(async (g) => {
            const slug = g.slug || slugifyName(g.name);
            try {
              const catalog = await fetchCatalog({ group: slug, limit: 1, offset: 0 });
              return { ...g, slug, count: catalog.total ?? g.count ?? 0 };
            } catch {
              return { ...g, slug, count: g.count ?? 0 };
            }
          }),
        );
        if (cancelled) return;

        withExactCounts.sort(
          (a, b) => (b.count || 0) - (a.count || 0) || a.name.localeCompare(b.name),
        );
        setGroups(withExactCounts);
        setError(null);
      } catch (err) {
        if (!cancelled) {
          setGroups([]);
          setError(err instanceof Error ? err.message : 'Failed to load ERP groups');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#fffbfa] flex flex-col">
      <Header />

      <main className="flex-1 max-w-[1200px] mx-auto w-full px-4 py-12 md:py-16">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/upload"
            className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-rose-600 hover:border-rose-100 transition-all shadow-sm"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-3xl font-display font-bold text-navy uppercase tracking-widest">
              Jewellery Catalog
            </h1>
          </div>
        </div>

        {error ? (
          <p className="text-center text-rose-500 text-sm py-16">{error}</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            <AnimatePresence mode="popLayout">
              {loading
                ? [1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="aspect-[4/5] bg-gray-100 rounded-[24px] animate-pulse" />
                  ))
                : groups.map((g) => {
                    const slug = g.slug || slugifyName(g.name);
                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={g.id || slug}
                        className="group relative bg-white border border-gray-100 rounded-[28px] overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                      >
                        <Link href={`/upload/jewellery/${slug}`} className="block relative z-10">
                          <div className="aspect-square bg-[#fcf8f8] relative overflow-hidden group/img">
                            <img
                              src={groupImageForSlug(slug)}
                              alt={g.name}
                              className="w-full h-full object-contain p-6 group-hover/img:scale-110 transition-transform duration-500 mix-blend-multiply"
                            />
                            <div className="absolute inset-0 bg-navy/0 group-hover/img:bg-navy/10 transition-colors flex items-center justify-center">
                              <span className="bg-white text-navy text-[9px] font-black px-4 py-2 rounded-full opacity-0 group-hover/img:opacity-100 transition-all transform translate-y-2 group-hover/img:translate-y-0 shadow-md uppercase">
                                View stock
                              </span>
                            </div>
                          </div>
                          <div className="p-5 text-center bg-white border-t border-gray-50">
                            <h3 className="font-bold text-navy text-sm uppercase tracking-wider line-clamp-1 group-hover:text-rose-600">
                              {g.name}
                            </h3>
                            <p className="text-[10px] text-gray-400 mt-1 uppercase font-medium">
                              {typeof g.count === 'number' ? `${g.count} available` : 'ERP group'}
                            </p>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
            </AnimatePresence>
          </div>
        )}

        <div className="mt-16 flex justify-center">
          <Link
            href="/jewellery"
            className="flex items-center gap-3 text-gray-400 hover:text-navy transition-colors font-bold text-xs uppercase tracking-widest bg-white px-8 py-4 rounded-full border border-gray-100 shadow-sm"
          >
            <span>View live jewellery page</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14m-7-7l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </main>

      <footer className="py-8 text-center text-gray-400 text-[10px] tracking-widest uppercase border-t border-gray-50/50">
        © 2026 Anagha Administrative Portal · ERP-backed
      </footer>
    </div>
  );
}

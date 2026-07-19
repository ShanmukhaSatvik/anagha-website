'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CatalogFilterOption,
  CatalogItem,
  fetchCatalog,
  fetchCatalogFilters,
  formatDisplayPrice,
  itemHref,
} from '@/lib/erpCatalog';

interface Props {
  /** ERP type slug (from inventory_types name). If undefined, show all. */
  category?: string;
}

type ActiveFilters = {
  type?: string;
  group?: string;
  article?: string;
  purity?: string;
};

const FilterGroup = ({
  title,
  items,
  selected,
  onSelect,
}: {
  title: string;
  items: CatalogFilterOption[];
  selected?: string;
  onSelect: (name: string | undefined) => void;
}) => (
  <div>
    <h3 className="font-domine text-[#222] text-[16px] mb-4 font-bold border-b border-gray-100 pb-2">{title}</h3>
    <div className="space-y-3">
      {items.length === 0 ? (
        <p className="text-[12px] text-gray-400">No options</p>
      ) : (
        items.map((f) => {
          const active = selected === f.name;
          return (
            <button
              key={`${title}-${f.id || f.slug || f.name}`}
              type="button"
              onClick={() => onSelect(active ? undefined : f.name)}
              className="flex items-center gap-3 cursor-pointer group w-full text-left"
            >
              <div
                className={`w-4 h-4 border rounded-[2px] flex-shrink-0 transition-colors ${
                  active ? 'border-[#2e6da4] bg-[#2e6da4]' : 'border-gray-300 bg-white group-hover:border-[#2e6da4]'
                }`}
              />
              <span className={`text-[13px] ${active ? 'text-[#2e6da4] font-medium' : 'text-[#444]'}`}>
                {f.name}
                {typeof f.count === 'number' ? (
                  <span className="text-gray-400"> ({f.count})</span>
                ) : null}
              </span>
            </button>
          );
        })
      )}
    </div>
  </div>
);

function ProductCard({ product }: { product: CatalogItem }) {
  const priceLabel = formatDisplayPrice(product.display_price);
  const showPrice = product.display_price != null;

  return (
    <Link
      href={itemHref(product)}
      className="group flex flex-col bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300 h-full"
    >
      <div className="relative w-full pt-[100%] bg-[#fafafa] overflow-hidden">
        <div className="absolute inset-0 p-4 sm:p-6 flex items-center justify-center">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
            />
          ) : (
            <div className="text-gray-300 text-sm text-center px-4">No image</div>
          )}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1 items-start text-left bg-white">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap min-h-[24px]">
          <span className={`font-bold text-[15px] md:text-[16px] ${showPrice ? 'text-[#222]' : 'text-gray-500 text-[13px]'}`}>
            {priceLabel}
          </span>
        </div>
        <h3 className="text-[#666] text-[12px] md:text-[13px] line-clamp-2 leading-snug min-h-[38px] w-full">
          {product.name}
        </h3>
        <p className="text-[11px] text-gray-400 mt-1">
          {product.tag_number}
          {product.purity ? ` · ${product.purity}` : ''}
        </p>
      </div>
    </Link>
  );
}

export default function JewelleryListing({ category }: Props) {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [total, setTotal] = useState(0);
  const [filterOptions, setFilterOptions] = useState<{
    type: CatalogFilterOption[];
    group: CatalogFilterOption[];
    article: CatalogFilterOption[];
    purity: CatalogFilterOption[];
  }>({ type: [], group: [], article: [], purity: [] });
  const [active, setActive] = useState<ActiveFilters>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const typeFromRoute = category?.replace(/-/g, ' ');

  const queryParams = useMemo(() => {
    const params: Record<string, string | number | undefined> = {
      limit: 48,
      offset: 0,
    };
    if (active.type) params.type = active.type;
    else if (category) params.type = category;
    if (active.group) params.group = active.group;
    if (active.article) params.article = active.article;
    if (active.purity) params.purity = active.purity;
    return params;
  }, [active, category]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const filterQuery: Record<string, string | undefined> = {};
      if (active.type) filterQuery.type = active.type;
      else if (category) filterQuery.type = category;
      if (active.group) filterQuery.group = active.group;

      const [catalog, filtersPayload] = await Promise.all([
        fetchCatalog(queryParams),
        fetchCatalogFilters(filterQuery),
      ]);
      setItems(catalog.items || []);
      setTotal(catalog.total || 0);
      setFilterOptions({
        type: filtersPayload.filters.type || [],
        group: filtersPayload.filters.group || [],
        article: filtersPayload.filters.article || [],
        purity: filtersPayload.filters.purity || [],
      });
    } catch (err) {
      setItems([]);
      setTotal(0);
      setError(err instanceof Error ? err.message : 'Failed to load inventory');
    } finally {
      setLoading(false);
    }
  }, [queryParams, active.type, active.group, category]);

  useEffect(() => {
    load();
  }, [load]);

  const title = category
    ? `${(typeFromRoute || category).replace(/\b\w/g, (c) => c.toUpperCase())} Collection`
    : 'All Jewellery';

  return (
    <main className="w-full bg-[#f9f9f9] min-h-screen font-sans pb-20">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-6">
        <div className="mb-10 mt-4">
          <h2 className="text-center text-[28px] font-domine text-[#032C5E] tracking-wide font-bold">
            {title}
          </h2>
          {!loading && !error ? (
            <p className="text-center text-[13px] text-gray-500 mt-2">{total} available item{total === 1 ? '' : 's'}</p>
          ) : null}
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="w-full lg:w-[280px] shrink-0 bg-white shadow-sm border border-gray-100 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
            <div className="bg-[#2e6da4] text-white px-4 py-3 font-medium tracking-wide sticky top-0 z-10 flex items-center justify-between">
              <span>FILTERS</span>
              {(active.group || active.article || active.purity || active.type) ? (
                <button
                  type="button"
                  className="text-[11px] uppercase tracking-wide opacity-90 hover:opacity-100"
                  onClick={() => setActive({})}
                >
                  Clear
                </button>
              ) : null}
            </div>
            <div className="p-5 space-y-8">
              {!category ? (
                <FilterGroup
                  title="Type"
                  items={filterOptions.type}
                  selected={active.type}
                  onSelect={(name) => setActive((prev) => ({ ...prev, type: name, group: undefined, article: undefined }))}
                />
              ) : null}
              <FilterGroup
                title="Group"
                items={filterOptions.group}
                selected={active.group}
                onSelect={(name) => setActive((prev) => ({ ...prev, group: name, article: undefined }))}
              />
              <FilterGroup
                title="Article"
                items={filterOptions.article}
                selected={active.article}
                onSelect={(name) => setActive((prev) => ({ ...prev, article: name }))}
              />
              <FilterGroup
                title="Purity"
                items={filterOptions.purity}
                selected={active.purity}
                onSelect={(name) => setActive((prev) => ({ ...prev, purity: name }))}
              />
            </div>
          </div>

          <div className="flex-1 w-full">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="w-12 h-12 border-4 border-[#2e6da4] border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-gray-400 font-medium">Loading live inventory...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-24 text-center px-4">
                <h2 className="text-xl font-domine text-gray-500 mb-2">Catalog unavailable</h2>
                <p className="text-gray-400 text-sm max-w-md">{error}</p>
                <p className="text-gray-400 text-xs mt-3">
                  Ensure Anagha backend has ERP_API_URL and ERP_STORE_SLUG configured.
                </p>
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <h2 className="text-xl font-domine text-gray-400 mb-2">No products found</h2>
                <p className="text-gray-400 text-sm">No available items match these filters.</p>
                <Link href="/jewellery" className="mt-6 text-[#2e6da4] text-sm font-medium hover:underline">
                  Browse All Jewellery →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {items.map((product) => (
                  <ProductCard key={product.id || product.tag_number} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

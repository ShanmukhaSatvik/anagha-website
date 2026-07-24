'use client';

import Link from 'next/link';
import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import {
  CatalogFilterOption,
  CatalogItem,
  fetchCatalog,
  fetchCatalogFilters,
  formatDisplayPrice,
  itemHref,
} from '@/lib/erpCatalog';

interface Props {
  /** ERP group slug from route. If undefined, show all. */
  category?: string;
}

type ActiveFilters = {
  type?: string;
  group?: string;
  article?: string;
  purity?: string;
};

type FilterOptions = {
  type: CatalogFilterOption[];
  group: CatalogFilterOption[];
  article: CatalogFilterOption[];
  purity: CatalogFilterOption[];
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
              onClick={() => {
                const next = active ? undefined : f.name;
                startTransition(() => onSelect(next));
              }}
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

function FiltersBody({
  category,
  filterOptions,
  active,
  setActive,
}: {
  category?: string;
  filterOptions: FilterOptions;
  active: ActiveFilters;
  setActive: Dispatch<SetStateAction<ActiveFilters>>;
}) {
  return (
    <div className="p-5 space-y-8">
      <FilterGroup
        title="Audience"
        items={filterOptions.type}
        selected={active.type}
        onSelect={(name) => setActive((prev) => ({ ...prev, type: name, article: undefined }))}
      />
      {!category ? (
        <FilterGroup
          title="Category"
          items={filterOptions.group}
          selected={active.group}
          onSelect={(name) => setActive((prev) => ({ ...prev, group: name, article: undefined }))}
        />
      ) : null}
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
  );
}

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

function countActiveFilters(active: ActiveFilters, category?: string) {
  let n = 0;
  if (active.type) n += 1;
  if (!category && active.group) n += 1;
  if (active.article) n += 1;
  if (active.purity) n += 1;
  return n;
}

export default function JewelleryListing({ category }: Props) {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [total, setTotal] = useState(0);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    type: [],
    group: [],
    article: [],
    purity: [],
  });
  const [active, setActive] = useState<ActiveFilters>({});
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const hasLoadedRef = useRef(false);
  const requestIdRef = useRef(0);

  const groupFromRoute = category?.replace(/-/g, ' ');
  const activeCount = countActiveFilters(active, category);

  const queryParams = useMemo(() => {
    const params: Record<string, string | number | undefined> = {
      limit: 48,
      offset: 0,
    };
    if (active.group) params.group = active.group;
    else if (category) params.group = category;
    if (active.type) params.type = active.type;
    if (active.article) params.article = active.article;
    if (active.purity) params.purity = active.purity;
    return params;
  }, [active, category]);

  const load = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    const isFirst = !hasLoadedRef.current;
    if (isFirst) setInitialLoading(true);
    else setRefreshing(true);
    setError(null);

    try {
      const filterQuery: Record<string, string | undefined> = {};
      if (active.group) filterQuery.group = active.group;
      else if (category) filterQuery.group = category;
      if (active.type) filterQuery.type = active.type;

      const [catalog, filtersPayload] = await Promise.all([
        fetchCatalog(queryParams),
        fetchCatalogFilters(filterQuery),
      ]);

      // Ignore stale responses when filters change quickly
      if (requestId !== requestIdRef.current) return;

      setItems(catalog.items || []);
      setTotal(catalog.total || 0);
      setFilterOptions({
        type: filtersPayload.filters.type || [],
        group: filtersPayload.filters.group || [],
        article: filtersPayload.filters.article || [],
        purity: filtersPayload.filters.purity || [],
      });
      hasLoadedRef.current = true;
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      if (!hasLoadedRef.current) {
        setItems([]);
        setTotal(0);
      }
      setError(err instanceof Error ? err.message : 'Failed to load inventory');
    } finally {
      if (requestId === requestIdRef.current) {
        setInitialLoading(false);
        setRefreshing(false);
      }
    }
  }, [queryParams, active.type, active.group, category]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!filtersOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [filtersOpen]);

  const title = category
    ? `${(groupFromRoute || category).replace(/\b\w/g, (c) => c.toUpperCase())} Collection`
    : 'All Jewellery';

  const clearFilters = () => startTransition(() => setActive({}));

  return (
    <main className="w-full bg-[#f9f9f9] min-h-screen font-sans pb-24 lg:pb-20">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-6">
        <div className="mb-8 mt-4 lg:mb-10">
          <h2 className="text-center text-[24px] sm:text-[28px] font-domine text-[#032C5E] tracking-wide font-bold">
            {title}
          </h2>
          {!initialLoading && !error ? (
            <p className="text-center text-[13px] text-gray-500 mt-2">
              {refreshing ? 'Updating…' : `${total} available item${total === 1 ? '' : 's'}`}
              {activeCount > 0 ? (
                <span className="text-[#2e6da4]"> · {activeCount} filter{activeCount === 1 ? '' : 's'}</span>
              ) : null}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-[280px] shrink-0 bg-white shadow-sm border border-gray-100 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
            <div className="bg-[#2e6da4] text-white px-4 py-3 font-medium tracking-wide sticky top-0 z-10 flex items-center justify-between">
              <span>FILTERS</span>
              {activeCount > 0 ? (
                <button
                  type="button"
                  className="text-[11px] uppercase tracking-wide opacity-90 hover:opacity-100"
                  onClick={clearFilters}
                >
                  Clear
                </button>
              ) : null}
            </div>
            <FiltersBody
              category={category}
              filterOptions={filterOptions}
              active={active}
              setActive={setActive}
            />
          </aside>

          {/* Product grid — full width on mobile; keep layout stable while refreshing */}
          <div className="flex-1 w-full min-w-0 relative">
            {initialLoading ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="w-12 h-12 border-4 border-[#2e6da4] border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-gray-400 font-medium">Loading live inventory...</p>
              </div>
            ) : error && items.length === 0 ? (
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
              <div
                className={`grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 transition-opacity duration-200 ${
                  refreshing ? 'opacity-55' : 'opacity-100'
                }`}
              >
                {items.map((product) => (
                  <ProductCard key={product.id || product.tag_number} product={product} />
                ))}
              </div>
            )}
            {refreshing && !initialLoading ? (
              <div className="pointer-events-none absolute top-2 right-2 z-10">
                <div className="w-6 h-6 border-2 border-[#2e6da4] border-t-transparent rounded-full animate-spin bg-white/80" />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Mobile bottom Filters tab */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-[60] pointer-events-none">
        <div
          className="pointer-events-auto border-t border-gray-200 bg-white/95 backdrop-blur-sm shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 text-[#032C5E] font-semibold text-[13px] uppercase tracking-widest"
            aria-haspopup="dialog"
            aria-expanded={filtersOpen}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M4 5h16M7 12h10M10 19h4" strokeLinecap="round" />
            </svg>
            Filters
            {activeCount > 0 ? (
              <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-[#2e6da4] text-white text-[11px] font-bold flex items-center justify-center">
                {activeCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>

      {/* Mobile filters bottom sheet */}
      {filtersOpen ? (
        <div className="lg:hidden fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Filters">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close filters"
            onClick={() => setFiltersOpen(false)}
          />
          <div
            className="absolute inset-x-0 bottom-0 max-h-[85vh] flex flex-col bg-white rounded-t-2xl shadow-2xl"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-3">
                <span className="font-domine text-[#032C5E] text-lg font-bold">Filters</span>
                {activeCount > 0 ? (
                  <span className="text-[12px] text-gray-400">{activeCount} applied</span>
                ) : null}
              </div>
              <div className="flex items-center gap-3">
                {activeCount > 0 ? (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-[12px] font-semibold uppercase tracking-wide text-[#2e6da4]"
                  >
                    Clear
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => setFiltersOpen(false)}
                  className="w-9 h-9 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center"
                  aria-label="Close"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="overflow-y-auto flex-1 overscroll-contain">
              <FiltersBody
                category={category}
                filterOptions={filterOptions}
                active={active}
                setActive={setActive}
              />
            </div>
            <div className="shrink-0 border-t border-gray-100 p-4 bg-white">
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="w-full bg-[#032C5E] text-white font-bold text-[12px] uppercase tracking-widest py-3.5 rounded-full"
              >
                Show {refreshing ? '…' : total} result{total === 1 ? '' : 's'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

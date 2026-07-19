export type CatalogItem = {
  id: string;
  tag_number: string;
  name: string;
  description?: string | null;
  image_url?: string | null;
  gross_weight?: number | string | null;
  net_weight?: number | string | null;
  stone_weight?: number | string | null;
  stone_charges?: number | null;
  mrp?: number | null;
  display_price?: number | null;
  metal_type?: string | null;
  purity?: string | null;
  status?: string | null;
  type?: string | null;
  type_id?: string | null;
  type_slug?: string | null;
  group?: string | null;
  group_id?: string | null;
  group_slug?: string | null;
  article?: string | null;
  article_id?: string | null;
  article_slug?: string | null;
};

export type CatalogFilterOption = {
  id?: string | null;
  name: string;
  slug?: string | null;
  count?: number;
};

export type CatalogFilters = {
  type: CatalogFilterOption[];
  group: CatalogFilterOption[];
  article: CatalogFilterOption[];
  purity: CatalogFilterOption[];
  metal_type: CatalogFilterOption[];
};

function toQuery(params: Record<string, string | number | undefined>) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') qs.set(key, String(value));
  });
  const s = qs.toString();
  return s ? `?${s}` : '';
}

export function formatDisplayPrice(price: number | null | undefined) {
  if (price === null || price === undefined || Number.isNaN(Number(price))) {
    return 'Price on request';
  }
  return `₹${Number(price).toLocaleString('en-IN')}`;
}

export function itemHref(item: CatalogItem) {
  const typeSlug = item.type_slug || 'item';
  return `/jewellery/${encodeURIComponent(typeSlug)}/${encodeURIComponent(item.tag_number)}`;
}

export async function fetchCatalog(params: Record<string, string | number | undefined> = {}) {
  const res = await fetch(`/api/catalog${toQuery(params)}`, { cache: 'no-store' });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error || 'Failed to load catalog');
  }
  return body.data as {
    store: unknown;
    items: CatalogItem[];
    total: number;
    limit: number;
    offset: number;
  };
}

export async function fetchCatalogFilters(params: Record<string, string | undefined> = {}) {
  const res = await fetch(`/api/catalog/filters${toQuery(params)}`, { cache: 'no-store' });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error || 'Failed to load filters');
  }
  return body.data as { store: unknown; filters: CatalogFilters };
}

export async function fetchCatalogItem(tag: string) {
  const res = await fetch(`/api/catalog/items/${encodeURIComponent(tag)}`, { cache: 'no-store' });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error || 'Item not found');
  }
  return body.data as CatalogItem;
}

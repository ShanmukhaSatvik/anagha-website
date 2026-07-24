import { getContent, setContent } from './content.js';

export type WebsiteItemMeta = {
  description?: string;
};

type MetaMap = Record<string, WebsiteItemMeta>;

const KEY = 'website_item_meta';

function normalizeTag(tag: string) {
  return String(tag || '').trim().toUpperCase();
}

export async function getAllWebsiteItemMeta(): Promise<MetaMap> {
  const data = await getContent<MetaMap>(KEY, {});
  return data && typeof data === 'object' ? data : {};
}

export async function getWebsiteItemMeta(tag: string): Promise<WebsiteItemMeta> {
  const map = await getAllWebsiteItemMeta();
  return map[normalizeTag(tag)] || {};
}

export async function setWebsiteItemDescription(tag: string, description: string) {
  const key = normalizeTag(tag);
  if (!key) {
    throw Object.assign(new Error('tag_number is required'), { status: 400 });
  }
  const map = await getAllWebsiteItemMeta();
  map[key] = {
    ...(map[key] || {}),
    description: String(description ?? ''),
  };
  await setContent(KEY, map);
  return map[key];
}

/** Prefer website CMS description when that tag has been saved; else ERP text. */
export function applyWebsiteDescription<T extends { tag_number?: string; description?: string | null }>(
  item: T,
  metaMap: MetaMap,
): T {
  const tag = normalizeTag(item.tag_number || '');
  if (!tag || !Object.prototype.hasOwnProperty.call(metaMap, tag)) return item;
  const desc = metaMap[tag]?.description;
  if (typeof desc !== 'string') return item;
  return { ...item, description: desc };
}

import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { siteContent } from '../db/schema.js';

export async function getContent<T = unknown>(key: string, fallback: T): Promise<T> {
  const rows = await db
    .select()
    .from(siteContent)
    .where(eq(siteContent.key, key))
    .limit(1);

  if (!rows[0]) return fallback;
  // Distinguish missing key (use fallback) from stored JSON/SQL null
  if (rows[0].data === null || rows[0].data === undefined) {
    return null as T;
  }
  return rows[0].data as T;
}

export async function setContent(key: string, data: unknown): Promise<void> {
  await db
    .insert(siteContent)
    .values({ key, data, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: siteContent.key,
      set: { data, updatedAt: new Date() },
    });
}

export async function getAllContent(): Promise<Record<string, unknown>> {
  const rows = await db.select().from(siteContent);
  const out: Record<string, unknown> = {};
  for (const row of rows) out[row.key] = row.data;
  return out;
}

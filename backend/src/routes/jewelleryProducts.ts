import { Router } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/index.js';
import { products } from '../db/schema.js';
import { upload, UPLOADS_DIR, safeUnlink, publicUploadPath } from '../lib/upload.js';

const router = Router();

function toClient(row: typeof products.$inferSelect) {
  return {
    id: row.id,
    category: row.category,
    subcategory: row.subcategory ?? undefined,
    name: row.name,
    price: row.price,
    originalPrice: row.originalPrice ?? row.price,
    image: row.image,
    description: row.description ?? undefined,
    offer: row.offer ?? undefined,
  };
}

router.get('/', async (req, res) => {
  try {
    const category = req.query.category as string | undefined;
    const id = req.query.id as string | undefined;

    if (id) {
      const rows = await db.select().from(products).where(eq(products.id, id)).limit(1);
      if (!rows[0]) return res.status(404).json(null);
      return res.json(toClient(rows[0]));
    }

    let rows = await db.select().from(products);
    if (category) rows = rows.filter((p) => p.category === category);
    res.json(rows.map(toClient));
  } catch (err) {
    console.error('[jewellery/products] GET', err);
    res.status(500).json({ error: 'Failed' });
  }
});

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const name = req.body.name as string;
    const category = req.body.category as string;
    const price = req.body.price as string;
    const originalPrice = (req.body.originalPrice as string) || price;

    if (!name || !category || !price || !req.file) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const ext = path.extname(req.file.originalname) || '.png';
    const filename = `product_${Date.now()}${ext}`;
    fs.renameSync(req.file.path, path.join(UPLOADS_DIR, filename));

    const id = uuidv4();
    const [row] = await db
      .insert(products)
      .values({
        id,
        name,
        category,
        price,
        originalPrice,
        image: publicUploadPath(filename),
      })
      .returning();

    res.json({ success: true, product: toClient(row) });
  } catch (err) {
    console.error('[jewellery/products] POST', err);
    res.status(500).json({ error: 'Failed' });
  }
});

router.patch('/', upload.single('file'), async (req, res) => {
  try {
    const id = req.body.id as string;
    if (!id) return res.status(400).json({ error: 'ID required' });

    const existing = await db.select().from(products).where(eq(products.id, id)).limit(1);
    if (!existing[0]) return res.status(404).json({ error: 'Not found' });

    const product = existing[0];
    const updates: Partial<typeof products.$inferInsert> = { updatedAt: new Date() };

    if (req.body.name) updates.name = req.body.name;
    if (req.body.category) updates.category = req.body.category;
    if (req.body.price) updates.price = req.body.price;
    if (req.body.originalPrice) updates.originalPrice = req.body.originalPrice;
    if (req.body.description) updates.description = req.body.description;
    if (req.body.offer) updates.offer = req.body.offer;

    if (req.file) {
      if (product.image?.startsWith('/uploads/')) safeUnlink(product.image);
      const ext = path.extname(req.file.originalname) || '.png';
      const filename = `product_${Date.now()}${ext}`;
      fs.renameSync(req.file.path, path.join(UPLOADS_DIR, filename));
      updates.image = publicUploadPath(filename);
    }

    const [row] = await db
      .update(products)
      .set(updates)
      .where(eq(products.id, id))
      .returning();

    res.json({ success: true, product: toClient(row) });
  } catch (err) {
    console.error('[jewellery/products] PATCH', err);
    res.status(500).json({ error: 'Failed' });
  }
});

router.delete('/', async (req, res) => {
  try {
    const id = req.query.id as string | undefined;
    if (!id) return res.status(400).json({ error: 'ID is required' });

    const existing = await db.select().from(products).where(eq(products.id, id)).limit(1);
    if (existing[0]?.image?.startsWith('/uploads/')) safeUnlink(existing[0].image);

    await db.delete(products).where(eq(products.id, id));
    res.json({ success: true });
  } catch (err) {
    console.error('[jewellery/products] DELETE', err);
    res.status(500).json({ error: 'Failed' });
  }
});

export default router;

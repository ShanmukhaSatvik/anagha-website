import { Router } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { getContent, setContent } from '../lib/content.js';
import { upload, UPLOADS_DIR, safeUnlink } from '../lib/upload.js';

const router = Router();

type CatSlot = {
  name?: string;
  filename?: string | null;
  uploadedAt?: string;
} | null;

function keyFor(type: string | null | undefined) {
  return type === 'silver' ? 'silverCategories' : 'goldCategories';
}

router.get('/', async (req, res) => {
  const key = keyFor(req.query.type as string);
  const cats = await getContent<CatSlot[]>(key, []);
  res.json(cats);
});

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const type = req.query.type as string;
    const key = keyFor(type);
    const index = parseInt(String(req.body.index), 10);
    const name = req.body.name as string;

    if (Number.isNaN(index)) {
      return res.status(400).json({ error: 'Missing index' });
    }

    const cats = [...(await getContent<CatSlot[]>(key, []))];
    while (cats.length <= index) cats.push(null);

    let filename = cats[index]?.filename ?? null;

    if (req.file) {
      if (filename) safeUnlink(filename);
      const ext = path.extname(req.file.originalname) || '.png';
      filename = `cat_${type || 'gold'}_${index}${ext}`;
      fs.renameSync(req.file.path, path.join(UPLOADS_DIR, filename));
    }

    cats[index] = {
      ...(cats[index] ?? {}),
      name,
      filename,
      uploadedAt: new Date().toISOString(),
    };

    await setContent(key, cats);
    res.json({ success: true, filename });
  } catch (err) {
    console.error('[categories] POST', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

router.delete('/', async (req, res) => {
  try {
    const type = req.query.type as string;
    const key = keyFor(type);
    const index = req.query.index as string | undefined;
    const mode = req.query.mode as string | undefined;
    const cats = [...(await getContent<CatSlot[]>(key, []))];

    if (index !== undefined) {
      const idx = parseInt(index, 10);
      if (mode === 'delete') cats.splice(idx, 1);
      else cats[idx] = null;
      await setContent(key, cats);
    } else {
      await setContent(key, []);
    }

    res.json({ success: true });
  } catch (err) {
    console.error('[categories] DELETE', err);
    res.status(500).json({ error: 'Reset failed' });
  }
});

export default router;

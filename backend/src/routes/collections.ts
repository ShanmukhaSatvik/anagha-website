import { Router } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { getContent, setContent } from '../lib/content.js';
import { upload, UPLOADS_DIR, safeUnlink } from '../lib/upload.js';

const router = Router();

router.get('/', async (_req, res) => {
  const slots = await getContent<(string | null)[]>('collections', [null, null, null]);
  const btnLink = await getContent<string>('collectionsBtnLink', '#');
  res.json({ slots, btnLink });
});

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const index = Number(req.body.index);
    const btnLink = req.body.btnLink as string | undefined;
    if (!req.file || Number.isNaN(index)) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const slots = [...(await getContent<(string | null)[]>('collections', [null, null, null]))];
    if (slots[index]) safeUnlink(slots[index]);

    const ext = path.extname(req.file.originalname) || '.png';
    const filename = `collection_${index}${ext}`;
    fs.renameSync(req.file.path, path.join(UPLOADS_DIR, filename));
    slots[index] = filename;
    await setContent('collections', slots);
    if (btnLink) await setContent('collectionsBtnLink', btnLink);
    res.json({ success: true, filename });
  } catch (err) {
    console.error('[collections] POST', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

router.delete('/', async (req, res) => {
  const index = Number(req.query.index);
  const slots = [...(await getContent<(string | null)[]>('collections', [null, null, null]))];
  if (slots[index]) safeUnlink(slots[index]);
  slots[index] = null;
  await setContent('collections', slots);
  res.json({ success: true });
});

export default router;

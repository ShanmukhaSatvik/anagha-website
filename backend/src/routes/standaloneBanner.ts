import { Router } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { getContent, setContent } from '../lib/content.js';
import { upload, UPLOADS_DIR, safeUnlink } from '../lib/upload.js';

const router = Router();

router.get('/', async (_req, res) => {
  const banner = await getContent<string | null>('standaloneBanner', null);
  res.json({ banner });
});

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Missing file' });

    const old = await getContent<string | null>('standaloneBanner', null);
    if (old) safeUnlink(old);

    const ext = path.extname(req.file.originalname) || '.png';
    const filename = `standalone_banner_${Date.now()}${ext}`;
    fs.renameSync(req.file.path, path.join(UPLOADS_DIR, filename));
    await setContent('standaloneBanner', filename);
    res.json({ success: true, filename });
  } catch (err) {
    console.error('[standalone-banner] POST', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

router.delete('/', async (_req, res) => {
  const old = await getContent<string | null>('standaloneBanner', null);
  if (old) safeUnlink(old);
  await setContent('standaloneBanner', null);
  res.json({ success: true });
});

export default router;

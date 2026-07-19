import { Router } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { getContent, setContent } from '../lib/content.js';
import { upload, UPLOADS_DIR, safeUnlink } from '../lib/upload.js';

const router = Router();
const DEFAULT_LABELS = ['Earrings', 'Bangles', 'Necklace'];

router.get('/', async (_req, res) => {
  const images = await getContent<(string | null)[]>('designLedImages', new Array(6).fill(null));
  const labels = await getContent<string[]>('designLedLabels', DEFAULT_LABELS);
  res.json({ images, labels });
});

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const index = req.body.index as string | undefined;
    const labelIndex = req.body.labelIndex as string | undefined;
    const labelValue = req.body.label as string | undefined;

    if (labelIndex !== undefined && labelValue !== undefined) {
      const labels = [...(await getContent<string[]>('designLedLabels', DEFAULT_LABELS))];
      labels[Number(labelIndex)] = labelValue;
      await setContent('designLedLabels', labels);
    }

    if (req.file && index !== undefined && !Number.isNaN(Number(index))) {
      const idx = Number(index);
      const images = [
        ...(await getContent<(string | null)[]>('designLedImages', new Array(6).fill(null))),
      ];
      if (images[idx]) safeUnlink(images[idx]);
      const ext = path.extname(req.file.originalname) || '.png';
      const filename = `designled_${idx}${ext}`;
      fs.renameSync(req.file.path, path.join(UPLOADS_DIR, filename));
      images[idx] = filename;
      await setContent('designLedImages', images);
    }

    res.json({ success: true });
  } catch (err) {
    console.error('[design-led] POST', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

router.delete('/', async (req, res) => {
  const index = req.query.index as string | undefined;

  if (index !== undefined) {
    const images = [
      ...(await getContent<(string | null)[]>('designLedImages', new Array(6).fill(null))),
    ];
    const idx = Number(index);
    if (images[idx]) safeUnlink(images[idx]);
    images[idx] = null;
    await setContent('designLedImages', images);
  } else {
    const images = await getContent<(string | null)[]>('designLedImages', new Array(6).fill(null));
    for (const f of images) if (f) safeUnlink(f);
    await setContent('designLedImages', new Array(6).fill(null));
    await setContent('designLedLabels', DEFAULT_LABELS);
  }

  res.json({ success: true });
});

export default router;

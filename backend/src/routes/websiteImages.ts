import { Router, type Request, type Response } from 'express';
import {
  setWebsiteImagesOnErp,
  uploadWebsiteImageOnErp,
} from '../lib/erpWebstore.js';

const router = Router();

function handle(err: unknown, res: Response) {
  const status =
    typeof err === 'object' && err && 'status' in err
      ? Number((err as { status: number }).status) || 500
      : 500;
  const message = err instanceof Error ? err.message : 'Website images update failed';
  res.status(status).json({ error: message });
}

function paramTag(req: Request): string {
  const raw = req.params.tag;
  return decodeURIComponent(Array.isArray(raw) ? String(raw[0] || '') : String(raw || ''));
}

/** POST /api/upload/jewellery/website-images/:tag — append one gallery image */
router.post('/:tag', async (req, res) => {
  try {
    const data = await uploadWebsiteImageOnErp({
      tagNumber: paramTag(req),
      file: String(req.body?.file || ''),
      fileName: req.body?.fileName || req.body?.file_name,
    });
    res.json({ data });
  } catch (err) {
    handle(err, res);
  }
});

/** PUT /api/upload/jewellery/website-images/:tag — replace gallery order */
router.put('/:tag', async (req, res) => {
  try {
    const images = Array.isArray(req.body?.website_images) ? req.body.website_images : null;
    if (!images) {
      res.status(400).json({ error: 'website_images array is required' });
      return;
    }
    const data = await setWebsiteImagesOnErp({
      tagNumber: paramTag(req),
      websiteImages: images.map((u: unknown) => String(u || '')),
    });
    res.json({ data });
  } catch (err) {
    handle(err, res);
  }
});

export default router;

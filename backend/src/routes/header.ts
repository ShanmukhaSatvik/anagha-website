import { Router } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { getContent, setContent } from '../lib/content.js';
import { DEFAULT_NAV_ITEMS } from '../lib/defaults.js';
import { upload, UPLOADS_DIR, publicUploadPath } from '../lib/upload.js';

const router = Router();

type NavItem = (typeof DEFAULT_NAV_ITEMS)[number];

async function getNavItems(): Promise<NavItem[]> {
  const header = await getContent<{ navItems: NavItem[] }>('header', {
    navItems: DEFAULT_NAV_ITEMS as NavItem[],
  });
  return header.navItems ?? (DEFAULT_NAV_ITEMS as NavItem[]);
}

router.get('/', async (_req, res) => {
  res.json(await getNavItems());
});

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const action = req.query.action as string | undefined;
    const navIndex = parseInt(String(req.query.navIndex ?? '-1'), 10);
    const navItems = [...(await getNavItems())] as Array<{
      label: string;
      slug: string;
      dropdown?: {
        callout?: { title?: string; desc?: string; image?: string };
        categories?: unknown;
      } | null;
    }>;

    if (action === 'upload-callout-image') {
      if (navIndex < 0) return res.status(400).json({ error: 'Missing navIndex' });
      if (!req.file) return res.status(400).json({ error: 'No file' });

      const ext = path.extname(req.file.originalname) || `.${req.file.mimetype.split('/')[1] || 'png'}`;
      const filename = `header_callout_${navIndex}${ext}`;
      fs.renameSync(req.file.path, path.join(UPLOADS_DIR, filename));

      if (navItems[navIndex]?.dropdown?.callout) {
        navItems[navIndex].dropdown!.callout!.image = publicUploadPath(filename);
      }

      await setContent('header', { navItems });
      return res.json({ success: true, filename });
    }

    // Default: save full nav structure sent as JSON array
    const body = req.body;
    const items = Array.isArray(body) ? body : body?.navItems;
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'Expected array' });
    }

    await setContent('header', { navItems: items });
    res.json({ success: true });
  } catch (err) {
    console.error('[header] POST', err);
    res.status(500).json({ error: 'Save failed' });
  }
});

router.delete('/', async (_req, res) => {
  try {
    await setContent('header', { navItems: DEFAULT_NAV_ITEMS });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Reset failed' });
  }
});

export default router;

import { Router, type Request, type Response, type NextFunction } from 'express';
import { fetchErpPublic } from '../lib/erpCatalog.js';
import {
  applyWebsiteDescription,
  getAllWebsiteItemMeta,
} from '../lib/websiteItemMeta.js';

const router = Router();

function pickQuery(req: Request, keys: string[]) {
  const out: Record<string, string | undefined> = {};
  keys.forEach((key) => {
    const raw = req.query[key];
    if (typeof raw === 'string') out[key] = raw;
    else if (Array.isArray(raw) && typeof raw[0] === 'string') out[key] = raw[0];
  });
  return out;
}

function handleErpError(err: unknown, res: Response) {
  const status = typeof err === 'object' && err && 'status' in err
    ? Number((err as { status: number }).status) || 500
    : 500;
  const message = err instanceof Error ? err.message : 'Catalog request failed';
  res.status(status).json({ error: message });
}

/** GET /api/catalog — live ERP available inventory for this store instance */
router.get('/', async (req: Request, res: Response) => {
  try {
    const body = await fetchErpPublic(
      '/catalog',
      pickQuery(req, [
        'limit',
        'offset',
        'search',
        'type',
        'group',
        'article',
        'type_id',
        'group_id',
        'article_id',
        'purity',
        'metal_type',
        'branch_id',
      ]),
    );
    const metaMap = await getAllWebsiteItemMeta();
    if (body?.data?.items && Array.isArray(body.data.items)) {
      body.data.items = body.data.items.map((item: { tag_number?: string; description?: string | null }) =>
        applyWebsiteDescription(item, metaMap),
      );
    }
    res.json(body);
  } catch (err) {
    handleErpError(err, res);
  }
});

/** GET /api/catalog/filters — ERP taxonomy facets from live stock */
router.get('/filters', async (req: Request, res: Response) => {
  try {
    const body = await fetchErpPublic(
      '/filters',
      pickQuery(req, [
        'type',
        'group',
        'article',
        'type_id',
        'group_id',
        'article_id',
        'branch_id',
      ]),
    );
    res.json(body);
  } catch (err) {
    handleErpError(err, res);
  }
});

/** GET /api/catalog/items/:tag — single available item PDP */
router.get('/items/:tag', async (req: Request, res: Response) => {
  try {
    const tag = String(req.params.tag || '').trim();
    const body = await fetchErpPublic(
      `/items/${encodeURIComponent(tag)}`,
      pickQuery(req, ['branch_id']),
    );
    const metaMap = await getAllWebsiteItemMeta();
    if (body?.data) {
      body.data = applyWebsiteDescription(body.data, metaMap);
    }
    res.json(body);
  } catch (err) {
    handleErpError(err, res);
  }
});

router.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  handleErpError(err, res);
});

export default router;

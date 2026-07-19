import { Router } from 'express';
import { getContent, setContent } from '../lib/content.js';
import { DEFAULT_PLANS } from '../lib/defaults.js';

const router = Router();

function keyFor(type: string | null | undefined) {
  return type === 'silver' ? 'silverPlan' : 'goldPlan';
}

router.get('/', async (req, res) => {
  const type = (req.query.type as 'gold' | 'silver') || 'gold';
  const key = keyFor(type);
  const plan = await getContent(key, DEFAULT_PLANS[type] ?? DEFAULT_PLANS.gold);
  res.json(plan);
});

router.post('/', async (req, res) => {
  try {
    const type = (req.query.type as 'gold' | 'silver') || 'gold';
    const key = keyFor(type);
    const defaults = DEFAULT_PLANS[type] ?? DEFAULT_PLANS.gold;
    await setContent(key, { ...defaults, ...req.body });
    res.json({ success: true });
  } catch (err) {
    console.error('[offer-plan] POST', err);
    res.status(500).json({ error: 'Save failed' });
  }
});

router.delete('/', async (req, res) => {
  try {
    const type = (req.query.type as 'gold' | 'silver') || 'gold';
    const key = keyFor(type);
    await setContent(key, DEFAULT_PLANS[type] ?? DEFAULT_PLANS.gold);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Reset failed' });
  }
});

export default router;

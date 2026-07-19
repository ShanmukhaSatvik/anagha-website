import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import heroRoutes from './routes/hero.js';
import headerRoutes from './routes/header.js';
import categoriesRoutes from './routes/categories.js';
import offerPlanRoutes from './routes/offerPlan.js';
import offersRoutes from './routes/offers.js';
import collectionsRoutes from './routes/collections.js';
import curatedRoutes from './routes/curated.js';
import designLedRoutes from './routes/designLed.js';
import testimonialsRoutes from './routes/testimonials.js';
import standaloneBannerRoutes from './routes/standaloneBanner.js';
import jewelleryCategoriesRoutes from './routes/jewelleryCategories.js';
import jewelleryProductsRoutes from './routes/jewelleryProducts.js';
import { UPLOADS_DIR } from './lib/upload.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT) || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

app.use(
  cors({
    origin: CORS_ORIGIN.split(',').map((s) => s.trim()),
    credentials: true,
  }),
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(UPLOADS_DIR));

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'anagha-backend' });
});

app.use('/api/upload/hero', heroRoutes);
app.use('/api/upload/header', headerRoutes);
app.use('/api/upload/categories', categoriesRoutes);
app.use('/api/upload/offer-plan', offerPlanRoutes);
app.use('/api/upload/offers', offersRoutes);
app.use('/api/upload/collections', collectionsRoutes);
app.use('/api/upload/curated', curatedRoutes);
app.use('/api/upload/design-led', designLedRoutes);
app.use('/api/upload/testimonials', testimonialsRoutes);
app.use('/api/upload/standalone-banner', standaloneBannerRoutes);
app.use('/api/upload/jewellery/categories', jewelleryCategoriesRoutes);
app.use('/api/upload/jewellery/products', jewelleryProductsRoutes);

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error('[express]', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  },
);

app.listen(PORT, () => {
  console.log(`Anagha API listening on http://localhost:${PORT}`);
  console.log(`Uploads directory: ${path.resolve(__dirname, '..', 'uploads')}`);
});

# Anagha Express Backend

Express API backed by [Neon](https://console.neon.tech) Postgres.

Lives in the monorepo as `backend/` next to `frontend/`.

## Setup

From the **repo root** (preferred):

```bash
npm run install:all
cp backend/.env.example backend/.env
# set DATABASE_URL in backend/.env

npm run backend:migrate
npm run backend:seed
npm run dev:backend
```

Or from this folder:

```bash
cp .env.example .env
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

API runs at `http://localhost:4000` by default.

## Endpoints

All previous paths are preserved under `/api/upload/*`:

- `/api/upload/hero`
- `/api/upload/header`
- `/api/upload/categories`
- `/api/upload/offer-plan`
- `/api/upload/offers`
- `/api/upload/collections`
- `/api/upload/curated`
- `/api/upload/design-led`
- `/api/upload/testimonials`
- `/api/upload/standalone-banner`
- `/api/upload/jewellery/categories`
- `/api/upload/jewellery/products`

Uploaded files are stored in `backend/uploads` and served at `/uploads/*`.

## Schema

| Table | Purpose |
| --- | --- |
| `site_content` | CMS JSON blobs (hero, header, offers, …) |
| `jewellery_categories` | Jewellery category list |
| `products` | Product catalog |

# Anagha Website

Monorepo with a Next.js frontend and Express + Neon backend.

```
anagha-website/
├── frontend/     # Next.js app (UI + admin upload pages)
├── backend/      # Express API + Neon Postgres
└── package.json  # workspace scripts
```

## Setup

### 1. Install dependencies

```bash
npm run install:all
```

Or separately:

```bash
npm install --prefix frontend
npm install --prefix backend
```

### 2. Environment

```bash
# Frontend
cp frontend/.env.example frontend/.env.local

# Backend
cp backend/.env.example backend/.env
# then set DATABASE_URL from Neon
# and ERP catalog + checkout wiring:
#   ERP_API_URL=http://localhost:4000/api
#   ERP_STORE_SLUG=<org-slug-from-octis>
#   ERP_BRANCH_ID=<branch-uuid>
#   WEBSTORE_SECRET=<same as ERP WEBSTORE_SECRET>
#   PHONEPE_MODE=mock   # or sandbox with PhonePe UAT keys
#   PUBLIC_BASE_URL=http://localhost:3000
#   PUBLIC_API_BASE_URL=http://localhost:4001
```

Jewellery catalog pages load **live available inventory** from Octis ERP via the Anagha BFF (`/api/catalog`). Checkout uses **Buy now** → reserve → PhonePe (mock/sandbox) → ERP sale bill via `/api/webstore`. Marketing CMS (hero/offers) still uses Neon. Each client website is an instance: change `ERP_STORE_SLUG` (and branding) for Sresta / other orgs.

Full V2 deploy notes live in the Octis ERP repo: `docs/V2_PHONEPE_WEBSTORE_CHECKOUT.md`.

### 3. Database

```bash
npm run backend:migrate
npm run backend:seed
```

### 4. Run locally

```bash
# terminal 0 — Octis ERP API (http://localhost:4000)
# from Gold-Shop-Management-System/backend

# terminal 1 — Anagha BFF (http://localhost:4001)
npm run dev:backend

# terminal 2 — website (http://localhost:3000)
npm run dev:frontend
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev:frontend` | Start Next.js |
| `npm run dev:backend` | Start Express API |
| `npm run backend:migrate` | Apply DB schema |
| `npm run backend:seed` | Seed from existing metadata |
| `npm run build` | Build frontend |

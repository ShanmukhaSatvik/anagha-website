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
```

### 3. Database

```bash
npm run backend:migrate
npm run backend:seed
```

### 4. Run locally

```bash
# terminal 1 — API (http://localhost:4000)
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

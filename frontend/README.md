# Anagha Frontend

Next.js app for the Anagha jewellery website and `/upload` admin UI.

API calls to `/api/upload/*` and `/uploads/*` are proxied to the Express backend via `next.config.ts` (`BACKEND_URL`).

## Develop

From the repo root:

```bash
npm run dev:frontend
```

Or from this folder:

```bash
npm run dev
```

Requires the backend running on `http://localhost:4000` (see `../backend`).

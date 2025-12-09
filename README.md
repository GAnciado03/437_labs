# 437_labs – Esports SPA & API

This repo hosts the final Mustang SPA (`packages/app`), the Express/Mongo API (`packages/server`),
and the original HTML prototype (`packages/proto`) that I keep around for styling references only.

## Prerequisites

- Node.js 18+ (works on Node 22)
- npm 9+
- MongoDB instance + credentials (local or hosted)

## Installation

Install every workspace dependency from the repo root:

```bash
npm install
```

The root `package.json` wires both workspaces (`app`, `server`) so one install covers both.

## Local development

1. **API (packages/server)**
   ```bash
   npm run dev -w packages/server
   ```
   - Runs on `http://localhost:3000`.
   - Provide a `packages/server/.env` with at least:
     ```
     MONGO_USER= *super secret*
     MONGO_PWD= *super secret*
     MONGO_CLUSTER=437esportsdatabase.akdsxpf.mongodb.net
     ```

2. **SPA (packages/app)**
   ```bash
   npm run dev -w packages/app
   ```
   - Served via Vite on `http://localhost:5173` with proxy rules for `/api`, `/auth`, `/login`, etc.

### Handy scripts

| Command | Description |
| `npm run dev -w packages/app` | SPA dev server |
| `npm run build -w packages/app` | Production build to `packages/app/dist` |
| `npm run typecheck -w packages/app` | TypeScript check for the SPA |
| `npm run dev -w packages/server` | Express API with nodemon |
| `npm run build -w packages/server` | Compile server with `esbuild-node-tsc` |
| `npm exec -w proto vite build` | runs Vite’s production build |

## Deployment

- **Client**: `npm run build -w packages/app` → deploy `packages/app/dist` to your host (or serve via Express by pointing `STATIC=../app/dist` and running `npm run start:app -w packages/server`).
- **Server**: Deploy the Express app (Render/Fly/VPS). Provide the same `.env` values used locally. SPA assumes the API lives on the same origin; adjust env/proxy if you host them separately.

Document your production URLs (SPA + API + login info) in the Canvas submission so the grader can hit the live site.

## Authentication quick start

- Register: `POST /auth/register` with `{ "username": "demo", "password": "Password123!" }` or use `/register.html`.
- Login: `POST /auth/login` or `/login.html` → response contains `{ token }`.
- Protected routes (`PUT /api/players/:id`, favorites, `/api/me`, `/api/sync`) require `Authorization: Bearer <token>`.

## Dark mode & UI

- `<blazing-header>` exposes the theme toggle; the shared script in `packages/app/public/scripts/theme.js` updates button labels (“Dark Mode: Yes/No”) and persists the preference.
- Proto uses the same script to keep parity when referencing older layouts.

## Repo layout

```
packages/
// app     # Mustang SPA
// server  # Express API, auth, Mongo models
// proto   # Static prototype kept for style reference only
```

If you run into auth or data issues, restart both dev servers and log in again to refresh the JWT. Reach out if you need more deployment or testing details.

There would be more data, but I have not implemented the way to get data for
events from valorant tournaments or data for league of legends.

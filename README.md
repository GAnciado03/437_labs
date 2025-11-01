# 437_labs

## Prerequisites

- Node.js 18+ (Node 22 works too)
- npm 9+

## Install

From the repo root:

```
npm i
```

## Run (Vite dev server)

Vite serves the proto with hot reload. Open the URL it prints (defaults to port 3000).

npm run dev -w packages/proto

Then visit, for example:

- http://localhost:3000/stats.html
- http://localhost:3000/stats2.html

## Build

Build the optimized site into `packages/proto/dist/` and preview it locally:

npm run build -w packages/proto

## Deploy

Upload the contents of `packages/proto/dist/` to your static host or CDN. That folder is the complete production site.

## Dark Mode

- Toggle is on the User page only and persists via `localStorage`.
- The button text color respects tokens and updates with the theme.

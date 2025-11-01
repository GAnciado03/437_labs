import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  appType: 'mpa', // treat each HTML as its own entry; no SPA fallback
  server: { port: 3000 },
  preview: { port: 3000 }
});

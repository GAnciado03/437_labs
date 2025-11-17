import { defineConfig } from 'vite';

export default defineConfig({
  appType: 'spa',
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:4000',
      '/auth': 'http://localhost:4000'
    }
  },
  preview: { port: 3000 }
});

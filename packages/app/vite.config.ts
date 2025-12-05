import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  appType: "spa",
  root: ".",
  base: "/app",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html")
      }
    }
  },
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:3000",
      "/auth": "http://localhost:3000",
      "/images": "http://localhost:3000",
      "/login": "http://localhost:3000",
      "/register": "http://localhost:3000"
    }
  }
});


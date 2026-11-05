import { defineConfig } from 'vite';

// Matrix Salon — Vite config.
// - dev server runs on http://localhost:5173  (npm run dev)
// - base './' so the production build works from any folder / sub-path.
export default defineConfig({
  base: './',
  server: {
    port: 5173,
    strictPort: true,
  },
  preview: {
    port: 5173,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});

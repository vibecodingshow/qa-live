import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Production-only Vite configuration
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    minify: true,
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  define: {
    'import.meta.env.BACKEND_URL': JSON.stringify('/api'),
  },
  base: '/projects/qa-live/'
});
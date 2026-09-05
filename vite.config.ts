import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'es2022',
    sourcemap: false,
    cssCodeSplit: false,
  },
  server: {
    host: '127.0.0.1',
  },
  preview: {
    headers: {
      'Cache-Control': 'public, max-age=3600',
    },
  },
});

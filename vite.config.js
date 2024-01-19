import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import Checker from 'vite-plugin-checker';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Checker({ typescript: true, eslint: true }),
    // Other plugins...
  ],
  build: {
    rollupOptions: {
      external: ['axios'],
    },
  },
  // Other configurations...
});
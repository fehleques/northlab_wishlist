import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "${path.resolve(__dirname, 'src/styles/_variables.scss')}";
          @import "${path.resolve(__dirname, 'src/styles/_mixins.scss')}";
        `
      }
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});

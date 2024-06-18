import { resolve } from 'path';

import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [dts()],
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'index',
      fileName: 'index',
    },
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@decorators': resolve(__dirname, 'src/decorators'),
      '@filter': resolve(__dirname, 'src/filter'),
      '@guard': resolve(__dirname, 'src/guard'),
      '@utils': resolve(__dirname, 'src/utils'),
    },
  },
});

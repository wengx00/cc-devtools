import { resolve } from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

import pluginGenerator from './plugins/plugin-generator';

// https://vitejs.dev/config/
export default ({ mode }: any) =>
  defineConfig({
    plugins: [react(), pluginGenerator()],
    base: loadEnv(mode, process.cwd()).VITE_APP_BASE || '/',
    resolve: {
      alias: {
        '@/': `${resolve(__dirname, './src')}/`,
      },
    },
    server: {
      port: Number(loadEnv(mode, process.cwd()).VITE_DEV_PORT) || 3000,
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '',
        },
      },
    },
    build: {
      rollupOptions: {
        output: {},
      },
    },
  });

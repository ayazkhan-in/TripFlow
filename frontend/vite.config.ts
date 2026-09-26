import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

// Read backend .env to automatically detect and synchronize backend port
let detectedPort = process.env.BACKEND_PORT;
if (!detectedPort) {
  try {
    const backendEnvPath = path.resolve(import.meta.dirname, '../backend/.env');
    if (fs.existsSync(backendEnvPath)) {
      const match = fs.readFileSync(backendEnvPath, 'utf-8').match(/^PORT\s*=\s*(\d+)/m);
      if (match) {
        detectedPort = match[1];
      }
    }
  } catch (err) {
    // ignore
  }
}
const backendPort = Number(detectedPort) || 5000;

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: `http://localhost:${backendPort}`,
          changeOrigin: true,
        },
      },
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

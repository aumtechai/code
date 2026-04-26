import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// process.cwd() is 3_code/frontend when npm run build is called from that directory.
// Setting root explicitly ensures /src/main.jsx resolves from THIS folder, not repo root.
export default defineConfig({
  root: process.cwd(),
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
})

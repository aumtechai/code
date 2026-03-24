import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        coaching: resolve(__dirname, 'coaching.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
        login: resolve(__dirname, 'login.html'),
        profile: resolve(__dirname, 'profile.html'),
        roadmap: resolve(__dirname, 'roadmap.html'),
        strategy: resolve(__dirname, 'strategy.html'),
        testing: resolve(__dirname, 'testing.html'),
        test_supa: resolve(__dirname, 'test_supa_compare.html'),
        vesta: resolve(__dirname, 'vesta.html'),
      },
    },
  },
})

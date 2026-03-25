import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
        onboarding: resolve(__dirname, 'onboarding.html'),
        roadmap: resolve(__dirname, 'roadmap.html'),
        tracker: resolve(__dirname, 'tracker.html'),
        essays: resolve(__dirname, 'essays.html'),
        testing: resolve(__dirname, 'testing.html'),
        profile: resolve(__dirname, 'profile.html'),
        coaching: resolve(__dirname, 'coaching.html'),
        parent: resolve(__dirname, 'parent.html'),
        vesta: resolve(__dirname, 'vesta.html'),
        strategy: resolve(__dirname, 'strategy.html'),
      },
    },
  },
})

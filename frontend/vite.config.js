import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const BACKEND_URL = 'https://ceylon-batik-git-main-isuru128s-projects.vercel.app'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: BACKEND_URL,
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: BACKEND_URL,
        changeOrigin: true,
        secure: false,
      },
    },
  },
})


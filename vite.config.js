import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // Default the dev API proxy to production so the gallery (images + products)
  // works on localhost without running the local Express backend. To develop
  // against the local backend instead, set VITE_API_TARGET=http://localhost:3001
  // (e.g. in .env.local) and restart the dev server.
  const apiTarget = env.VITE_API_TARGET || 'https://www.mettaire.com'
  const isHttps = apiTarget.startsWith('https')

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          secure: isHttps,
        },
      },
    },
  }
})

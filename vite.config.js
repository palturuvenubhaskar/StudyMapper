import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // Prefer the server-only name; fall back to the legacy VITE_ name so local
  // development keeps working without extra setup.
  const aiKey = env.OPENROUTER_API_KEY || env.VITE_OPENROUTER_API_KEY || ''

  return {
    plugins: [react()],
    server: {
      proxy: {
        // Mirrors the Vercel function in api/chat.js so /api/chat works locally.
        '/api/chat': {
          target: 'https://openrouter.ai',
          changeOrigin: true,
          rewrite: () => '/api/v1/chat/completions',
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (aiKey) proxyReq.setHeader('Authorization', `Bearer ${aiKey}`)
              proxyReq.setHeader('HTTP-Referer', 'http://localhost:5173')
              proxyReq.setHeader('X-Title', 'StudyMapper')
            })
          },
        },
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './src/setupTests.js',
    },
  }
})

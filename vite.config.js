import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          secure: false,
          rewrite: path => path.replace(/^\/api/, '')
        },
        '/storage': {
          target: env.VITE_STORAGE_URL,
          changeOrigin: true,
          secure: false,
          rewrite: path => path.replace(/^\/storage/, '')
        }
      }
    }
  }
})
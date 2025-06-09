import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// Definimos la URL base del backend una sola vez
const BACKEND_URL = 'http://192.168.51.15:3000';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Todas las peticiones a /incidentes se enviarán a tu backend
      '/incidentes': {
        target: BACKEND_URL,
        changeOrigin: true,
      },
      '/tecnicos': {
        target: BACKEND_URL,
        changeOrigin: true,
      },
      '/robots': {
        target: BACKEND_URL,
        changeOrigin: true,
      },
      '/incidentes-robots-tecnicos/asignar-tecnico': {
        target: BACKEND_URL,
        changeOrigin: true,
      },
      '/incidentes-robots-tecnicos': {
        target: BACKEND_URL,
        changeOrigin: true,
      },
      '/api/auth': {
        target: BACKEND_URL,
        changeOrigin: true,
      }
    }
  }
})

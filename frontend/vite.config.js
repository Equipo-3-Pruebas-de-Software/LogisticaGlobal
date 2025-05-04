import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Todas las peticiones a /incidentes se enviarán a tu backend en el 3000
      '/incidentes': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        // rewrite no hace falta si la ruta es idéntica
      },
      '/tecnicos': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        // rewrite no hace falta si la ruta es idéntica
      }
    }
  }
})

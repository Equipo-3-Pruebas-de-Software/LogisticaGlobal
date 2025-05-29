import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Todas las peticiones a /incidentes se enviarán a tu backend en el 3000
      '/incidentes': {
        target: 'http://3.142.70.13/:3000',
        changeOrigin: true,
        // rewrite no hace falta si la ruta es idéntica
      },
      '/tecnicos': {
        target: 'http://3.142.70.13:3000',
        changeOrigin: true,
        // rewrite no hace falta si la ruta es idéntica
      },
      '/robots': {
        target: 'http://3.142.70.13:3000',
        changeOrigin: true,
        // rewrite no hace falta si la ruta es idéntica
      },
      '/incidentes-robots-tecnicos/asignar-tecnico': {
        target: 'http://3.142.70.13:3000',
        changeOrigin: true,
        // rewrite no hace falta si la ruta es idéntica
      },
      '/incidentes-robots-tecnicos': {
        target: 'http://3.142.70.13:3000',
        changeOrigin: true,
        // rewrite no hace falta si la ruta es idéntica
      },
      '/api/auth': {
        target: 'http://3.142.70.13:3000',
        changeOrigin: true,
        // rewrite no hace falta si la ruta es idéntica
      }
      
    }
  }
})

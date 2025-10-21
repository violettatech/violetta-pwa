import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Configuración completa de Violetta PWA
export default defineConfig({
  server: {
    port: 5173
  },
  build: {
    sourcemap: true
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',   // Actualiza el SW automáticamente
      injectRegister: 'auto',       // Registra el Service Worker de forma automática
      includeAssets: [
        'icons/icon-192.png',
        'icons/icon-512.png',
        'icons/maskable-512.png',
        'icons/apple-icon-180.png'
      ],
      manifest: {
        name: 'Violetta',
        short_name: 'Violetta',
        description: 'Acompañamiento emocional y autoconocimiento',
        start_url: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#a855f7',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'icons/maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: 'icons/apple-icon-180.png',
            sizes: '180x180',
            type: 'image/png',
            purpose: 'any'
          }
        ]
      },
      devOptions: {
        enabled: true,   // Habilita PWA también en modo desarrollo
        type: 'module'
      }
    })
  ]
})

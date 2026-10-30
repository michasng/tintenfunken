import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const ARTWORK_CACHE_NAME = 'tintenfunken-artworks-v2'

const githubPagesSpaFallback = {
  name: 'github-pages-spa-fallback',
  writeBundle() {
    const dist = resolve(import.meta.dirname, 'dist')
    copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'))
  },
}

export default defineConfig({
  plugins: [
    tailwindcss(),
    vue(),
    VitePWA({
      strategies: 'generateSW',
      registerType: 'autoUpdate',
      filename: 'service-worker.js',
      includeAssets: ['icon.svg', 'artworks/der-held.png'],
      manifest: {
        name: 'Tintenfunken',
        short_name: 'Tintenfunken',
        description: 'Schreibhandwerk-Karten zum Durchblättern, Drucken und Offline-Nutzen.',
        lang: 'de',
        start_url: './',
        scope: './',
        display: 'standalone',
        background_color: '#14101E',
        theme_color: '#1C1628',
        icons: [
          { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml' },
          { src: 'artworks/der-held.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html}'],
        globIgnores: ['404.html'],
        runtimeCaching: [
          {
            urlPattern: ({ request, sameOrigin }) => sameOrigin && request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: ARTWORK_CACHE_NAME,
              cacheableResponse: { statuses: [200] },
            },
          },
        ],
      },
    }),
    githubPagesSpaFallback,
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})

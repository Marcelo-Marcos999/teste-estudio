import { createRequire } from 'node:module'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// `vite-plugin-pwa` é usado quando disponível para gerar o service worker
// (workbox) e o cache dos assets estáticos — permitindo uso offline após a
// primeira visita. O manifest é servido a partir de
// `public/manifest.webmanifest` (linkado manualmente no index.html), por isso
// `manifest: false`.
//
// Se o plugin não estiver instalado no ambiente, caímos para o service worker
// manual (`public/sw-fallback.js`), garantindo que o PWA continue funcional.
const require = createRequire(import.meta.url)

let VitePWA = null
try {
  ;({ VitePWA } = require('vite-plugin-pwa'))
} catch (e) {
  VitePWA = null
}

const plugins = [react()]

if (VitePWA) {
  plugins.push(
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      includeAssets: [
        'icons/icon-192x192.svg',
        'icons/icon-512x512.svg',
        'icons/maskable-512x512.svg',
      ],
      manifest: false,
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest,woff2}'],
        cleanupOutdatedCaches: true,
        navigateFallback: 'index.html',
      },
    })
  )
}

export default defineConfig({
  plugins,
})


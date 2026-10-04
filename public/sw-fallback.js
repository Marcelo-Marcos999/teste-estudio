/* Service worker manual de fallback.
 *
 * Usado quando o `vite-plugin-pwa` não está disponível no ambiente de build.
 * Estratégia:
 *  - precache dos assets essenciais (shell do app);
 *  - navegação: network-first com fallback para o index.html em cache;
 *  - demais requisições GET: cache-first com atualização em background.
 *
 * Como o app é 100% client-side, ele passa a funcionar offline após a
 * primeira visita.
 */
const CACHE = 'jogo-da-velha-v1'

const PRECACHE = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icons/icon-192x192.svg',
  '/icons/icon-512x512.svg',
  '/icons/maskable-512x512.svg',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/index.html').then((res) => res || Response.error()))
    )
    return
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached
      return fetch(request)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const copy = response.clone()
            caches.open(CACHE).then((cache) => cache.put(request, copy)).catch(() => {})
          }
          return response
        })
        .catch(() => cached || Response.error())
    })
  )
})

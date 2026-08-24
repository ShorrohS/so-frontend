// Salon Orgænics Service Worker
const CACHE_NAME = 'so-cache-v1'

self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // Ignore non-HTTP/HTTPS schemes (e.g. chrome-extension://, moz-extension://)
  if (!url.protocol.startsWith('http')) {
    return
  }

  // Bypass API requests from cache
  if (url.pathname.startsWith('/api/')) {
    return
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse
      }
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse
        }
        const responseToCache = networkResponse.clone()
        caches.open(CACHE_NAME).then((cache) => {
          // Safely wrap Cache.put for valid HTTP requests
          if (event.request.url.startsWith('http')) {
            cache.put(event.request, responseToCache).catch(() => {})
          }
        })
        return networkResponse
      })
    })
  )
})

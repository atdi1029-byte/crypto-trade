const CACHE_NAME = 'crypto-trade-v172';
const ASSETS = [
  './',
  './index.html',
  './logo.png',
  './icon-192.png',
  './icon-512.png',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700&family=Space+Mono:wght@400;700&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || event.request.url.includes('script.google.com')) {
    return;
  }
  // Network-first for HTML — always get latest, fall back to cache offline
  if (event.request.mode === 'navigate' || event.request.url.endsWith('.html') || event.request.url.endsWith('/')) {
    event.respondWith(
      fetch(event.request).then(resp => {
        const clone = resp.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return resp;
      }).catch(() => caches.match(event.request))
    );
    return;
  }
  // Cache-first for static assets (images, fonts)
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});

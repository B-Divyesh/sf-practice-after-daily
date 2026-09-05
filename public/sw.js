const CACHE = 'signal-garden-shell-v1';
const CORE = ['/', '/index.html', '/demo', '/privacy', '/terms', '/404.html', '/manifest.webmanifest', '/favicon.svg', '/og-signal-garden.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('message', (event) => {
  if (event.data?.type !== 'CACHE_URLS' || !Array.isArray(event.data.urls)) return;
  const urls = event.data.urls.filter((url) => typeof url === 'string' && url.startsWith(self.location.origin));
  event.waitUntil(caches.open(CACHE).then((cache) => Promise.all(urls.map((url) => cache.add(url).catch(() => undefined)))).then(() => event.ports[0]?.postMessage({ cached: true })));
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) return;
  event.respondWith(
    caches.open(CACHE).then((cache) => cache.match(event.request.url).then((cached) => cached || fetch(event.request).then((response) => {
      if (response.ok) cache.put(event.request.url, response.clone());
      return response;
    }).catch(() => event.request.mode === 'navigate' ? cache.match('/index.html') : undefined))),
  );
});

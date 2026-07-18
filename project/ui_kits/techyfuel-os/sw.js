// TechyFuel OS — service worker.
// Minimal, network-first so the app is always fresh (the frontend compiles
// .jsx at runtime and talks to a live API, so we must NOT serve stale code).
// Its only jobs: make the app installable (PWA) and give a graceful offline
// fallback for navigations. It deliberately does NOT cache API responses.

const CACHE = 'techyfuel-os-v1';
const APP_SHELL = ['/os/', '/os/index.html', '/os/manifest.json', '/os/icon-192.png'];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(APP_SHELL).catch(() => {})));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  // Never touch API calls or non-GET — always go to network.
  if (req.method !== 'GET' || req.url.includes('/api/') || req.url.includes('api.techyfuel.com')) {
    return;
  }
  // Network-first for everything else; fall back to cache when offline.
  e.respondWith(
    fetch(req)
      .then((res) => {
        // keep the app shell fresh in cache
        if (req.url.includes('/os/')) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() => caches.match(req).then((r) => r || caches.match('/os/index.html')))
  );
});

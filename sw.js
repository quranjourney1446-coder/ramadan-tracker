// Ramadan Tracker — Service Worker v9
// Network-first for HTML/JS/CSS (always fresh), cache-first for audio/icons

const CACHE_NAME = 'ramadan-tracker-v9';
const BASE = '/ramadan-tracker';

// Assets to pre-cache on install (icons and audio only — not JS/CSS/HTML)
const PRECACHE_ASSETS = [
  BASE + '/icons/icon-192.png',
  BASE + '/icons/icon-512.png',
  BASE + '/audio/tasbih.m4a',
  BASE + '/audio/tahmeed.m4a',
  BASE + '/audio/tahleel.m4a',
  BASE + '/audio/takbeer.m4a',
  BASE + '/audio/salawat.m4a',
];

// Install: pre-cache static assets only
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Pre-cache assets, ignore failures (icons/audio may not exist)
      return Promise.allSettled(PRECACHE_ASSETS.map(url => cache.add(url)));
    })
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch strategy:
// - HTML, JS, CSS → Network-first (always get fresh code)
// - Audio, Images → Cache-first (serve fast, update in background)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const ext = url.pathname.split('.').pop().toLowerCase();
  const isCode = ['html', 'js', 'css', 'json'].includes(ext) || url.pathname.endsWith('/');
  const isAsset = ['m4a', 'mp3', 'png', 'jpg', 'svg', 'ico', 'webp'].includes(ext);

  if (isCode) {
    // Network-first: always try network, fall back to cache
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  } else if (isAsset) {
    // Cache-first: serve from cache, update in background
    event.respondWith(
      caches.match(event.request).then((cached) => {
        const networkFetch = fetch(event.request).then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        });
        return cached || networkFetch;
      })
    );
  }
  // All other requests: let browser handle normally
});

// Keertana Service Worker
// Caching strategy: precache essentials, stale-while-revalidate for visited pages
const CACHE_VERSION = 'keertana-v3-brand';
const PRECACHE = [
  '/',
  '/offline/',
  '/brand/keertana-logo-concept-v2.png',
  '/brand/favicon-32.png',
  '/api/search-index.json?v=title-roman-2',
];

// Install: precache essentials
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_VERSION)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: stale-while-revalidate for pages & assets, network-first for API
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip cross-origin requests (e.g. Google Fonts, analytics)
  if (url.origin !== self.location.origin) return;

  // Search schema changes must reach returning visitors immediately.
  if (url.pathname === '/api/search-index.json') {
    event.respondWith(caches.open(CACHE_VERSION).then(async (cache) => {
      try {
        const response = await fetch(request);
        if (response.ok) { await cache.put(request, response.clone()); return response; }
        return (await cache.match(request)) || response;
      } catch {
        return (await cache.match(request)) || new Response('Search unavailable offline', { status: 503 });
      }
    }));
    return;
  }

  // Pagefind files: cache once used (network first, then cache)
  if (url.pathname.includes('/pagefind/')) {
    event.respondWith(
      caches.open(CACHE_VERSION).then((cache) =>
        cache.match(request).then((cached) => {
          const fetchPromise = fetch(request).then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          }).catch(() => cached);
          return cached || fetchPromise;
        })
      )
    );
    return;
  }

  // HTML pages and assets: stale-while-revalidate
  event.respondWith(
    caches.open(CACHE_VERSION).then((cache) =>
      cache.match(request).then((cached) => {
        const fetchPromise = fetch(request).then((response) => {
          if (response.ok) {
            cache.put(request, response.clone());
          }
          return response;
        }).catch(() => {
          // If offline and no cache, show offline page for navigation requests
          if (cached) return cached;
          if (request.mode === 'navigate') {
            return cache.match('/offline/');
          }
          return new Response('Offline', { status: 503, statusText: 'Offline' });
        });

        // Return cached response immediately, update in background
        return cached || fetchPromise;
      })
    )
  );
});

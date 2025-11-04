// IMPORTANT: Update this version number with each deployment
const CACHE_NAME = `e4you-cache-${process.env.REACT_APP_BUILD_HASH}`;

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
  // Don't cache JS/CSS files here - let them be fetched dynamically
];

self.addEventListener('install', event => {
  // Force the new service worker to activate immediately
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', event => {
  // Take control of all clients immediately
  event.waitUntil(
    Promise.all([
      // Delete old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control immediately
      self.clients.claim()
    ])
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Network-first strategy for JS, CSS, and API calls
  if (
    url.pathname.startsWith('/static/') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.startsWith('/api/')
  ) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Optionally cache the new version
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache only if network fails
          return caches.match(request);
        })
    );
    return;
  }
  
  // Cache-first strategy for other resources
  event.respondWith(
    caches.match(request).then(response => {
      return response || fetch(request).then(fetchResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(request, fetchResponse.clone());
          return fetchResponse;
        });
      });
    })
  );
});
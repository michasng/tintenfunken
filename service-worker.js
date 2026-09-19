const CACHE_VERSION = 'v1';
const STATIC_CACHE = `tintenfunken-static-${CACHE_VERSION}`;
const IMAGE_CACHE = `tintenfunken-images-${CACHE_VERSION}`;
const APP_SCOPE = self.registration.scope;
const APP_ORIGIN = new URL(APP_SCOPE).origin;
const APP_PATH = new URL(APP_SCOPE).pathname;
const PRECACHE_PATHS = [
  './',
  'index.html',
  'app.js',
  'styles.css',
  'cards.csv',
  'manifest.webmanifest',
  'icon.svg',
  'images/der-held.png',
];
const PRECACHE_URLS = PRECACHE_PATHS.map(path => new URL(path, APP_SCOPE).toString());
const PRECACHE_URL_SET = new Set(PRECACHE_URLS);

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const expected = new Set([STATIC_CACHE, IMAGE_CACHE]);
    for (const cacheName of await caches.keys()) {
      if (cacheName.startsWith('tintenfunken-') && !expected.has(cacheName)) {
        await caches.delete(cacheName);
      }
    }
    await self.clients.claim();
  })());
});

async function staleWhileRevalidate(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);
  const networkPromise = fetch(request)
    .then(response => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  return cached ?? networkPromise ?? Response.error();
}

async function cacheFirst(request) {
  const cache = await caches.open(IMAGE_CACHE);
  const cached = await cache.match(request);
  if (cached) {
    return cached;
  }

  const response = await fetch(request);
  if (response.ok) {
    cache.put(request, response.clone());
  }
  return response;
}

async function handleNavigation(request) {
  try {
    const response = await fetch(request);
    if (response.ok || response.type === 'opaqueredirect') {
      return response;
    }
  } catch {}

  const cache = await caches.open(STATIC_CACHE);
  return (
    (await cache.match(new URL('./', APP_SCOPE).toString())) ??
    (await cache.match(new URL('index.html', APP_SCOPE).toString())) ??
    Response.error()
  );
}

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);
  const isAppRequest = url.origin === APP_ORIGIN && url.pathname.startsWith(APP_PATH);

  if (request.mode === 'navigate' && isAppRequest) {
    event.respondWith(handleNavigation(request));
    return;
  }

  if (isAppRequest && request.destination === 'image') {
    event.respondWith(cacheFirst(request));
    return;
  }

  if (PRECACHE_URL_SET.has(url.toString())) {
    event.respondWith(staleWhileRevalidate(request));
  }
});

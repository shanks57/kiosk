const CACHE_NAME = 'eticket-cache-v1';
const RUNTIME = 'runtime-cache';

// Files to precache — add root and common static assets.
const PRECACHE_URLS = [
    '/',
    '/favicon.svg',
    '/favicon.svg',
    '/apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)),
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        (async () => {
            const keys = await caches.keys();
            await Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME && key !== RUNTIME) {
                        return caches.delete(key);
                    }
                }),
            );
            await self.clients.claim();
        })(),
    );
});

self.addEventListener('fetch', (event) => {
    // Only handle GET requests
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);

    // For navigation requests, try network first then fallback to cache
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    return caches.open(RUNTIME).then((cache) => {
                        cache.put(event.request, response.clone());
                        return response;
                    });
                })
                .catch(() => caches.match('/')),
        );
        return;
    }

    // For same-origin resources, use cache-first strategy
    if (url.origin === location.origin) {
        event.respondWith(
            caches.match(event.request).then((cached) => {
                if (cached) return cached;
                return fetch(event.request)
                    .then((response) => {
                        return caches.open(RUNTIME).then((cache) => {
                            cache.put(event.request, response.clone());
                            return response;
                        });
                    })
                    .catch(() => {
                        // fallback to cached root for navigation or nothing
                        return caches.match('/');
                    });
            }),
        );
    }
});

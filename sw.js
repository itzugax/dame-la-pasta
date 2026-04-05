const CACHE = 'nexus-v2';
const PRECACHE = [
    '/',
    '/tv.html',
    '/admin.html',
    '/player.html',
    '/suspenso.mp3',
    '/correcto.mp3',
    '/incorrecto.mp3',
    '/canciones.json',
    'https://cdn.ably.com/lib/ably.min-1.js',
    'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@900&display=swap',
];

self.addEventListener('install', e => {
    self.skipWaiting();
    e.waitUntil(
        caches.open(CACHE).then(cache => cache.addAll(PRECACHE).catch(()=>{}))
    );
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
        ).then(() => clients.claim())
    );
});

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(cached => {
            if(cached) return cached;
            return fetch(e.request).then(res => {
                if(res.ok) {
                    const clone = res.clone();
                    caches.open(CACHE).then(c => c.put(e.request, clone));
                }
                return res;
            }).catch(() => cached);
        })
    );
});

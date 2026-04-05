const CACHE = 'nexus-v3';
const PRECACHE = [
    '/tv.html',
    '/player.html',
    '/suspenso.mp3',
    '/correcto.mp3',
    '/incorrecto.mp3',
    '/canciones.json',
    'https://cdn.ably.com/lib/ably.min-1.js',
    'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@900&display=swap',
];

// Nunca cachear el admin — siempre debe ser la versión más reciente
const NEVER_CACHE = ['/admin.html', '/sw.js'];

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
    const url = new URL(e.request.url);
    // Admin y SW siempre desde red
    if(NEVER_CACHE.some(p => url.pathname === p)) {
        e.respondWith(fetch(e.request));
        return;
    }
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

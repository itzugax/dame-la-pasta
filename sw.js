const CACHE = 'nexus-v1';

self.addEventListener('install', e => {
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    e.waitUntil(clients.claim());
});

// Cachear bajo demanda
self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
            return res;
        }))
    );
});

// Mensaje para precargar lista de archivos con progreso
self.addEventListener('message', async e => {
    if(e.type !== 'PRECACHE') return;
    const files = e.data.files;
    const cache = await caches.open(CACHE);
    let done = 0;
    for(const file of files) {
        try {
            const res = await fetch(file.archivo);
            if(res.ok) {
                await cache.put(file.archivo, res.clone());
                // Leer tamaño
                const buf = await res.clone().arrayBuffer();
                const kb = Math.round(buf.byteLength / 1024);
                done++;
                e.source.postMessage({type:'PROGRESS', nombre: file.nombre, archivo: file.archivo, kb, done, total: files.length});
            }
        } catch(err) {
            done++;
            e.source.postMessage({type:'PROGRESS', nombre: file.nombre, archivo: file.archivo, kb: 0, done, total: files.length, error: true});
        }
    }
    e.source.postMessage({type:'DONE'});
});

// Asignar nombre y versión de la caché
const CACHE_NAME = 'v1_cache_acarreos';

// Archivos en caché de la aplicación
var urlsToCache = [
    '../',
    '../css/styles.css', 
    '../assets/img/generic-avatar.png', 
    '../assets/img/icons/apple-icon.png',
    '../assets/img/icons/android-icon-36x36.png',
    '../assets/img/icons/android-icon-48x48.png',
    '../assets/img/icons/android-icon-72x72.png',
    '../assets/img/icons/android-icon-96x96.png',
    '../assets/img/icons/android-icon-144x144.png',
    '../assets/img/icons/android-icon-192x192.png'
];

// Evento Install
// Instalación del serviceWorker, y guardar en caché los recursos estáticos de la aplicación
self.addEventListener('install', e => {
    e.waitUntil(
        caches
            .open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache)
                        .then(() => {
                            self.skipWaiting();
                        })
            })
            .catch(err => {
                console.log('No se ha registrado el caché', err);
            })
    );
});

// Evento Activate
// Para que la App funcione sin conexión
self.addEventListener('activate', e => {
    const cacheWaitList = [CACHE_NAME];

    e.waitUntil(
        caches
            .keys()
            .then(cacheNames => {
                    return Promise.all(
                        cacheNames.map(cacheName => {
                            if(cacheWaitList.indexOf(cacheName) === -1) {
                                // borramos los elementos que ya no se necesitan
                                return caches.delete(cacheName);
                            }
                        })
                    );
                })
            .then(() => {
                // Activar caché
                self.clients.claim();
            })
        );
})
 
// Evento Fetch
self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request)
            .then(res => {
                if(res) {
                    // devuelvo datos desde caché
                    return res;
                } 

                return fetch(e.request);
            })
    );
});
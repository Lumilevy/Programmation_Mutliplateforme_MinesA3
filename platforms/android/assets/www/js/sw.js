importjs("https://cdn.rawgit.com/mozilla/localForage/master/dist/localforage.js");

const FILES_TO_CACHE = [
    '.',
    'www/js/app.js',
    'www/js/detailSession.js',
    'www/detailSession.html',
    'www/js/detailSpeaker.js',
    'www/detailSpeaker.html',
    'www/index.html',
    'www/js/notes.js',
    'www/notes.html',
    'www/sessions.html',
    'www/js/sessions.js',
    'www/js/speakers.js',
    'www/speakers.html',
    'www/img/devfest.jpg',
    'node_modules/materialize-css/materialize.css',
    'node_modules/materialize-css/materialize.min.css'
];

const STATIC_CACHE_NAME = 'page-cache-v2';

self.addEventListener('install', event => {
    console.log('Installation du Service Worker...');
    console.log('Mise en cache des ressources');
    event.waitUntil(
      caches.open(STATIC_CACHE_NAME)
          .then(cache => {
               return cache.addAll(FILES_TO_CACHE);
            })
      );
});

self.addEventListener('activate', event => {
      console.log('Activating new service worker...');
      const cacheWhitelist = [STATIC_CACHE_NAME];
      // suppression des caches excepté le cache courant (STATIC_CACHE_NAME)
      event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
            cacheNames.map(cacheName => {
                if (cacheWhitelist.indexOf(cacheName) < 0) {
                    return caches.delete(cacheName);
                 }
            })
        );
      })
      );
    });

self.skipWaiting();

self.addEventListener('fetch', event => {
    console.log('Fetching: ', event.request.url);

    event.respondWith(
        caches.match(event.request).then(response => {
            if(response) {
                console.log(event.request.url, 'servi depuis le cache');
                return response;
            }
            console.log(event.request.url, 'servi depuis le réseau');
            return fetch(event.request);
        })

        .then(function(response){
            return caches.open(STATIC_CACHE_NAME).then(cache => {
                if(event.request.url.indexOf('.json') < 0) {
                    cache.put(event.request.url, response.clone());
                }
                return response;
            });
        })
        
        .catch(error => {
            console.log('oops');
        })
    )
});

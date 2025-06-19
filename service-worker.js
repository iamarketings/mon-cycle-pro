const CACHE_NAME = 'mon-cycle-pro-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/app.js',
  '/manifest.json',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png'
];

// Installation du Service Worker
self.addEventListener('install', function(event) {
  console.log('🔧 Service Worker: Installation');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('📦 Cache ouvert');
        return cache.addAll(urlsToCache.map(url => {
          return new Request(url, { credentials: 'same-origin' });
        }));
      })
      .catch(function(error) {
        console.error('❌ Erreur lors de la mise en cache:', error);
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', function(event) {
  console.log('✅ Service Worker: Activation');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interception des requêtes réseau
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - retourner la réponse du cache
        if (response) {
          console.log('📱 Réponse depuis le cache:', event.request.url);
          return response;
        }

        // Clone de la requête car elle ne peut être utilisée qu'une fois
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function(response) {
            // Vérifier si la réponse est valide
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone de la réponse car elle ne peut être utilisée qu'une fois
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                // Mise en cache de la nouvelle réponse
                if (event.request.method === 'GET') {
                  cache.put(event.request, responseToCache);
                }
              });

            return response;
          }
        ).catch(function() {
          // En cas d'erreur réseau, retourner la page hors ligne si disponible
          if (event.request.destination === 'document') {
            return caches.match('/');
          }
        });
      })
  );
});

// Synchronisation en arrière-plan
self.addEventListener('sync', function(event) {
  console.log('🔄 Synchronisation en arrière-plan:', event.tag);
  
  if (event.tag === 'sync-cycle-data') {
    event.waitUntil(syncCycleData());
  }
});

// Fonction de synchronisation des données
async function syncCycleData() {
  try {
    // Ici on pourrait synchroniser avec un serveur
    console.log('💾 Synchronisation des données de cycle');
    
    // Pour l'instant, on ne fait que du stockage local
    // Dans une version future, on pourrait ajouter la sync avec le cloud
    
    return Promise.resolve();
  } catch (error) {
    console.error('❌ Erreur lors de la synchronisation:', error);
    throw error;
  }
}

// Messages du client vers le Service Worker
self.addEventListener('message', function(event) {
  console.log('📨 Message reçu:', event.data);
  
  switch (event.data.action) {
    case 'skipWaiting':
      self.skipWaiting();
      break;
    case 'getCacheSize':
      getCacheSize().then(size => {
        event.ports[0].postMessage({ cacheSize: size });
      });
      break;
    case 'clearCache':
      clearCache().then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;
  }
});

// Obtenir la taille du cache
async function getCacheSize() {
  const cache = await caches.open(CACHE_NAME);
  const keys = await cache.keys();
  let totalSize = 0;
  
  for (const key of keys) {
    const response = await cache.match(key);
    if (response) {
      const blob = await response.blob();
      totalSize += blob.size;
    }
  }
  
  return totalSize;
}

// Vider le cache
async function clearCache() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
}

// Notification push (pour les futures fonctionnalités)
self.addEventListener('push', function(event) {
  console.log('🔔 Notification push reçue');
  
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'Rappel de cycle menstruel',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: data,
      actions: [
        {
          action: 'view',
          title: 'Voir détails',
          icon: '/icons/icon-72x72.png'
        },
        {
          action: 'dismiss',
          title: 'Ignorer',
          icon: '/icons/icon-72x72.png'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'Mon Cycle Pro', options)
    );
  }
});

// Clic sur notification
self.addEventListener('notificationclick', function(event) {
  console.log('🔔 Clic sur notification:', event.action);
  
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Gestion des erreurs
self.addEventListener('error', function(event) {
  console.error('❌ Erreur Service Worker:', event.error);
});

// Gestion des erreurs de promesses non gérées
self.addEventListener('unhandledrejection', function(event) {
  console.error('❌ Promesse rejetée non gérée:', event.reason);
  event.preventDefault();
});

console.log('🚀 Service Worker chargé et prêt!');
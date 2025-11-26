const CACHE_NAME = 'costant-v1';
const STATIC_CACHE_NAME = 'costant-static-v1';
const DATA_CACHE_NAME = 'costant-data-v1';

// URLs to cache on install
const STATIC_URLS = [
  '/',
  '/projects',
  '/reports',
  '/offline',
  '/manifest.json',
  '/_next/static/css/app/layout.css',
  '/_next/static/chunks/webpack.js',
  '/_next/static/chunks/main-app.js',
  '/_next/static/chunks/app/_not-found.js',
];

// API endpoints to cache
const API_CACHE_URLS = [
  '/api/projects',
  '/api/projects?limit=50',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');

  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME &&
                cacheName !== DATA_CACHE_NAME &&
                cacheName !== CACHE_NAME) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests (except our API)
  if (!url.origin.includes(self.location.origin) &&
      !url.pathname.includes('/api/')) {
    return;
  }

  // Handle API requests
  if (url.pathname.includes('/api/')) {
    event.respondWith(handleApiRequest(request));
  }
  // Handle static requests
  else {
    event.respondWith(handleStaticRequest(request));
  }
});

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  const url = new URL(request.url);

  try {
    // Try network first
    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DATA_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Network failed, trying cache for:', request.url);

    // Fallback to cache
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // For specific API endpoints, return mock data
    if (url.pathname.includes('/api/projects')) {
      return new Response(JSON.stringify({
        projetos: getMockProjects(),
        total: 15,
        page: 1,
        limit: 20,
        totalPages: 1,
        fromCache: false,
        dataSource: 'Dados Mock (Offline)'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline');
    }

    // Return error response
    return new Response('Offline - sem conexão à rede', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Handle static requests with cache-first strategy
async function handleStaticRequest(request) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Static request failed:', request.url);

    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline');
    }

    // Return error response
    return new Response('Recurso não disponível offline', {
      status: 404,
      statusText: 'Not Found Offline'
    });
  }
}

// Mock projects data for offline fallback
function getMockProjects() {
  return [
    {
      id: 'mock-offline-1',
      nome: 'Reabilitação da Estrada Nacional EN1',
      provincia: 'Maputo',
      setor: 'Estradas',
      valor: '2.5B MZN',
      estado: 'Em Andamento',
      progresso: 65,
      atraso: 15,
      relatos: 3,
      dataContrato: '15/06/2023',
      contratante: 'Ministério das Obras Públicas',
      contratado: 'China Road and Bridge Corporation',
      metodoProcurement: 'International Competitive Bidding'
    },
    {
      id: 'mock-offline-2',
      nome: 'Construção de Escola Primária - Chicualacuala',
      provincia: 'Gaza',
      setor: 'Escolas',
      valor: '15M MZN',
      estado: 'Concluído',
      progresso: 100,
      atraso: 0,
      relatos: 1,
      dataContrato: '20/03/2023',
      contratante: 'Ministério da Educação',
      contratado: 'Mozambique Construction Ltd',
      metodoProcurement: 'National Competitive Bidding'
    },
    {
      id: 'mock-offline-3',
      nome: 'Reabilitação do Hospital Central da Beira',
      provincia: 'Sofala',
      setor: 'Hospitais',
      valor: '450M MZN',
      estado: 'Em Andamento',
      progresso: 45,
      atraso: 30,
      relatos: 7,
      dataContrato: '10/09/2023',
      contratante: 'Ministério da Saúde',
      contratado: 'Consórcio Saúde Mozambique',
      metodoProcurement: 'International Competitive Bidding'
    }
  ];
}

// Message event - handle communication from app
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;

  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;

    case 'GET_VERSION':
      event.ports[0].postMessage({ version: CACHE_NAME });
      break;

    case 'SYNC_DATA':
      // Trigger background sync
      self.registration.sync.register('sync-data');
      break;

    default:
      console.log('Service Worker: Unknown message type:', type);
  }
});

// Background sync event
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync', event.tag);

  if (event.tag === 'sync-data') {
    event.waitUntil(syncOfflineData());
  }
});

// Sync offline data when back online
async function syncOfflineData() {
  try {
    // Get all cached reports from IndexedDB
    const offlineReports = await getOfflineReports();

    // Sync each report
    for (const report of offlineReports) {
      try {
        const response = await fetch('/api/reports', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(report),
        });

        if (response.ok) {
          // Remove from offline storage
          await removeOfflineReport(report.id);
          console.log('Service Worker: Synced report:', report.id);
        }
      } catch (error) {
        console.error('Service Worker: Failed to sync report:', report.id, error);
      }
    }

    // Notify all clients about sync completion
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_COMPLETE',
        payload: { synced: offlineReports.length }
      });
    });

  } catch (error) {
    console.error('Service Worker: Background sync failed:', error);
  }
}

// IndexedDB helpers for offline reports
async function getOfflineReports() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('costant-offline', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['reports'], 'readonly');
      const store = transaction.objectStore('reports');
      const getAllRequest = store.getAll();

      getAllRequest.onsuccess = () => resolve(getAllRequest.result || []);
      getAllRequest.onerror = () => reject(getAllRequest.error);
    };

    request.onupgradeneeded = () => {
      const db = request.result;
      db.createObjectStore('reports', { keyPath: 'id' });
    };
  });
}

async function removeOfflineReport(reportId) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('costant-offline', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['reports'], 'readwrite');
      const store = transaction.objectStore('reports');
      const deleteRequest = store.delete(reportId);

      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
    };
  });
}

// Push notification event (future feature)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/icons/icon-192.png',
    badge: '/icons/badge-72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver Detalhes',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/icons/xmark.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Costant', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('Service Worker: Loaded successfully');
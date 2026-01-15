// Service Worker para ALFREDO
// Versão do cache
const CACHE_NAME = 'alfredo-v2';
const RUNTIME_CACHE = 'alfredo-runtime-v2';

// Arquivos essenciais para cachear
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/lovable-uploads/d58baa4c-1273-42fb-83d0-950387ad313b.png',
  '/manifest.json'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Cacheando arquivos estáticos');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Ativando...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE;
          })
          .map((cacheName) => {
            console.log('[Service Worker] Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
    .then(() => self.clients.claim())
  );
});

// Interceptação de requisições
self.addEventListener('fetch', (event) => {
  // Ignorar TODAS as requisições para APIs externas (Supabase, etc) - incluindo POST, PUT, DELETE
  if (event.request.url.includes('supabase.co') || 
      event.request.url.includes('exchangerate-api.com') ||
      event.request.url.includes('n8n') ||
      event.request.url.includes('api.')) {
    return; // Deixa a requisição passar sem interceptação
  }

  // Ignorar requisições que não são GET
  if (event.request.method !== 'GET') {
    return;
  }

  // Para navegação, usar network-first para evitar página antiga
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseToCache = response.clone();
          caches.open(RUNTIME_CACHE)
            .then((cache) => {
              cache.put('/index.html', responseToCache);
            });
          return response;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Se encontrou no cache, retorna
        if (cachedResponse) {
          return cachedResponse;
        }

        // Se não encontrou, busca na rede
        return fetch(event.request)
          .then((response) => {
            // Não cachear se não for uma resposta válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clonar a resposta para cachear
            const responseToCache = response.clone();

            // Cachear na runtime cache
            caches.open(RUNTIME_CACHE)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Se falhar e for uma navegação, retornar a página inicial
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
          });
      })
  );
});

// Notificações push (opcional - para implementação futura)
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push recebido:', event);
  // Implementar notificações push no futuro
});

// Sincronização em background (opcional)
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Sincronização em background:', event.tag);
  // Implementar sincronização em background no futuro
});


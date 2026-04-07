/**
 * 精密仪器公司官网 - Service Worker
 * 提供离线缓存、资源预缓存、后台同步等功能
 */

const CACHE_NAME = 'precision-instruments-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const IMAGE_CACHE = 'images-v1';

// 预缓存的核心资源
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/products.html',
  '/css/variables.css',
  '/css/base.css',
  '/css/components.css',
  '/css/responsive.css',
  '/css/touch.css',
  '/js/main.js',
  '/js/theme.js',
  '/js/mobile-nav.js',
  '/js/touch.js',
  '/js/mobile-perf.js',
  '/assets/images/logo.svg',
  '/assets/images/hero-bg.webp',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-512x512.png',
  '/manifest.json'
];

// 缓存策略配置
const CACHE_STRATEGIES = {
  // 静态资源 - 缓存优先
  static: {
    pattern: /\.(css|js|woff2?|ttf|otf)$/,
    strategy: 'cache-first'
  },
  // 图片资源 - 缓存优先，带过期
  images: {
    pattern: /\.(png|jpg|jpeg|gif|webp|svg|ico)$/,
    strategy: 'cache-first',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30天
  },
  // API请求 - 网络优先
  api: {
    pattern: /\/api\//,
    strategy: 'network-first'
  },
  // HTML页面 - 网络优先
  pages: {
    pattern: /\.html$/,
    strategy: 'network-first'
  }
};

/**
 * 安装事件 - 预缓存核心资源
 */
self.addEventListener('install', (event) => {
  console.log('[Service Worker] 安装中...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[Service Worker] 预缓存核心资源');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] 预缓存完成');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[Service Worker] 预缓存失败:', error);
      })
  );
});

/**
 * 激活事件 - 清理旧缓存
 */
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] 激活中...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // 删除不在白名单中的旧缓存
            if (![STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE].includes(cacheName)) {
              console.log('[Service Worker] 删除旧缓存:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[Service Worker] 激活完成');
        return self.clients.claim();
      })
  );
});

/**
 * 获取缓存策略
 */
function getCacheStrategy(url) {
  const urlString = url.toString();
  
  for (const [name, config] of Object.entries(CACHE_STRATEGIES)) {
    if (config.pattern.test(urlString)) {
      return { name, ...config };
    }
  }
  
  // 默认策略
  return { name: 'default', strategy: 'network-first' };
}

/**
 * 缓存优先策略
 */
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  if (cached) {
    // 后台更新缓存
    fetch(request)
      .then((response) => {
        if (response.ok) {
          cache.put(request, response.clone());
        }
      })
      .catch(() => {});
    
    return cached;
  }
  
  // 缓存未命中，从网络获取
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // 网络失败，返回离线页面
    return caches.match('/offline.html');
  }
}

/**
 * 网络优先策略
 */
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // 更新缓存
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('网络响应无效');
  } catch (error) {
    // 网络失败，尝试从缓存获取
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    // 缓存也未命中
    throw error;
  }
}

/**
 * 仅网络策略
 */
async function networkOnly(request) {
  return fetch(request);
}

/**
 * 仅缓存策略
 */
async function cacheOnly(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }
  
  throw new Error('缓存未命中');
}

/**
 * 陈旧时重新验证策略
 */
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  // 后台更新
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached);
  
  // 立即返回缓存（如果有）
  if (cached) {
    fetchPromise;
    return cached;
  }
  
  // 无缓存，等待网络
  return fetchPromise;
}

/**
 * 获取请求
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // 跳过非 GET 请求
  if (request.method !== 'GET') {
    return;
  }
  
  // 跳过跨域请求
  if (url.origin !== self.location.origin) {
    return;
  }
  
  // 获取缓存策略
  const strategy = getCacheStrategy(url);
  
  // 确定使用哪个缓存
  let cacheName = DYNAMIC_CACHE;
  if (strategy.name === 'static') cacheName = STATIC_CACHE;
  if (strategy.name === 'images') cacheName = IMAGE_CACHE;
  
  // 应用缓存策略
  event.respondWith(
    (async () => {
      try {
        switch (strategy.strategy) {
          case 'cache-first':
            return await cacheFirst(request, cacheName);
          case 'network-first':
            return await networkFirst(request, cacheName);
          case 'stale-while-revalidate':
            return await staleWhileRevalidate(request, cacheName);
          case 'cache-only':
            return await cacheOnly(request, cacheName);
          case 'network-only':
          default:
            return await networkOnly(request);
        }
      } catch (error) {
        console.error('[Service Worker] 请求失败:', error);
        
        // 返回离线页面
        if (request.headers.get('accept')?.includes('text/html')) {
          return caches.match('/offline.html');
        }
        
        throw error;
      }
    })()
  );
});

/**
 * 后台同步事件
 */
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] 后台同步:', event.tag);
  
  if (event.tag === 'sync-forms') {
    event.waitUntil(syncFormSubmissions());
  }
});

/**
 * 同步表单提交
 */
async function syncFormSubmissions() {
  // 从 IndexedDB 获取待同步的表单数据
  // 这里需要配合 IndexedDB 使用
  console.log('[Service Worker] 同步表单提交');
}

/**
 * 推送事件
 */
self.addEventListener('push', (event) => {
  console.log('[Service Worker] 推送消息:', event);
  
  const options = {
    body: event.data?.text() || '新消息',
    icon: '/assets/icons/icon-192x192.png',
    badge: '/assets/icons/badge-72x72.png',
    tag: 'notification',
    requireInteraction: false,
    actions: [
      {
        action: 'open',
        title: '打开'
      },
      {
        action: 'close',
        title: '关闭'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('精密仪器', options)
  );
});

/**
 * 通知点击事件
 */
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] 通知点击:', event);
  
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

/**
 * 消息事件 - 与页面通信
 */
self.addEventListener('message', (event) => {
  console.log('[Service Worker] 收到消息:', event.data);
  
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
  
  if (event.data === 'getVersion') {
    event.ports[0].postMessage({
      version: CACHE_NAME,
      cacheNames: [STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE]
    });
  }
  
  if (event.data.type === 'clearCache') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all
// Service Worker for offline functionality
const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `personal-blog-${CACHE_VERSION}`;

// 需要缓存的核心资源
const CORE_ASSETS = [
    '/',
    '/index.html',
    '/blog.html',
    '/about.html',
    '/styles/main.css',
    '/scripts/main.js',
    '/scripts/search.js',
    '/scripts/theme.js',
    '/search-index.json'
];

// 安装Service Worker
self.addEventListener('install', (event) => {
    console.log('[SW] 安装中...');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] 缓存核心资源');
                return cache.addAll(CORE_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// 激活Service Worker
self.addEventListener('activate', (event) => {
    console.log('[SW] 激活中...');

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((name) => name !== CACHE_NAME)
                        .map((name) => {
                            console.log('[SW] 删除旧缓存:', name);
                            return caches.delete(name);
                        })
                );
            })
            .then(() => self.clients.claim())
    );
});

// 拦截请求
self.addEventListener('fetch', (event) => {
    const { request } = event;

    // 跳过非GET请求
    if (request.method !== 'GET') {
        return;
    }

    // 跳过外部请求
    if (!request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    // 命中缓存，同时在后台更新
                    fetchAndCache(request);
                    return cachedResponse;
                }

                // 未命中缓存，从网络获取
                return fetchAndCache(request);
            })
            .catch(() => {
                // 网络失败，返回离线页面
                if (request.destination === 'document') {
                    return caches.match('/index.html');
                }
            })
    );
});

// 获取并缓存
function fetchAndCache(request) {
    return fetch(request)
        .then((response) => {
            // 只缓存成功的响应
            if (!response || response.status !== 200 || response.type === 'error') {
                return response;
            }

            // 克隆响应（响应只能读一次）
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
                .then((cache) => {
                    cache.put(request, responseToCache);
                });

            return response;
        });
}

// 监听消息
self.addEventListener('message', (event) => {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }

    if (event.data.action === 'clearCache') {
        caches.keys().then((cacheNames) => {
            cacheNames.forEach((name) => caches.delete(name));
        });
    }
});

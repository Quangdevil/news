'use strict';

const cachePrefix = 'quang-duren-news-';
const cacheName = cachePrefix + 'v1';
const scope = self.registration.scope;
const shell = [
  './', 'charts.html', 'news.css', 'charts.css', 'news.js', 'charts.js',
  'pwa.js', 'manifest.webmanifest', 'favicon.svg',
  'icon-180.png', 'icon-192.png', 'icon-512.png'
];
const resources = new Set([...shell, 'news.json', 'trade.json', 'market-data.json']
  .map(path => new URL(path, scope).href));

self.addEventListener('install', event => {
  event.waitUntil(caches.open(cacheName).then(cache =>
    cache.addAll(shell.map(path => new Request(new URL(path, scope), { cache: 'reload' })))
  ));
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith(cachePrefix) && key !== cacheName)
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  url.search = '';
  const key = url.href === new URL('index.html', scope).href ? scope : url.href;
  if (!resources.has(key)) return;

  event.respondWith((async () => {
    const cache = await caches.open(cacheName);
    try {
      const response = await fetch(event.request);
      if (response.ok) {
        await cache.put(key, response.clone()).catch(() => {});
      } else if (response.status >= 500) {
        return (await cache.match(key)) || response;
      }
      return response;
    } catch {
      return (await cache.match(key)) || new Response('Chưa có dữ liệu ngoại tuyến.', {
        status: 503,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }
  })());
});

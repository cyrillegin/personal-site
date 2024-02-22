self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('cyrillegindreau').then(cache => {
      return cache.addAll(['/', '/index.html', '/models/wood_texture.webp']);
    }),
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    }),
  );
});

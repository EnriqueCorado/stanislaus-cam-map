// The help pages moved to /community-camera-map/. This replaces the old
// offline worker: it removes copies saved under the old address, then
// unregisters itself and reloads open pages (which then redirect).
self.addEventListener("install", function () {
  self.skipWaiting();
});
self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches
      .keys()
      .then(function (names) {
        return Promise.all(
          names.map(function (name) {
            return caches.open(name).then(function (cache) {
              return cache.keys().then(function (reqs) {
                return Promise.all(
                  reqs
                    .filter(function (r) {
                      return r.url.indexOf("/stanislaus-cam-map/") >= 0;
                    })
                    .map(function (r) {
                      return cache.delete(r);
                    }),
                );
              });
            });
          }),
        );
      })
      .then(function () {
        return self.registration.unregister();
      })
      .then(function () {
        return self.clients.matchAll({ type: "window" });
      })
      .then(function (clients) {
        clients.forEach(function (client) {
          client.navigate(client.url);
        });
      }),
  );
});

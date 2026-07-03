const CACHE_NAME = "periodos-tareas-v1";
const APP_SHELL = [
  "/",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => caches.delete(cacheName)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const networkResponse = fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const responseClone = response.clone();
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(event.request, responseClone));
          }
          return response;
        })
        .catch(() => cachedResponse);

      return cachedResponse || networkResponse;
    }),
  );
});

self.addEventListener("push", (event) => {
  const fallbackNotification = {
    title: "Periodos & Tareas",
    options: {
      body: "Tienes una nueva notificación.",
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      data: { url: "/" },
    },
  };

  let notification = fallbackNotification;
  if (event.data) {
    try {
      const payload = event.data.json();
      notification = {
        title: payload.title || fallbackNotification.title,
        options: {
          ...fallbackNotification.options,
          ...payload.options,
          body:
            payload.body ||
            payload.options?.body ||
            fallbackNotification.options.body,
          data: { url: payload.url || payload.options?.data?.url || "/" },
        },
      };
    } catch (_error) {
      notification = {
        ...fallbackNotification,
        options: {
          ...fallbackNotification.options,
          body: event.data.text(),
        },
      };
    }
  }

  event.waitUntil(
    self.registration.showNotification(
      notification.title,
      notification.options,
    ),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clients) => {
        const appClient = clients.find((client) =>
          client.url.startsWith(self.location.origin),
        );
        if (appClient) {
          appClient.navigate(targetUrl);
          return appClient.focus();
        }

        return self.clients.openWindow(targetUrl);
      }),
  );
});

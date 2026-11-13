// Service worker de Sue (version web installable). Volontairement minimal : aucune mise en cache,
// tout passe par le réseau, pour que le site et l'espace web soient toujours à jour.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {});

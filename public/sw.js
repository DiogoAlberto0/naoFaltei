self.addEventListener("install", (event) => {
  console.log("Service Worker instalado");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker ativado");
});

self.addEventListener("fetch", (event) => {
  // Cache simples: só deixa passar o fetch padrão
  event.respondWith(fetch(event.request));
});

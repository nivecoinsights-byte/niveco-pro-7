const CACHE="niveco-pro-7-3.2-shell";
const ASSETS=[
  "./",
  "./index.html",
  "./styles.css?v=7.3.2",
  "./app.js?v=7.3.2",
  "./manifest.webmanifest",
  "./assets/icons/niveco-icon-192.png",
  "./assets/icons/niveco-icon-512.png",
  "./assets/icons/niveco-eye-transparent.png"
];

self.addEventListener("install",event=>{
  event.waitUntil(
    caches.open(CACHE)
      .then(cache=>cache.addAll(ASSETS))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener("activate",event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET")return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin)return;

  event.respondWith(
    fetch(event.request,{cache:"no-store"})
      .then(response=>{
        const copy=response.clone();
        caches.open(CACHE).then(cache=>cache.put(event.request,copy));
        return response;
      })
      .catch(()=>caches.match(event.request).then(response=>response||caches.match("./index.html")))
  );
});
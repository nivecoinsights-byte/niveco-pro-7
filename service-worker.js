const CACHE="niveco-pro-7-3.4-firebase-auth";
const APPROVED_EYE="/niveco-eye-transparent.png?v=20260808b";
const AUTH_BRIDGE="/firebase-auth.js?v=20260817";
const ASSETS=[
  "/",
  "/index.html",
  "/styles.css?v=7.3.2",
  "/app.js?v=7.3.2",
  "/config.js?v=7.3",
  AUTH_BRIDGE,
  "/manifest.webmanifest",
  "/niveco-icon-192.png",
  "/niveco-icon-512.png",
  APPROVED_EYE
];

self.addEventListener("install",event=>{
  event.waitUntil(
    caches.open(CACHE)
      .then(cache=>Promise.allSettled(ASSETS.map(url=>cache.add(url))))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener("activate",event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)));
    await self.clients.claim();
    const clientsList=await self.clients.matchAll({type:"window",includeUncontrolled:true});
    for(const client of clientsList){
      try{await client.navigate(client.url)}catch(_){ }
    }
  })());
});

function patchHtml(html){
  let patched=html
    .replaceAll('assets/icons/niveco-eye-transparent.png',APPROVED_EYE)
    .replaceAll('/assets/icons/niveco-eye-transparent.png',APPROVED_EYE);

  const authScript=`<script src="${AUTH_BRIDGE}" defer></script>`;
  if(!patched.includes(AUTH_BRIDGE)){
    if(patched.includes('</body>')) patched=patched.replace('</body>',authScript+'</body>');
    else patched+=authScript;
  }

  const failsafe=`<script>(function(){var done=false;function openApp(){if(done)return;done=true;var s=document.getElementById('splashScreen');if(s){s.classList.add('hide');setTimeout(function(){if(s&&s.parentNode)s.parentNode.removeChild(s)},450)}}window.addEventListener('error',function(){setTimeout(openApp,50)},{once:true});window.addEventListener('unhandledrejection',function(){setTimeout(openApp,50)},{once:true});document.addEventListener('DOMContentLoaded',function(){setTimeout(openApp,1400)});setTimeout(openApp,2600)})();</script>`;

  if(patched.includes('</body>')) patched=patched.replace('</body>',failsafe+'</body>');
  else patched+=failsafe;
  return patched;
}

self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET")return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin)return;

  if(event.request.mode==="navigate"){
    event.respondWith((async()=>{
      try{
        const response=await fetch(event.request,{cache:"no-store"});
        const type=response.headers.get("content-type")||"";
        if(!response.ok||!type.includes("text/html"))return response;
        const html=patchHtml(await response.text());
        return new Response(html,{status:response.status,statusText:response.statusText,headers:{"Content-Type":"text/html; charset=utf-8","Cache-Control":"no-store, max-age=0"}});
      }catch(_){
        const cached=await caches.match("/index.html");
        if(!cached)return new Response("Offline",{status:503});
        return new Response(patchHtml(await cached.text()),{headers:{"Content-Type":"text/html; charset=utf-8","Cache-Control":"no-store, max-age=0"}});
      }
    })());
    return;
  }

  event.respondWith(
    fetch(event.request,{cache:"no-store"})
      .then(response=>{
        if(response.ok){
          const copy=response.clone();
          caches.open(CACHE).then(cache=>cache.put(event.request,copy)).catch(()=>{});
        }
        return response;
      })
      .catch(()=>caches.match(event.request))
  );
});
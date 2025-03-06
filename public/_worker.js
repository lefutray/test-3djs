// Archivo worker para Cloudflare Pages
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // Si la ruta no tiene extensión, servir index.html para manejar rutas de React
  if (!url.pathname.includes('.')) {
    return fetch(`${url.origin}/index.html`)
  }
  
  // De lo contrario, servir el archivo solicitado
  return fetch(request)
}

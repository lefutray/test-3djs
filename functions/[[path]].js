export async function onRequest({ request }) {
  const url = new URL(request.url);
  
  // Redirigir todas las solicitudes a index.html para que React Router pueda manejarlas
  return fetch(new URL('/index.html', url.origin));
}

export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  
  // Si la URL no tiene una extensión de archivo, asumimos que es una ruta de React
  // y redirigimos a index.html
  if (!url.pathname.includes('.') && !url.pathname.startsWith('/api')) {
    return fetch(new URL('/index.html', url.origin));
  }
  
  // De lo contrario, continuamos con la solicitud normal
  return next();
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Si la URL no tiene una extensión de archivo, asumimos que es una ruta de React
    // y redirigimos a index.html
    if (!url.pathname.includes('.')) {
      const indexUrl = new URL('/index.html', url);
      return fetch(new Request(indexUrl, request));
    }
    
    // De lo contrario, servimos el archivo solicitado
    return fetch(request);
  }
};

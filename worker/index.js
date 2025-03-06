// Worker para servir una aplicación React
import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

/**
 * Maneja todas las solicitudes a través del worker
 * @param {Request} request
 * @param {Object} env
 * @param {Object} ctx
 */
async function handleRequest(request, env, ctx) {
  const url = new URL(request.url);
  
  try {
    // Intenta obtener el activo estático de KV
    const page = await getAssetFromKV({
      request,
      waitUntil: ctx.waitUntil.bind(ctx),
    });
    
    // Devuelve el activo si se encuentra
    return page;
  } catch (e) {
    // Si la ruta no coincide con un activo estático, sirve index.html para manejar rutas de React
    if (!url.pathname.includes('.')) {
      // Modifica la URL para apuntar a index.html
      const indexRequest = new Request(`${url.origin}/index.html`, request);
      
      try {
        // Intenta obtener index.html
        const page = await getAssetFromKV({
          request: indexRequest,
          waitUntil: ctx.waitUntil.bind(ctx),
        });
        
        return page;
      } catch (e) {
        // Si index.html no se encuentra, devuelve un error 404
        return new Response('Página no encontrada', { status: 404 });
      }
    }
    
    // Para otros errores, devuelve un error 404
    return new Response('Recurso no encontrado', { status: 404 });
  }
}

// Registra el event listener para el evento fetch
export default {
  async fetch(request, env, ctx) {
    return handleRequest(request, env, ctx);
  }
};

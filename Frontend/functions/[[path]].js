export async function onRequest(context) {
  const url = new URL(context.request.url);

  // 1. If static file, let Cloudflare handle it
  if (url.pathname === "/" || url.pathname.includes(".")) {
    return context.next();
  }

  // 2. Build API URL
  const destination = new URL(
    "/url_shortener" + url.pathname + url.search, 
    "https://api.jam06452.uk"
  );

  // 3. Proxy everything exactly as received (Method, Body, Headers)
  // 'redirect: manual' ensures the 302 redirect is passed to the browser
  const proxyRequest = new Request(destination, {
    method: context.request.method,
    headers: context.request.headers,
    body: context.request.body,
    redirect: "manual"
  });

  return fetch(proxyRequest);
}
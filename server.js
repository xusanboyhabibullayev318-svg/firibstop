// FiribStop UZ: простой статический сервер. Node.js 18+.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const PORT = Number(process.env.PORT || 8787);
const MIME = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.webmanifest':'application/manifest+json; charset=utf-8','.svg':'image/svg+xml'};
const PUBLIC = new Set(['index.html','manifest.webmanifest','icon.svg','sw.js']);
http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405, {Allow: 'GET, HEAD'}); return res.end('Method Not Allowed'); }
  let p; try { p = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); } catch (_) { res.writeHead(400); return res.end('Bad path'); }
  const name = (p === '/' ? 'index.html' : p).replace(/^\/+/, '');
  if (!PUBLIC.has(name)) { res.writeHead(404); return res.end('Not found'); }
  const file = path.join(__dirname, name);
  res.writeHead(200, {'Content-Type': MIME[path.extname(file)] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin'});
  if (req.method === 'HEAD') return res.end();
  fs.createReadStream(file).on('error', () => res.end()).pipe(res);
}).listen(PORT, () => console.log(`FiribStop UZ: http://localhost:${PORT}`));

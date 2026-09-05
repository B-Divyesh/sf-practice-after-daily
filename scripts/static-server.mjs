import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';

const root = join(process.cwd(), 'dist');
const config = JSON.parse(readFileSync(join(root, 'staticwebapp.config.json'), 'utf8'));
const rewrites = new Map((config.routes ?? [])
  .filter((route) => typeof route.route === 'string' && typeof route.rewrite === 'string')
  .map((route) => [route.route, route.rewrite]));
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json',
  '.xml': 'application/xml; charset=utf-8',
  '.png': 'image/png',
};

function safeFile(pathname) {
  const requested = pathname === '/' ? '/index.html' : pathname;
  const rewritten = rewrites.get(requested) ?? requested;
  const candidate = normalize(join(root, rewritten));
  return candidate.startsWith(`${root}/`) && existsSync(candidate) && statSync(candidate).isFile() ? candidate : null;
}

const server = createServer((request, response) => {
  const pathname = new URL(request.url ?? '/', 'http://localhost').pathname;
  const file = safeFile(pathname);
  const isNotFound = !file;
  const target = file ?? join(root, '404.html');
  const type = mimeTypes[extname(target)] ?? 'application/octet-stream';
  response.writeHead(isNotFound ? 404 : 200, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  if (request.method === 'HEAD') return response.end();
  createReadStream(target).pipe(response);
});

const port = Number(process.env.PORT ?? 4173);
server.listen(port, '127.0.0.1');
process.on('SIGTERM', () => server.close());
process.on('SIGINT', () => server.close());

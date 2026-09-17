/**
 * Assembles the deployable demo site into _site/.
 *
 *   _site/index.html      the landing page from site/
 *   _site/green/          templates/green, verbatim
 *   _site/red/            templates/red, verbatim
 *   _site/yellow/         templates/yellow, verbatim
 *
 * The themes are copied unchanged — no bundling, no rewriting — so what is
 * deployed is exactly what someone downloads from a release. Every URL in
 * the templates is relative, which is what lets the same output serve from
 * a Worker at the domain root and from GitHub Pages under /<repo>/.
 *
 *   npm run build         write _site/
 *   npm run dev           write _site/ and serve it on http://localhost:8787
 */
import { cp, rm, mkdir, readdir, readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { join, extname, normalize } from 'node:path';

const OUT = '_site';
const TEMPLATES = 'templates';
const SITE = 'site';

const themes = (await readdir(TEMPLATES, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

await cp(SITE, OUT, { recursive: true });
for (const theme of themes) {
  await cp(join(TEMPLATES, theme), join(OUT, theme), { recursive: true });
}

console.log(
  `Built ${OUT}/ with ${themes.length} theme(s): ${themes.join(', ')}`,
);

if (!process.argv.includes('--serve')) process.exit(0);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};

const port = Number(process.env.PORT) || 8787;

createServer(async (req, res) => {
  let path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (path.endsWith('/')) path += 'index.html';

  try {
    const file = join(OUT, normalize(path));
    const body = await readFile(file);
    res.writeHead(200, {
      'content-type': MIME[extname(file)] ?? 'application/octet-stream',
    });
    res.end(body);
  } catch {
    try {
      const body = await readFile(join(OUT, '404.html'));
      res.writeHead(404, { 'content-type': MIME['.html'] });
      res.end(body);
    } catch {
      res.writeHead(404, { 'content-type': 'text/plain' });
      res.end('Not found');
    }
  }
}).listen(port, () => {
  console.log(`Serving ${OUT}/ on http://localhost:${port}`);
});

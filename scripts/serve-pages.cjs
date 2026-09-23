// Static preview matching a project Pages deployment: dist is the site root.
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const root = path.resolve(__dirname, '..', 'dist');
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.json':'application/json','.woff2':'font/woff2'};

function createPagesServer(basePath = '/Ingles-Gamification/') {
  if (!/^\/(?:[A-Za-z0-9_-]+\/)*$/.test(basePath)) throw Error('Invalid base path');
  return http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      if (basePath !== '/' && url.pathname === basePath.slice(0,-1)) {
        res.writeHead(301, {Location: basePath + url.search});
        return res.end();
      }
      if (!url.pathname.startsWith(basePath)) { res.writeHead(404); return res.end('Not found'); }
      const relative = decodeURIComponent(url.pathname.slice(basePath.length)) || 'index.html';
      const file = path.resolve(root, relative);
      if (!file.startsWith(root + path.sep)) { res.writeHead(404); return res.end('Not found'); }
      const stat = await fs.stat(file);
      if (!stat.isFile()) { res.writeHead(404); return res.end('Not found'); }
      const body = await fs.readFile(file);
      res.writeHead(200, {'Content-Type':mime[path.extname(file)] || 'application/octet-stream','Cache-Control':'no-store'});
      res.end(body);
    } catch (error) {
      res.writeHead(error.code === 'ENOENT' || error.code === 'ENOTDIR' ? 404 : 400);
      res.end('Not found');
    }
  });
}

module.exports = {createPagesServer};
if (require.main === module) {
  const basePath = process.env.PAGES_BASE_PATH || '/Ingles-Gamification/';
  const port = Number(process.env.PORT || 5184);
  createPagesServer(basePath).listen(port, '127.0.0.1', () => console.log(`Pages preview: http://127.0.0.1:${port}${basePath}`));
}

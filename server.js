// Minimal Node static file server for the TripOffer site
// No external dependencies required.

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5173;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'text/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=UTF-8',
  '.md': 'text/markdown; charset=UTF-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

function send(res, status, headers, body) {
  res.writeHead(status, headers);
  if (body) res.end(body);
  else res.end();
}

function renderHtml(filePath, seen = new Set()) {
  if (seen.has(filePath)) return '';
  seen.add(filePath);
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const includeRE = /<!--\s*@include\s+([^\s]+)\s*-->/g;
    content = content.replace(includeRE, (match, incPath) => {
      const rel = incPath.replace(/"/g, '');
      const safeInc = path.normalize(rel).replace(/^([.][.][/\\])+/, '');
      const incAbs = path.join(ROOT, safeInc);
      if (!fs.existsSync(incAbs)) return `<!-- missing include ${rel} -->`;
      return renderHtml(incAbs, seen);
    });
    return content;
  } catch (e) {
    return null;
  }
}

function serveFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const type = MIME[ext] || 'application/octet-stream';
  const headers = {
    'Content-Type': type,
    'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600'
  };

  if (ext === '.html') {
    const html = renderHtml(filePath);
    if (html == null) {
      return send(res, 404, { 'Content-Type': 'text/plain; charset=UTF-8' }, '404 Not Found');
    }
    return send(res, 200, headers, html);
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      return send(res, 404, { 'Content-Type': 'text/plain; charset=UTF-8' }, '404 Not Found');
    }
    send(res, 200, headers, data);
  });
}

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  if (urlPath === '/' || urlPath === '') urlPath = '/index.html';

  // Prevent path traversal
  const safePath = path.normalize(urlPath).replace(/^([.][.][/\\])+/, '');
  const fsPath = path.join(ROOT, safePath);

  fs.stat(fsPath, (err, stat) => {
    if (!err && stat.isDirectory()) {
      const indexPath = path.join(fsPath, 'index.html');
      return serveFile(indexPath, res);
    }
    serveFile(fsPath, res);
  });
});

server.listen(PORT, () => {
  console.log(`TripOffer server running at http://localhost:${PORT}`);
});

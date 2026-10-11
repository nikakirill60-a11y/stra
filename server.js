// «Завоевание Европы» — локальный сервер игры.
// Запускает игру и открывает её в браузере.
// Работает в двух режимах:
//   1) Обычный: файлы game/ читаются с диска (npm start).
//   2) Встроенный (SEA/exe): файлы лежат в globalThis.__SEA_ASSETS__ (см. tools/build-win.mjs).
const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const EMBEDDED = globalThis.__SEA_ASSETS__ || null; // { '/index.html': {type, b64} }
const GAME_DIR = path.join(__dirname, 'game');
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8',
};

function send(res, code, type, body) {
  res.writeHead(code, {
    'Content-Type': type,
    'Cache-Control': 'no-cache',
  });
  res.end(body);
}

function serveFile(req, res) {
  let urlPath;
  try {
    urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  } catch (e) {
    send(res, 400, 'text/plain', 'Bad request'); return;
  }
  if (urlPath === '/') urlPath = '/index.html';

  if (EMBEDDED) {
    const asset = EMBEDDED[urlPath];
    if (!asset) { send(res, 404, 'text/plain', 'Not found'); return; }
    send(res, 200, asset.type, Buffer.from(asset.b64, 'base64'));
    return;
  }

  // защита от path traversal
  const rel = path.normalize(urlPath).replace(/^([/\\])+/, '').replace(/^(\.\.[/\\])+/, '');
  const file = path.join(GAME_DIR, rel);
  const gameDirResolved = path.resolve(GAME_DIR) + path.sep;
  if (!path.resolve(file).startsWith(gameDirResolved)) {
    send(res, 403, 'text/plain', 'Forbidden'); return;
  }
  fs.readFile(file, (err, data) => {
    if (err) { send(res, 404, 'text/plain', 'Not found'); return; }
    send(res, 200, MIME[path.extname(file).toLowerCase()] || 'application/octet-stream', data);
  });
}

function tryListen(port, cb) {
  const server = http.createServer(serveFile);
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && port < 7800) {
      tryListen(port + 1, cb);
    } else {
      cb(err);
    }
  });
  server.listen(port, '0.0.0.0', () => cb(null, server, port));
}

const startPort = parseInt(process.env.PORT || '7777', 10);
tryListen(startPort, (err, server, port) => {
  if (err) {
    console.error('Не удалось запустить сервер:', err.message);
    process.exit(1);
  }
  const localUrl = `http://127.0.0.1:${port}/`;
  console.log('==========================================================');
  console.log('  «Завоевание Европы» — пошаговая стратегия');
  console.log('  Игра запущена: ' + localUrl);
  console.log('  (если браузер не открылся — перейдите по ссылке вручную)');
  console.log('  Для выхода закройте это окно.');
  console.log('==========================================================');

  // Открываем браузер (ошибки игнорируем — например, без дисплея)
  let cmd;
  if (process.platform === 'win32') cmd = `start "" "${localUrl}"`;
  else if (process.platform === 'darwin') cmd = `open "${localUrl}"`;
  else cmd = `xdg-open "${localUrl}"`;
  try {
    exec(cmd, { detached: true, stdio: 'ignore' }, () => {}).unref();
  } catch (e) { /* ignore */ }
});

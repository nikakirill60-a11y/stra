// Сборка Windows .exe («Завоевание Европы») через Node.js SEA (Single Executable Application).
// Используются только официальные бинарники Node.js (пакет nodejs-wheel-binaries с PyPI)
// и утилита postject (npm). Работает под Linux/macOS/Windows.
//
// Шаги:
//   1. Скачать node.js 22.20.0 для Linux и Windows (PyPI, файлы pythonhosted.org)
//   2. Собрать один файл dist/sea-bundle.cjs (сервер + все файлы игры в base64)
//   3. Сгенерировать SEA-блоб парным Linux/Windows node той же версии
//   4. Вшить блоб в копию node.exe -> dist/EuropeStrategy.exe (настоящий Windows PE)
//
// Запуск: npm run build:win
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TMP = path.join(ROOT, '.tmp');
const DIST = path.join(ROOT, 'dist');
const NODE_VER = '22.20.0'; // версия nodejs-wheel-binaries (win + linux должны совпадать)

function sh(cmd, args, opts = {}) {
  return execFileSync(cmd, args, { stdio: 'inherit', ...opts });
}

function ensureRuntime(platform, outDir) {
  const isWin = platform === 'win_amd64';
  // в колесе: Windows — nodejs_wheel/node.exe, Linux — nodejs_wheel/bin/node
  const bin = isWin
    ? path.join(outDir, 'nodejs_wheel', 'node.exe')
    : path.join(outDir, 'nodejs_wheel', 'bin', 'node');
  if (fs.existsSync(bin)) {
    if (!isWin) fs.chmodSync(bin, 0o755);
    return bin;
  }

  console.log(`\n[1] Скачиваю Node.js ${NODE_VER} (${platform}) с PyPI...`);
  fs.mkdirSync(outDir, { recursive: true });
  const wheelDir = path.join(outDir, 'wheels');
  fs.mkdirSync(wheelDir, { recursive: true });
  sh('python3', [
    '-m', 'pip', 'download', `nodejs-wheel-binaries==${NODE_VER}`,
    '--platform', platform,
    '--python-version', '3.11',
    '--only-binary=:all:',
    '--no-deps',
    '-d', wheelDir,
  ]);
  const wheel = fs.readdirSync(wheelDir).find(f => f.endsWith('.whl'));
  if (!wheel) throw new Error('Не удалось скачать колесо nodejs-wheel-binaries');
  // распаковка zip
  sh('python3', ['-c', `
import zipfile, os, stat, shutil
z = zipfile.ZipFile(${JSON.stringify(path.join(wheelDir, wheel))})
z.extractall(${JSON.stringify(outDir)})
`]);
  if (!fs.existsSync(bin)) throw new Error('В колесе нет бинарника node: ' + bin);
  if (!isWin) fs.chmodSync(bin, 0o755);
  return bin;
}

// ---------- 1. Бинарники Node ----------
const winNode = ensureRuntime('win_amd64', path.join(TMP, 'node-win'));
const hostIsWin = process.platform === 'win32';
const linuxNode = hostIsWin
  ? winNode // на Windows блоб генерирует сам node.exe
  : ensureRuntime('manylinux2014_x86_64', path.join(TMP, 'node-linux'));

// ---------- 2. Бандл: сервер + ассеты игры ----------
console.log('\n[2] Собираю единый бандл игры (dist/sea-bundle.cjs)...');
fs.mkdirSync(DIST, { recursive: true });
const ASSET_FILES = ['index.html', 'style.css', 'game.js', 'flags.js'];
const assets = {};
for (const f of ASSET_FILES) {
  const body = fs.readFileSync(path.join(ROOT, 'game', f));
  assets['/' + f] = {
    type: f.endsWith('.html') ? 'text/html; charset=utf-8'
      : f.endsWith('.css') ? 'text/css; charset=utf-8'
      : 'text/javascript; charset=utf-8',
    b64: body.toString('base64'),
  };
}
const serverSrc = fs.readFileSync(path.join(ROOT, 'server.js'), 'utf8');
const bundle =
  '// СГЕНЕРИРОВАНО tools/build-win.mjs — сервер + встроенная игра\n' +
  "'use strict';\n" +
  'globalThis.__SEA_ASSETS__ = ' + JSON.stringify(assets) + ';\n' +
  serverSrc;
fs.writeFileSync(path.join(DIST, 'sea-bundle.cjs'), bundle);
console.log(`   ассетов: ${ASSET_FILES.length}, размер бандла: ${Math.round(bundle.length / 1024)} КБ`);

// ---------- 3. SEA-блоб ----------
console.log('\n[3] Генерирую SEA-блоб...');
const seaConfig = {
  main: path.join(DIST, 'sea-bundle.cjs'),
  output: path.join(DIST, 'sea-blob.blob'),
  disableExperimentalSEAWarning: true,
  useSnapshot: false,
  useCodeCache: false,
};
const cfgPath = path.join(DIST, 'sea-config.json');
fs.writeFileSync(cfgPath, JSON.stringify(seaConfig, null, 2));
sh(linuxNode, ['--experimental-sea-config', cfgPath]);

// ---------- 4. Вшиваем в node.exe ----------
console.log('\n[4] Вшиваю игру в node.exe -> dist/EuropeStrategy.exe ...');
const exePath = path.join(DIST, 'EuropeStrategy.exe');
fs.copyFileSync(winNode, exePath);
// postject: node_modules/postject/dist/cli.js (см. bin в его package.json)
const postjectPkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'node_modules', 'postject', 'package.json'), 'utf8'));
const postjectCli = path.join(ROOT, 'node_modules', 'postject', postjectPkg.bin.postject);
sh(process.execPath, [
  postjectCli,
  exePath,
  'NODE_SEA_BLOB',
  path.join(DIST, 'sea-blob.blob'),
  '--sentinel-fuse', 'NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2',
]);

const mb = (fs.statSync(exePath).size / 1024 / 1024).toFixed(1);
console.log('\n==========================================================');
console.log(`  Готово: dist/EuropeStrategy.exe (${mb} МБ)`);
console.log('  Это настоящий Windows-файл: запустите его на Windows,');
console.log('  он откроет игру в браузере. Интернет не требуется —');
console.log('  все флаги стран уже внутри.');
console.log('==========================================================');

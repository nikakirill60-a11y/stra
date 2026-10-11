// Смоук-тест игровой логики без браузера: подставляет заглушки DOM/canvas,
// запускает игру, размещает резервы, атакует, проверяет отсутствие ошибок.
// Запуск: node tools/smoke-test.mjs
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// ---------- заглушки ----------
const handlers = {}; // id:event -> fn
const elements = {};

const ctxStub = new Proxy({}, {
  get(t, prop) {
    if (prop === 'measureText') return () => ({ width: 40 });
    if (prop === 'createLinearGradient') return () => ({ addColorStop() {} });
    if (typeof prop === 'string') return () => {};
    return undefined;
  },
  set() { return true; },
});

function makeEl(id) {
  const el = {
    _id: id,
    classList: { add() {}, remove() {}, contains() { return false; } },
    style: {},
    dataset: {},
    innerHTML: '',
    textContent: '',
    value: '',
    disabled: false,
    width: 1000,
    height: 720,
    addEventListener(ev, fn) { handlers[id + ':' + ev] = fn; },
    getContext() { return ctxStub; },
    getBoundingClientRect() { return { left: 0, top: 0, width: 1000, height: 720 }; },
  };
  return el;
}

const sandbox = {
  console,
  performance: { now: () => Date.now() },
  requestAnimationFrame() { /* не крутим цикл */ },
  setTimeout: (fn, ms) => setTimeout(fn, Math.min(ms, 20)), // ускоряем ИИ
  clearTimeout,
  Image: class { constructor() { this.complete = true; this.naturalWidth = 4; this.naturalHeight = 3; } set src(v) {} },
  document: {
    getElementById(id) {
      if (!elements[id]) elements[id] = makeEl(id);
      return elements[id];
    },
    querySelectorAll() { return []; },
  },
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

function load(file) {
  const src = fs.readFileSync(path.join(ROOT, 'game', file), 'utf8');
  vm.runInContext(src, sandbox, { filename: file });
}

let failures = 0;
function check(cond, msg) {
  if (cond) console.log('  ✓ ' + msg);
  else { console.error('  ✗ ' + msg); failures++; }
}

console.log('Смоук-тест «Завоевание Европы»');
load('flags.js');
check(Object.keys(sandbox.FLAGS).length === 45, 'флаги: 45 стран загружены');
load('game.js');
check(true, 'game.js инициализируется без ошибок');

// меню -> старт игры
handlers['btn-start:click']();
check(true, 'новая игра стартовала (2 державы)');

const click = (x, y) => handlers['map:click']({ clientX: x, clientY: y });
const clickAllNodes = () => {
  for (let x = 90; x <= 830; x += 20) {
    for (let y = 80; y <= 680; y += 20) click(x, y);
  }
};

// размещение резервов: кликаем по всем странам (свои получат армии)
clickAllNodes();
check(true, 'размещение резервов работает');

// переводим фазу и атакуем (клики по всем узлам — логика сама разберётся с выбором)
handlers['btn-place-done:click']();
clickAllNodes();
check(true, 'клики по карте в фазе атаки не приводят к ошибкам');

// переброс и конец хода
handlers['btn-move-mode:click']();
click(95, 85); click(415, 105);
handlers['btn-move-mode:click']();
check(true, 'режим переброса работает');

handlers['btn-end-turn:click']();
// ждём ходы ИИ
await new Promise(r => setTimeout(r, 1500));
handlers['btn-end-turn:click'] && handlers['btn-end-turn:click']();
await new Promise(r => setTimeout(r, 1500));
check(true, 'ходы ИИ и смена хода без ошибок');

// правила / новая игра / рестарт
handlers['btn-rules:click']();
handlers['btn-rules-close:click']();
handlers['btn-new:click']();
handlers['btn-start:click']();
check(true, 'новая игра из меню работает');

if (failures) {
  console.error(`\nПРОВАЛ: ${failures} ошибок`);
  process.exit(1);
}
console.log('\nВсе проверки пройдены ✔');

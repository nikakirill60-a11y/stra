// Скачивает SVG-флаги стран Европы из интернета (npm-пакет flag-icons)
// и генерирует game/flags.js с флагами в виде base64 data-URI (для вшивания в exe).
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TMP = path.join(ROOT, 'flags-src');

// Страны Европы (код ISO 3166-1 alpha-2 -> название для логов)
const COUNTRIES = {
  is: 'Исландия', no: 'Норвегия', se: 'Швеция', fi: 'Финляндия', dk: 'Дания',
  ie: 'Ирландия', gb: 'Великобритания', nl: 'Нидерланды', be: 'Бельгия',
  lu: 'Люксембург', fr: 'Франция', es: 'Испания', pt: 'Португалия',
  de: 'Германия', ch: 'Швейцария', at: 'Австрия', it: 'Италия', mt: 'Мальта',
  cz: 'Чехия', pl: 'Польша', sk: 'Словакия', hu: 'Венгрия', si: 'Словения',
  hr: 'Хорватия', ba: 'Босния и Герцеговина', rs: 'Сербия', me: 'Черногория',
  xk: 'Косово', al: 'Албания', mk: 'Северная Македония', gr: 'Греция',
  bg: 'Болгария', ro: 'Румыния', md: 'Молдавия', ua: 'Украина', by: 'Беларусь',
  lt: 'Литва', lv: 'Латвия', ee: 'Эстония', ru: 'Россия', cy: 'Кипр',
  ad: 'Андорра', mc: 'Монако', sm: 'Сан-Марино', li: 'Лихтенштейн',
};

console.log('Скачиваю flag-icons с npm (интернет)...');
fs.rmSync(TMP, { recursive: true, force: true });
fs.mkdirSync(TMP, { recursive: true });

// npm pack скачивает тарбол пакета с registry.npmjs.org
const tarball = execSync('npm pack flag-icons --silent', { cwd: TMP }).toString().trim().split('\n').pop();
execSync(`tar -xzf ${JSON.stringify(tarball)}`, { cwd: TMP });
const flagsDir = path.join(TMP, 'package', 'flags', '4x3');
if (!fs.existsSync(flagsDir)) {
  console.error('Не найдена папка flags/4x3 в пакете flag-icons');
  process.exit(1);
}

const out = {};
const missing = [];
for (const [code, name] of Object.entries(COUNTRIES)) {
  const file = path.join(flagsDir, `${code}.svg`);
  if (!fs.existsSync(file)) { missing.push(`${code} (${name})`); continue; }
  const svg = fs.readFileSync(file);
  out[code] = 'data:image/svg+xml;base64,' + svg.toString('base64');
}
if (missing.length) {
  console.error('Не найдены флаги:', missing.join(', '));
  process.exit(1);
}

const outFile = path.join(ROOT, 'game', 'flags.js');
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(
  outFile,
  '// СГЕНЕРИРОВАНО автоматически (tools/download-flags.mjs). Флаги из интернета: npm-пакет flag-icons (MIT).\n' +
  'window.FLAGS = ' + JSON.stringify(out) + ';\n'
);
const kb = Math.round(fs.statSync(outFile).size / 1024);
console.log(`Готово: ${Object.keys(out).length} флагов -> game/flags.js (${kb} КБ)`);
fs.rmSync(TMP, { recursive: true, force: true });

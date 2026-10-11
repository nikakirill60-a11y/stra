// «Завоевание Европы» — пошаговая стратегия (canvas).
// 45 стран Европы с настоящими флагами (window.FLAGS, скачаны из интернета).
'use strict';
(function () {

  // ============================================================
  //  ДАННЫЕ КАРТЫ
  // ============================================================
  const TERR = [
    // Скандинавия и север
    { id: 'is', name: 'Исландия',        x: 95,  y: 85,  nb: ['no', 'gb'] },
    { id: 'no', name: 'Норвегия',        x: 415, y: 105, nb: ['is', 'se', 'fi', 'ru', 'dk', 'gb'] },
    { id: 'se', name: 'Швеция',          x: 485, y: 155, nb: ['no', 'fi', 'dk', 'ee'] },
    { id: 'fi', name: 'Финляндия',       x: 575, y: 115, nb: ['no', 'se', 'ru', 'ee'] },
    { id: 'dk', name: 'Дания',           x: 405, y: 240, nb: ['de', 'nl', 'se', 'no', 'gb'] },
    // Балтика и восток
    { id: 'ee', name: 'Эстония',         x: 618, y: 160, nb: ['fi', 'se', 'lv', 'ru'] },
    { id: 'lv', name: 'Латвия',          x: 600, y: 212, nb: ['ee', 'lt', 'by', 'ru'] },
    { id: 'lt', name: 'Литва',           x: 585, y: 262, nb: ['lv', 'by', 'pl'] },
    { id: 'by', name: 'Беларусь',        x: 672, y: 310, nb: ['lt', 'lv', 'ru', 'ua', 'pl'] },
    { id: 'ru', name: 'Россия',          x: 815, y: 175, nb: ['no', 'fi', 'ee', 'lv', 'by', 'ua'] },
    { id: 'ua', name: 'Украина',         x: 745, y: 385, nb: ['by', 'ru', 'pl', 'sk', 'hu', 'ro', 'md'] },
    { id: 'md', name: 'Молдавия',        x: 755, y: 462, nb: ['ua', 'ro'] },
    { id: 'pl', name: 'Польша',          x: 560, y: 320, nb: ['cz', 'sk', 'ua', 'by', 'lt', 'de'] },
    { id: 'cz', name: 'Чехия',           x: 470, y: 352, nb: ['sk', 'pl', 'de', 'at'] },
    { id: 'sk', name: 'Словакия',        x: 535, y: 375, nb: ['hu', 'ua', 'pl', 'cz', 'at'] },
    // Запад
    { id: 'de', name: 'Германия',        x: 428, y: 305, nb: ['pl', 'cz', 'at', 'ch', 'lu', 'be', 'nl', 'dk'] },
    { id: 'nl', name: 'Нидерланды',      x: 338, y: 295, nb: ['be', 'de', 'dk', 'gb'] },
    { id: 'be', name: 'Бельгия',         x: 305, y: 338, nb: ['nl', 'de', 'lu', 'fr', 'gb'] },
    { id: 'lu', name: 'Люксембург',      x: 352, y: 362, nb: ['be', 'de', 'fr'] },
    { id: 'fr', name: 'Франция',         x: 295, y: 412, nb: ['ch', 'it', 'mc', 'ad', 'es', 'be', 'lu', 'gb'] },
    { id: 'gb', name: 'Великобритания',  x: 235, y: 262, nb: ['ie', 'fr', 'be', 'nl', 'dk', 'no', 'is'] },
    { id: 'ie', name: 'Ирландия',        x: 155, y: 285, nb: ['gb'] },
    { id: 'ch', name: 'Швейцария',       x: 382, y: 405, nb: ['de', 'at', 'li', 'it', 'fr'] },
    { id: 'at', name: 'Австрия',         x: 472, y: 415, nb: ['de', 'cz', 'sk', 'hu', 'si', 'it', 'ch', 'li'] },
    // Юг и Средиземноморье
    { id: 'es', name: 'Испания',         x: 235, y: 545, nb: ['ad', 'fr', 'pt'] },
    { id: 'pt', name: 'Португалия',      x: 155, y: 560, nb: ['es'] },
    { id: 'ad', name: 'Андорра',         x: 272, y: 505, nb: ['fr', 'es'] },
    { id: 'li', name: 'Лихтенштейн',     x: 425, y: 425, nb: ['ch', 'at'] },
    { id: 'mc', name: 'Монако',          x: 360, y: 470, nb: ['fr', 'it'] },
    { id: 'it', name: 'Италия',          x: 445, y: 530, nb: ['si', 'at', 'ch', 'fr', 'mc', 'sm', 'mt', 'gr'] },
    { id: 'sm', name: 'Сан-Марино',      x: 508, y: 575, nb: ['it'] },
    { id: 'mt', name: 'Мальта',          x: 500, y: 665, nb: ['it', 'gr'] },
    { id: 'cy', name: 'Кипр',            x: 785, y: 640, nb: ['gr'] },
    // Балканы и центр
    { id: 'hu', name: 'Венгрия',         x: 555, y: 430, nb: ['si', 'hr', 'rs', 'ro', 'ua', 'sk', 'at'] },
    { id: 'si', name: 'Словения',        x: 452, y: 462, nb: ['hr', 'hu', 'at', 'it'] },
    { id: 'hr', name: 'Хорватия',        x: 500, y: 488, nb: ['ba', 'rs', 'hu', 'si'] },
    { id: 'ba', name: 'Босния и Герцеговина', x: 530, y: 530, nb: ['me', 'rs', 'hr'] },
    { id: 'rs', name: 'Сербия',          x: 585, y: 490, nb: ['me', 'xk', 'mk', 'bg', 'ro', 'hu', 'ba', 'hr'] },
    { id: 'me', name: 'Черногория',      x: 538, y: 582, nb: ['al', 'xk', 'rs', 'ba'] },
    { id: 'xk', name: 'Косово',          x: 605, y: 545, nb: ['al', 'mk', 'rs', 'me'] },
    { id: 'al', name: 'Албания',         x: 548, y: 628, nb: ['gr', 'mk', 'xk', 'me'] },
    { id: 'mk', name: 'Сев. Македония',  x: 622, y: 592, nb: ['bg', 'gr', 'al', 'xk', 'rs'] },
    { id: 'gr', name: 'Греция',          x: 628, y: 655, nb: ['bg', 'mk', 'al', 'mt', 'it', 'cy'] },
    { id: 'bg', name: 'Болгария',        x: 692, y: 545, nb: ['ro', 'rs', 'mk', 'gr'] },
    { id: 'ro', name: 'Румыния',         x: 688, y: 470, nb: ['ua', 'md', 'hu', 'rs', 'bg'] },
  ];

  const BY_ID = {};
  TERR.forEach(t => { BY_ID[t.id] = t; });

  const REGIONS = [
    { name: 'Скандинавия',      bonus: 2, ids: ['is', 'no', 'se', 'fi', 'dk'] },
    { name: 'Западная Европа',  bonus: 3, ids: ['fr', 'de', 'nl', 'be', 'lu', 'ie', 'gb', 'at', 'ch'] },
    { name: 'Юг Европы',        bonus: 2, ids: ['es', 'pt', 'it', 'mt', 'ad', 'mc', 'sm', 'li', 'gr', 'cy'] },
    { name: 'Балканы',          bonus: 2, ids: ['si', 'hr', 'ba', 'rs', 'me', 'xk', 'al', 'mk', 'bg', 'ro', 'hu'] },
    { name: 'Балтика и Восток', bonus: 3, ids: ['pl', 'cz', 'sk', 'lt', 'lv', 'ee', 'by', 'ua', 'md', 'ru'] },
  ];

  const PLAYER_DEFS = [
    { name: 'Синие',      color: '#3b82f6', glow: '#93c5fd' },
    { name: 'Красные',    color: '#ef4444', glow: '#fca5a5' },
    { name: 'Зелёные',    color: '#22c55e', glow: '#86efac' },
    { name: 'Фиолетовые', color: '#a855f7', glow: '#d8b4fe' },
  ];

  // ============================================================
  //  СОСТОЯНИЕ
  // ============================================================
  let S = null;                 // состояние игры
  let selected = null;          // выбранная страна
  let hoverId = null;           // страна под курсором
  let aiToken = 0;              // токен для отмены ИИ-ходов при новой игре
  const fx = [];                // всплывающие эффекты боя

  // ============================================================
  //  DOM
  // ============================================================
  const $ = (id) => document.getElementById(id);
  const canvas = $('map');
  const ctx = canvas.getContext('2d');
  const tooltip = $('tooltip');

  // Загрузка флагов
  const flagImgs = {};
  function loadFlags() {
    const flags = window.FLAGS || {};
    for (const code of Object.keys(flags)) {
      const img = new Image();
      img.src = flags[code];
      flagImgs[code] = img;
    }
  }

  // ============================================================
  //  УТИЛИТЫ
  // ============================================================
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function countTerr(pIdx) {
    let n = 0;
    for (const t of TERR) if (S.terr[t.id].owner === pIdx) n++;
    return n;
  }

  function armiesOf(pIdx) {
    let n = 0;
    for (const t of TERR) if (S.terr[t.id].owner === pIdx) n += S.terr[t.id].armies;
    return n;
  }

  function log(msg, cls) {
    S.log.push({ msg, cls: cls || '' });
    if (S.log.length > 120) S.log.shift();
    renderLog();
  }

  function renderLog() {
    const el = $('log');
    el.innerHTML = S.log.map(e => `<div class="log-entry ${e.cls}">${e.msg}</div>`).join('');
    el.scrollTop = el.scrollHeight;
  }

  function isHumanTurn() {
    return S && !S.gameOver && S.current === 0 && S.players[0].alive && !S.locked;
  }

  // ============================================================
  //  НОВАЯ ИГРА
  // ============================================================
  function newGame(nPlayers) {
    aiToken++;
    S = {
      players: PLAYER_DEFS.slice(0, nPlayers).map((d, i) => ({
        id: i, name: d.name, color: d.color, glow: d.glow,
        isHuman: i === 0, alive: true, reserves: 0,
      })),
      terr: {},
      turn: 1,
      current: 0,
      phase: 'place',
      locked: false,
      gameOver: false,
      log: [],
    };
    selected = null;
    fx.length = 0;

    // Раздача стран
    const ids = shuffle(TERR.map(t => t.id));
    ids.forEach((id, i) => {
      S.terr[id] = { owner: i % nPlayers, armies: 2 + Math.floor(Math.random() * 2) };
    });

    $('overlay').classList.add('hidden');
    $('gameover-card').classList.add('hidden');
    $('menu-card').classList.remove('hidden');

    log(`🌍 Новая игра: ${nPlayers} державы сражаются за Европу!`, 'turn');
    startTurn(0);
    render();
  }

  // ============================================================
  //  РЕЗЕРВЫ И ФАЗЫ
  // ============================================================
  function calcReserves(pIdx) {
    const count = countTerr(pIdx);
    if (count === 0) return 0;
    let res = Math.max(3, Math.floor(count / 3));
    for (const reg of REGIONS) {
      if (reg.ids.every(id => S.terr[id].owner === pIdx)) {
        res += reg.bonus;
      }
    }
    return res;
  }

  function regionBonusText(pIdx) {
    return REGIONS
      .filter(reg => reg.ids.every(id => S.terr[id].owner === pIdx))
      .map(reg => `${reg.name} +${reg.bonus}`);
  }

  function startTurn(pIdx) {
    S.current = pIdx;
    selected = null;
    const p = S.players[pIdx];
    if (!p.alive) { endTurn(); return; }

    const res = calcReserves(pIdx);
    p.reserves = res;
    const bonus = regionBonusText(pIdx);
    log(`— Ход ${S.turn}: ${p.name} получает ${res} резерв(ов)${bonus.length ? ' (бонусы: ' + bonus.join(', ') + ')' : ''} —`, 'turn');

    if (p.isHuman) {
      S.phase = 'place';
      S.locked = false;
      updateUI();
    } else {
      S.phase = 'ai';
      S.locked = true;
      updateUI();
      runAI(pIdx);
    }
    render();
  }

  function endTurn() {
    if (S.gameOver) return;
    const n = S.players.length;
    let next = -1;
    for (let i = 1; i <= n; i++) {
      const idx = (S.current + i) % n;
      if (S.players[idx].alive) { next = idx; break; }
    }
    if (next === -1) return;
    if (next <= S.current) S.turn++;
    startTurn(next);
  }

  function placeReserve(id) {
    const st = S.terr[id];
    const p = S.players[0];
    if (p.reserves <= 0) return;
    if (st.owner !== 0) return;
    st.armies++;
    p.reserves--;
    if (p.reserves <= 0) {
      log('Все резервы размещены — можно атаковать!', 'capture');
    }
    updateUI();
    render();
  }

  function setPhase(phase) {
    if (!isHumanTurn()) return;
    S.phase = phase;
    selected = null;
    updateUI();
    render();
  }

  // ============================================================
  //  БОЙ
  // ============================================================
  function battleRound(attId, defId, byAI) {
    const att = S.terr[attId];
    const def = S.terr[defId];
    if (!att || !def || att.owner === def.owner || att.armies < 2) return false;

    const atkDice = Math.min(3, att.armies - 1);
    const defDice = Math.min(2, def.armies);
    const aRolls = Array.from({ length: atkDice }, () => 1 + Math.floor(Math.random() * 6)).sort((x, y) => y - x);
    const dRolls = Array.from({ length: defDice }, () => 1 + Math.floor(Math.random() * 6)).sort((x, y) => y - x);
    const cmp = Math.min(atkDice, defDice);
    let aLoss = 0, dLoss = 0;
    for (let i = 0; i < cmp; i++) {
      if (aRolls[i] > dRolls[i]) dLoss++; else aLoss++;
    }
    att.armies -= aLoss;
    def.armies -= dLoss;

    const attName = `${S.players[att.owner].name} (${BY_ID[attId].name})`;
    const defName = `${S.players[def.owner].name} (${BY_ID[defId].name})`;
    log(`🎲 ${attName} → ${defName}: [${aRolls.join(',')}] vs [${dRolls.join(',')}] — потери ${aLoss}/${dLoss}`, 'battle');

    const defT = BY_ID[defId];
    fx.push({
      x: defT.x, y: defT.y - 34,
      text: dLoss > 0 ? `−${dLoss}` : 'отбита!',
      color: dLoss > 0 ? '#fca5a5' : '#86efac',
      born: performance.now(),
    });

    if (def.armies <= 0) {
      const prevOwner = def.owner;
      const moved = Math.max(1, att.armies - 1);
      def.owner = att.owner;
      def.armies = moved;
      att.armies -= moved;
      log(`🏳️ ${BY_ID[defId].name} захвачена державой ${S.players[att.owner].name}!`, 'capture');
      fx.push({ x: defT.x, y: defT.y - 52, text: 'ЗАХВАТ!', color: '#f0c419', born: performance.now() });

      if (countTerr(prevOwner) === 0) {
        S.players[prevOwner].alive = false;
        log(`💀 Держава ${S.players[prevOwner].name} уничтожена!`, 'win');
      }
      checkGameOver();
      selected = att.owner === 0 ? attId : null;
    }

    if (att.armies < 2 && selected === attId) selected = null;
    updateUI();
    render();
    return true;
  }

  function moveArmies(fromId, toId) {
    const from = S.terr[fromId];
    const to = S.terr[toId];
    if (from.owner !== to.owner || from.armies < 2) return false;
    const moved = from.armies - 1;
    from.armies = 1;
    to.armies += moved;
    log(`🔀 Переброс: ${BY_ID[fromId].name} → ${BY_ID[toId].name} (+${moved} армий)`);
    selected = null;
    updateUI();
    render();
    return true;
  }

  function checkGameOver() {
    const alive = S.players.filter(p => p.alive);
    if (S.players[0].alive && countTerr(0) === TERR.length) {
      finishGame(true);
    } else if (!S.players[0].alive) {
      finishGame(false);
    } else if (alive.length === 1) {
      finishGame(alive[0].id === 0);
    }
  }

  function finishGame(playerWon) {
    S.gameOver = true;
    S.locked = true;
    S.phase = 'gameover';
    aiToken++;
    $('gameover-card').classList.remove('hidden');
    $('menu-card').classList.add('hidden');
    $('overlay').classList.remove('hidden');
    if (playerWon) {
      $('gameover-title').textContent = '🏆 Победа!';
      $('gameover-text').textContent = 'Вся Европа под вашим контролем. История запомнит это завоевание!';
      log('🏆 ПОБЕДА! Вся Европа ваша!', 'win');
    } else {
      const winner = S.players.find(p => p.alive && p.id !== 0) || S.players.find(p => p.alive);
      $('gameover-title').textContent = '💀 Поражение';
      $('gameover-text').textContent = winner
        ? `Европу захватила держава «${winner.name}». Попробуйте снова!`
        : 'Игра окончена.';
      log('💀 Поражение... Европа потеряна.', 'win');
    }
    updateUI();
    render();
  }

  // ============================================================
  //  ИИ
  // ============================================================
  function aiPlace(pIdx) {
    const p = S.players[pIdx];
    let guard = 0;
    while (p.reserves > 0 && guard++ < 200) {
      // Свои страны, граничащие с врагом, с наименьшим числом армий
      const borders = TERR.filter(t => {
        const st = S.terr[t.id];
        return st.owner === pIdx && t.nb.some(n => S.terr[n].owner !== pIdx);
      });
      const pool = borders.length ? borders : TERR.filter(t => S.terr[t.id].owner === pIdx);
      if (!pool.length) break;
      pool.sort((a, b) => {
        const threat = (t) => t.nb.filter(n => S.terr[n].owner !== pIdx)
          .reduce((s, n) => s + S.terr[n].armies, 0);
        return (S.terr[a.id].armies - threat(a) * 0.35) - (S.terr[b.id].armies - threat(b) * 0.35);
      });
      const target = pool[0];
      S.terr[target.id].armies++;
      p.reserves--;
    }
    log(`${p.name}: резервы размещены у границ.`);
  }

  function aiFindAttack(pIdx) {
    let best = null;
    for (const t of TERR) {
      const st = S.terr[t.id];
      if (st.owner !== pIdx || st.armies < 2) continue;
      for (const nb of t.nb) {
        const nd = S.terr[nb];
        if (nd.owner === pIdx) continue;
        const ratio = (st.armies - 1) / Math.max(1, nd.armies);
        const score = ratio + Math.random() * 0.15;
        if (ratio > 1.2 || (ratio > 0.95 && Math.random() < 0.18)) {
          if (!best || score > best.score) best = { att: t.id, def: nb, score };
        }
      }
    }
    return best;
  }

  function runAI(pIdx) {
    const token = ++aiToken;
    const p = S.players[pIdx];
    setTimeout(() => {
      if (token !== aiToken || S.gameOver) return;
      aiPlace(pIdx);
      updateUI();
      render();
      setTimeout(() => aiAttackLoop(pIdx, token, 0), 420);
    }, 520);
  }

  function aiAttackLoop(pIdx, token, rounds) {
    if (token !== aiToken || S.gameOver) return;
    const move = aiFindAttack(pIdx);
    if (!move || rounds >= 26) {
      setTimeout(() => {
        if (token !== aiToken || S.gameOver) return;
        endTurn();
      }, 420);
      return;
    }
    battleRound(move.att, move.def, true);
    setTimeout(() => aiAttackLoop(pIdx, token, rounds + 1), 380);
  }

  // ============================================================
  //  ОТРИСОВКА КАРТЫ
  // ============================================================
  const NODE_R = 23;

  function drawBackground() {
    const g = ctx.createLinearGradient(0, 0, 1000, 720);
    g.addColorStop(0, '#0d243c');
    g.addColorStop(0.55, '#0b1e33');
    g.addColorStop(1, '#091727');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 1000, 720);

    // сетка
    ctx.strokeStyle = 'rgba(120, 170, 230, 0.06)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= 1000; x += 50) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 720); ctx.stroke();
    }
    for (let y = 0; y <= 720; y += 50) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1000, y); ctx.stroke();
    }

    // декоративные «течения»
    ctx.strokeStyle = 'rgba(90, 150, 220, 0.05)';
    ctx.lineWidth = 22;
    ctx.beginPath();
    ctx.moveTo(30, 620); ctx.bezierCurveTo(260, 560, 320, 680, 560, 640);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(700, 40); ctx.bezierCurveTo(820, 120, 900, 60, 990, 140);
    ctx.stroke();
  }

  function drawEdges() {
    const drawn = new Set();
    for (const t of TERR) {
      for (const nb of t.nb) {
        const key = [t.id, nb].sort().join('|');
        if (drawn.has(key)) continue;
        drawn.add(key);
        const o = BY_ID[nb];
        if (!o) continue;
        const isSel = selected && (selected === t.id || selected === nb);
        const sameOwner = S.terr[t.id].owner === S.terr[nb].owner;
        ctx.strokeStyle = isSel
          ? 'rgba(255, 255, 255, 0.55)'
          : sameOwner
            ? 'rgba(255, 255, 255, 0.16)'
            : 'rgba(255, 255, 255, 0.09)';
        ctx.lineWidth = isSel ? 2.5 : 1.5;
        ctx.beginPath();
        ctx.moveTo(t.x, t.y);
        ctx.lineTo(o.x, o.y);
        ctx.stroke();
      }
    }
  }

  function drawNode(t) {
    const st = S.terr[t.id];
    const p = S.players[st.owner];
    const isSel = selected === t.id;
    const isHover = hoverId === t.id;
    const r = NODE_R;

    // подсветка выбора / наведения
    if (isSel || isHover) {
      const pulse = isSel ? 0.55 + 0.25 * Math.sin(performance.now() / 220) : 0.35;
      ctx.beginPath();
      ctx.arc(t.x, t.y, r + 9, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${pulse * 0.22})`;
      ctx.fill();
    }

    // тень
    ctx.beginPath();
    ctx.arc(t.x + 1.5, t.y + 3, r + 3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.38)';
    ctx.fill();

    // кольцо владельца
    ctx.beginPath();
    ctx.arc(t.x, t.y, r + 3, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();

    // флаг (в круге)
    ctx.save();
    ctx.beginPath();
    ctx.arc(t.x, t.y, r, 0, Math.PI * 2);
    ctx.clip();
    const img = flagImgs[t.id];
    if (img && img.complete && img.naturalWidth) {
      const s = r * 2;
      const a = img.naturalWidth / img.naturalHeight; // ~4/3
      const dw = s * Math.max(1, a), dh = s * Math.max(1, 1 / a);
      ctx.drawImage(img, t.x - dw / 2, t.y - dh / 2, dw, dh);
    } else {
      ctx.fillStyle = '#24334f';
      ctx.fillRect(t.x - r, t.y - r, r * 2, r * 2);
    }
    ctx.restore();

    // рамка флага
    ctx.beginPath();
    ctx.arc(t.x, t.y, r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.55)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // бейдж армий
    const bx = t.x + r * 0.78, by = t.y + r * 0.78;
    ctx.beginPath();
    ctx.arc(bx, by, 11.5, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
    ctx.strokeStyle = 'rgba(5,10,20,0.9)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12.5px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(st.armies), bx, by + 0.5);

    // название
    const label = t.name;
    ctx.font = '11.5px "Segoe UI", Arial, sans-serif';
    const tw = ctx.measureText(label).width;
    ctx.fillStyle = 'rgba(8, 14, 26, 0.72)';
    const lx = t.x, ly = t.y + r + 15;
    roundRect(lx - tw / 2 - 5, ly - 9, tw + 10, 17, 6);
    ctx.fill();
    ctx.fillStyle = '#e8f0fb';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, lx, ly + 0.5);
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function drawFX() {
    const now = performance.now();
    for (let i = fx.length - 1; i >= 0; i--) {
      const f = fx[i];
      const age = now - f.born;
      if (age > 1400) { fx.splice(i, 1); continue; }
      const alpha = 1 - age / 1400;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.font = 'bold 17px "Segoe UI", Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.strokeStyle = 'rgba(0,0,0,0.85)';
      ctx.lineWidth = 4;
      const yy = f.y - age * 0.035;
      ctx.strokeText(f.text, f.x, yy);
      ctx.fillStyle = f.color;
      ctx.fillText(f.text, f.x, yy);
      ctx.restore();
    }
  }

  function render() {
    if (!S) return;
    drawBackground();
    drawEdges();
    for (const t of TERR) drawNode(t);
    drawFX();
  }

  // ============================================================
  //  UI (панели, кнопки)
  // ============================================================
  function updateUI() {
    if (!S) return;
    const p = S.players[S.current];
    $('turn-label').textContent = `Ход ${S.turn}`;

    const phaseNames = {
      place: '🛡 Размещение резервов',
      attack: '⚔ Атака',
      move: '🔀 Переброс',
      ai: '🤖 Ход ИИ',
      gameover: 'Игра окончена',
    };
    $('phase-label').textContent = phaseNames[S.phase] || '—';

    // Игроки
    $('players-list').innerHTML = S.players.map(pl => {
      const terr = countTerr(pl.id);
      const arm = armiesOf(pl.id);
      return `<div class="player-row ${pl.id === S.current ? 'active' : ''} ${pl.alive ? '' : 'dead'}">
        <div class="color-dot" style="background:${pl.color}"></div>
        <div class="player-name">${pl.name}${pl.isHuman ? ' (вы)' : ''}</div>
        <div class="player-stats">Стран: <b>${terr}</b> · Армий: <b>${arm}</b></div>
      </div>`;
    }).join('');

    // Управление
    const human = isHumanTurn();
    $('reserve-count').textContent = S.players[0].reserves;
    $('reserve-info').style.opacity = S.players[0].alive ? 1 : 0.4;

    const hints = {
      place: 'Кликайте по своим странам, чтобы поставить резервные армии (по 1 за клик).',
      attack: selected
        ? `Выбрана ${BY_ID[selected].name}. Кликните по соседней вражеской стране, чтобы атаковать.`
        : 'Выберите свою страну с 2+ армиями, затем кликните по соседней вражеской.',
      move: selected
        ? `Выбрана ${BY_ID[selected].name}. Кликните по соседней своей стране — армии уйдут туда.`
        : 'Выберите свою страну, затем соседнюю свою — перебросит все армии, кроме одной.',
      ai: 'Соперники делают свои ходы...',
      gameover: 'Игра окончена. Начните новую!',
    };
    $('hint-text').textContent = hints[S.phase] || '';

    $('btn-place-done').disabled = !(human && S.phase === 'place');
    $('btn-move-mode').disabled = !(human && (S.phase === 'attack' || S.phase === 'move'));
    $('btn-move-mode').textContent = S.phase === 'move' ? '⚔ Назад к атаке' : '🔀 Переброс армий';
    $('btn-end-turn').disabled = !(human && (S.phase === 'attack' || S.phase === 'move'));
  }

  // ============================================================
  //  СОБЫТИЯ КАРТЫ
  // ============================================================
  function canvasPos(evt) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (evt.clientX - rect.left) * (canvas.width / rect.width),
      y: (evt.clientY - rect.top) * (canvas.height / rect.height),
    };
  }

  function nodeAt(pos) {
    for (const t of TERR) {
      const dx = pos.x - t.x, dy = pos.y - t.y;
      if (dx * dx + dy * dy <= (NODE_R + 8) * (NODE_R + 8)) return t.id;
    }
    return null;
  }

  canvas.addEventListener('mousemove', (e) => {
    const id = nodeAt(canvasPos(e));
    hoverId = id;
    canvas.style.cursor = id ? 'pointer' : 'default';
    if (id && S) {
      const st = S.terr[id];
      const t = BY_ID[id];
      const p = S.players[st.owner];
      const flags = window.FLAGS || {};
      const enemyNbs = t.nb.filter(n => S.terr[n].owner !== st.owner).length;
      tooltip.innerHTML = `
        <div class="tt-name"><img src="${flags[id] || ''}" alt="">${t.name}</div>
        <div>Владелец: <b style="color:${p.glow}">${p.name}</b></div>
        <div>Армии: <b>${st.armies}</b> · Вражеских соседей: <b>${enemyNbs}</b></div>`;
      tooltip.classList.remove('hidden');
      tooltip.style.left = Math.min(e.clientX + 16, window.innerWidth - 250) + 'px';
      tooltip.style.top = Math.min(e.clientY + 16, window.innerHeight - 110) + 'px';
    } else {
      tooltip.classList.add('hidden');
    }
    render();
  });

  canvas.addEventListener('mouseleave', () => {
    hoverId = null;
    tooltip.classList.add('hidden');
    render();
  });

  canvas.addEventListener('click', (e) => {
    if (!S || S.gameOver || S.locked) return;
    const id = nodeAt(canvasPos(e));
    if (!id) { selected = null; render(); return; }
    const st = S.terr[id];

    if (S.phase === 'place') {
      if (st.owner === 0) placeReserve(id);
      return;
    }

    if (S.phase === 'attack') {
      if (st.owner === 0) {
        if (st.armies >= 2) selected = id;
        else log('⚠ Для атаки нужно минимум 2 армии в стране.');
        render();
        return;
      }
      if (selected) {
        const sel = S.terr[selected];
        const t = BY_ID[selected];
        if (t.nb.includes(id)) {
          if (sel.armies < 2) { selected = null; render(); return; }
          battleRound(selected, id, false);
        } else {
          log('⚠ Можно атаковать только соседнюю страну.');
        }
      }
      return;
    }

    if (S.phase === 'move') {
      if (st.owner !== 0) return;
      if (!selected) {
        if (st.armies >= 2) selected = id;
        else log('⚠ В этой стране нет свободных армий для переброса.');
        render();
        return;
      }
      if (selected === id) { selected = null; render(); return; }
      const t = BY_ID[selected];
      if (t.nb.includes(id)) moveArmies(selected, id);
      else {
        selected = id;
        render();
      }
    }
  });

  // ============================================================
  //  КНОПКИ И МЕНЮ
  // ============================================================
  let menuPlayerCount = 2;

  $('btn-start').addEventListener('click', () => newGame(menuPlayerCount));
  $('btn-restart').addEventListener('click', () => {
    $('gameover-card').classList.add('hidden');
    $('menu-card').classList.remove('hidden');
  });
  $('btn-new').addEventListener('click', () => {
    aiToken++;
    if (S) S.locked = true;
    $('gameover-card').classList.add('hidden');
    $('menu-card').classList.remove('hidden');
    $('overlay').classList.remove('hidden');
  });
  $('btn-place-done').addEventListener('click', () => {
    if (S && S.players[0].reserves > 0) {
      log('⚠ Остались неразмещённые резервы — расставьте их.', 'battle');
      return;
    }
    setPhase('attack');
  });
  $('btn-move-mode').addEventListener('click', () => {
    setPhase(S.phase === 'move' ? 'attack' : 'move');
  });
  $('btn-end-turn').addEventListener('click', () => {
    if (!isHumanTurn()) return;
    selected = null;
    endTurn();
    updateUI();
    render();
  });

  // Сегмент выбора числа игроков
  document.querySelectorAll('.seg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.seg-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      menuPlayerCount = parseInt(btn.dataset.count, 10);
    });
  });

  // Правила
  const rulesModal = $('rules-modal');
  const openRules = () => rulesModal.classList.remove('hidden');
  const closeRules = () => rulesModal.classList.add('hidden');
  $('btn-rules').addEventListener('click', openRules);
  $('btn-rules-2').addEventListener('click', openRules);
  $('btn-rules-close').addEventListener('click', closeRules);
  rulesModal.addEventListener('click', (e) => { if (e.target === rulesModal) closeRules(); });

  // ============================================================
  //  ЗАПУСК
  // ============================================================
  function validateGraph() {
    for (const t of TERR) {
      for (const nb of t.nb) {
        if (!BY_ID[nb]) { console.error('Неизвестный сосед', nb, 'у', t.id); continue; }
        if (!BY_ID[nb].nb.includes(t.id)) console.error('Асимметричная связь:', t.id, '->', nb);
      }
    }
    // проверка, что все страны в регионах
    const inRegions = new Set(REGIONS.flatMap(r => r.ids));
    for (const t of TERR) {
      if (!inRegions.has(t.id)) console.error('Страна вне регионов:', t.id);
    }
  }

  loadFlags();
  validateGraph();
  // лёгкая заглушка состояния для рендера под меню
  S = {
    players: PLAYER_DEFS.slice(0, 2).map((d, i) => ({
      id: i, name: d.name, color: d.color, glow: d.glow, isHuman: i === 0, alive: true, reserves: 0,
    })),
    terr: {},
    turn: 1, current: 0, phase: 'place', locked: true, gameOver: false, log: [],
  };
  TERR.forEach((t, i) => { S.terr[t.id] = { owner: i % 2, armies: 2 }; });
  updateUI();
  render();

  // Анимация подсветки
  (function frame() {
    if (S && (selected || hoverId)) render();
    requestAnimationFrame(frame);
  })();

})();

document.documentElement.classList.add('js');

(() => {
'use strict';

/* ==========================================================================
   КОНТЕНТ: меняйте только этот блок
   ========================================================================== */


/* Работы. Чтобы добавить свою: положите файл в папку img/ и добавьте строку.
    */
const WORKS = {
  avatars: [
    { id:'a1', src:'img/avatar-kfc-orders.webp',     title:'KFC Orders',               kind:'Аватарка', alt:'Аватарка KFC Orders: монеты TON на тёмном фоне, надпись «Купить» и «USDT/TON»' },
    { id:'a2', src:'img/avatar-chat-ruchenii.webp',  title:'Чат ручений',              kind:'Аватарка', alt:'Аватарка «Чат ручений»: крупная белая надпись и неоновый жезл' },
    { id:'a3', src:'img/avatar-crypto-trade.webp',   title:'Atalanta',                 kind:'Аватарка', alt:'Аватарка Atalanta: «Продажа/покупка крипты», светящаяся надпись на синем фоне' },
  ],
  banners: [
    { id:'b1', src:'img/banner-knight.webp',    title:'Нанял рыцаря',      kind:'Баннер', alt:'Баннер «Нанял рыцаря»: рыцарь в плаще посвящает коленопреклонённого воина' },
    { id:'b2', src:'img/banner-confi.webp',     title:'Confi',             kind:'Баннер', alt:'Баннер Confi: профиль в Telegram и надпись «Проведёт сделки, продаст ручение, выложит посты»' },
    { id:'b3', src:'img/banner-wwrapathy.webp', title:'wwrapathy',         kind:'Баннер', alt:'Баннер «Я wwrapathy наняла ручения»: профиль в Telegram на тёмном фиолетовом фоне' },
  ]
};

const PRICES = [
  { name:'Аватарка', price:'$2' },
  { name:'Баннер / Шапка', price:'$3' },
  { name:'Превью / Обложка', price:'$4' },
  { name:'Логотип', price:'$5' }
];

/* Fill the three decorative vertical lanes with the portfolio images. */
const heroSets = [
  [WORKS.avatars[0], WORKS.banners[0], WORKS.avatars[1], WORKS.banners[1]],
  [WORKS.banners[2], WORKS.avatars[2], WORKS.banners[1], WORKS.avatars[0]],
  [WORKS.avatars[1], WORKS.banners[2], WORKS.avatars[0], WORKS.banners[0]]
];
document.querySelectorAll('.hero__track').forEach((track, laneIndex) => {
  const lane = track.closest('.hero__lane');
  track.style.setProperty('--lane-speed', (Number(lane?.dataset.speed) || 34) + 's');
  const set = document.createElement('div');
  set.className = 'hero__set';
  heroSets[laneIndex].forEach(work => {
    const tile = document.createElement('div');
    tile.className = work.kind === 'Баннер' ? 'hero__sample hero__sample--banner' : 'hero__sample';
    const image = document.createElement('img');
    image.src = work.src;
    image.alt = '';
    image.decoding = 'async';
    image.loading = 'eager';
    tile.append(image);
    set.append(tile);
  });
  const mirror = set.cloneNode(true);
  mirror.setAttribute('aria-hidden', 'true');
  track.append(set, mirror);
});


/* ==========================================================================
   Утилиты
   ========================================================================== */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const mqReduce = matchMedia('(prefers-reduced-motion: reduce)');
const reduced = () => mqReduce.matches;
const ICON = {
  expand:'<svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4h4v4M8 16H4v-4M16 4l-5 5M4 16l5-5"/></svg>',
  arrow:'<svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 15 15 5M7 5h8v8"/></svg>',
  plus:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>'
};

/* ==========================================================================
   Пружина: настоящая физика, переведённая в CSS linear()
   ========================================================================== */
function makeSpring(stiffness, damping, mass = 1){
  const w0 = Math.sqrt(stiffness / mass), z = damping / (2 * Math.sqrt(stiffness * mass));
  const wd = w0 * Math.sqrt(Math.max(1 - z * z, 1e-6));
  const pos = t => z < 1
    ? 1 - Math.exp(-z * w0 * t) * (Math.cos(wd * t) + (z * w0 / wd) * Math.sin(wd * t))
    : 1 - Math.exp(-w0 * t) * (1 + w0 * t);
  let T = .2;
  for (let t = 0; t < 4; t += .005) if (Math.abs(1 - pos(t)) > .002) T = t;
  T += .02;
  const N = Math.min(64, Math.max(12, Math.round(T * 60)));
  const pts = [];
  for (let i = 0; i <= N; i++) pts.push(+pos(T * i / N).toFixed(4));
  pts[N] = 1;
  return { duration: Math.round(T * 1000), easing: `linear(${pts.join(',')})` };
}
const canLinear = !!(window.CSS && CSS.supports && CSS.supports('animation-timing-function', 'linear(0,1)'));
const SP = canLinear ? makeSpring(260, 26) : { duration: 600, easing: 'cubic-bezier(.22,1,.36,1)' };
const SP_SOFT = canLinear ? makeSpring(170, 24) : { duration: 700, easing: 'cubic-bezier(.22,1,.36,1)' };
document.documentElement.style.setProperty('--spring', SP.easing);
document.documentElement.style.setProperty('--spring-dur', SP.duration + 'ms');

/* ссылки на Telegram */

/* ==========================================================================
   Рендер карточек
   ========================================================================== */
const AR = { avatars: ['1 / 1', 1], banners: ['16 / 9', 16 / 9] };

function workCard(w, cat){
  const ar = AR[cat][0];
  return `<li class="card" style="--ar:${ar}">
    <button class="card__btn" type="button" data-cat="${cat}" data-id="${w.id}" aria-haspopup="dialog" aria-label="Открыть работу «${esc(w.title)}»">
      <span class="card__media"><img src="${esc(w.src)}" alt="" draggable="false" decoding="async"><span class="card__open">${ICON.expand}</span></span>
      <span class="card__cap"><span class="card__title">${esc(w.title)}</span><span class="card__kind">${esc(w.kind)}</span></span>
    </button>
  </li>`;
}
$('[data-marquee="avatars"] .marquee__track').innerHTML = WORKS.avatars.map(w => workCard(w, 'avatars')).join('');
$('[data-marquee="banners"] .marquee__track').innerHTML = WORKS.banners.map(w => workCard(w, 'banners')).join('');
$("#priceList").innerHTML = PRICES.map(p => `<li class="prow"><h3 class="prow__name">${esc(p.name)}</h3><div class="prow__price">${esc(p.price)}</div></li>`).join("");

/* ==========================================================================
   Бегущая строка: один общий цикл, инерция, перетаскивание, пауза
   ========================================================================== */
const Loop = {
  items: new Set(), raf: 0, last: 0, globalPause: 0,
  add(m){ this.items.add(m); this.kick(); },
  del(m){ this.items.delete(m); },
  kick(){ if (!this.raf && this.items.size && !document.hidden && !reduced()) { this.last = performance.now(); this.raf = requestAnimationFrame(t => this.tick(t)); } },
  tick(t){
    const dt = Math.min(.05, (t - this.last) / 1000 || .016); this.last = t;
    this.items.forEach(m => m.step(dt));
    this.raf = this.items.size ? requestAnimationFrame(t2 => this.tick(t2)) : 0;
  }
};
document.addEventListener('visibilitychange', () => { if (document.hidden) { cancelAnimationFrame(Loop.raf); Loop.raf = 0; } else Loop.kick(); });

class Marquee {
  constructor(root){
    this.root = root;
    this.track = $('.marquee__track', root);
    this.base = Array.from(this.track.children);
    this.speed = +root.dataset.speed || 40;
    this.dir = +root.dataset.dir || -1;
    this.x = 0; this.v = this.speed * this.dir;
    this.setW = 0; this.hover = false; this.focus = false; this.paused = false;
    this.dragging = false; this.pending = false; this.visible = false; this.static = false;
    this.btn = (root.closest('.panel, .reviews') || document).querySelector('.pausebtn');
    this.bind();
  }
  bind(){
    const r = this.root;
    r.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') this.hover = true; });
    r.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') this.hover = false; });
    r.addEventListener('focusin', e => { this.focus = true; this.reveal(e.target); });
    r.addEventListener('focusout', () => { requestAnimationFrame(() => { this.focus = r.contains(document.activeElement) && document.activeElement !== document.body; }); });
    r.addEventListener('pointerdown', e => this.down(e));
    r.addEventListener('pointermove', e => this.move(e));
    r.addEventListener('pointerup', e => this.up(e, true));
    r.addEventListener('pointercancel', e => this.up(e, false));
    r.addEventListener('click', e => { if (this.justDragged) { e.preventDefault(); e.stopPropagation(); this.justDragged = false; return; }
      const b = e.target.closest('.card__btn'); if (b) openLB(b.dataset.cat, b.dataset.id, $('.card__media', b)); }, true);
    if (this.btn) this.btn.addEventListener('click', () => {
      this.paused = !this.paused;
      this.btn.setAttribute('aria-pressed', this.paused);
      this.btn.setAttribute('aria-label', this.paused ? 'Запустить бегущую строку' : 'Остановить бегущую строку');
    });
    new IntersectionObserver(es => es.forEach(e => { this.visible = e.isIntersecting; this.visible ? Loop.add(this) : Loop.del(this); }), { rootMargin: '80px' }).observe(r);
    let raf = 0;
    new ResizeObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => this.build()); }).observe(r);
  }
  clear(){ $$('.is-clone', this.track).forEach(n => n.remove()); }
  build(){
    const W = this.root.clientWidth; if (!W) return;
    this.clear();
    if (reduced()) { this.static = true; this.root.classList.add('is-static'); this.track.style.transform = ''; return; }
    this.static = false; this.root.classList.remove('is-static');
    const items = this.base; if (!items.length) return;
    const gap = parseFloat(getComputedStyle(this.track).columnGap) || 0;
    const a = items[0], z = items[items.length - 1];
    this.setW = z.offsetLeft + z.offsetWidth - a.offsetLeft + gap;
    if (this.setW <= 0) return;
    const sets = Math.ceil(W / this.setW) + 1;
    for (let s = 1; s < sets; s++) items.forEach(li => {
      const c = li.cloneNode(true);
      c.classList.add('is-clone'); c.setAttribute('aria-hidden', 'true');
      $$('button,a', c).forEach(b => b.tabIndex = -1);
      this.track.appendChild(c);
    });
    this.wrap(); this.apply();
  }
  refresh(){ this.build(); }
  wrap(){ if (!this.setW) return; this.x = ((this.x % this.setW) - this.setW) % this.setW; if (this.x > 0) this.x -= this.setW; }
  apply(){ this.track.style.transform = `translate3d(${this.x.toFixed(2)}px,0,0)`; }
  step(dt){
    if (this.static || !this.setW) return;
    if (!this.dragging) {
      const stop = this.hover || this.focus || this.paused || Loop.globalPause;
      const target = stop ? 0 : this.speed * this.dir;
      this.v += (target - this.v) * (1 - Math.exp(-dt * (stop ? 5 : 2.2)));
      this.x += this.v * dt;
    }
    this.wrap(); this.apply();
  }
  reveal(t){
    const li = t.closest && t.closest('li'); if (!li || li.classList.contains('is-clone') || this.static || !this.setW) return;
    const rr = this.root.getBoundingClientRect(), lr = li.getBoundingClientRect();
    if (lr.left < rr.left + 16 || lr.right > rr.right - 16) { this.x = Math.min(0, 24 - li.offsetLeft); this.apply(); }
  }
  down(e){
    if (this.static || (e.pointerType === 'mouse' && e.button !== 0)) return;
    this.pending = true; this.pid = e.pointerId; this.lastX = e.clientX; this.moved = 0; this.flick = 0; this.lastT = performance.now();
  }
  move(e){
    if (!this.pending || e.pointerId !== this.pid) return;
    const dx = e.clientX - this.lastX; this.lastX = e.clientX; this.moved += Math.abs(dx);
    if (!this.dragging && this.moved > 8) { this.dragging = true; this.root.classList.add('is-drag'); try { this.root.setPointerCapture(this.pid); } catch (_) {} }
    if (this.dragging) {
      const n = performance.now(), d = Math.max(1, n - this.lastT); this.lastT = n;
      this.flick = this.flick * .6 + (dx / d * 1000) * .4;
      this.x += dx; this.wrap(); this.apply();
    }
  }
  up(e, ok){
    if (!this.pending || e.pointerId !== this.pid) return;
    this.pending = false;
    if (this.dragging) {
      this.dragging = false; this.justDragged = true; this.root.classList.remove('is-drag');
      this.v = ok ? clamp(this.flick, -1600, 1600) : this.speed * this.dir;
      setTimeout(() => { this.justDragged = false; }, 60);
    }
  }
}
const marquees = new Map($$('.marquee').map(el => [el.dataset.marquee, new Marquee(el)]));
mqReduce.addEventListener?.('change', () => { marquees.forEach(m => m.refresh()); Loop.kick(); });

/* ==========================================================================
   Вкладки: стрелки, хеш, пружинный индикатор, плавная смена высоты
   ========================================================================== */
const NAMES = ['avatars', 'banners', 'price'];
const tabsEl = $('#tabs'), indEl = $('#tabInd'), panelsEl = $('#panels');
const tabBtns = $$('.tab', tabsEl);
const panelOf = n => $('#panel-' + n);
let cur = null, token = 0;

function placeInd(){
  const t = tabBtns.find(b => b.getAttribute('aria-selected') === 'true'); if (!t) return;
  indEl.style.setProperty('--x', t.offsetLeft + 'px');
  indEl.style.setProperty('--w', t.offsetWidth + 'px');
}
function refreshIn(panel){ $$('.marquee', panel).forEach(el => marquees.get(el.dataset.marquee)?.refresh()); }

async function select(name, { animate = true, focus = false, setHash = true } = {}){
  if (!NAMES.includes(name) || name === cur) return;
  const prev = cur; cur = name; const my = ++token;
  tabBtns.forEach(b => { const on = b.dataset.tab === name; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; });
  if (focus) $('#tab-' + name).focus();
  tabsEl.classList.toggle('tabs--still', !animate || reduced());
  placeInd();
  if (setHash && location.hash !== '#' + name) { try { location.hash = name; } catch (_) {} }

  const next = panelOf(name);
  $$('.panel', panelsEl).forEach(p => p.getAnimations().forEach(a => a.cancel()));
  panelsEl.getAnimations().forEach(a => a.cancel());
  if (!prev || !animate || reduced()) {
    $$('.panel', panelsEl).forEach(p => p.hidden = p !== next);
    refreshIn(next); return;
  }
  const old = panelOf(prev), dir = Math.sign(NAMES.indexOf(name) - NAMES.indexOf(prev));
  const h0 = panelsEl.offsetHeight;
  const out = old.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: `translateX(${-dir * 18}px) scale(.992)` }], { duration: 150, easing: 'ease-in', fill: 'forwards' });
  try { await out.finished; } catch (_) { return; }
  if (my !== token) return;
  old.hidden = true; out.cancel();
  next.hidden = false; refreshIn(next);
  const h1 = panelsEl.offsetHeight;
  panelsEl.style.overflow = 'clip';
  const grow = panelsEl.animate([{ height: h0 + 'px' }, { height: h1 + 'px' }], { duration: SP.duration, easing: SP.easing });
  grow.onfinish = grow.oncancel = () => { panelsEl.style.overflow = ''; };
  next.animate([{ opacity: 0, transform: `translateX(${dir * 28}px) scale(.985)` }, { opacity: 1, transform: 'none' }], { duration: SP_SOFT.duration, easing: SP_SOFT.easing });
  $$('.prow', next).forEach((row, i) => row.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: SP.duration, easing: SP.easing, delay: 90 + i * 55, fill: 'backwards' }));
}
tabBtns.forEach(b => b.addEventListener('click', () => select(b.dataset.tab)));
tabsEl.addEventListener('keydown', e => {
  const i = NAMES.indexOf(cur); let n = -1;
  if (e.key === 'ArrowRight') n = (i + 1) % 3; else if (e.key === 'ArrowLeft') n = (i + 2) % 3;
  else if (e.key === 'Home') n = 0; else if (e.key === 'End') n = 2;
  if (n > -1) { e.preventDefault(); select(NAMES[n], { focus: true }); }
});
addEventListener('hashchange', () => { const h = location.hash.slice(1); if (NAMES.includes(h)) select(h, { setHash: false }); });
addEventListener('resize', () => { tabsEl.classList.add('tabs--still'); placeInd(); });
(document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => { tabsEl.classList.add('tabs--still'); placeInd(); });

const h0 = location.hash.slice(1);
select(NAMES.includes(h0) ? h0 : 'avatars', { animate: false, setHash: false });
requestAnimationFrame(() => requestAnimationFrame(() => tabsEl.classList.remove('tabs--still')));

/* ==========================================================================
   Просмотр работы: открывается из карточки (FLIP), листается, закрывается Esc
   ========================================================================== */
const lb = $('#lb'), lbFrame = $('#lbFrame'), lbImg = $('#lbImg'), lbBg = $('#lbBg'), lbStage = $('#lbStage'), lbBar = $('#lbBar');
const LB = { list: [], idx: 0, cat: '', last: null, busy: false, closing: false };

function setItem(i){
  const w = LB.list[i]; LB.idx = i;
  const [ar, n] = AR[LB.cat];
  lbStage.style.setProperty('--ar', ar); lbStage.style.setProperty('--ar-n', n);
  lbImg.style.setProperty('--ar', ar);
  lbImg.src = w.src; lbImg.alt = w.alt;
  $('#lbTitle').textContent = w.title; $('#lbKind').textContent = `${w.kind}, ${i + 1} из ${LB.list.length}`;
  lb.setAttribute('aria-label', `${w.kind}: ${w.title}`);
}
const decoded = () => (lbImg.decode ? lbImg.decode() : Promise.resolve()).catch(() => {});
const done = a => a.finished.catch(() => {});

async function openLB(cat, id, origin){
  if (!lb.hidden) return;
  LB.cat = cat; LB.list = WORKS[cat].filter(w => !w.placeholder);
  const i = LB.list.findIndex(w => w.id === id); if (i < 0) return;
  LB.last = document.activeElement;
  setItem(i);
  $('#lbPrev').hidden = $('#lbNext').hidden = LB.list.length < 2;
  lb.hidden = false; document.documentElement.classList.add('lb-open'); Loop.globalPause++;
  const first = origin ? origin.getBoundingClientRect() : null;
  await decoded();
  $('#lbClose').focus({ preventScroll: true });
  if (reduced()) return;
  const last = lbFrame.getBoundingClientRect();
  lbBg.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, easing: 'ease-out' });
  lbBar.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: SP.duration, easing: SP.easing, delay: 120, fill: 'backwards' });
  if (first && first.width && last.width) {
    const dx = first.left - last.left, dy = first.top - last.top, sx = first.width / last.width, sy = first.height / last.height;
    lbFrame.animate([{ transform: `translate(${dx}px,${dy}px) scale(${sx},${sy})`, borderRadius: '24px' }, { transform: 'none', borderRadius: '24px' }], { duration: SP_SOFT.duration, easing: SP_SOFT.easing });
  } else {
    lbFrame.animate([{ opacity: 0, transform: 'scale(.94)' }, { opacity: 1, transform: 'none' }], { duration: SP.duration, easing: SP.easing });
  }
}
async function closeLB(){
  if (lb.hidden || LB.closing) return; LB.closing = true;
  if (!reduced()) {
    const a = lbFrame.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(.95)' }], { duration: 190, easing: 'ease-in', fill: 'forwards' });
    const b = lbBg.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, fill: 'forwards' });
    const c = lbBar.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: 'forwards' });
    await Promise.all([done(a), done(b), done(c)]);
  }
  [lbFrame, lbBg, lbBar].forEach(el => el.getAnimations().forEach(x => x.cancel()));
  lb.hidden = true; document.documentElement.classList.remove('lb-open'); Loop.globalPause = Math.max(0, Loop.globalPause - 1);
  LB.closing = false;
  if (LB.last && LB.last.focus) LB.last.focus({ preventScroll: true });
}
async function goLB(d){
  if (LB.busy || LB.list.length < 2 || LB.closing) return; LB.busy = true;
  const n = (LB.idx + d + LB.list.length) % LB.list.length;
  if (reduced()) { setItem(n); LB.busy = false; return; }
  await done(lbFrame.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: `translateX(${-d * 32}px)` }], { duration: 140, easing: 'ease-in', fill: 'forwards' }));
  setItem(n); await decoded();
  lbFrame.getAnimations().forEach(x => x.cancel());
  await done(lbFrame.animate([{ opacity: 0, transform: `translateX(${d * 32}px)` }, { opacity: 1, transform: 'none' }], { duration: SP.duration, easing: SP.easing }));
  LB.busy = false;
}
$('#lbClose').addEventListener('click', closeLB);
lbBg.addEventListener('click', closeLB);
$('#lbStage').addEventListener('click', e => { if (e.target === lbStage) closeLB(); });
$('#lbPrev').addEventListener('click', () => goLB(-1));
$('#lbNext').addEventListener('click', () => goLB(1));
$('#lbCta').addEventListener('click', () => { /* ссылка открывается в новой вкладке */ });
document.addEventListener('keydown', e => {
  if (lb.hidden) return;
  if (e.key === 'Escape') { e.preventDefault(); closeLB(); }
  else if (e.key === 'ArrowLeft') goLB(-1);
  else if (e.key === 'ArrowRight') goLB(1);
  else if (e.key === 'Tab') {
    const f = $$('button:not([hidden]),a[href]', lb).filter(n => n.offsetParent !== null || n === document.activeElement);
    if (!f.length) return; const a = f[0], z = f[f.length - 1];
    if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
    else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
  }
});
let sx0 = null;
lbFrame.addEventListener('pointerdown', e => { sx0 = e.clientX; });
lbFrame.addEventListener('pointerup', e => { if (sx0 === null) return; const d = e.clientX - sx0; sx0 = null; if (Math.abs(d) > 60) goLB(d < 0 ? 1 : -1); });







})();

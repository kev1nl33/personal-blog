// 移植自已购 Modulify Cutout；原生 DOM 接入，Canvas 字形遮罩与 GSAP 时间线。

 function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
(function () {
'use strict';
/* 给页面里的启动兜底看门用：脚本已接管、正在取数据，别急着放开静态列表。 */
window.memoirBooting = true;
const root = document.querySelector('.cut-root');
/* 载入失败（没有 GSAP、没有 2D context）就不能再让页面等：立刻交回静态列表。 */
if (!root || !window.gsap || !root.querySelector('canvas').getContext('2d')) {
 window.memoirBooting = false;
 if (window.memoirReleaseBoot) window.memoirReleaseBoot();
 return;
}
const gsap = window.gsap;
let phase = 'mat', moodIdx = null, geo = null;
const apiRef = {current: null};
const formOpenRef = {current: false};
const setFormOpen = () => {};
const hit = root.querySelector('.cut-hit');
const status = root.querySelector('.cut-status');
const backButton = root.querySelector('.cut-back');
const skipButton = root.querySelector('.cut-skip');
const fallback = document.querySelector('.memoir-fallback');
let filterBar = null, activeKeyword = null, viewer = null;
let lastChoice = null;
function setPhase(next) {
 const prior = phase; phase = next; root.dataset.phase = next; renderControls();
 if (next === 'sheet') { announceFrame(0); if (prior !== 'sheet') backButton.focus({preventScroll:true}); }
 if (next === 'mat' && lastChoice != null && !(filterBar && filterBar.contains(document.activeElement))) {
  /* 从筛选栏过来的话，焦点留在筛选按钮上，不抢回来。 */
  const buttons = hit.querySelectorAll('button');
  if (buttons[lastChoice]) buttons[lastChoice].focus({preventScroll:true});
 }
}
function setMoodIdx(next) { if (next != null) lastChoice = next; moodIdx = next; }
function setGeo(next) { geo = next; renderControls(); }
function finishBoot() {
 window.memoirBooting = false;
 clearTimeout(window.memoirBootTimeout);
 document.documentElement.classList.remove('memoir-pending');
}
function setReady() {
 if (document.documentElement.classList.contains('memoir-pending')) {
  root.classList.add('is-ready');
  fallback.hidden = true;
  buildFilter();
  finishBoot();
  return;
 }
 /* 数据晚于兜底期限才到：静态列表已经在屏幕上，先淡出再交给裁切桌，避免硬切。 */
 fallback.classList.add('memoir-fallback-out');
 window.setTimeout(() => {
  fallback.hidden = true;
  fallback.classList.remove('memoir-fallback-out');
  root.classList.add('is-ready');
  buildFilter();
  finishBoot();
 }, 200);
}
function setLaidOut() { root.dataset.laid = '1'; }
function announceFrame(i) {
 if (moodIdx == null) return;
 const m = MOODS[moodIdx], f = m.frames[i];
 if (!f) return;
 status.textContent = m.word + ' · ' + f.title + '，' + (i+1) + ' / ' + m.frames.length;
 hit.querySelectorAll('.cut-frame-hit').forEach((b,k) => b.setAttribute('aria-pressed', String(k === i)));
}
function renderControls() {
 backButton.hidden = phase !== 'sheet'; skipButton.hidden = phase !== 'cutting' && phase !== 'word';
 if (!geo) return;
 const key = phase === 'mat' ? 'words' : phase === 'sheet' ? 'frames' : 'none';
 const boxes = key === 'words' ? geo.words : key === 'frames' ? geo.frames : [];
 const stamp = key === 'frames' ? MOODS[moodIdx].frames.map(f => f.src).join('|') : key === 'words' ? MOODS.map(m => m.frames.length).join(',') : key;
 if (hit.dataset.kind !== key || hit.dataset.mood !== String(moodIdx) || hit.dataset.count !== String(boxes.length) || hit.dataset.stamp !== stamp) {
 hit.replaceChildren(); hit.dataset.kind = key; hit.dataset.mood = String(moodIdx); hit.dataset.count = String(boxes.length); hit.dataset.stamp = stamp;
 boxes.forEach((box,i) => {
  const button = document.createElement('button'); button.type = 'button';
  button.className = key === 'words' ? 'cut-word-hit' : 'cut-frame-hit';
  const m = key === 'words' ? MOODS[i] : MOODS[moodIdx];
  if (key === 'words') {
   const count = m.frames.length;
   button.dataset.count = String(count);
   button.setAttribute('aria-label', m.word + ' — ' + m.note + '，' + (count ? count + ' 张照片' : '暂无照片'));
   /* 用 aria-disabled 而不是 disabled：0 张的词仍可被读到，但点不动。 */
   if (!count) button.setAttribute('aria-disabled', 'true');
  } else {
   const frame = m.frames[i];
   if (!frame) return;
   button.setAttribute('aria-label', '查看：' + frame.title);
  }
  const hover = on => key === 'words' ? _optionalChain([apiRef, 'access', _7 => _7.current, 'optionalAccess', _8 => _8.hoverWord, 'call', _9 => _9(on ? i : null)]) : _optionalChain([apiRef, 'access', _10 => _10.current, 'optionalAccess', _11 => _11.hoverFrame, 'call', _12 => _12(on ? i : null)]);
  button.addEventListener('pointerenter', () => hover(true)); button.addEventListener('pointerleave', () => hover(false));
  button.addEventListener('focus', () => hover(true)); button.addEventListener('blur', () => hover(false));
  button.addEventListener('click', () => {
   if (key === 'words') {
    if (m.frames.length) _optionalChain([apiRef, 'access', _13 => _13.current, 'optionalAccess', _14 => _14.choose, 'call', _15 => _15(i)]);
   } else openViewer(m.frames[i]);
  });
  hit.append(button);
 });
 }
 [...hit.children].forEach((button,i) => { const b = boxes[i]; if (!b) return; Object.assign(button.style, {left: b.x-b.w/2+'px', top:b.y-b.h/2+'px', width:b.w+'px',height:b.h+'px', transform:'rotate('+(b.rot || 0)+'deg)'}); });
 if (phase === 'sheet') Object.assign(backButton.style, {left:geo.sheet.x+'px', top:geo.sheet.y+geo.sheet.h+12+'px'});
}
backButton.addEventListener('click', () => _optionalChain([apiRef, 'access', _19 => _19.current, 'optionalAccess', _20 => _20.back, 'call', _21 => _21()]));
skipButton.addEventListener('click', () => _optionalChain([apiRef, 'access', _22 => _22.current, 'optionalAccess', _23 => _23.skip, 'call', _24 => _24()]));
function buildFilter() {
 if (filterBar || !MEMOIR.photos.length) return;
 filterBar = document.createElement('div');
 filterBar.className = 'memoir-filter';
 filterBar.setAttribute('role', 'toolbar');
 filterBar.setAttribute('aria-label', '按关键词筛选照片');
 const keywords = [...MEMOIR.byKeyword.keys()].sort((a, b) => MEMOIR.byKeyword.get(b).length - MEMOIR.byKeyword.get(a).length || a.localeCompare(b, 'zh'));
 ['全部', ...keywords].forEach(keyword => {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = keyword;
  button.dataset.keyword = keyword === '全部' ? '' : keyword;
  button.setAttribute('aria-pressed', String(keyword === '全部'));
  button.addEventListener('click', () => applyFilter(keyword === '全部' ? null : keyword));
  filterBar.append(button);
 });
 root.parentNode.insertBefore(filterBar, root);
}
function publishStatus() {
 if (phase !== 'mat' || moodIdx != null) return;
 status.textContent = (activeKeyword || '全部') + ' · ' + POOL.length + ' 张照片 / 选一种心情开始';
}
function applyFilter(keyword) {
 const same = keyword === activeKeyword;
 /* 筛选只管片源：无论之前停在裁切桌上还是已经剪开，
   点任意关键词都回到挑词状态，不替用户选心情。 */
 if (same && phase === 'mat') return;
 if (!same) {
  const next = keyword ? MEMOIR.photos.filter(photo => photo.keywords.includes(keyword)) : MEMOIR.photos.slice();
  if (!next.length) return;
  activeKeyword = keyword;
  POOL = next;
  if (filterBar) [...filterBar.children].forEach(button => button.setAttribute('aria-pressed', String(button.dataset.keyword === (keyword || ''))));
 }
 const api = apiRef.current;
 if (api && api.refreshPool) api.refreshPool();
}
function setPageInert(on) {
 ['main', '.site-nav', '.site-footer', '.back-to-top'].forEach(selector => {
  const element = document.querySelector(selector);
  if (element) element.inert = on;
 });
}
function openViewer(frame) {
 if (!frame || !frame.photo) return;
 const photo = frame.photo;
 if (!viewer) {
  viewer = document.createElement('div');
  viewer.className = 'memoir-viewer';
  viewer.hidden = true;
  viewer.setAttribute('role', 'dialog');
  viewer.setAttribute('aria-modal', 'true');
  viewer.tabIndex = -1;
  viewer.innerHTML = '<button type="button" class="memoir-viewer-close">关闭</button><div class="memoir-viewer-frame"><img alt=""><div class="memoir-viewer-bar"><span class="memoir-viewer-meta"><span></span><strong></strong></span><a>去看这篇游记 →</a></div></div>';
  viewer.querySelector('.memoir-viewer-close').addEventListener('click', closeViewer);
  viewer.addEventListener('click', event => { if (event.target === viewer) closeViewer(); });
  document.body.append(viewer);
 }
 const image = viewer.querySelector('img');
 /* 大图沿用静态列表里的真实宽高，避免打开时因尺寸未知产生跳动。 */
 const source = [...fallback.querySelectorAll('img')].find(item => item.getAttribute('src') === photo.src);
 if (source) { image.width = Number(source.getAttribute('width')); image.height = Number(source.getAttribute('height')); }
 /* 大图查看优先 1600w WebP；变体缺失时 main.js 的 <picture> 回退逻辑不适用这里，
    直接监听 error 落回原 JPG。 */
 if (photo.webp && photo.webp['1600']) {
  /* 换图前先摘掉上一张遗留的监听，避免旧照片的回退把手误改当前大图。 */
  if (image.memoirFallback) {
   image.removeEventListener('error', image.memoirFallback);
   image.removeEventListener('load', image.memoirFallback);
  }
  const onViewerFallback = () => {
   image.removeEventListener('error', onViewerFallback);
   image.removeEventListener('load', onViewerFallback);
   image.memoirFallback = null;
   image.src = photo.src;
  };
  image.memoirFallback = onViewerFallback;
  image.addEventListener('error', onViewerFallback);
  image.addEventListener('load', onViewerFallback);
  image.src = photo.webp['1600'];
 } else {
  image.src = photo.src;
 }
 image.alt = photo.alt;
 viewer.querySelector('.memoir-viewer-meta span').textContent = photo.country + ' · ' + photo.year;
 viewer.querySelector('.memoir-viewer-meta strong').textContent = photo.title;
 const link = viewer.querySelector('a');
 link.href = photo.journal;
 link.textContent = '去看这篇游记：' + photo.journalLabel + ' →';
 viewer.setAttribute('aria-label', photo.title);
 viewer.hidden = false;
 document.body.dataset.viewer = '1';
 setPageInert(true);
 viewer.focus();
}
function closeViewer() {
 if (!viewer || viewer.hidden) return;
 viewer.hidden = true;
 delete document.body.dataset.viewer;
 setPageInert(false);
 const current = hit.querySelector('.cut-frame-hit[aria-pressed="true"]');
 if (current) current.focus();
}
const F = (
  src,
  title,
  place,
  year,
  project,
  select
) => ({ src, title, place, year, project, select });
const MOODS = [
  {
    "id": "bold",
    "word": "BOLD",
    "paper": "#DE3B22",
    "ink": "#FFF3E4",
    "pencil": "#FFE66B",
    "grade": {
      "filter": "saturate(1.24) contrast(1.12)",
      "cast": "rgba(255,74,32,0.10)",
      "castAlpha": 1,
      "grain": 0.28,
      "vignette": 0.2
    }
  },
  {
    "id": "soft",
    "word": "SOFT",
    "paper": "#EFE3D2",
    "ink": "#33291F",
    "pencil": "#B4795A",
    "grade": {
      "filter": "saturate(0.86) contrast(0.92) brightness(1.06)",
      "cast": "rgba(255,236,214,0.14)",
      "castAlpha": 1,
      "grain": 0.14,
      "vignette": 0.08
    }
  },
  {
    "id": "raw",
    "word": "RAW",
    "paper": "#191715",
    "ink": "#F4F1E8",
    "pencil": "#FF5B39",
    "grade": {
      "filter": "grayscale(1) contrast(1.3) brightness(0.96)",
      "cast": "rgba(20,22,26,0.10)",
      "castAlpha": 1,
      "grain": 0.62,
      "vignette": 0.3
    }
  },
  {
    "id": "dreamy",
    "word": "DREAMY",
    "paper": "#BFC7EA",
    "ink": "#262A45",
    "pencil": "#E86BA0",
    "grade": {
      "filter": "saturate(1.06) contrast(0.9) brightness(1.05)",
      "cast": "rgba(168,150,255,0.16)",
      "castAlpha": 1,
      "grain": 0.2,
      "vignette": 0.14
    }
  },
  {
    "id": "cinematic",
    "word": "CINEMATIC",
    "paper": "#EFB61F",
    "ink": "#241C10",
    "pencil": "#CC3A22",
    "grade": {
      "filter": "saturate(1.02) contrast(1.16) brightness(0.97)",
      "cast": "rgba(24,42,64,0.16)",
      "castAlpha": 1,
      "grain": 0.3,
      "vignette": 0.34
    }
  }
];
const STUDIO = {name: '计划李', city: '旅行', role: '旅行记录'};
const MEMOIR = {photos: [], byKeyword: new Map(), moods: []};
let memoirReady = null;
let POOL = [];
function loadMemoir() {
 if (memoirReady) return memoirReady;
 memoirReady = fetch('data/memoir.json')
  .then(response => { if (!response.ok) throw new Error(response.status); return response.json(); })
  .then(data => {
   const photos = Array.isArray(data.photos) ? data.photos : [];
   MEMOIR.photos = photos;
   MEMOIR.byKeyword = new Map();
   photos.forEach((photo, index) => {
    photo.keywords.forEach(keyword => {
     if (!MEMOIR.byKeyword.has(keyword)) MEMOIR.byKeyword.set(keyword, []);
     MEMOIR.byKeyword.get(keyword).push(index);
    });
   });
   /* 心情→关键词的映射来自数据文件，五个心情各分到一组照片。 */
   MEMOIR.moods = Array.isArray(data.moods) ? data.moods : [];
   MOODS.forEach(m => {
    const row = MEMOIR.moods.find(item => item.word === m.word);
    m.keywords = row && Array.isArray(row.keywords) ? row.keywords.slice() : [];
    if (row && typeof row.note === 'string' && row.note) m.note = row.note;
   });
  })
  .catch(() => {});
 return memoirReady;
}
/* 当前筛选结果就是唯一片源，再按心情的关键词分组。命中多少张就剪多少张，
   不再截断：只展示同时命中筛选和这个心情的照片。 */
function pickFrames(moodIndex) {
 const list = POOL;
 if (!list.length) return [];
 const keywords = (MOODS[moodIndex] && MOODS[moodIndex].keywords) || [];
 const matched = keywords.length ? list.filter(photo => photo.keywords.some(keyword => keywords.includes(keyword))) : [];
 if (!matched.length) return [];
 return matched.map((photo, i) => {
  return {src: photo.src, title: photo.title, place: photo.country, year: photo.year, project: 0, select: i === 0 || i === 4, photo};
 });
}
MOODS.forEach((m, mi) => {
 m.note = ['鲜明的街头','温柔的日常','城市的切面','游走的光影','像电影的一刻'][mi];
 m.keywords = [];
 m.stock = '2023 — 2026';
 /* 页面级简介：只在裁切桌上出现，不再当成每张照片的介绍。 */
 m.projects = [{name: '旅行手记', blurb: '2023 到 2026，新加坡、日本、澳大利亚与英国。把旅途中看见的光和日常，留在照片里。'}];
 /* 首帧在数据到达前占位，避免第一次测量时出现零列网格。 */
 m.frames = [{src: '', title: '—', place: '', year: '', project: 0, select: false}];
});
const LIGHT = {
  desk: "#E7DFCE",
  deskEdge: "#D3C8B1",
  mat: "#2C4E3E",
  matMottle: "#356049",
  matWash: 0.1,
  matGrid: "rgba(233,240,216,0.15)",
  matGridBold: "rgba(238,244,222,0.32)",
  matWear: "rgba(232,240,222,0.11)",
  matLabel: "rgba(244,249,236,0.92)",
  sheet: "#F6F1E6",
  sheetInk: "#241F19",
  shadow: "rgba(38,30,20,0.34)",
  propDim: 0,
  stain: "rgba(96,64,30,0.3)",
};
const DARK = {
  desk: "#141210",
  deskEdge: "#080807",
  mat: "#12241E",
  matMottle: "#172E25",
  matWash: 0.62,
  matGrid: "rgba(168,208,184,0.085)",
  matGridBold: "rgba(182,218,194,0.17)",
  matWear: "rgba(178,214,190,0.07)",
  matLabel: "rgba(206,230,214,0.72)",
  sheet: "#E4DDCF",
  sheetInk: "#221D17",
  shadow: "rgba(0,0,0,0.72)",
  propDim: 0.46,
  stain: "rgba(120,80,38,0.22)",
};
const WORD_SLOTS = [
  { k: 0.205, nx: 0.79, ny: 0.16, rot: -6 }, // BOLD
  { k: 0.185, nx: 0.135, ny: 0.55, rot: 4 }, // SOFT
  { k: 0.15, nx: 0.4, ny: 0.62, rot: -3 }, // RAW
  { k: 0.245, nx: 0.775, ny: 0.5, rot: 5 }, // DREAMY
  { k: 0.33, nx: 0.42, ny: 0.86, rot: -2 }, // CINEMATIC
];
const WORD_SLOTS_W = [
  { k: 0.17, nx: 0.78, ny: 0.13, rot: -5 }, // BOLD
  { k: 0.15, nx: 0.14, ny: 0.6, rot: 4 }, // SOFT
  { k: 0.12, nx: 0.6, ny: 0.6, rot: -3 }, // RAW — clear of `feel?` at (.50,.285)
  { k: 0.19, nx: 0.79, ny: 0.44, rot: 4 }, // DREAMY
  { k: 0.26, nx: 0.44, ny: 0.8, rot: -2 }, // CINEMATIC
];
const WORD_SLOTS_T = [
  { k: 0.3, nx: 0.66, ny: 0.34, rot: -5 }, // BOLD
  { k: 0.26, nx: 0.25, ny: 0.46, rot: 4 }, // SOFT
  { k: 0.2, nx: 0.63, ny: 0.58, rot: -3 }, // RAW
  { k: 0.34, nx: 0.33, ny: 0.7, rot: 4 }, // DREAMY
  { k: 0.46, nx: 0.56, ny: 0.86, rot: -2 }, // CINEMATIC
];
const WORD_SLOTS_M = [
  { k: 0.42, nx: 0.33, ny: 0.4, rot: -5 },
  { k: 0.38, nx: 0.7, ny: 0.52, rot: 4 },
  { k: 0.3, nx: 0.26, ny: 0.63, rot: -3 },
  { k: 0.5, nx: 0.58, ny: 0.74, rot: 3 },
  { k: 0.72, nx: 0.5, ny: 0.88, rot: -2 },
];
const STICKERS = {
  camera: { src: "camera.png", ar: 640 / 496 },
  film: { src: "film.png", ar: 640 / 482 },
  polaroids: { src: "polaroids.png", ar: 640 / 637 },
  lens: { src: "lens.png", ar: 640 / 578 },
  meter: { src: "meter.png", ar: 398 / 640 },
} ;
const S = (k) => STICKERS[k];
const PROPS = [
  { id: "camera", photo: S("camera"), nx: 0.60, ny: 0.06, w: 0.052, rot: 9, z: 24, m: { nx: 0.86, ny: 0.035 } },
  { id: "meter", photo: S("meter"), nx: 0.952, ny: 0.30, w: 0.038, rot: 12 },
  { id: "polaroids", photo: S("polaroids"), nx: 0.058, ny: 0.735, w: 0.085, rot: -10, z: 22 },
  { id: "film", photo: S("film"), nx: 0.092, ny: 0.935, w: 0.092, rot: 7, m: { nx: 0.2, ny: 0.968 } },
  { id: "lens", photo: S("lens"), nx: 0.928, ny: 0.9, w: 0.022, rot: -7 },
];
const LETTER_K = 0.04;
const LETTER_D = 0.152;
const MAT_MINOR = 54; // minor squares across the mat
const MAT_MAJOR = 5; // a heavy line every N
const FRAME_AR = 1.5; // 3:2, landscape
const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const ease3 = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
function seeded(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
    const root0 = root;
    const cv0 = root.querySelector("canvas");
    const layer0 = root.querySelector(".cut-props");
    if (!root0 || !cv0 || !layer0) return;
    const ctx0 = cv0.getContext("2d");
    if (!ctx0) return;
    const cv = cv0;
    const propLayer = layer0;
    const ctx = ctx0;
    let reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const csRoot = getComputedStyle(root);
    const FACE =
      csRoot.getPropertyValue("--font-archivo-black").trim() ||
      "'Archivo Black', Impact, sans-serif";
    const MONO =
      csRoot.getPropertyValue("--font-geist-mono").trim() ||
      "ui-monospace, monospace";
    let pal =
      document.documentElement.getAttribute("data-theme") === "dark"
        ? DARK
        : LIGHT;
    const CAN_FILTER = (() => {
      const t = document.createElement("canvas").getContext("2d");
      if (!t) return false;
      t.filter = "blur(1px)";
      return t.filter !== "none" && t.filter !== "";
    })();
    let W = root.clientWidth || 1;
    let H = root.clientHeight || 1;
    let dpr = Math.min(2, window.devicePixelRatio || 1);
    let mobile = W < 760; // `narrow`, kept under the old name — 40+ call sites
    let short = H < 560;
    let stack = true;
    let tall = false;
    let mat = { x: 0, y: 0, w: 1, h: 1 };
    let disposed = false;
    const st = {
      phase: "mat" ,
      mood: -1,
      hoverWord: -1,
      hoverFrame: -1,
      cut: 0,
      morph: 0,
      roll: 0,
      active: 0,
      prevActive: 0,
      heroFade: 1,
      hero: 0,
      sheetFade: 1,
      exiting: false,
      intro: 0,
      introMat: 0,
      lift: [0, 0, 0, 0, 0],
      pencil: 0,
      dash: 0,
      t: 0,
    };
    let letters = [];
    let holeCard = null;
    const introHead = Array.from({ length: 4 }, () => ({ v: 0 }));
    const introCards = Array.from({ length: 5 }, () => ({ v: 0 }));
    const px = { x: -9999, y: -9999, has: false };
    const cursor = { x: -9999, y: -9999 };
    const graded = new Map();
    const loading = new Set();
    function gradePhoto(m, src, img) {
      const key = m.id + "/" + src;
      const maxW = 1100;
      const scale = Math.min(1, maxW / img.naturalWidth);
      const w = Math.max(2, Math.round(img.naturalWidth * scale));
      const h = Math.max(2, Math.round(img.naturalHeight * scale));
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      const g = c.getContext("2d");
      if (!g) return;
      if (CAN_FILTER) g.filter = m.grade.filter;
      g.drawImage(img, 0, 0, w, h);
      g.filter = "none";
      g.globalAlpha = m.grade.castAlpha;
      g.fillStyle = m.grade.cast;
      g.fillRect(0, 0, w, h);
      if (m.grade.vignette > 0) {
        const vg = g.createRadialGradient(
          w / 2,
          h / 2,
          Math.min(w, h) * 0.28,
          w / 2,
          h / 2,
          Math.max(w, h) * 0.72
        );
        vg.addColorStop(0, "rgba(0,0,0,0)");
        vg.addColorStop(1, `rgba(8,6,4,${m.grade.vignette})`);
        g.fillStyle = vg;
        g.fillRect(0, 0, w, h);
      }
      if (m.grade.grain > 0) {
        const rnd = seeded(src.length * 7919 + w);
        g.globalAlpha = m.grade.grain * 0.5;
        for (let i = 0; i < w * h * 0.012; i++) {
          const gx = rnd() * w;
          const gy = rnd() * h;
          const v = rnd();
          g.fillStyle = v > 0.5 ? "rgba(255,252,244,0.5)" : "rgba(10,8,6,0.5)";
          g.fillRect(gx, gy, 1.2, 1.2);
        }
        g.globalAlpha = 1;
      }
      graded.set(key, c);
      /* 筛选会把同一心情的片源换掉，旧调色缓存不再被引用；
         只留最近 30 张，避免反复筛选把内存堆到几百 MB。 */
      while (graded.size > 30) graded.delete(graded.keys().next().value);
    }
    function loadMood(m) {
      for (const f of m.frames) {
        if (!f) continue;
        const key = m.id + "/" + f.src;
        if (graded.has(key) || loading.has(key)) continue;
        loading.add(key);
        const img = new Image();
        img.decoding = "async";
        /* 数据里有 WebP 变体就优先用 800w（裁切桌调色上限 1100px），
           解码失败一次就换回原 JPG，画布上不会留空帧。 */
        const variant = f.photo && f.photo.webp && f.photo.webp["800"];
        let fellBack = !variant;
        const done = () => {
          if (disposed) return;
          try {
            gradePhoto(m, f.src, img);
          } catch (e2) {
          }
          loading.delete(key);
        };
        let retrying = false;
        const retryOriginal = () => {
          if (fellBack || retrying) { if (!retrying) loading.delete(key); return; }
          retrying = true;
          img.src = f.src;
          img.decode().then(done).catch(() => { loading.delete(key); });
        };
        img.addEventListener("error", retryOriginal);
        img.src = variant || f.src;
        if (img.decode) img.decode().then(done).catch(retryOriginal);
        else img.onload = done;
      }
    }
    const photoFor = (i) => {
      if (st.mood < 0) return null;
      const m = MOODS[st.mood];
      const f = m.frames[i];
      if (!f) return null;
      return _nullishCoalesce(graded.get(m.id + "/" + f.src), () => ( null));
    };
    let matCache = null;
    let matArt = null;
    const feltTile = (() => {
      const T = 168;
      const c = document.createElement("canvas");
      c.width = c.height = T;
      const g2 = c.getContext("2d");
      if (!g2) return c;
      const im = g2.createImageData(T, T);
      const rnd = seeded(0x5EED);
      const coarse = new Float64Array((T / 3) * (T / 3));
      for (let i = 0; i < coarse.length; i++) coarse[i] = rnd();
      for (let y = 0; y < T; y++)
        for (let x = 0; x < T; x++) {
          const cq = coarse[((y / 3) | 0) * (T / 3) + ((x / 3) | 0)];
          const v = 128 + (rnd() - 0.5) * 46 + (cq - 0.5) * 30;
          const i = (y * T + x) * 4;
          im.data[i] = im.data[i + 1] = im.data[i + 2] = v;
          im.data[i + 3] = 255;
        }
      g2.putImageData(im, 0, 0);
      return c;
    })();
    function buildMat() {
      const c = document.createElement("canvas");
      c.width = Math.max(2, Math.round(W * dpr));
      c.height = Math.max(2, Math.round(H * dpr));
      const g = c.getContext("2d");
      if (!g) return;
      g.scale(dpr, dpr);
      g.fillStyle = pal.desk;
      g.fillRect(0, 0, W, H);
      const edge = g.createLinearGradient(0, 0, W, H);
      edge.addColorStop(0, "rgba(255,255,255,0.06)");
      edge.addColorStop(0.5, "rgba(0,0,0,0)");
      edge.addColorStop(1, pal.deskEdge);
      g.fillStyle = edge;
      g.fillRect(0, 0, W, H);
      const rndDesk = seeded(4242);
      g.globalAlpha = 0.05;
      for (let i = 0; i < 240; i++) {
        const y = rndDesk() * H;
        g.fillStyle = rndDesk() > 0.5 ? "#FFFFFF" : "#5B4A31";
        g.fillRect(rndDesk() * W, y, 40 + rndDesk() * 180, 1);
      }
      g.globalAlpha = 1;
      const r = Math.min(14, mat.w * 0.012);
      g.save();
      g.shadowColor = pal.shadow;
      g.shadowBlur = Math.max(18, mat.w * 0.022);
      g.shadowOffsetY = Math.max(8, mat.h * 0.012);
      g.fillStyle = pal.mat;
      roundRect(g, mat.x, mat.y, mat.w, mat.h, r);
      g.fill();
      g.restore();
      g.save();
      roundRect(g, mat.x, mat.y, mat.w, mat.h, r);
      g.clip();
      const cell = mat.w / (mobile ? 16 : 34);
      if (matArt) {
        g.drawImage(matArt, mat.x, mat.y, mat.w, mat.h);
        g.save();
        g.globalCompositeOperation = "multiply";
        g.globalAlpha = pal.matWash;
        g.fillStyle = pal.mat;
        g.fillRect(mat.x, mat.y, mat.w, mat.h);
        g.restore();
      } else {
      const sq = mat.w / MAT_MINOR;
      g.fillStyle = pal.mat;
      g.fillRect(mat.x, mat.y, mat.w, mat.h);
      const rndM = seeded(3121);
      g.save();
      g.globalAlpha = 0.2;
      g.fillStyle = pal.matMottle;
      for (let i = 0; i < 44; i++) {
        const bx = mat.x + rndM() * mat.w;
        const by = mat.y + rndM() * mat.h;
        const br = mat.w * (0.02 + rndM() * 0.055);
        const rg = g.createRadialGradient(bx, by, 0, bx, by, br);
        rg.addColorStop(0, pal.matMottle);
        rg.addColorStop(1, "rgba(0,0,0,0)");
        g.fillStyle = rg;
        g.fillRect(bx - br, by - br, br * 2, br * 2);
      }
      g.restore();
      const felt = g.createPattern(feltTile, "repeat");
      if (felt) {
        g.save();
        g.globalCompositeOperation = "overlay";
        g.globalAlpha = 0.34;
        g.fillStyle = felt;
        g.fillRect(mat.x, mat.y, mat.w, mat.h);
        g.restore();
      }
      g.save();
      g.setTransform(1, 0, 0, 1, 0, 0);
      const D = (v) => Math.round(v * dpr);
      const x0 = D(mat.x), y0 = D(mat.y);
      const x1 = D(mat.x + mat.w), y1 = D(mat.y + mat.h);
      const step = (sq * dpr);
      const nx = Math.round(mat.w / sq);
      const ny = Math.round(mat.h / sq);
      for (let i = 1; i < nx; i++) {
        const major = i % MAT_MAJOR === 0;
        g.fillStyle = major ? pal.matGridBold : pal.matGrid;
        g.fillRect(Math.round(x0 + i * step), y0, major ? Math.max(2, dpr) : 1, y1 - y0);
      }
      for (let i = 1; i < ny; i++) {
        const major = i % MAT_MAJOR === 0;
        g.fillStyle = major ? pal.matGridBold : pal.matGrid;
        g.fillRect(x0, Math.round(y0 + i * step), x1 - x0, major ? Math.max(2, dpr) : 1);
      }
      g.restore();
      }
      const rnd = seeded(90210);
      g.save();
      g.lineCap = "butt";
      for (let i = 0; matArt ? false : i < 190; i++) {
        const x = mat.x + rnd() * mat.w;
        const y = mat.y + rnd() * mat.h;
        const r = rnd();
        const a =
          r < 0.42
            ? (rnd() - 0.5) * 0.03
            : r < 0.76
              ? Math.PI / 2 + (rnd() - 0.5) * 0.03
              : rnd() * Math.PI;
        const len = (r > 0.76 ? 0.05 + rnd() * 0.26 : 0.02 + rnd() * 0.13) * mat.w;
        const deep = rnd();
        g.globalAlpha = deep < 0.12 ? 1 : deep < 0.45 ? 0.55 : 0.28;
        g.strokeStyle = pal.matWear;
        g.lineWidth = deep < 0.12 ? 1.5 : deep < 0.45 ? 1 : 0.7;
        g.beginPath();
        g.moveTo(x, y);
        g.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len);
        g.stroke();
      }
      g.restore();
      const stainX = mat.x + mat.w * 0.7;
      const stainY = mat.y + mat.h * 0.72;
      const stainR = mat.w * 0.052;
      const ring = g.createRadialGradient(
        stainX,
        stainY,
        stainR * 0.72,
        stainX,
        stainY,
        stainR
      );
      ring.addColorStop(0, "rgba(0,0,0,0)");
      ring.addColorStop(0.72, pal.stain);
      ring.addColorStop(0.94, pal.stain);
      ring.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = ring;
      g.beginPath();
      g.arc(stainX, stainY, stainR, 0, Math.PI * 2);
      g.fill();
      if (!matArt) {
      g.font = `500 ${Math.max(8, cell * 0.34)}px ${MONO}`;
      g.fillStyle = pal.matLabel;
      g.textAlign = "right";
      g.fillText(
        "A1 · 5mm",
        mat.x + mat.w - cell * 0.5,
        mat.y + mat.h - cell * 0.35
      );
      if (!mobile) {
      g.save();
      g.globalAlpha = 0.7;
      g.translate(mat.x + cell * 0.5, mat.y + mat.h * 0.42);
      g.rotate(-Math.PI / 2);
      g.textAlign = "center";
      g.font = `500 ${Math.max(7, cell * 0.28)}px ${MONO}`;
      g.fillText("SELF-HEALING CUTTING MAT", 0, 0);
      g.restore();
      }
      }
      g.textAlign = "left";
      g.restore();
      matCache = c;
    }
    const grainTile = (() => {
      const c = document.createElement("canvas");
      c.width = c.height = 140;
      const g = c.getContext("2d");
      if (!g) return c;
      const d = g.createImageData(140, 140);
      const rnd = seeded(1337);
      for (let i = 0; i < d.data.length; i += 4) {
        const v = 118 + rnd() * 74;
        d.data[i] = d.data[i + 1] = d.data[i + 2] = v;
        d.data[i + 3] = 26;
      }
      g.putImageData(d, 0, 0);
      return c;
    })();
    let wordBoxes
 = [];
    let sheet = { x: 0, y: 0, w: 1, h: 1, pad: 10, headH: 10, gx: 8, gy: 8 };
    let hero = { x: 0, y: 0, w: 1, h: 1 };
    let credit = { x: 0, y: 0, w: 1, h: 1 };
    let frameBox = { w: 10, h: 7 };
    let framePos = [];
    let centre = { x: 0, y: 0, g: 100 };
    function measureWord(word, size) {
      ctx.font = `${size}px ${FACE}`;
      let adv = 0;
      let asc = 0;
      let desc = 0;
      for (const ch of word) {
        const m = ctx.measureText(ch);
        adv += m.width;
        asc = Math.max(asc, m.actualBoundingBoxAscent || size * 0.72);
        desc = Math.max(desc, m.actualBoundingBoxDescent || 0);
      }
      return { adv, asc, desc };
    }
    function layout() {
      W = root.clientWidth || 1;
      H = root.clientHeight || 1;
      mobile = W < 760;
      short = H < 560;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = Math.max(2, Math.round(W * dpr));
      cv.height = Math.max(2, Math.round(H * dpr));
      cv.style.width = W + "px";
      cv.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const ix = mobile ? W * 0.018 : W * 0.022;
      const iyTop = mobile ? H * 0.02 : H * 0.026;
      const iyBot = mobile ? H * 0.02 : H * 0.026;
      mat = { x: ix, y: iyTop, w: W - ix * 2, h: H - iyTop - iyBot };
      const ar = mat.w / mat.h;
      stack = mobile || ar < 1.2;
      tall = !mobile && ar < 1.25;
      const slots = mobile
        ? WORD_SLOTS_M
        : ar >= 1.95
          ? WORD_SLOTS_W
          : ar < 1.25
            ? WORD_SLOTS_T
            : WORD_SLOTS;
      wordBoxes = MOODS.map((m, i) => {
        const s = slots[i];
        const targetW = mat.w * s.k;
        const ref = measureWord(m.word, 100);
        const g = (targetW / ref.adv) * 100;
        const mm = measureWord(m.word, g);
        const padX = g * 0.15;
        const padY = g * 0.2;
        return {
          x: mat.x + mat.w * s.nx,
          y: mat.y + mat.h * s.ny,
          w: mm.adv + padX * 2,
          h: mm.asc + mm.desc + padY * 2,
          rot: (s.rot * Math.PI) / 180,
          g,
          adv: mm.adv,
          asc: mm.asc,
          desc: mm.desc,
        };
      });
      const n = _nullishCoalesce(_optionalChain([MOODS, 'access', _25 => _25[Math.max(0, st.mood)], 'optionalAccess', _26 => _26.frames, 'access', _27 => _27.length]), () => ( 1));
      /* 帧数没有上限了：一排放不下就折行，并让每行张数尽量均匀，
         免得 12 张挤成一行细条、最后一行又孤零零剩一两张。 */
      const maxCols = stack && !short ? 5 : 6;
      const cols = n > maxCols ? Math.ceil(n / Math.ceil(n / maxCols)) : Math.max(n, 1);
      const rows = Math.max(1, Math.ceil(n / cols));
      const solve = (sw) => {
        const pad = sw * (stack ? 0.045 : 0.03);
        const inner = sw - pad * 2;
        const headH = sw * (short ? 0.062 : stack ? 0.155 : 0.078) + sw * 0.008;
        const gapCol = sw * (stack ? 0.03 : 0.042);
        const heroW = stack ? inner : inner * (short ? 0.44 : 0.585);
        const heroH = heroW / FRAME_AR;
        const rightW = stack ? inner : inner - heroW - gapCol;
        let creditH = 0;
        if (stack) {
          const U2 = Math.max(10, sw * 0.0125);
          const MED2 = Math.max(15, sw * 0.024);
          let tallest = 0;
          for (const mm of MOODS)
            for (const fr of mm.frames) {
              ctx.font = `${MED2}px ${FACE}`;
              const tl = wrapText(ctx, fr.title.toUpperCase(), 0, 0, inner, MED2 * 1.2, true);
              ctx.font = `400 ${U2}px ${MONO}`;
              /* 介绍区高度要按最长的那张照片量：note 有就量，没有就跳过。 */
              const note = fr.photo && typeof fr.photo.note === 'string' ? fr.photo.note.trim() : '';
              const nl = note ? wrapText(ctx, note, 0, 0, inner, U2 * 1.7, true) : 0;
              const src = fr.photo && fr.photo.journalLabel ? '来自：' + fr.photo.journalLabel : '';
              const sl = src ? wrapText(ctx, src, 0, 0, inner, U2 * 1.7, true) : 0;
              tallest = Math.max(
                tallest,
                MED2 * 0.9 + tl * MED2 * 1.2 +
                  (nl ? U2 * 0.8 + nl * U2 * 1.7 : 0) +
                  (sl ? U2 * 1.5 + sl * U2 * 1.7 : 0) +
                  U2 * 2.5
              );
            }
          creditH = tallest + sw * 0.045;
        }
        const gapStrip = sw * (stack ? 0.1 : short ? 0.028 : 0.045);
        const gx = sw * (stack && !short ? 0.018 : 0.011);
        const gy = sw * 0.03;
        let fw = (inner - gx * (cols - 1)) / cols;
        /* 只有一两张照片时不要让相框撑满整张纸：
           三比二的相框越高，整张纸就越窄。桌面端把单帧收进半栏并居中。 */
        if (!stack && n <= 4) fw = Math.min(fw, inner * 0.46);
        const fh = fw / FRAME_AR;
        const capH = Math.max(
          short ? 11 : 14,
          Math.min(fw * (stack ? 0.34 : 0.28), sw * (stack ? 0.06 : 0.055))
        );
        const sh =
          pad * 2 + headH + heroH + creditH + gapStrip +
          rows * (fh + capH) + (rows - 1) * gy;
        return { sw, pad, inner, headH, gapCol, heroW, heroH, rightW, creditH,
                 gapStrip, gx, gy, fw, fh, capH, sh };
      };
      const topClear = mobile
        ? mat.h * 0.02
        : short
          ? Math.max(38, H * 0.075)
          : Math.max(84, H * 0.105);
      const botClear = mobile
        ? mat.h * 0.1
        : short
          ? Math.max(40, H * 0.08)
          : Math.max(64, H * 0.082);
      const bandY = mat.y + topClear;
      const bandH = mat.h - topClear - botClear;
      const maxH = bandH;
      let S = solve(
        Math.min(mat.w * (stack ? 0.94 : short ? 0.96 : 0.9), H * (short ? 2.6 : 1.62))
      );
      if (S.sh > maxH) S = solve(S.sw * (maxH / S.sh));
      const { sw, pad, headH, gapCol, heroW, heroH, rightW, creditH,
              gapStrip, gx, gy, fw, fh, capH, sh } = S;
      sheet = {
        x: W / 2 - sw / 2,
        y: bandY + (bandH - sh) / 2,
        w: sw,
        h: sh,
        pad,
        headH,
        gx,
        gy: gy + capH,
      };
      hero = {
        x: sheet.x + pad,
        y: sheet.y + pad + headH,
        w: heroW,
        h: heroH,
      };
      credit = stack
        ? { x: sheet.x + pad, y: hero.y + heroH + sw * 0.045, w: rightW, h: creditH }
        : { x: sheet.x + pad + heroW + gapCol, y: hero.y, w: rightW, h: heroH };
      frameBox = { w: fw, h: fh };
      const stripY = hero.y + heroH + creditH + gapStrip;
      const rowW = cols * fw + (cols - 1) * gx;
      const rowX = sheet.x + pad + (sw - pad * 2 - rowW) / 2;
      framePos = [];
      for (let i = 0; i < n; i++) {
        const c = i % cols;
        const r = Math.floor(i / cols);
        framePos.push({
          x: rowX + c * (fw + gx) + fw / 2,
          y: stripY + r * (fh + capH + gy) + fh / 2,
        });
      }
      const cw = Math.min(mat.w * (mobile ? 0.9 : 0.82), W * 0.86);
      centre = { x: W / 2, y: mat.y + mat.h * 0.46, g: 100 };
      if (st.mood >= 0) {
        const ref = measureWord(MOODS[st.mood].word, 100);
        centre.g = (cw / ref.adv) * 100;
      }
      buildMat();
      rebuildLetters(true);
      if (st.mood >= 0) buildHoleCard();
      adoptProps();
      placeProps();
      publishGeo();
    }
    function publishGeo() {
      setGeo({
        words: wordBoxes.map((b) => ({
          x: b.x,
          y: b.y,
          w: b.w,
          h: b.h,
          rot: (b.rot * 180) / Math.PI,
        })),
        frames: framePos.map((p) => ({
          x: p.x,
          y: p.y,
          w: frameBox.w,
          h: frameBox.h,
        })),
        sheet: { ...sheet },
        credit: { ...credit },
        mobile,
        short,
      });
    }
    function rebuildLetters(keepSim) {
      if (st.mood < 0) {
        letters = [];
        holeCard = null;
        return;
      }
      const m = MOODS[st.mood];
      const box = wordBoxes[st.mood];
      const cm = measureWord(m.word, centre.g);
      const prev = keepSim ? letters : [];
      ctx.font = `${box.g}px ${FACE}`;
      let hcur = -box.adv / 2;
      ctx.font = `${centre.g}px ${FACE}`;
      let tcur = -cm.adv / 2;
      const ref100 = measureWord(m.word, 100);
      const asc = ref100.asc;
      const desc = ref100.desc;
      const rnd = seeded(st.mood * 7717 + 13);
      letters = Array.from(m.word).map((ch, i) => {
        ctx.font = `100px ${FACE}`;
        const adv = ctx.measureText(ch).width;
        const hAdv = (adv * box.g) / 100;
        const tAdv = (adv * centre.g) / 100;
        const lx = hcur + hAdv / 2;
        hcur += hAdv;
        const cos = Math.cos(box.rot);
        const sin = Math.sin(box.rot);
        const hx = box.x + lx * cos;
        const hy = box.y + lx * sin;
        const tx = centre.x + tcur + tAdv / 2;
        tcur += tAdv;
        const old = prev[i];
        return {
          ch,
          adv,
          asc,
          desc,
          hx,
          hy,
          hrot: box.rot,
          hg: box.g,
          tx,
          ty: centre.y,
          tg: centre.g,
          fx: _nullishCoalesce(_optionalChain([framePos, 'access', _28 => _28[i], 'optionalAccess', _29 => _29.x]), () => ( centre.x)),
          fy: _nullishCoalesce(_optionalChain([framePos, 'access', _30 => _30[i], 'optionalAccess', _31 => _31.y]), () => ( centre.y)),
          /* 筛选后照片少于单词字母数时（如 CINEMATIC 九帧只有一张“云海”），
             多出来的字母没有帧可去，原地淡出，不占一个不存在的相框。 */
          spare: !framePos[i],
          x: _nullishCoalesce(_optionalChain([old, 'optionalAccess', _32 => _32.x]), () => ( hx)),
          y: _nullishCoalesce(_optionalChain([old, 'optionalAccess', _33 => _33.y]), () => ( hy)),
          rot: _nullishCoalesce(_optionalChain([old, 'optionalAccess', _34 => _34.rot]), () => ( box.rot)),
          g: _nullishCoalesce(_optionalChain([old, 'optionalAccess', _35 => _35.g]), () => ( box.g)),
          vx: _nullishCoalesce(_optionalChain([old, 'optionalAccess', _36 => _36.vx]), () => ( 0)),
          vy: _nullishCoalesce(_optionalChain([old, 'optionalAccess', _37 => _37.vy]), () => ( 0)),
          vrot: _nullishCoalesce(_optionalChain([old, 'optionalAccess', _38 => _38.vrot]), () => ( 0)),
          vg: _nullishCoalesce(_optionalChain([old, 'optionalAccess', _39 => _39.vg]), () => ( 0)),
          freed: _nullishCoalesce(_optionalChain([old, 'optionalAccess', _40 => _40.freed]), () => ( false)),
          spin:
            _nullishCoalesce(_optionalChain([old, 'optionalAccess', _41 => _41.spin]), () => (
            (rnd() < 0.5 ? -1 : 1) * (0.5 + rnd() * 1.1) * (reduce ? 0.15 : 1))),
          dev: _nullishCoalesce(_optionalChain([old, 'optionalAccess', _42 => _42.dev]), () => ( 0)),
          fade: _nullishCoalesce(_optionalChain([old, 'optionalAccess', _43 => _43.fade]), () => ( 0)),
          homeT: _nullishCoalesce(_optionalChain([old, 'optionalAccess', _44 => _44.homeT]), () => ( 0)),
          rx: 0,
          ry: 0,
          rrot: 0,
          rg: 0,
          stamp: null,
          stampKey: "",
        } ;
      });
      holeCard = null;
    }
    function buildHoleCard() {
      if (st.mood < 0) return;
      const m = MOODS[st.mood];
      const box = wordBoxes[st.mood];
      const c = document.createElement("canvas");
      c.width = Math.max(2, Math.round(box.w * dpr));
      c.height = Math.max(2, Math.round(box.h * dpr));
      const g = c.getContext("2d");
      if (!g) return;
      g.scale(dpr, dpr);
      g.fillStyle = m.paper;
      roundRect(g, 0, 0, box.w, box.h, Math.min(4, box.h * 0.05));
      g.fill();
      g.font = `${box.g}px ${FACE}`;
      g.textAlign = "center";
      g.textBaseline = "alphabetic";
      const baseY = box.h / 2 + box.asc / 2;
      g.strokeStyle = "rgba(0,0,0,0.34)";
      g.lineWidth = Math.max(2, box.g * 0.03);
      let cur = box.w / 2 - box.adv / 2;
      for (const ch of m.word) {
        const a = (g.measureText(ch).width);
        g.strokeText(ch, cur + a / 2, baseY);
        cur += a;
      }
      g.globalCompositeOperation = "destination-out";
      cur = box.w / 2 - box.adv / 2;
      for (const ch of m.word) {
        const a = g.measureText(ch).width;
        g.fillText(ch, cur + a / 2, baseY);
        cur += a;
      }
      g.globalCompositeOperation = "source-atop";
      g.shadowColor = "rgba(0,0,0,0.55)";
      g.shadowBlur = Math.max(3, box.g * 0.075);
      g.fillStyle = "rgba(0,0,0,0.5)";
      cur = box.w / 2 - box.adv / 2;
      for (const ch of m.word) {
        const a = g.measureText(ch).width;
        g.fillText(ch, cur + a / 2, baseY);
        cur += a;
      }
      g.shadowColor = "transparent";
      g.globalCompositeOperation = "source-over";
      holeCard = c;
    }
    const sims = PROPS.map((spec) => ({
      spec,
      el: null,
      x: 0,
      y: 0,
      rot: (spec.rot * Math.PI) / 180,
    }));
    function adoptProps() {
      for (const s of sims)
        s.el = propLayer.querySelector(
          `[data-prop="${s.spec.id}"]`
        );
    }
    function placeProps() {
      for (const s of sims) {
        const at = mobile && s.spec.m ? s.spec.m : { nx: s.spec.nx, ny: s.spec.ny };
        s.x = mat.x + mat.w * at.nx;
        s.y = mat.y + mat.h * at.ny;
        if (!s.el) continue;
        s.el.style.display = mobile && !s.spec.m ? "none" : "";
        s.el.style.width = mat.w * s.spec.w * (mobile ? 1.9 : 1) + "px";
        s.el.style.zIndex = String(_nullishCoalesce(s.spec.z, () => ( 10)));
        s.el.style.transform =
          `translate3d(${s.x}px, ${s.y}px, 0) translate(-50%, -50%) ` +
          `rotate(${s.rot}rad)`;
      }
    }
    let tl = null;
    function choose(i) {
      if (st.mood === i && st.phase !== "mat") return;
      if (!MOODS[i] || !MOODS[i].frames.length) return;
      _optionalChain([tl, 'optionalAccess', _45 => _45.kill, 'call', _46 => _46()]);
      st.mood = i;
      st.hoverWord = -1;
      st.cut = 0;
      st.morph = 0;
      st.roll = 0;
      st.active = 0;
      st.prevActive = 0;
      st.heroFade = 1;
      st.hero = 0;
      st.sheetFade = 1;
      st.pencil = 0;
      loadMood(MOODS[i]);
      /* 每个心情的帧数可能不同（关键词分组），相纸网格必须按新帧数重算，
         否则命中框会停在上一组帧的位置上。 */
      if (root.dataset.laid === "1") layout();
      const ref = measureWord(MOODS[i].word, 100);
      centre.g =
        (Math.min(mat.w * (mobile ? 0.9 : 0.82), W * 0.86) / ref.adv) * 100;
      rebuildLetters(false);
      for (const l of letters) {
        l.freed = false;
        l.dev = 0;
        l.fade = 0;
        l.homeT = 0;
        l.x = l.hx;
        l.y = l.hy;
        l.rot = l.hrot;
        l.g = l.hg;
        l.vx = l.vy = l.vrot = l.vg = 0;
      }
      buildHoleCard();
      st.phase = "cutting";
      setPhase("cutting");
      setMoodIdx(i);
      if (reduce) {
        st.phase = "sheet"; st.cut = st.morph = st.roll = st.hero = st.pencil = 1;
        letters.forEach(l => { l.freed = true; l.dev = 1; l.x = l.tx; l.y = l.ty; l.g = l.tg; l.rot = 0; });
        setPhase("sheet"); publishGeo(); return;
      }
      const devTargets = letters.map(() => ({ v: 0 }));
      const MORPH_D = reduce ? 0.4 : 1.3;
      tl = gsap.timeline({
        onUpdate() {
          for (let k = 0; k < letters.length; k++)
            letters[k].dev = devTargets[k].v;
        },
      });
      tl.to(st, {
        cut: 1,
        duration: reduce ? 0.35 : 1.1,
        ease: "power1.inOut",
      })
        .add(() => {
          st.phase = "word";
          setPhase("word");
        })
        .to(
          devTargets,
          {
            v: 1,
            duration: reduce ? 0.4 : 1.25,
            ease: "power2.out",
            stagger: reduce ? 0 : 0.085,
          },
          reduce ? "-=0.1" : "-=0.55"
        )
        .addLabel("unpack")
        .to(
          st,
          {
            morph: 1,
            duration: MORPH_D,
            ease: "power3.inOut",
            onStart() {
              st.phase = "sheet";
              setPhase("sheet");
            },
          },
          reduce ? "+=0.05" : "+=0.12"
        )
        .to(
          st,
          { roll: 1, duration: reduce ? 0.3 : 1.0, ease: "power2.out" },
          "-=0.65"
        )
        .to(
          st,
          { hero: 1, duration: reduce ? 0.25 : 0.9, ease: "power3.out" },
          reduce ? "unpack" : `unpack+=${(0.12 + MORPH_D * 0.74).toFixed(3)}`
        )
        .to(st, { pencil: 1, duration: reduce ? 0.2 : 0.75, ease: "power2.out" }, "-=0.3");
    }
    function skip() {
      if (!tl || st.phase === "mat" || st.phase === "sheet") return;
      tl.progress(1, false);
      letters.forEach(l => { l.freed = true; l.x = l.tx; l.y = l.ty; l.g = l.tg; l.rot = 0; });
    }
    function back(onDone) {
      _optionalChain([tl, 'optionalAccess', _47 => _47.kill, 'call', _48 => _48()]);
      setFormOpen(false);
      st.sheetFade = 1;
      const finish = () => {
        st.exiting = false;
        st.mood = -1;
        st.phase = "mat";
        setMoodIdx(null);
        setPhase("mat");
        letters = [];
        holeCard = null;
        publishStatus();
        if (onDone) onDone();
        if (poolDirty) { poolDirty = false; rebuildPool(); renderControls(); }
      };
      if (reduce) { st.mood = -1; st.phase = "mat"; st.cut = st.morph = st.roll = st.hero = 0; letters = []; holeCard = null; setMoodIdx(null); setPhase("mat"); publishStatus(); if (onDone) onDone(); return; }
      st.exiting = true;
      tl = gsap.timeline({ onComplete: finish });
      const STEP = reduce ? 0 : 0.055;
      const RELEASE = reduce ? 0.08 : 0.47;
      const LAST = RELEASE + Math.max(0, letters.length - 1) * STEP;
      tl.to(st, { pencil: 0, roll: 0, hero: 0, duration: 0.18, ease: "power2.in" }, 0)
        .to(st, { morph: 0, duration: reduce ? 0.18 : 0.42, ease: "power3.in" }, 0.04)
        .add(() => {
          st.phase = "word";
          setPhase("word");
        }, 0.04);
      letters.forEach((l, i) => {
        tl.add(() => {
          l.rx = l.x;
          l.ry = l.y;
          l.rrot = l.rot;
          l.rg = l.g;
          l.freed = false;
        }, RELEASE + i * STEP);
      });
      tl.to(
        letters,
        {
          homeT: 1,
          duration: reduce ? 0.16 : 0.55,
          ease: "power2.inOut",
          stagger: STEP,
        },
        RELEASE
      );
      tl.to(
        letters,
        {
          fade: 1,
          duration: reduce ? 0.12 : 0.36,
          ease: "sine.inOut",
          stagger: STEP,
        },
        RELEASE + (reduce ? 0.04 : 0.26)
      )
        .to(
          st,
          { cut: 0, duration: reduce ? 0.15 : 0.34, ease: "sine.inOut" },
          LAST + (reduce ? 0.05 : 0.4)
        );
    }
    /* 筛选只换片源，然后回到裁切桌让用户自己挑词：
       已经在裁切桌上就直接换牌，否则先把相纸收回再换。 */
    let poolDirty = false;
    function rebuildPool() {
      MOODS.forEach((m, mi) => { m.frames = pickFrames(mi); });
      for (const l of letters) l.stampKey = "";
      if (st.mood >= 0) {
        st.active = 0;
        st.prevActive = 0;
        st.heroFade = 0;
        loadMood(MOODS[st.mood]);
      }
      if (root.dataset.laid === "1") layout();
      publishStatus();
    }
    function refreshPool() {
      if (st.phase === "mat") { rebuildPool(); renderControls(); return; }
      /* 正在收相纸：等它收完再换牌，避免动画中途换帧留下残影。 */
      if (st.exiting) { poolDirty = true; return; }
      back(() => { rebuildPool(); renderControls(); });
    }
    apiRef.current = {
      choose,
      back,
      skip,
      refreshPool,
      hoverWord: (i) => {
        st.hoverWord = _nullishCoalesce(i, () => ( -1));
      },
      hoverFrame: (i) => {
        st.hoverFrame = _nullishCoalesce(i, () => ( -1));
        if (i != null) announceFrame(i);
        if (i != null && i !== st.active) {
          st.prevActive = st.active;
          st.active = i;
          st.heroFade = 0;
          gsap.killTweensOf(st, "heroFade");
          gsap.to(st, {
            heroFade: 1,
            duration: reduce ? 0.01 : 0.34,
            ease: "power2.inOut",
          });
        }
      },
    };
    function onMove(e) {
      const r = root.getBoundingClientRect();
      px.x = e.clientX - r.left;
      px.y = e.clientY - r.top;
      px.has = true;
    }
    function onLeave() {
      px.has = false;
      px.x = px.y = -9999;
    }
    function onDown(e) {
      if (st.phase !== "sheet" || formOpenRef.current) return;
      if (_optionalChain([(e.target ), 'optionalAccess', _49 => _49.closest, 'call', _50 => _50("button")])) return;
      const r = root.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const inSheet =
        x >= sheet.x &&
        x <= sheet.x + sheet.w &&
        y >= sheet.y &&
        y <= sheet.y + sheet.h;
      if (!inSheet) back();
    }
    root.addEventListener("pointermove", onMove, { passive: true });
    root.addEventListener("pointerleave", onLeave);
    root.addEventListener("pointerdown", onDown);
    function onKey(e) {
      if (viewer && !viewer.hidden) {
        if (e.key === "Escape") { e.preventDefault(); closeViewer(); }
        return;
      }
      if (!root.contains(document.activeElement)) return;
      if (e.key === "Escape" && st.phase !== "mat") back();
      if (st.phase === "sheet" && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
        e.preventDefault();
        const n = _nullishCoalesce(_optionalChain([MOODS, 'access', _51 => _51[st.mood], 'optionalAccess', _52 => _52.frames, 'access', _53 => _53.length]), () => ( 1));
        _optionalChain([apiRef, 'access', _54 => _54.current, 'optionalAccess', _55 => _55.hoverFrame, 'call', _56 => _56(
          (st.active + (e.key === "ArrowRight" ? 1 : n - 1)) % n
        )]);
      }
    }
    window.addEventListener("keydown", onKey);
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    function onMotionChange(event) {
      reduce = event.matches;
      if (!reduce) return;
      st.dash = 0;
      gsap.killTweensOf([st, ...introHead, ...introCards]);
      st.introMat = st.intro = st.heroFade = 1;
      introHead.forEach(h => h.v = 1); introCards.forEach(c => c.v = 1);
      setLaidOut(true);
      if (st.exiting) { tl?.progress(1, false); return; }
      if (st.mood >= 0) {
        tl?.kill();
        st.phase = 'sheet'; st.cut = st.morph = st.roll = st.hero = st.pencil = 1;
        letters.forEach(l => { l.freed = true; l.dev = 1; l.x = l.tx; l.y = l.ty; l.g = l.tg; l.rot = 0; l.vx = l.vy = l.vrot = l.vg = 0; });
        setPhase('sheet'); publishGeo();
      }
    }
    motionQuery.addEventListener('change', onMotionChange);
    const themeObs = new MutationObserver(() => {
      const next =
        document.documentElement.getAttribute("data-theme") === "dark"
          ? DARK
          : LIGHT;
      if (next === pal) return;
      pal = next;
      buildMat();
      for (const l of letters) l.stampKey = "";
      propLayer.style.setProperty("--cut-dim", String(pal.propDim));
    });
    themeObs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    propLayer.style.setProperty("--cut-dim", String(pal.propDim));
    const face = document.fonts ? document.fonts.load('16px "Cutout Display"').then(() => document.fonts.ready) : Promise.resolve();
    const cap = new Promise((r) => window.setTimeout(r, 4000));
    Promise.all([Promise.race([face, cap]), loadMemoir()]).then(() => {
      if (disposed || !MEMOIR.photos.length) { finishBoot(); return; }
      POOL = MEMOIR.photos.slice();
      MOODS.forEach((m, mi) => { m.frames = pickFrames(mi); });
      layout();
      setReady(true);
      publishStatus();
      loadMood(MOODS[0]);
      if (reduce) {
        st.introMat = st.intro = 1;
        for (const h of introHead) h.v = 1;
        for (const c of introCards) c.v = 1;
        setLaidOut(true);
        return;
      }
      gsap
        .timeline()
        .to(st, { introMat: 1, duration: 0.95, ease: "power3.out" }, 0)
        .to(introHead, { v: 1, duration: 0.9, ease: "power4.out", stagger: 0.09 }, 0.4)
        .to(introCards, { v: 1, duration: 1, ease: "power4.out", stagger: 0.085 }, 0.75)
        .to(st, { intro: 1, duration: 0.6, ease: "none" }, 0.4);
      window.setTimeout(() => !disposed && setLaidOut(true), 200);
    });
    layout();
    const ro = new ResizeObserver(() => layout());
    ro.observe(root);
    let raf = 0;
    let last = performance.now();
    let paused = false;
    const io = new IntersectionObserver(
      (es) => {
        paused = !_optionalChain([es, 'access', _59 => _59[0], 'optionalAccess', _60 => _60.isIntersecting]);
      },
      { threshold: 0.02 }
    );
    io.observe(root);
    const onVis = () => {
      if (document.hidden) paused = true;
      else if (root.getBoundingClientRect().bottom > 0) paused = false;
    };
    document.addEventListener("visibilitychange", onVis);
    function step(dt) {
      st.t += dt;
      if (!reduce) st.dash = (st.dash + dt * 34) % 1000;
      cursor.x = px.has ? lerp(cursor.x < -900 ? px.x : cursor.x, px.x, 0.28) : cursor.x;
      cursor.y = px.has ? lerp(cursor.y < -900 ? px.y : cursor.y, px.y, 0.28) : cursor.y;
      for (let i = 0; i < 5; i++) {
        const want = st.phase === "mat" && st.hoverWord === i ? 1 : 0;
        st.lift[i] += (want - st.lift[i]) * (reduce ? 1 : 0.16);
      }
      if (st.phase === "cutting" || st.phase === "word" || st.phase === "sheet") {
        const box = wordBoxes[st.mood];
        if (box) {
          const bladeLocal = -box.w / 2 + box.w * st.cut;
          for (const l of letters) {
            if (l.freed) continue;
            const dx = l.hx - box.x;
            const dy = l.hy - box.y;
            const lx = dx * Math.cos(-box.rot) - dy * Math.sin(-box.rot);
            if (lx <= bladeLocal) {
              l.freed = true;
              l.vrot = l.spin * 0.045;
              l.vy = -0.48;
            }
          }
        }
      }
      const k = st.exiting ? 0.135 : reduce ? 0.16 : LETTER_K;
      const d = st.exiting ? 0.3 : reduce ? 0.42 : LETTER_D;
      for (const l of letters) {
        if (l.homeT > 0) {
          const e = clamp(l.homeT);
          l.x = lerp(l.rx, l.hx, e);
          l.y = lerp(l.ry, l.hy, e);
          l.rot = lerp(l.rrot, l.hrot, e);
          l.g = lerp(l.rg, l.hg, e);
          l.vx = l.vy = l.vrot = l.vg = 0;
          continue;
        }
        const goHome = st.phase === "mat" || !l.freed;
        const tx = goHome ? l.hx : l.tx;
        const ty = goHome ? l.hy : l.ty;
        const trot = goHome ? l.hrot : 0;
        const tg = goHome ? l.hg : l.tg;
        const frameScale = dt * 60;
        l.vx += (tx - l.x) * k * frameScale;
        l.vy += (ty - l.y) * k * frameScale;
        l.vrot += (trot - l.rot) * k * 0.9 * frameScale;
        l.vg += (tg - l.g) * k * frameScale;
        l.vx *= Math.pow(1 - d, frameScale);
        l.vy *= Math.pow(1 - d, frameScale);
        l.vrot *= Math.pow(1 - d * 0.92, frameScale);
        l.vg *= Math.pow(1 - d, frameScale);
        l.x += l.vx * frameScale;
        l.y += l.vy * frameScale;
        l.rot += l.vrot * frameScale;
        l.g += l.vg * frameScale;
      }
    }
    function coverRect(
      iw,
      ih,
      bw,
      bh
    ) {
      const s = Math.max(bw / iw, bh / ih);
      const w = iw * s;
      const h = ih * s;
      return [-w / 2, -h / 2, w, h];
    }
    function stampFor(l, i, bw, bh) {
      const ph = photoFor(i);
      const key = `${Math.round(bw)}x${Math.round(bh)}|${ph ? 1 : 0}|${l.ch}`;
      if (l.stamp && l.stampKey === key) return l.stamp;
      const c =
        _nullishCoalesce(l.stamp, () => (
        (l.stamp = document.createElement("canvas"))));
      const cw = Math.max(2, Math.round(bw * dpr));
      const ch2 = Math.max(2, Math.round(bh * dpr));
      if (c.width !== cw || c.height !== ch2) {
        c.width = cw;
        c.height = ch2;
      }
      const g = c.getContext("2d");
      if (!g) return c;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, bw, bh);
      if (!ph) {
        l.stampKey = key;
        return c;
      }
      const gs = (bh / ((l.asc + l.desc) / 100)) * 1;
      g.font = `${gs}px ${FACE}`;
      g.textAlign = "center";
      g.textBaseline = "alphabetic";
      g.fillStyle = "#fff";
      g.fillText(l.ch, bw / 2, bh / 2 + ((l.asc - l.desc) / 200) * gs);
      g.globalCompositeOperation = "source-in";
      const [ox, oy, ow, oh] = coverRect(ph.width, ph.height, bw, bh);
      g.drawImage(ph, bw / 2 + ox, bh / 2 + oy, ow, oh);
      g.globalCompositeOperation = "source-over";
      l.stampKey = key;
      return c;
    }
    function paintLetter(l, i) {
      const m = MOODS[st.mood];
      const LA = (1 - clamp(l.fade)) * st.sheetFade * (l.spare ? 1 - clamp(st.morph * 1.15) : 1);
      if (LA <= 0.003) return;
      const mo = l.spare ? 0 : ease3(clamp(st.morph));
      const gbw = (l.adv * l.g) / 100;
      const gbh = ((l.asc + l.desc) * l.g) / 100;
      const bw = lerp(gbw, frameBox.w, mo);
      const bh = lerp(gbh, frameBox.h, mo);
      const x = lerp(l.x, l.fx, mo);
      const y = lerp(l.y, l.fy, mo);
      const rot = lerp(l.rot, 0, ease3(clamp(st.morph * 1.25)));
      const hovered = st.phase === "sheet" && st.hoverFrame === i;
      const hv = hovered ? 1 : 0;
      const lift =
        Math.abs(l.tg - l.hg) < 0.01
          ? 0
          : clamp((l.g - l.hg) / (l.tg - l.hg));
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      if (hv) ctx.scale(1.035, 1.035);
      if (mo > 0.02) {
        ctx.save();
        ctx.globalAlpha = LA * mo;
        ctx.shadowColor = pal.shadow;
        ctx.shadowBlur = 10 + hv * 14;
        ctx.shadowOffsetY = 3 + hv * 5;
        ctx.fillStyle = "#0C0B09";
        ctx.fillRect(-bw / 2 - 2, -bh / 2 - 2, bw + 4, bh + 4);
        ctx.restore();
      }
      const ph = photoFor(i);
      if (ph && mo > 0.001) {
        ctx.save();
        ctx.globalAlpha = LA * mo;
        ctx.beginPath();
        ctx.rect(-bw / 2, -bh / 2, bw, bh);
        ctx.clip();
        const [ox, oy, ow, oh] = coverRect(ph.width, ph.height, bw, bh);
        ctx.drawImage(ph, ox, oy, ow, oh);
        ctx.restore();
      }
      const gsz = (bh / ((l.asc + l.desc) / 100)) * 1;
      const baseY = ((l.asc - l.desc) / 200) * gsz;
      const backA = clamp(1 - mo * 2.2);
      if (lift > 0.01 && backA > 0.01) {
        ctx.save();
        ctx.globalAlpha = LA * backA;
        ctx.shadowColor = pal.shadow;
        ctx.shadowBlur = 6 + 26 * lift;
        ctx.shadowOffsetX = 2 + 5 * lift;
        ctx.shadowOffsetY = 3 + 13 * lift;
        ctx.font = `${gsz}px ${FACE}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = m.paper;
        ctx.fillText(l.ch, 0, baseY);
        ctx.restore();
      }
      if (ph) {
        const stamp = stampFor(l, i, bw, bh);
        ctx.drawImage(stamp, -bw / 2, -bh / 2, bw, bh);
      }
      const dv = clamp(l.dev);
      if (dv < 0.999) {
        const gs = gsz;
        ctx.font = `${gs}px ${FACE}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";
        const by = baseY;
        const cardA = clamp(1 - Math.max(0, dv - 0.06) / 0.42);
        if (cardA > 0.002) {
          ctx.globalAlpha = LA * cardA;
          ctx.fillStyle = m.paper;
          ctx.fillText(l.ch, 0, by);
        }
        const swing = Math.sin(clamp(dv) * Math.PI) * 0.12;
        if (swing > 0.004) {
          ctx.globalAlpha = LA * swing;
          ctx.fillStyle = "#7FB4B8";
          ctx.fillText(l.ch, 0, by);
        }
        ctx.globalAlpha = LA * 1;
      }
      if (mo > 0.35) {
        const a = clamp((mo - 0.35) / 0.65);
        paintFrameChrome(i, bw, bh, a * st.sheetFade, hv);
      }
      ctx.restore();
    }
    function paintFrameChrome(
      i,
      bw,
      bh,
      a,
      hv
    ) {
      const m = MOODS[st.mood];
      const f = m.frames[i];
      if (!f) return;
      const s = frameBox.w;
      ctx.globalAlpha = a;
      const isOn = i === st.active;
      const U = Math.max(10, sheet.w * 0.0125);
      ctx.fillStyle = pal.sheetInk;
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.font = `400 ${U}px ${MONO}`;
      ctx.globalAlpha = a * (isOn ? 0.95 : 0.45);
      ctx.fillText(String(i + 1).padStart(2, "0"), -bw / 2, bh / 2 + U * 0.55);
      if (isOn) {
        ctx.globalAlpha = a;
        ctx.fillStyle = pal.sheetInk;
        ctx.fillRect(-bw / 2, bh / 2 + U * 2.1, bw * 0.62, Math.max(2, s * 0.03));
      }
      if (!isOn && hv <= 0) {
        ctx.globalAlpha = a * 0.34;
        ctx.fillStyle = pal.sheet;
        ctx.fillRect(-bw / 2, -bh / 2, bw, bh);
      }
      if (f.select && st.pencil > 0.01) {
        const p = clamp(st.pencil);
        ctx.save();
        ctx.globalAlpha = a * 0.9;
        ctx.strokeStyle = m.pencil;
        ctx.lineWidth = Math.max(2, s * 0.016);
        ctx.lineCap = "round";
        ctx.beginPath();
        const steps = 46;
        for (let k = 0; k <= steps * p; k++) {
          const t = (k / steps) * Math.PI * 2.14 - 0.4;
          const wob = 1 + Math.sin(t * 3.1 + i) * 0.028;
          const ex = Math.cos(t) * bw * 0.53 * wob;
          const ey = Math.sin(t) * bh * 0.57 * wob;
          if (k === 0) ctx.moveTo(ex, ey);
          else ctx.lineTo(ex, ey);
        }
        ctx.stroke();
        ctx.restore();
      }
      if (hv > 0) {
        ctx.globalAlpha = a * hv * 0.9;
        ctx.strokeStyle = m.pencil;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(-bw / 2 - 3, -bh / 2 - 3, bw + 6, bh + 6);
      }
      ctx.globalAlpha = 1;
    }
    function paintSheetPaper() {
      const a = clamp((st.morph - 0.32) / 0.42) * st.sheetFade;
      if (a <= 0.002 || st.mood < 0) return;
      const m = MOODS[st.mood];
      const s = sheet;
      ctx.save();
      ctx.globalAlpha = a;
      ctx.shadowColor = pal.shadow;
      ctx.shadowBlur = 34;
      ctx.shadowOffsetY = 14;
      ctx.fillStyle = pal.sheet;
      const sc = lerp(0.94, 1, easeOut(a));
      ctx.translate(W / 2, s.y + s.h / 2);
      ctx.scale(sc, sc);
      ctx.translate(-W / 2, -(s.y + s.h / 2));
      roundRect(ctx, s.x, s.y, s.w, s.h, 3);
      ctx.fill();
      ctx.shadowColor = "transparent";
      const pad = s.pad;
      ctx.fillStyle = pal.sheetInk;
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      const hs = Math.max(18, s.w * 0.03);
      const U = Math.max(10, s.w * 0.0125);
      ctx.font = `${hs}px ${FACE}`;
      ctx.fillText(m.word, s.x + pad, s.y + pad + hs * 0.86);
      ctx.font = `400 ${U}px ${MONO}`;
      ctx.globalAlpha = a * 0.5;
      ctx.fillText(
        `${STUDIO.name} · ${m.stock.toUpperCase()}`,
        s.x + pad,
        s.y + pad + hs * 0.86 + U * 1.8
      );
      ctx.textAlign = "right";
      ctx.globalAlpha = a * 0.8;
      ctx.fillText(
        `${String(st.active + 1).padStart(2, "0")} / ${String(m.frames.length).padStart(2, "0")}`,
        s.x + s.w - pad,
        s.y + pad + hs * 0.86
      );
      ctx.textAlign = "left";
      ctx.strokeStyle = pal.sheetInk;
      ctx.globalAlpha = a * 0.18;
      ctx.lineWidth = 1;
      ctx.beginPath();
      const hy = s.y + pad + s.headH - U * 0.9;
      ctx.moveTo(s.x + pad, hy);
      ctx.lineTo(s.x + s.w - pad, hy);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.restore();
    }
    function paintRollFrames() {
      if (st.mood < 0) return;
      const m = MOODS[st.mood];
      const n = letters.length;
      for (let i = n; i < m.frames.length; i++) {
        const local = clamp((st.roll - (i - n) * 0.085) / 0.55);
        const fade = st.sheetFade;
        if (local <= 0.001 || fade <= 0.001) continue;
        const e = easeOut(local);
        const p = framePos[i];
        if (!p) continue;
        const hovered = st.phase === "sheet" && st.hoverFrame === i;
        ctx.save();
        ctx.translate(p.x, p.y + (1 - e) * frameBox.h * 0.9);
        ctx.rotate((1 - e) * 0.07 * (i % 2 ? 1 : -1));
        ctx.globalAlpha = e * fade;
        if (hovered) ctx.scale(1.035, 1.035);
        const bw = frameBox.w;
        const bh = frameBox.h;
        ctx.save();
        ctx.shadowColor = pal.shadow;
        ctx.shadowBlur = 10 + (hovered ? 14 : 0);
        ctx.shadowOffsetY = 3;
        ctx.fillStyle = "#0C0B09";
        ctx.fillRect(-bw / 2 - 2, -bh / 2 - 2, bw + 4, bh + 4);
        ctx.restore();
        const ph = photoFor(i);
        if (ph) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(-bw / 2, -bh / 2, bw, bh);
          ctx.clip();
          const [ox, oy, ow, oh] = coverRect(ph.width, ph.height, bw, bh);
          ctx.drawImage(ph, ox, oy, ow, oh);
          ctx.restore();
        }
        paintFrameChrome(i, bw, bh, e * fade, hovered ? 1 : 0);
        ctx.restore();
      }
    }
    function track(v) {
      try {
        (ctx ).letterSpacing = v;
      } catch (e3) {}
    }
    function pencilBed(on) {
      ctx.shadowColor = on ? "rgba(8,14,10,0.55)" : "transparent";
      ctx.shadowBlur = on ? 5 : 0;
      ctx.shadowOffsetY = on ? 1 : 0;
    }
    function paintHeadline() {
      const a = clamp(st.intro) * (1 - clamp(st.cut * 1.6));
      if (a <= 0.003) return;
      const u = mat.w;
      const h0 = introHead[0].v, h1 = introHead[1].v;
      const h2 = introHead[2].v, h3 = introHead[3].v;
      ctx.save();
      ctx.globalAlpha = a;
      pencilBed(true);
      const pick = (m, t, d) => (mobile ? m : tall ? t : d);
      const hx = mat.x + u * pick(0.06, 0.055, 0.045);
      const hy = mat.y + mat.h * pick(0.075, 0.055, 0.085);
      ctx.font = `500 ${Math.max(11, u * pick(0.038, 0.03, 0.0195))}px ${MONO}`;
      track("0.16em");
      ctx.fillStyle = pal.matLabel;
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      ctx.save();
      ctx.globalAlpha = a * clamp(h0);
      ctx.rotate(-0.03);
      ctx.fillText("MEMORY ARCHIVE / 2023 — 2026", hx, hy + (1 - easeOut(clamp(h0))) * u * 0.02);
      ctx.restore();
      const bw = u * pick(0.8, 0.62, 0.4);
      block(
        "MEMORIES",
        mat.x + u * pick(0.5, 0.41, 0.235),
        mat.y + mat.h * pick(0.155, 0.115, 0.175),
        bw,
        -1.6,
        "#241C15",
        "#F5EFE2",
        0,
        h1
      );
      block(
        "回忆录",
        mat.x + u * pick(0.72, 0.75, 0.5),
        mat.y + mat.h * pick(0.245, 0.185, 0.285),
        u * pick(0.3, 0.22, 0.13),
        5.5,
        "#EFB61F",
        "#241C10",
        0,
        h2
      );
      ctx.font = `400 ${Math.max(12, u * pick(0.032, 0.026, 0.0165))}px ${MONO}`;
      track("0.16em");
      ctx.fillStyle = pal.matLabel;
      ctx.save();
      ctx.globalAlpha = a * clamp(h3);
      ctx.translate(
        mat.x + u * pick(0.08, 0.07, 0.115),
        mat.y + mat.h * pick(0.31, 0.245, 0.375) + (1 - easeOut(clamp(h3))) * u * 0.02
      );
      ctx.rotate(0.025);
      ctx.fillText("选一种心情，剪开一段回忆", 0, 0);
      ctx.strokeStyle = pal.matLabel;
      ctx.lineWidth = Math.max(1.4, u * 0.0018);
      ctx.lineCap = "round";
      const al = u * pick(0.12, 0.1, 0.07);
      ctx.beginPath();
      ctx.moveTo(al * 0.1, u * 0.012);
      ctx.quadraticCurveTo(al * 0.55, u * 0.032, al, u * 0.026);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(al, u * 0.026);
      ctx.lineTo(al - u * 0.012, u * 0.018);
      ctx.moveTo(al, u * 0.026);
      ctx.lineTo(al - u * 0.014, u * 0.034);
      ctx.stroke();
      ctx.restore();
      track("0px");
      ctx.restore();
    }
    function block(
      text,
      cx,
      cy,
      targetW,
      rotDeg,
      paper,
      ink,
      lift = 0,
      intro = 1
    ) {
      track("0px");
      const ie = easeOut(clamp(intro));
      if (ie <= 0.001) return { w: 0, h: 0 };
      const ref = measureWord(text, 100);
      const g = (targetW / ref.adv) * 100;
      const mm = measureWord(text, g);
      const padX = g * 0.15;
      const padY = g * 0.2;
      const w = mm.adv + padX * 2;
      const h = mm.asc + mm.desc + padY * 2;
      ctx.save();
      ctx.globalAlpha *= ie;
      ctx.translate(cx, cy + (1 - ie) * h * 0.55);
      ctx.rotate((rotDeg * Math.PI) / 180 * (1 - lift * 0.4));
      const sc = (1 + lift * 0.035) * lerp(0.9, 1, ie);
      ctx.scale(sc, sc);
      if (CAN_FILTER && ie < 0.995) ctx.filter = `blur(${(1 - ie) * 9}px)`;
      ctx.shadowColor = pal.shadow;
      ctx.shadowBlur = (10 + lift * 26) * 1;
      ctx.shadowOffsetY = 4 + lift * 12;
      ctx.fillStyle = paper;
      roundRect(ctx, -w / 2, -h / 2, w, h, Math.min(4, h * 0.05));
      ctx.fill();
      ctx.shadowColor = "transparent";
      ctx.fillStyle = ink;
      ctx.font = `${g}px ${FACE}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      ctx.fillText(text, 0, (mm.asc - mm.desc) / 2);
      ctx.filter = "none";
      ctx.restore();
      return { w, h };
    }
    function paintWordCards() {
      if (st.intro <= 0.001) return;
      for (let i = 0; i < MOODS.length; i++) {
        const m = MOODS[i];
        const b = wordBoxes[i];
        if (!b) continue;
        const chosen = st.mood === i;
        if (chosen && holeCard && st.cut > 0.001) {
          const hc = clamp(st.cut / 0.55);
          if (hc < 0.995) drawCard(i, m, b, 0, 1 - hc);
          ctx.save();
          ctx.translate(b.x, b.y);
          ctx.rotate(b.rot);
          ctx.globalAlpha = clamp(st.intro) * hc;
          ctx.shadowColor = pal.shadow;
          ctx.shadowBlur = 10;
          ctx.shadowOffsetY = 4;
          ctx.drawImage(holeCard, -b.w / 2, -b.h / 2, b.w, b.h);
          ctx.restore();
          continue;
        }
        if (st.mood >= 0 && !chosen) {
          const a = clamp(1 - st.cut * 1.5);
          if (a <= 0.004) continue;
          ctx.save();
          ctx.globalAlpha = a;
          const away = (1 - a) * mat.w * 0.24;
          const dir = i % 2 ? 1 : -1;
          ctx.translate(dir * away, (1 - a) * mat.h * 0.18);
          ctx.globalAlpha = a;
          drawCard(i, m, b, 0);
          ctx.restore();
          continue;
        }
        drawCard(i, m, b, MOODS[i].frames.length ? st.lift[i] : 0);
      }
    }
    function drawCard(
      i,
      m,
      b,
      lift,
      alphaMul = 1
    ) {
      const ci = clamp(_nullishCoalesce(_optionalChain([introCards, 'access', _61 => _61[i], 'optionalAccess', _62 => _62.v]), () => ( 1))) * clamp(alphaMul);
      if (ci <= 0.004) return;
      const count = m.frames.length;
      /* 0 张的心情纸卡不参与抬起，纸面整体压暗。 */
      if (!count) lift = 0;
      ctx.save();
      if (!count) ctx.globalAlpha *= 0.45;
      block(m.word, b.x, b.y, b.adv, (b.rot * 180) / Math.PI, m.paper, m.ink, lift, ci);
      ctx.restore();
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.rot);
      ctx.globalAlpha = ci * (count ? 0.78 + lift * 0.22 : 0.5);
      ctx.fillStyle = pal.matLabel;
      const subSize = Math.max(9, b.g * 0.15);
      ctx.font = `500 ${subSize}px ${MONO}`;
      track("0.16em");
      ctx.textAlign = "center";
      pencilBed(true);
      /* 照片张数跟着标签走：0 张的心情纸卡写明「暂无照片」。 */
      ctx.fillText(m.note.toUpperCase() + ' · ' + (count ? count + ' 张' : '暂无照片'), 0, b.h / 2 + b.g * 0.3);
      pencilBed(false);
      track("0px");
      ctx.restore();
      if (lift > 0.01 && ci > 0.99) {
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.rot * (1 - lift * 0.4));
        const sc = 1 + lift * 0.035;
        ctx.scale(sc, sc);
        const ox = b.w / 2 + b.g * 0.16;
        const oy = b.h / 2 + b.g * 0.16;
        ctx.globalAlpha = lift;
        ctx.strokeStyle = "#FDF8E9";
        ctx.lineWidth = 1.9;
        ctx.setLineDash([9, 6]);
        ctx.lineDashOffset = -st.dash;
        ctx.strokeRect(-ox, -oy, ox * 2, oy * 2);
        ctx.setLineDash([]);
        const hs = Math.max(5, b.g * 0.085);
        ctx.fillStyle = "#FDF8E9";
        for (const [sx, sy] of [
          [-ox, -oy],
          [ox, -oy],
          [-ox, oy],
          [ox, oy],
        ])
          ctx.fillRect(sx - hs / 2, sy - hs / 2, hs, hs);
        ctx.restore();
      }
      ctx.restore();
    }
    function paintScissors() {
      const blade = root.querySelector('.cut-blade');
      const live = !reduce && st.phase === 'cutting';
      blade.hidden = !live;
      if (!live) return;
      const b = wordBoxes[st.mood];
      const x = -b.w / 2 + b.w * st.cut;
      blade.style.transform = 'translate(' + (b.x + x * Math.cos(b.rot)) + 'px,' + (b.y + x * Math.sin(b.rot)) + 'px) translate(-50%, -48%) rotate(' + (90 + b.rot * 180 / Math.PI) + 'deg)';
    }
    function paintCutLine() {
      if (st.mood < 0 || st.cut <= 0.001 || st.cut >= 0.999) return;
      const b = wordBoxes[st.mood];
      if (!b) return;
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.rot);
      ctx.strokeStyle = "rgba(250,244,228,0.9)";
      ctx.lineWidth = 1.6;
      ctx.setLineDash([9, 7]);
      ctx.lineDashOffset = -st.dash * 0.6;
      const half = b.w / 2 + b.g * 0.2;
      ctx.beginPath();
      ctx.moveTo(-half, 0);
      ctx.lineTo(-half + (half * 2) * st.cut, 0);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }
    function paintHero() {
      if (st.mood < 0 || st.hero <= 0.002 || st.sheetFade <= 0.002) return;
      const m = MOODS[st.mood];
      const a = clamp(st.hero) * st.sheetFade;
      const e = easeOut(a);
      ctx.save();
      ctx.globalAlpha = a;
      ctx.translate(0, (1 - e) * hero.h * 0.11);
      ctx.save();
      ctx.shadowColor = "rgba(24,18,10,0.3)";
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 8;
      ctx.fillStyle = "#0C0B09";
      ctx.fillRect(hero.x - 2, hero.y - 2, hero.w + 4, hero.h + 4);
      ctx.restore();
      const drawInto = (idx, alpha) => {
        const ph = photoFor(idx);
        if (!ph || alpha <= 0.002) return;
        ctx.save();
        ctx.globalAlpha = a * alpha;
        ctx.beginPath();
        ctx.rect(hero.x, hero.y, hero.w, hero.h);
        ctx.clip();
        ctx.translate(hero.x + hero.w / 2, hero.y + hero.h / 2);
        const [ox, oy, ow, oh] = coverRect(ph.width, ph.height, hero.w, hero.h);
        ctx.drawImage(ph, ox, oy, ow, oh);
        ctx.restore();
      };
      const f = clamp(st.heroFade);
      if (f < 0.999) drawInto(st.prevActive, 1 - f);
      drawInto(st.active, f);
      const fr = m.frames[st.active];
      if (fr) {
        const U = Math.max(10, sheet.w * 0.0125);
        const MED = Math.max(15, sheet.w * 0.024);
        const cx = credit.x;
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        const prM = m.projects[fr.project];
        /* 介绍跟着当前照片走：标题、这张照片自己的说明（note，可空）、
           它来自哪篇游记。共用 blurb 只作为页面级简介，不再逐张重复。 */
        const photoNote = fr.photo && typeof fr.photo.note === 'string' ? fr.photo.note.trim() : '';
        const journalLabel = fr.photo && fr.photo.journalLabel ? '来自：' + fr.photo.journalLabel : '';
        ctx.font = `${MED}px ${FACE}`;
        const titleLines = wrapText(ctx, fr.title.toUpperCase(), 0, 0, credit.w, MED * 1.2, true);
        let noteLines = 0;
        if (photoNote) {
          ctx.font = `400 ${U}px ${MONO}`;
          noteLines = wrapText(ctx, photoNote, 0, 0, credit.w, U * 1.7, true);
        }
        let sourceLines = 0;
        if (journalLabel) {
          ctx.font = `400 ${U}px ${MONO}`;
          sourceLines = wrapText(ctx, journalLabel, 0, 0, credit.w, U * 1.7, true);
        }
        const blockH =
          titleLines * MED * 1.2 +
          (noteLines ? U * 0.8 + noteLines * U * 1.7 : 0) +
          (sourceLines ? U * 1.5 + sourceLines * U * 1.7 : 0) +
          U * 2.4;
        let cy = stack
          ? credit.y + MED * 0.9
          : credit.y + credit.h / 2 - blockH / 2 + MED * 0.86;
        ctx.fillStyle = pal.sheetInk;
        ctx.globalAlpha = a;
        ctx.font = `${MED}px ${FACE}`;
        cy += wrapText(ctx, fr.title.toUpperCase(), cx, cy, credit.w, MED * 1.2) * MED * 1.2;
        if (noteLines) {
          cy += U * 0.8;
          ctx.globalAlpha = a * 0.75;
          ctx.font = `400 ${U}px ${MONO}`;
          cy += wrapText(ctx, photoNote, cx, cy, credit.w, U * 1.7) * U * 1.7;
        }
        if (sourceLines) {
          cy += U * 1.5;
          ctx.globalAlpha = a * 0.5;
          ctx.font = `400 ${U}px ${MONO}`;
          cy += wrapText(ctx, journalLabel, cx, cy, credit.w, U * 1.7) * U * 1.7;
        }
        cy += U * 1.5;
        ctx.globalAlpha = a * 0.5;
        ctx.font = `400 ${U}px ${MONO}`;
        ctx.fillText(
          [fr.place.toUpperCase(), fr.year, _optionalChain([prM, 'optionalAccess', _63 => _63.name, 'access', _64 => _64.toUpperCase, 'call', _65 => _65()])]
            .filter(Boolean)
            .join("  ·  "),
          cx,
          cy
        );
      }
      ctx.globalAlpha = 1;
      ctx.restore();
    }
    function paintGrain() {
      const jx = reduce ? 0 : (Math.random() * 140) | 0;
      const jy = reduce ? 0 : (Math.random() * 140) | 0;
      ctx.save();
      ctx.globalCompositeOperation = "overlay";
      ctx.globalAlpha = 0.5;
      const pat = ctx.createPattern(grainTile, "repeat");
      if (pat) {
        ctx.translate(-jx, -jy);
        ctx.fillStyle = pat;
        ctx.fillRect(0, 0, W + 140, H + 140);
      }
      ctx.restore();
    }
    function writeCursor() {
      const cu = root.querySelector(".cut-cursor");
      if (cu) {
        cu.style.transform = `translate3d(${cursor.x}px, ${cursor.y}px, 0)`;
        cu.style.opacity = px.has ? "1" : "0";
      }
    }
    function paint() {
      ctx.clearRect(0, 0, W, H);
      if (matCache) {
        const mi = clamp(st.introMat);
        if (mi > 0.999) ctx.drawImage(matCache, 0, 0, W, H);
        else {
          const e = easeOut(mi);
          ctx.save();
          ctx.globalAlpha = e;
          ctx.translate(W / 2, H / 2);
          const sc = lerp(0.968, 1, e);
          ctx.scale(sc, sc);
          ctx.translate(-W / 2, -H / 2);
          ctx.drawImage(matCache, 0, 0, W, H);
          ctx.restore();
        }
      }
      paintHeadline();
      paintWordCards();
      paintCutLine();
      paintScissors();
      paintSheetPaper();
      paintRollFrames();
      for (let i = 0; i < letters.length; i++) paintLetter(letters[i], i);
      paintHero();
      paintGrain();
      writeCursor();
    }
    function loop(now) {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (paused) return;
      let acc = dt;
      while (acc > 0) {
        const s = Math.min(1 / 60, acc);
        step(s);
        acc -= s;
      }
      paint();
    }
    raf = requestAnimationFrame(loop);
    window.addEventListener("pagehide", (event) => {
      if (event.persisted) return;
      disposed = true;
      cancelAnimationFrame(raf);
      _optionalChain([tl, 'optionalAccess', _66 => _66.kill, 'call', _67 => _67()]);
      gsap.killTweensOf(st);
      ro.disconnect();
      io.disconnect();
      themeObs.disconnect();
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
      motionQuery.removeEventListener('change', onMotionChange);
      document.removeEventListener("visibilitychange", onVis);
      graded.clear();
      matCache = null;
      apiRef.current = null;
    });function wrapText(
  g,
  text,
  x,
  y,
  maxW,
  lh,
  dry = false
) {
  const words = text.match(/[\u3400-\u9fff]|[^\s\u3400-\u9fff]+/g) || [];
  let line = "";
  let row = 0;
  for (const w of words) {
    const joiner = /[㐀-鿿]$/.test(line) || /^[㐀-鿿]/.test(w) ? "" : " ";
    const test = line ? line + joiner + w : w;
    if (g.measureText(test).width > maxW && line) {
      if (!dry) g.fillText(line, x, y + row * lh);
      row++;
      line = w;
    } else line = test;
  }
  if (line && !dry) g.fillText(line, x, y + row * lh);
  return row + 1;
}
function roundRect(
  g,
  x,
  y,
  w,
  h,
  r
) {
  const rr = Math.min(r, w / 2, h / 2);
  g.beginPath();
  g.moveTo(x + rr, y);
  g.lineTo(x + w - rr, y);
  g.quadraticCurveTo(x + w, y, x + w, y + rr);
  g.lineTo(x + w, y + h - rr);
  g.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  g.lineTo(x + rr, y + h);
  g.quadraticCurveTo(x, y + h, x, y + h - rr);
  g.lineTo(x, y + rr);
  g.quadraticCurveTo(x, y, x + rr, y);
  g.closePath();
}
})();
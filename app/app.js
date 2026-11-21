'use strict';
/* Neon Palms Cover Studio v3 — your photos become Vice City key art.
   A canvas cover renderer plus a 6-step editor, offline, no network.
   Layouts: 12. Grades: 9 skin-safe. Face-aware crop with a click.
   Panel rows end at y 0.70 so the review strip has a clear sky zone. */

// ---- Sample photos: four new AI-model portraits plus the kit's two scenes.
const PHOTOS = [
  { file: 'samples/mara.jpg', name: 'MARA', role: 'GETAWAY' },
  { file: 'samples/diego.jpg', name: 'DIEGO', role: 'DRIVER' },
  { file: 'samples/nina.jpg', name: 'NINA', role: 'HUSTLER' },
  { file: 'samples/carlos.jpg', name: 'CARLOS', role: 'FIXER' },
  { file: 'samples/pier.jpg', name: 'VICE CITY', role: 'LOOKOUT' },
  { file: 'samples/boulevard.jpg', name: 'LEONIDA', role: 'ENFORCER' },
];

// ---- Grades: nine skin-safe Vice City colour grades.
// sky: top / middle / bottom of the cover sky. tint: panel wash. title: chrome stops.
const GRADES = [
  { id: 'vice-sunset', name: 'Vice Sunset', sky: ['#2b1055', '#c65d7b', '#f6a55c'], tint: '#ff9a3c', title: ['#fff3c4', '#f0b45a', '#9c6a12'] },
  { id: 'neon-nights', name: 'Neon Nights', sky: ['#0b1035', '#7b2f8b', '#ff2e7e'], tint: '#ff2e7e', title: ['#ffe9f4', '#ff7ab8', '#a3134f'] },
  { id: 'golden-hour', name: 'Golden Hour', sky: ['#3a1c4d', '#e07840', '#ffc46b'], tint: '#ffb347', title: ['#fff8dd', '#ffcf6e', '#b07a1e'] },
  { id: 'heatwave', name: 'Heatwave', sky: ['#33060d', '#a31621', '#ff6b35'], tint: '#ff5a2a', title: ['#ffe9c9', '#ff9d5c', '#8f2f0a'] },
  { id: 'noir', name: 'Noir', sky: ['#0c0c12', '#2a2a33', '#55555f'], tint: '#9a9aa5', title: ['#ffffff', '#cfcfd6', '#6d6d78'] },
  { id: 'teal-noir', name: 'Teal Noir', sky: ['#04141c', '#0e4d5c', '#1fa8a0'], tint: '#2fd4c4', title: ['#e6fffb', '#7fe8dc', '#0f6b62'] },
  { id: 'bubblegum', name: 'Bubblegum', sky: ['#3d0a3d', '#c13b8f', '#ff9ecf'], tint: '#ff7ec2', title: ['#fff0f8', '#ffb3dd', '#a83a7c'] },
  { id: 'mono-chrome', name: 'Mono Chrome', sky: ['#000000', '#3d3d3d', '#8a8a8a'], tint: '#bbbbbb', title: ['#ffffff', '#d9d9d9', '#777777'] },
  { id: 'vivid-pop', name: 'Vivid Pop', sky: ['#12003d', '#7a00c9', '#00c2ff'], tint: '#c400ff', title: ['#f2e6ff', '#c98cff', '#5b0aa8'] },
];

// ---- Export sizes: the three common post sizes.
const SIZES = [
  { id: '1080x1080', w: 1080, h: 1080, label: '1080 × 1080' },
  { id: '1080x1350', w: 1080, h: 1350, label: '1080 × 1350' },
  { id: '1920x1080', w: 1920, h: 1080, label: '1920 × 1080' },
];

// ---- Layouts. Panels live in the panel zone (y 0..0.70 of the cover).
// x, y, w, h are fractions of the cover; slant shifts the top edge right.
// photo is an index into PHOTOS; hero panels draw last so they pop out.
// A card panel is a movie-poster cast card, not a photo.
const LAYOUTS = [
  { id: 'vice-trio', name: 'Vice Trio · 3 panels', panels: [
    { x: 0.00, y: 0.00, w: 0.34, h: 0.70, slant: 0.03, photo: 1 },
    { x: 0.33, y: 0.00, w: 0.34, h: 0.70, slant: 0.03, photo: 0 },
    { x: 0.66, y: 0.00, w: 0.34, h: 0.70, slant: 0.03, photo: 3 } ] },
  { id: 'sunset-stack', name: 'Sunset Stack · 3 panels', panels: [
    { x: 0.00, y: 0.00, w: 1.00, h: 0.235, slant: 0, photo: 2 },
    { x: 0.00, y: 0.2325, w: 1.00, h: 0.235, slant: 0, photo: 0 },
    { x: 0.00, y: 0.465, w: 1.00, h: 0.235, slant: 0, photo: 4 } ] },
  { id: 'hero-popout', name: 'Hero Pop-Out · 3 panels', panels: [
    { x: 0.00, y: 0.02, w: 0.30, h: 0.62, slant: 0.02, photo: 1 },
    { x: 0.70, y: 0.02, w: 0.30, h: 0.62, slant: -0.02, photo: 3 },
    { x: 0.28, y: 0.00, w: 0.44, h: 0.70, slant: 0, photo: 0, hero: true } ] },
  { id: 'hero-left', name: 'Hero Left · 3 panels', panels: [
    { x: 0.00, y: 0.00, w: 0.52, h: 0.70, slant: 0.02, photo: 0, hero: true },
    { x: 0.54, y: 0.00, w: 0.46, h: 0.34, slant: -0.02, photo: 2 },
    { x: 0.54, y: 0.36, w: 0.46, h: 0.34, slant: -0.02, photo: 3 } ] },
  { id: 'cast-mosaic-7', name: 'Cast Mosaic 7 · 7 panels', panels: [
    { x: 0.00, y: 0.00, w: 0.25, h: 0.35, slant: 0.02, photo: 2 },
    { x: 0.25, y: 0.00, w: 0.25, h: 0.35, slant: 0.02, photo: 1 },
    { x: 0.50, y: 0.00, w: 0.25, h: 0.35, slant: 0.02, photo: 0 },
    { x: 0.75, y: 0.00, w: 0.25, h: 0.35, slant: 0.02, photo: 3 },
    { x: 0.00, y: 0.36, w: 0.34, h: 0.34, slant: 0.02, photo: 4 },
    { x: 0.33, y: 0.36, w: 0.34, h: 0.34, slant: 0.02, card: true },
    { x: 0.66, y: 0.36, w: 0.34, h: 0.34, slant: 0.02, photo: 5 } ] },
  { id: 'billboard', name: 'Billboard · 3 panels', panels: [
    { x: 0.00, y: 0.00, w: 1.00, h: 0.46, slant: 0, photo: 2, hero: true },
    { x: 0.00, y: 0.48, w: 0.50, h: 0.22, slant: 0.02, photo: 1 },
    { x: 0.50, y: 0.48, w: 0.50, h: 0.22, slant: -0.02, photo: 3 } ] },
  { id: 'golden-hour', name: 'Golden Hour · 4 panels', panels: [
    { x: 0.00, y: 0.00, w: 0.50, h: 0.35, slant: 0.02, photo: 0 },
    { x: 0.50, y: 0.00, w: 0.50, h: 0.35, slant: -0.02, photo: 1 },
    { x: 0.00, y: 0.36, w: 0.50, h: 0.34, slant: 0.02, photo: 2 },
    { x: 0.50, y: 0.36, w: 0.50, h: 0.34, slant: -0.02, photo: 3 } ] },
  { id: 'vice-nights', name: 'Vice Nights · 4 panels', panels: [
    { x: 0.00, y: 0.00, w: 0.34, h: 0.44, slant: 0.02, photo: 3 },
    { x: 0.33, y: 0.00, w: 0.34, h: 0.44, slant: 0.02, photo: 1 },
    { x: 0.66, y: 0.00, w: 0.34, h: 0.44, slant: 0.02, photo: 0 },
    { x: 0.06, y: 0.46, w: 0.88, h: 0.24, slant: 0, photo: 2, hero: true } ] },
  { id: 'neon-grid', name: 'Neon Grid · 4 panels', panels: [
    { x: 0.00, y: 0.00, w: 0.50, h: 0.35, slant: 0.04, photo: 0 },
    { x: 0.50, y: 0.00, w: 0.50, h: 0.35, slant: 0.04, photo: 2 },
    { x: 0.00, y: 0.36, w: 0.50, h: 0.34, slant: 0.04, photo: 1 },
    { x: 0.50, y: 0.36, w: 0.50, h: 0.34, slant: 0.04, photo: 3 } ] },
  { id: 'duo', name: 'Duo · 2 panels', panels: [
    { x: 0.00, y: 0.00, w: 0.50, h: 0.70, slant: 0.03, photo: 1 },
    { x: 0.50, y: 0.00, w: 0.50, h: 0.70, slant: -0.03, photo: 0 } ] },
  { id: 'trio', name: 'Trio · 3 panels', panels: [
    { x: 0.00, y: 0.00, w: 1.00, h: 0.34, slant: 0, photo: 4 },
    { x: 0.00, y: 0.36, w: 0.50, h: 0.34, slant: 0.02, photo: 0 },
    { x: 0.50, y: 0.36, w: 0.50, h: 0.34, slant: -0.02, photo: 2 } ] },
  { id: 'neon-strip', name: 'Neon Strip · 5 panels', panels: [
    { x: 0.00, y: 0.00, w: 0.20, h: 0.70, slant: 0.02, photo: 1 },
    { x: 0.20, y: 0.00, w: 0.20, h: 0.70, slant: 0.02, photo: 0 },
    { x: 0.40, y: 0.00, w: 0.20, h: 0.70, slant: 0.02, photo: 4 },
    { x: 0.60, y: 0.00, w: 0.20, h: 0.70, slant: 0.02, photo: 2 },
    { x: 0.80, y: 0.00, w: 0.20, h: 0.70, slant: 0.02, photo: 3 } ] },
];

// ---- State.
const state = {
  layoutId: 'hero-popout',
  gradeId: 'vice-sunset',
  sizeId: '1080x1080',
  title: 'NEON PALMS',
  subtitle: 'ONE LAST JOB IN VICE CITY',
  assign: {},      // panel index -> photo index override (from a thumbnail click)
  focal: {},       // panel index -> { x, y } focal point for the face-aware crop
  selected: 0,     // panel shown in the face-aware bar
  pickedPhoto: null, // photo chosen from the strip, waiting for a panel click
};

const images = new Array(PHOTOS.length).fill(null); // loaded HTMLImageElements

function currentLayout() { return LAYOUTS.find(l => l.id === state.layoutId) || LAYOUTS[0]; }
function currentGrade() { return GRADES.find(g => g.id === state.gradeId) || GRADES[0]; }
function currentSize() { return SIZES.find(s => s.id === state.sizeId) || SIZES[0]; }
function panelPhoto(i) {
  const p = currentLayout().panels[i];
  if (p.card) return -1;
  return (state.assign[i] !== undefined) ? state.assign[i] : p.photo;
}
function panelFocal(i, W, H) {
  if (state.focal[i]) return state.focal[i];
  return defaultFocalFor(currentLayout().panels[i], W, H);
}
// Faces sit near y 0.30 in the portraits — but a very wide panel only shows
// a thin slice of the photo, so its default focal drops to the face centre
// (y 0.45) or the slice lands on hair and forehead only.
function defaultFocalFor(p, W, H) {
  const aspect = (p.w * W) / (p.h * H);
  return { x: 0.5, y: aspect > 1.8 ? 0.45 : 0.30 };
}
function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }

// ---- Cover renderer: draws the whole poster onto a canvas at W x H. ----

// Panel quad corners: the top edge is shifted right by slant * w.
function panelRect(p, W, H) {
  return { x: p.x * W, y: p.y * H, w: p.w * W, h: p.h * H, s: p.slant * p.w * W };
}
function panelPath(ctx, r) {
  ctx.beginPath();
  ctx.moveTo(r.x + r.s, r.y);
  ctx.lineTo(r.x + r.w + r.s, r.y);
  ctx.lineTo(r.x + r.w, r.y + r.h);
  ctx.lineTo(r.x, r.y + r.h);
  ctx.closePath();
}
function panelHit(p, px, py, W, H) {
  const r = panelRect(p, W, H);
  const ly = (py - r.y) / r.h;
  if (ly < 0 || ly > 1) return false;
  const left = r.x + r.s * (1 - ly), right = r.x + r.w + r.s * (1 - ly);
  return px >= left && px <= right;
}
function panelFocalXY(p, px, py, W, H) {
  const r = panelRect(p, W, H);
  const ly = clamp((py - r.y) / r.h, 0.05, 0.95);
  const left = r.x + r.s * (1 - ly), right = r.x + r.w + r.s * (1 - ly);
  return { x: clamp((px - left) / (right - left), 0.05, 0.95), y: ly };
}

// Cover-fit draw of img inside rect, keeping the focal point at the same
// relative spot it holds in the image (so a face stays in frame).
function drawPhotoCover(ctx, img, r, focal) {
  const scale = Math.max(r.w / img.naturalWidth, r.h / img.naturalHeight);
  const dw = img.naturalWidth * scale, dh = img.naturalHeight * scale;
  let dx = r.x + r.w * focal.x - dw * focal.x;
  let dy = r.y + r.h * focal.y - dh * focal.y;
  dx = Math.min(r.x, Math.max(r.x + r.w - dw, dx));
  dy = Math.min(r.y, Math.max(r.y + r.h - dh, dy));
  ctx.drawImage(img, dx, dy, dw, dh);
}

function roundRectPath(ctx, x, y, w, h, rad) {
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.lineTo(x + w - rad, y);
  ctx.arcTo(x + w, y, x + w, y + rad, rad);
  ctx.lineTo(x + w, y + h - rad);
  ctx.arcTo(x + w, y + h, x + w - rad, y + h, rad);
  ctx.lineTo(x + rad, y + h);
  ctx.arcTo(x, y + h, x, y + h - rad, rad);
  ctx.lineTo(x, y + rad);
  ctx.arcTo(x, y, x + rad, y, rad);
  ctx.closePath();
}

function drawCastCard(ctx, r, W) {
  const g = ctx.createLinearGradient(r.x, r.y, r.x, r.y + r.h);
  g.addColorStop(0, '#241536');
  g.addColorStop(1, '#0b0812');
  ctx.fillStyle = g;
  ctx.fillRect(r.x, r.y, r.w, r.h);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#f5c86b';
  ctx.font = `700 ${Math.round(W * 0.014)}px Arial, sans-serif`;
  ctx.fillText('S T A R R I N G', r.x + r.w / 2, r.y + r.h * 0.24);
  ctx.fillStyle = '#ffffff';
  ctx.font = `${Math.round(W * 0.032)}px Anton, sans-serif`;
  ctx.fillText('MARA · DIEGO', r.x + r.w / 2, r.y + r.h * 0.50);
  ctx.fillText('NINA · CARLOS', r.x + r.w / 2, r.y + r.h * 0.72);
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font = `${Math.round(W * 0.011)}px Arial, sans-serif`;
  ctx.fillText('VICE CITY 2026', r.x + r.w / 2, r.y + r.h * 0.90);
}

function drawPanel(ctx, W, H, p, idx, grade) {
  const r = panelRect(p, W, H);
  ctx.save();
  panelPath(ctx, r);
  ctx.clip();
  if (p.card) {
    drawCastCard(ctx, r, W);
  } else {
    const img = images[panelPhoto(idx)];
    if (img) {
      drawPhotoCover(ctx, img, r, panelFocal(idx, W, H));
      // Skin-safe grade wash, then a bottom shade for the tag legibility.
      ctx.globalCompositeOperation = 'overlay';
      ctx.globalAlpha = 0.14;
      ctx.fillStyle = grade.tint;
      ctx.fillRect(r.x, r.y, r.w, r.h);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      const shade = ctx.createLinearGradient(0, r.y, 0, r.y + r.h);
      shade.addColorStop(0, 'rgba(0,0,0,0)');
      shade.addColorStop(1, 'rgba(0,0,0,0.28)');
      ctx.fillStyle = shade;
      ctx.fillRect(r.x, r.y, r.w, r.h);
    } else {
      ctx.fillStyle = '#2a2340';
      ctx.fillRect(r.x, r.y, r.w, r.h);
    }
  }
  ctx.restore();
  // White frame; heroes get a gold outer frame so they pop out.
  ctx.lineWidth = Math.max(2, W * 0.004);
  ctx.strokeStyle = 'rgba(255,255,255,0.9)';
  panelPath(ctx, r);
  ctx.stroke();
  if (p.hero) {
    ctx.lineWidth = Math.max(2, W * 0.006);
    ctx.strokeStyle = '#f5c86b';
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = W * 0.02;
    ctx.shadowOffsetY = W * 0.008;
    panelPath(ctx, r);
    ctx.stroke();
    ctx.restore();
  }
}

// Cast tag pill at the panel's top corner — never near the review strip.
function drawTag(ctx, W, H, p, idx) {
  if (p.card) return;
  const photo = PHOTOS[panelPhoto(idx)];
  if (!photo) return;
  const r = panelRect(p, W, H);
  const text = photo.name + ' — ' + photo.role;
  ctx.font = `700 ${Math.round(W * 0.016)}px Arial, sans-serif`;
  const tw = ctx.measureText(text).width;
  const pad = W * 0.010, bx = r.x + r.s + W * 0.012, by = r.y + H * 0.012;
  const bh = W * 0.028;
  ctx.fillStyle = 'rgba(0,0,0,0.72)';
  roundRectPath(ctx, bx, by, tw + pad * 2, bh, bh / 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, bx + pad, by + bh / 2 + 1);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
}

function drawReviewStrip(ctx, W, H) {
  ctx.fillStyle = 'rgba(6,3,14,0.62)';
  ctx.fillRect(0, H * 0.70, W, H * 0.062);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#f5c86b';
  ctx.font = `${Math.round(W * 0.024)}px Arial, sans-serif`;
  ctx.fillText('★★★★★', W / 2, H * 0.717);
  ctx.fillStyle = '#ffffff';
  ctx.font = `italic 700 ${Math.round(W * 0.017)}px Georgia, serif`;
  ctx.fillText('“THE DEFINITIVE VICE CITY POSTER” — VICE DAILY', W / 2, H * 0.744);
  ctx.textBaseline = 'alphabetic';
}

// Striped chrome title: gradient fill on an offscreen canvas, dark stripes
// clipped to the letters, then stamped onto the cover.
function drawChromeTitle(ctx, W, H, grade) {
  const text = (state.title || 'NEON PALMS').toUpperCase();
  let size = W * 0.135;
  ctx.font = `${size}px Anton, sans-serif`;
  while (ctx.measureText(text).width > W * 0.66 && size > W * 0.05) {
    size *= 0.94;
    ctx.font = `${size}px Anton, sans-serif`;
  }
  const tw = ctx.measureText(text).width;
  const th = size * 1.05;
  const off = document.createElement('canvas');
  off.width = Math.ceil(tw + size * 0.12);
  off.height = Math.ceil(th + size * 0.12);
  const o = off.getContext('2d');
  o.font = `${size}px Anton, sans-serif`;
  o.textBaseline = 'top';
  o.lineJoin = 'round';
  o.strokeStyle = 'rgba(20,8,20,0.9)';
  o.lineWidth = size * 0.09;
  o.strokeText(text, size * 0.06, size * 0.06);
  const grad = o.createLinearGradient(0, 0, 0, th);
  grad.addColorStop(0, grade.title[0]);
  grad.addColorStop(0.45, grade.title[1]);
  grad.addColorStop(0.55, grade.title[2]);
  grad.addColorStop(1, grade.title[0]);
  o.fillStyle = grad;
  o.fillText(text, size * 0.06, size * 0.06);
  o.globalCompositeOperation = 'source-atop';
  o.fillStyle = 'rgba(60,20,0,0.28)';
  for (let y = 0; y < off.height; y += size * 0.16) o.fillRect(0, y, off.width, size * 0.07);
  ctx.drawImage(off, (W - tw) / 2 - size * 0.06, H * 0.775 - size * 0.06);
}

function drawSubtitle(ctx, W, H) {
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#f5c86b';
  ctx.font = `700 ${Math.round(W * 0.020)}px Arial, sans-serif`;
  try { ctx.letterSpacing = `${Math.round(W * 0.004)}px`; } catch (e) { /* older canvas: no tracking */ }
  ctx.fillText((state.subtitle || '').toUpperCase(), W / 2, H * 0.932);
  try { ctx.letterSpacing = '0px'; } catch (e) { /* ignore */ }
  ctx.restore();
}

function drawSeal(ctx, W, H) {
  const cx = W * 0.885, cy = H * 0.83, r = W * 0.052;
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = '#ff2e7e';
  ctx.fill();
  ctx.lineWidth = Math.max(2, W * 0.004);
  ctx.strokeStyle = '#ffffff';
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.78, 0, Math.PI * 2);
  ctx.fillStyle = '#8f1145';
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = `700 ${Math.round(r * 0.17)}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const label = 'VICE CITY ★ EST. 2026';
  const n = label.length;
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (i - (n - 1) / 2) * (Math.PI * 1.5 / n);
    const px = cx + Math.cos(a) * r * 0.88;
    const py = cy + Math.sin(a) * r * 0.88;
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(a + Math.PI / 2);
    ctx.fillText(label[i], 0, 0);
    ctx.restore();
  }
  ctx.font = `${Math.round(r * 0.72)}px Arial, sans-serif`;
  ctx.fillText('★', cx, cy + r * 0.03);
  ctx.restore();
}

function drawBilling(ctx, W, H) {
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font = `${Math.round(W * 0.0115)}px Arial, sans-serif`;
  try { ctx.letterSpacing = `${Math.round(W * 0.002)}px`; } catch (e) { /* ignore */ }
  ctx.fillText('NEON PALMS PICTURES  presents  a LEONIDA STORY  •  directed by YOU  •  starring YOUR PHOTOS  •  VICE CITY 2026', W / 2, H * 0.963);
  ctx.restore();
}

// The whole poster: sky, panels (heroes last), tags, review strip, title.
function drawCover(canvas, W, H) {
  const ctx = canvas.getContext('2d');
  canvas.width = W;
  canvas.height = H;
  const grade = currentGrade();
  const layout = currentLayout();
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, grade.sky[0]);
  sky.addColorStop(0.5, grade.sky[1]);
  sky.addColorStop(0.78, grade.sky[2]);
  sky.addColorStop(1, '#0b0812');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);
  const order = layout.panels.map((p, i) => i)
    .sort((a, b) => (layout.panels[a].hero ? 1 : 0) - (layout.panels[b].hero ? 1 : 0));
  for (const i of order) drawPanel(ctx, W, H, layout.panels[i], i, grade);
  for (const i of order) drawTag(ctx, W, H, layout.panels[i], i);
  drawReviewStrip(ctx, W, H);
  drawChromeTitle(ctx, W, H, grade);
  drawSubtitle(ctx, W, H);
  drawSeal(ctx, W, H);
  drawBilling(ctx, W, H);
}

// ---- Editor wiring: grids, presets, face-aware clicks, export. ----

const $ = id => document.getElementById(id);

function render() {
  const size = currentSize();
  const cover = $('cover');
  const solo = $('coverSolo');
  drawCover(cover, size.w, size.h);
  drawCover(solo, size.w, size.h);
  const layout = currentLayout();
  $('stageInfo').textContent = `${size.label} · layout: ${layout.name}`;
  updateFaceBar();
}

function updateFaceBar() {
  const layout = currentLayout();
  const n = layout.panels.length;
  const i = clamp(state.selected, 0, n - 1);
  const c = $('cover');
  const f = panelFocal(i, c.width, c.height);
  const label = layout.panels[i].card ? 'cast card' : (PHOTOS[panelPhoto(i)] || {}).name || 'photo';
  $('faceInfo').textContent =
    `Panel ${i + 1} of ${n} (${label}) · focal point ${Math.round(f.x * 100)}% / ${Math.round(f.y * 100)}% — panels dodge the title band.`;
}

function buildThumbs() {
  const box = $('thumbs');
  box.innerHTML = '';
  PHOTOS.forEach((p, i) => {
    const img = document.createElement('img');
    img.src = p.file;
    img.alt = p.name + ' — ' + p.role;
    img.title = p.name + ' — ' + p.role + ' (click, then click a panel)';
    img.addEventListener('click', () => {
      state.pickedPhoto = i;
      box.querySelectorAll('img').forEach(el => el.classList.remove('picked'));
      img.classList.add('picked');
    });
    box.appendChild(img);
  });
}

function buildLayoutGrid() {
  const box = $('layoutGrid');
  box.innerHTML = '';
  const grade = currentGrade();
  LAYOUTS.forEach(l => {
    const b = document.createElement('button');
    b.type = 'button';
    b.dataset.layout = l.id;
    const sw = document.createElement('span');
    sw.className = 'swatch';
    sw.style.background = `linear-gradient(135deg, ${grade.sky[1]}, ${grade.sky[2]})`;
    b.appendChild(sw);
    b.appendChild(document.createTextNode(l.name));
    b.addEventListener('click', () => {
      state.layoutId = l.id;
      state.assign = {};
      state.focal = {};
      state.selected = 0;
      box.querySelectorAll('button').forEach(el => el.classList.toggle('active', el.dataset.layout === l.id));
      render();
    });
    if (l.id === state.layoutId) b.classList.add('active');
    box.appendChild(b);
  });
}

function buildGradeGrid() {
  const box = $('gradeGrid');
  box.innerHTML = '';
  GRADES.forEach(g => {
    const b = document.createElement('button');
    b.type = 'button';
    b.dataset.grade = g.id;
    const sw = document.createElement('span');
    sw.className = 'swatch';
    sw.style.background = `linear-gradient(90deg, ${g.sky[0]}, ${g.sky[1]}, ${g.sky[2]})`;
    b.appendChild(sw);
    b.appendChild(document.createTextNode(g.name));
    b.addEventListener('click', () => {
      state.gradeId = g.id;
      box.querySelectorAll('button').forEach(el => el.classList.toggle('active', el.dataset.grade === g.id));
      render();
    });
    if (g.id === state.gradeId) b.classList.add('active');
    box.appendChild(b);
  });
}

function buildSizeGrid() {
  const box = $('sizeGrid');
  box.innerHTML = '';
  SIZES.forEach(s => {
    const b = document.createElement('button');
    b.type = 'button';
    b.dataset.size = s.id;
    b.textContent = s.label;
    b.addEventListener('click', () => {
      state.sizeId = s.id;
      box.querySelectorAll('button').forEach(el => el.classList.toggle('active', el.dataset.size === s.id));
      render();
    });
    if (s.id === state.sizeId) b.classList.add('active');
    box.appendChild(b);
  });
}

// URL presets for screenshots and deep links:
// ?shot=cover|editor&layout=&grade=&size=&photos=0,2,3&caption=&subtitle=
// Guard: an empty ?photos= must be ignored — Number("") is 0, so a naive
// split(",").map(Number) would put photo 0 in every panel.
function applyPresets() {
  const q = new URLSearchParams(location.search);
  const layout = q.get('layout');
  if (layout && LAYOUTS.some(l => l.id === layout)) state.layoutId = layout;
  const grade = q.get('grade');
  if (grade && GRADES.some(g => g.id === grade)) state.gradeId = grade;
  const size = q.get('size');
  if (size && SIZES.some(s => s.id === size)) state.sizeId = size;
  const photosParam = q.get('photos');
  if (photosParam) {
    const idx = photosParam.split(',')
      .map(s => Number(s))
      .filter(n => Number.isInteger(n) && n >= 0 && n < PHOTOS.length);
    if (idx.length) {
      currentLayout().panels.forEach((p, i) => {
        if (!p.card && idx[i] !== undefined) state.assign[i] = idx[i];
      });
    }
  }
  const caption = q.get('caption');
  if (caption) {
    state.title = caption.slice(0, 24).toUpperCase();
    $('titleInput').value = state.title;
  }
  const subtitle = q.get('subtitle');
  if (subtitle) {
    state.subtitle = subtitle.slice(0, 48).toUpperCase();
    $('subtitleInput').value = state.subtitle;
  }
  if (q.get('shot') === 'cover') document.body.classList.add('cover-mode');
}

// Face-aware crop: a click on the preview picks a panel. With a photo
// picked from the strip it places that photo; otherwise it sets the
// panel's focal point to the clicked spot.
function onCoverClick(ev) {
  const canvas = $('cover');
  const rect = canvas.getBoundingClientRect();
  const px = (ev.clientX - rect.left) * (canvas.width / rect.width);
  const py = (ev.clientY - rect.top) * (canvas.height / rect.height);
  const layout = currentLayout();
  const order = layout.panels.map((p, i) => i)
    .sort((a, b) => (layout.panels[b].hero ? 1 : 0) - (layout.panels[a].hero ? 1 : 0));
  for (const i of order) {
    const p = layout.panels[i];
    if (panelHit(p, px, py, canvas.width, canvas.height)) {
      state.selected = i;
      if (state.pickedPhoto !== null && !p.card) {
        state.assign[i] = state.pickedPhoto;
        state.pickedPhoto = null;
        document.querySelectorAll('#thumbs img').forEach(el => el.classList.remove('picked'));
      } else if (!p.card) {
        state.focal[i] = panelFocalXY(p, px, py, canvas.width, canvas.height);
      }
      render();
      return;
    }
  }
}

function loadImage(src) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

async function exportPNG() {
  const size = currentSize();
  const off = document.createElement('canvas');
  drawCover(off, size.w, size.h);
  const status = $('exportStatus');
  status.textContent = 'Exporting…';
  const blob = await new Promise(resolve => off.toBlob(resolve, 'image/png'));
  if (!blob) {
    status.textContent = 'Export failed — please try again.';
    return;
  }
  const first = new Uint8Array(await blob.slice(0, 8).arrayBuffer());
  const magic = Array.from(first).map(b => b.toString(16).padStart(2, '0')).join('');
  window.__lastExport = { width: size.w, height: size.h, bytes: blob.size, magic };
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `neon-palms-${size.id}.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
  status.textContent = `Exported ${size.w} × ${size.h} PNG (${(blob.size / 1024).toFixed(0)} KB)`;
}

function init() {
  applyPresets();
  buildThumbs();
  buildLayoutGrid();
  buildGradeGrid();
  buildSizeGrid();
  $('titleInput').addEventListener('input', ev => {
    state.title = ev.target.value.toUpperCase();
    render();
  });
  $('subtitleInput').addEventListener('input', ev => {
    state.subtitle = ev.target.value.toUpperCase();
    render();
  });
  $('cover').addEventListener('click', onCoverClick);
  $('resetFace').addEventListener('click', () => {
    const c = $('cover');
    state.focal[state.selected] = defaultFocalFor(currentLayout().panels[state.selected], c.width, c.height);
    render();
  });
  $('exportBtn').addEventListener('click', exportPNG);
  $('fileInput').addEventListener('change', ev => {
    const files = Array.from(ev.target.files || []);
    files.forEach(file => {
      const url = URL.createObjectURL(file);
      const idx = PHOTOS.length;
      PHOTOS.push({ file: url, name: file.name.replace(/\.[^.]+$/, '').toUpperCase().slice(0, 12) || 'PHOTO', role: 'YOURS' });
      loadImage(url).then(img => { images[idx] = img; render(); });
      const box = $('thumbs');
      const thumb = document.createElement('img');
      thumb.src = url;
      thumb.alt = 'Your photo';
      thumb.addEventListener('click', () => {
        state.pickedPhoto = idx;
        box.querySelectorAll('img').forEach(el => el.classList.remove('picked'));
        thumb.classList.add('picked');
      });
      box.appendChild(thumb);
    });
    $('photoCount').textContent = `${PHOTOS.length} photos loaded`;
    render();
  });
  const fontReady = (document.fonts ? document.fonts.load('100px Anton').catch(() => null) : Promise.resolve(null));
  const photosReady = Promise.all(PHOTOS.map(p => loadImage(p.file)))
    .then(loaded => { loaded.forEach((img, i) => { images[i] = img; }); });
  Promise.all([fontReady, photosReady]).then(() => {
    render();
    window.__ready = true;
  });
  render();
}

init();

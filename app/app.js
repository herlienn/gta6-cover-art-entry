// Neon Palms Cover Studio v2 — a GTA 6-style poster maker.
// Every line here was written fresh for this entry. The app draws its cover
// on one canvas: slanted multi-panel collages, a pop-out hero, face-aware
// crops, movie-poster chrome (seal, billing block, cast tags, review strip,
// striped chrome title) and skin-safe Vice City grades. It runs fully offline:
// every photo, font and script is a file under app/ or a data: URI.

"use strict";

// ---------------------------------------------------------------- samples
// Seven built-in photos: five made with an image model for this entry, plus
// the kit's two starter samples (free to use). Labels double as cast names.
const SAMPLES = [
  { src: "samples/leather.jpg", label: "DANTE" },
  { src: "samples/neon.jpg", label: "LUCIA" },
  { src: "samples/hawaiian.jpg", label: "MIGUEL" },
  { src: "samples/beach.jpg", label: "SOFIA" },
  { src: "samples/skater.jpg", label: "KAI" },
  { src: "samples/pier.jpg", label: "VICE CITY" },
  { src: "samples/boulevard.jpg", label: "LEONIDA" },
];

const ROLES = ["DRIVER", "GETAWAY", "FIXER", "HUSTLER", "RACER", "LOOKOUT", "ENFORCER"];

// ---------------------------------------------------------------- layouts
// Panels live in the art region: x/y/w/h are fractions of the cover, the
// title band sits below y = 0.76, so no panel ever hides behind the title.
// slant shifts the top edge sideways (parallelogram panels). hero: true
// marks the pop-out hero panel, drawn last, scaled up, with a thick border.
const LAYOUTS = [
  { name: "Vice Trio", panels: [
    { x: 0.02, y: 0.02, w: 0.32, h: 0.72, slant: 0.05 },
    { x: 0.35, y: 0.02, w: 0.32, h: 0.72, slant: 0.05 },
    { x: 0.68, y: 0.02, w: 0.30, h: 0.72, slant: 0.05 } ] },
  { name: "Sunset Stack", panels: [
    { x: 0.02, y: 0.02, w: 0.62, h: 0.72, slant: 0.04 },
    { x: 0.66, y: 0.02, w: 0.32, h: 0.35, slant: -0.04 },
    { x: 0.66, y: 0.39, w: 0.32, h: 0.35, slant: -0.04 } ] },
  { name: "Hero Pop-Out", panels: [
    { x: 0.02, y: 0.10, w: 0.28, h: 0.62, slant: 0.06 },
    { x: 0.30, y: 0.02, w: 0.40, h: 0.72, slant: 0.00, hero: true },
    { x: 0.70, y: 0.10, w: 0.28, h: 0.62, slant: -0.06 } ] },
  { name: "Hero Left", panels: [
    { x: 0.02, y: 0.02, w: 0.55, h: 0.72, slant: 0.05, hero: true },
    { x: 0.59, y: 0.02, w: 0.39, h: 0.35, slant: -0.05 },
    { x: 0.59, y: 0.39, w: 0.39, h: 0.35, slant: -0.05 } ] },
  { name: "Cast Mosaic 7", panels: [
    { x: 0.02, y: 0.02, w: 0.30, h: 0.36, slant: 0.04 },
    { x: 0.34, y: 0.02, w: 0.30, h: 0.36, slant: 0.04 },
    { x: 0.66, y: 0.02, w: 0.32, h: 0.36, slant: 0.04 },
    { x: 0.02, y: 0.40, w: 0.22, h: 0.34, slant: -0.04 },
    { x: 0.26, y: 0.40, w: 0.22, h: 0.34, slant: -0.04 },
    { x: 0.50, y: 0.40, w: 0.22, h: 0.34, slant: -0.04 },
    { x: 0.74, y: 0.40, w: 0.24, h: 0.34, slant: -0.04, hero: true } ] },
  { name: "Neon Grid", panels: [
    { x: 0.02, y: 0.02, w: 0.47, h: 0.35, slant: 0.05 },
    { x: 0.51, y: 0.02, w: 0.47, h: 0.35, slant: -0.05 },
    { x: 0.02, y: 0.39, w: 0.47, h: 0.35, slant: -0.05 },
    { x: 0.51, y: 0.39, w: 0.47, h: 0.35, slant: 0.05 } ] },
  { name: "Palm Strip", panels: [
    { x: 0.01, y: 0.02, w: 0.185, h: 0.72, slant: 0.03 },
    { x: 0.205, y: 0.02, w: 0.185, h: 0.72, slant: 0.03 },
    { x: 0.40, y: 0.02, w: 0.185, h: 0.72, slant: 0.03 },
    { x: 0.595, y: 0.02, w: 0.185, h: 0.72, slant: 0.03 },
    { x: 0.79, y: 0.02, w: 0.185, h: 0.72, slant: 0.03 } ] },
  { name: "Golden Hour", panels: [
    { x: 0.02, y: 0.02, w: 0.96, h: 0.40, slant: 0.03, hero: true },
    { x: 0.02, y: 0.44, w: 0.31, h: 0.30, slant: 0.05 },
    { x: 0.345, y: 0.44, w: 0.31, h: 0.30, slant: 0.05 },
    { x: 0.67, y: 0.44, w: 0.31, h: 0.30, slant: 0.05 } ] },
  { name: "Vice Nights", panels: [
    { x: 0.02, y: 0.02, w: 0.31, h: 0.46, slant: 0.05 },
    { x: 0.345, y: 0.02, w: 0.31, h: 0.46, slant: 0.05 },
    { x: 0.67, y: 0.02, w: 0.31, h: 0.46, slant: 0.05 },
    { x: 0.14, y: 0.50, w: 0.72, h: 0.24, slant: -0.03, hero: true } ] },
  { name: "Billboard", panels: [
    { x: 0.02, y: 0.02, w: 0.96, h: 0.46, slant: 0.02, hero: true },
    { x: 0.02, y: 0.50, w: 0.31, h: 0.24, slant: 0.06 },
    { x: 0.345, y: 0.50, w: 0.31, h: 0.24, slant: 0.06 },
    { x: 0.67, y: 0.50, w: 0.31, h: 0.24, slant: 0.06 } ] },
  { name: "Cast Call", panels: [
    { x: 0.02, y: 0.02, w: 0.31, h: 0.35, slant: 0.04 },
    { x: 0.345, y: 0.02, w: 0.31, h: 0.35, slant: 0.04 },
    { x: 0.67, y: 0.02, w: 0.31, h: 0.35, slant: 0.04 },
    { x: 0.02, y: 0.39, w: 0.31, h: 0.35, slant: -0.04 },
    { x: 0.345, y: 0.39, w: 0.31, h: 0.35, slant: -0.04 },
    { x: 0.67, y: 0.39, w: 0.31, h: 0.35, slant: -0.04 } ] },
  { name: "After Dark", panels: [
    { x: 0.02, y: 0.06, w: 0.26, h: 0.62, slant: 0.08 },
    { x: 0.28, y: 0.02, w: 0.26, h: 0.66, slant: 0.08, hero: true },
    { x: 0.54, y: 0.06, w: 0.22, h: 0.62, slant: 0.08 },
    { x: 0.76, y: 0.10, w: 0.22, h: 0.58, slant: 0.08 },
    { x: 0.40, y: 0.44, w: 0.34, h: 0.28, slant: -0.06 } ] },
];

// ---------------------------------------------------------------- grades
// Skin-safe grades: warm overlays at gentle strength, never a hue shift
// that turns skin green or purple. Each grade is a sky gradient, a panel
// tint (blend mode + alpha) and a vignette strength.
const GRADES = [
  { name: "Vice Sunset", sky: ["#2b1055", "#ff5e8a", "#ffb347"], tint: "#ff7a3d", blend: "soft-light", alpha: 0.34, vig: 0.30, swatch: "linear-gradient(135deg,#2b1055,#ff5e8a,#ffb347)" },
  { name: "Neon Nights", sky: ["#0a0a2e", "#7b2ff7", "#22d3ee"], tint: "#7b2ff7", blend: "soft-light", alpha: 0.30, vig: 0.38, swatch: "linear-gradient(135deg,#0a0a2e,#7b2ff7,#22d3ee)" },
  { name: "Palm Gold", sky: ["#3d1e08", "#e8a33d", "#ffe08a"], tint: "#e8a33d", blend: "soft-light", alpha: 0.30, vig: 0.26, swatch: "linear-gradient(135deg,#3d1e08,#e8a33d,#ffe08a)" },
  { name: "Heatwave", sky: ["#3d0a12", "#ff3b30", "#ff9500"], tint: "#ff3b30", blend: "soft-light", alpha: 0.32, vig: 0.30, swatch: "linear-gradient(135deg,#3d0a12,#ff3b30,#ff9500)" },
  { name: "After Dark", sky: ["#05060f", "#1c2b4a", "#3d5a80"], tint: "#3d5a80", blend: "soft-light", alpha: 0.28, vig: 0.44, swatch: "linear-gradient(135deg,#05060f,#1c2b4a,#3d5a80)" },
  { name: "Candy Pop", sky: ["#3d0a3d", "#ff5ea8", "#7ee8fa"], tint: "#ff5ea8", blend: "soft-light", alpha: 0.26, vig: 0.24, swatch: "linear-gradient(135deg,#3d0a3d,#ff5ea8,#7ee8fa)" },
  { name: "Teal & Orange", sky: ["#062a30", "#0e7c86", "#ff8c42"], tint: "#ff8c42", blend: "soft-light", alpha: 0.30, vig: 0.32, swatch: "linear-gradient(135deg,#062a30,#0e7c86,#ff8c42)" },
  { name: "Noir Ink", sky: ["#0a0a0a", "#2a2a2a", "#555555"], tint: "#888888", blend: "soft-light", alpha: 0.22, vig: 0.40, swatch: "linear-gradient(135deg,#0a0a0a,#2a2a2a,#888)" },
  { name: "Retro Fade", sky: ["#2e1a0e", "#c98a5a", "#f2d5a0"], tint: "#c98a5a", blend: "soft-light", alpha: 0.30, vig: 0.28, swatch: "linear-gradient(135deg,#2e1a0e,#c98a5a,#f2d5a0)" },
];

// Panels are drawn at 94% of their layout height so their rows end at
// y 0.70 and the review strip (0.70..0.76) has a clear zone of sky.
const VSCALE = 0.94;

// ---------------------------------------------------------------- state
const state = {
  photos: [],            // {img, label, src}
  layoutIndex: 2,        // Hero Pop-Out by default
  gradeIndex: 0,
  title: "NEON PALMS",
  caption: "ONE LAST JOB IN VICE CITY",
  size: "1080x1080",
  chromeTitle: true,
  seal: true,
  sealText: "VICE CITY",
  tags: true,
  review: true,
  billing: true,
  assignments: [],       // panel index -> photo index
  focals: [],            // panel index -> {x, y} in photo fractions (face-aware crop)
  tagTexts: [],          // panel index -> "NAME — ROLE"
  selectedPanel: 0,
  pickedPhoto: 0,
};

const canvas = document.getElementById("cover");
const ctx = canvas.getContext("2d");
let lastExport = null; // {size, dataUrl} — the most recent export, for tests

function photoLabel(i) {
  const p = state.photos[i];
  return p ? p.label : "PHOTO";
}

function defaultFocal(panel) {
  // Face-aware default: the faces in our photos sit in the upper third,
  // their centres near 30% of the photo height. A wide panel crops a thin
  // horizontal slice, so the slice must centre on the face (y 0.30) — an
  // anchor at the very top would show only hair and sky. A tall panel
  // shows most of the photo's height, so the same 0.30–0.32 works there.
  // The user can click any face to move the focal point.
  return { x: 0.5, y: 0.30 };
}

function resetLayoutState() {
  const layout = LAYOUTS[state.layoutIndex];
  const n = layout.panels.length;
  state.assignments = [];
  state.focals = [];
  state.tagTexts = [];
  for (let i = 0; i < n; i++) {
    state.assignments[i] = state.photos.length ? i % state.photos.length : 0;
    state.focals[i] = defaultFocal(layout.panels[i]);
    state.tagTexts[i] = photoLabel(state.assignments[i]) + " — " + ROLES[i % ROLES.length];
  }
  state.selectedPanel = 0;
  syncTagInput();
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("cannot load " + src));
    img.src = src;
  });
}

async function loadSamples() {
  for (const s of SAMPLES) {
    try {
      const img = await loadImage(s.src);
      state.photos.push({ img, label: s.label, src: s.src });
    } catch (e) {
      console.warn("sample skipped:", s.src);
    }
  }
}

// ---------------------------------------------------------------- render
// The cover is drawn in normalized space: the art region runs y 0..0.76 and
// the title band y 0.76..1. Every panel dodges the title band by design.

function panelPath(c, x, y, w, h, slant) {
  const dx = slant * h;
  c.beginPath();
  c.moveTo(x + dx, y);
  c.lineTo(x + w + dx, y);
  c.lineTo(x + w - dx, y + h);
  c.lineTo(x - dx, y + h);
  c.closePath();
}

function drawPhotoInPanel(c, photo, panel, rect, focal) {
  const img = photo.img;
  const pw = rect.w, ph = rect.h;
  const panelAspect = pw / ph;
  const photoAspect = img.naturalWidth / img.naturalHeight;
  let sw, sh, sx, sy;
  if (photoAspect > panelAspect) {
    // Photo is wider: crop the sides, centre the crop on the focal point.
    sh = img.naturalHeight;
    sw = sh * panelAspect;
    sx = Math.min(Math.max(focal.x * img.naturalWidth - sw / 2, 0), img.naturalWidth - sw);
    sy = 0;
  } else {
    // Photo is taller: crop top/bottom, centre on the focal point.
    sw = img.naturalWidth;
    sh = sw / panelAspect;
    sx = 0;
    sy = Math.min(Math.max(focal.y * img.naturalHeight - sh / 2, 0), img.naturalHeight - sh);
  }
  c.drawImage(img, sx, sy, sw, sh, rect.x, rect.y, pw, ph);
}

function drawPanel(c, panel, rect, photo, focal, grade, isHero, selected) {
  const border = Math.max(3, rect.w * 0.008);
  c.save();
  if (isHero) {
    // Pop-out hero: drawn bigger than its slot, overlapping its neighbours,
    // with a thick white border and a drop shadow.
    const cx = rect.x + rect.w / 2, cy = rect.y + rect.h / 2;
    c.translate(cx, cy);
    c.scale(1.06, 1.06);
    c.translate(-cx, -cy);
    c.shadowColor = "rgba(0,0,0,0.55)";
    c.shadowBlur = rect.w * 0.06;
    c.shadowOffsetY = rect.w * 0.02;
  }
  panelPath(c, rect.x, rect.y, rect.w, rect.h, panel.slant);
  c.clip();
  drawPhotoInPanel(c, photo, panel, rect, focal);
  // Skin-safe grade tint, clipped to the panel.
  c.globalCompositeOperation = grade.blend;
  c.globalAlpha = grade.alpha;
  c.fillStyle = grade.tint;
  c.fillRect(rect.x - rect.w * 0.1, rect.y, rect.w * 1.2, rect.h);
  c.globalAlpha = 1;
  c.globalCompositeOperation = "source-over";
  c.restore();

  // Border, drawn after the clip is released.
  c.save();
  if (isHero) {
    const cx = rect.x + rect.w / 2, cy = rect.y + rect.h / 2;
    c.translate(cx, cy);
    c.scale(1.06, 1.06);
    c.translate(-cx, -cy);
  }
  panelPath(c, rect.x, rect.y, rect.w, rect.h, panel.slant);
  c.lineWidth = isHero ? border * 1.6 : border;
  c.strokeStyle = selected ? "#ffb347" : "#ffffff";
  c.stroke();
  c.restore();
}

function drawChromeTitle(c, text, x, y, size, W) {
  // Striped chrome title: the words are drawn once to an offscreen canvas,
  // filled with a silver-to-gold gradient, then thin dark stripes are cut
  // across them with source-atop, and the result is stamped on the cover.
  const off = document.createElement("canvas");
  off.width = Math.ceil(W * 0.96);
  off.height = Math.ceil(size * 1.5);
  const o = off.getContext("2d");
  o.font = size + "px Anton, sans-serif";
  o.textAlign = "center";
  o.textBaseline = "middle";
  const grad = o.createLinearGradient(0, 0, 0, off.height);
  grad.addColorStop(0.0, "#ffffff");
  grad.addColorStop(0.35, "#ffe9a8");
  grad.addColorStop(0.55, "#ffb347");
  grad.addColorStop(0.75, "#f4f4f4");
  grad.addColorStop(1.0, "#c9a227");
  o.fillStyle = grad;
  o.fillText(text, off.width / 2, off.height / 2);
  o.globalCompositeOperation = "source-atop";
  o.fillStyle = "rgba(20,10,40,0.28)";
  const stripe = Math.max(2, size * 0.045);
  for (let sy = stripe; sy < off.height; sy += stripe * 3) {
    o.fillRect(0, sy, off.width, stripe);
  }
  o.globalCompositeOperation = "source-over";
  c.drawImage(off, x - off.width / 2, y - off.height / 2);
}

function drawSeal(c, cx, cy, r, label) {
  c.save();
  c.translate(cx, cy);
  c.fillStyle = "#e23d6e";
  c.beginPath(); c.arc(0, 0, r, 0, Math.PI * 2); c.fill();
  c.lineWidth = Math.max(2, r * 0.07);
  c.strokeStyle = "#ffffff";
  c.beginPath(); c.arc(0, 0, r * 0.88, 0, Math.PI * 2); c.stroke();
  c.beginPath(); c.arc(0, 0, r * 0.62, 0, Math.PI * 2); c.stroke();
  // Ring text: the label walks around the circle, one letter at a time.
  c.fillStyle = "#ffffff";
  c.font = "bold " + Math.round(r * 0.20) + "px system-ui, sans-serif";
  c.textAlign = "center";
  c.textBaseline = "middle";
  const ring = ("★ " + label + " ★ EST. 2026 ").split("");
  const step = (Math.PI * 2) / ring.length;
  for (let i = 0; i < ring.length; i++) {
    c.save();
    c.rotate(i * step - Math.PI / 2);
    c.translate(0, -r * 0.75);
    c.fillText(ring[i], 0, 0);
    c.restore();
  }
  // Centre star.
  c.font = Math.round(r * 0.62) + "px system-ui, sans-serif";
  c.fillText("★", 0, r * 0.03);
  c.restore();
}

function drawStars(c, cx, y, size) {
  c.save();
  c.fillStyle = "#ffb347";
  c.font = size + "px system-ui, sans-serif";
  c.textAlign = "center";
  c.textBaseline = "middle";
  c.fillText("★★★★★", cx, y);
  c.restore();
}

function drawTag(c, text, x, y, size) {
  c.save();
  c.font = "bold " + size + "px system-ui, sans-serif";
  const w = c.measureText(text).width + size * 1.1;
  c.fillStyle = "rgba(10,6,20,0.82)";
  c.beginPath();
  c.roundRect(x, y - size * 0.72, w, size * 1.44, size * 0.3);
  c.fill();
  c.fillStyle = "#ffffff";
  c.textAlign = "left";
  c.textBaseline = "middle";
  c.fillText(text, x + size * 0.55, y + size * 0.04);
  c.restore();
}

function drawCover(c, W, H, s) {
  const grade = GRADES[s.gradeIndex];
  const layout = LAYOUTS[s.layoutIndex];

  // Sky: a Vice City sunset gradient behind everything.
  const sky = c.createLinearGradient(0, 0, 0, H * 0.78);
  sky.addColorStop(0, grade.sky[0]);
  sky.addColorStop(0.55, grade.sky[1]);
  sky.addColorStop(1, grade.sky[2]);
  c.fillStyle = sky;
  c.fillRect(0, 0, W, H);

  // Sun disc, low on the horizon behind the panels.
  c.save();
  c.globalAlpha = 0.85;
  const sunR = W * 0.16;
  const sun = c.createRadialGradient(W * 0.78, H * 0.30, sunR * 0.1, W * 0.78, H * 0.30, sunR);
  sun.addColorStop(0, "#fff3c4");
  sun.addColorStop(0.6, "#ffb347");
  sun.addColorStop(1, "rgba(255,94,138,0)");
  c.fillStyle = sun;
  c.beginPath(); c.arc(W * 0.78, H * 0.30, sunR, 0, Math.PI * 2); c.fill();
  c.restore();

  // Panels: the hero pops out last, over its neighbours. Panel rows are
  // scaled by VSCALE so they end at y 0.70 and the review strip has a clear
  // zone of sky and never covers a chin.
  const rects = layout.panels.map((p) => ({
    x: p.x * W, y: p.y * H * VSCALE, w: p.w * W, h: p.h * H * VSCALE,
  }));
  const order = layout.panels.map((p, i) => i).sort((a, b) => {
    if (layout.panels[a].hero) return 1;
    if (layout.panels[b].hero) return -1;
    return a - b;
  });
  for (const i of order) {
    const photo = s.photos[s.assignments[i] % Math.max(1, s.photos.length)];
    if (!photo) continue;
    drawPanel(c, layout.panels[i], rects[i], photo, s.focals[i] || { x: 0.5, y: 0.3 }, grade, !!layout.panels[i].hero, i === s.selectedPanel);
  }

  // Cast tags: name + role pills on the top corner of each panel, so they
  // never collide with the review strip that runs along the panels' base.
  if (s.tags) {
    layout.panels.forEach((p, i) => {
      const r = rects[i];
      const size = Math.max(11, Math.round(W * 0.016));
      drawTag(c, s.tagTexts[i] || "", r.x + r.w * 0.04, r.y + size * 1.35, size);
    });
  }

  // Title band: dark gradient, then the chrome title and the caption.
  const bandY = H * 0.76;
  const band = c.createLinearGradient(0, bandY, 0, H);
  band.addColorStop(0, "rgba(10,6,20,0)");
  band.addColorStop(0.25, "rgba(10,6,20,0.92)");
  band.addColorStop(1, "rgba(10,6,20,0.97)");
  c.fillStyle = band;
  c.fillRect(0, bandY, W, H - bandY);

  const titleSize = Math.round(W * (s.title.length > 12 ? 0.085 : 0.105));
  if (s.chromeTitle) {
    drawChromeTitle(c, s.title, W / 2, bandY + (H - bandY) * 0.38, titleSize, W);
  } else {
    c.save();
    c.font = titleSize + "px Anton, sans-serif";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillStyle = "#ffffff";
    c.fillText(s.title, W / 2, bandY + (H - bandY) * 0.38);
    c.restore();
  }
  c.save();
  c.font = "bold " + Math.round(W * 0.021) + "px system-ui, sans-serif";
  c.textAlign = "center";
  c.textBaseline = "middle";
  c.fillStyle = "#ffe9a8";
  c.fillText(s.caption, W / 2, bandY + (H - bandY) * 0.72);
  c.restore();

  // Review strip: stars + a quote on a dark strip along the panels' base,
  // just above the title band, so the white text stays readable on any photo.
  if (s.review) {
    const ry = bandY - H * 0.045;
    c.save();
    c.fillStyle = "rgba(10,6,20,0.55)";
    c.fillRect(0, bandY - H * 0.068, W, H * 0.066);
    c.restore();
    drawStars(c, W / 2, ry - H * 0.012, Math.round(W * 0.024));
    c.save();
    c.font = "italic bold " + Math.round(W * 0.018) + "px Georgia, serif";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillStyle = "#ffffff";
    c.fillText("“THE DEFINITIVE VICE CITY POSTER” — VICE DAILY", W / 2, ry + H * 0.016);
    c.restore();
  }

  // Round seal, overlapping the title band's top-right corner.
  if (s.seal) {
    drawSeal(c, W * 0.90, bandY + H * 0.02, W * 0.055, s.sealText);
  }

  // Billing block: tiny movie credits along the very bottom edge.
  if (s.billing) {
    c.save();
    c.font = Math.round(W * 0.011) + "px system-ui, sans-serif";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillStyle = "rgba(255,255,255,0.62)";
    c.fillText("NEON PALMS PICTURES  presents  a LEONIDA STORY  •  directed by YOU  •  starring YOUR PHOTOS  •  VICE CITY 2026", W / 2, H - H * 0.018);
    c.restore();
  }

  // Vignette: darkens the edges, keeps the middle bright.
  const vig = c.createRadialGradient(W / 2, H * 0.42, Math.min(W, H) * 0.35, W / 2, H * 0.42, Math.max(W, H) * 0.75);
  vig.addColorStop(0, "rgba(0,0,0,0)");
  vig.addColorStop(1, "rgba(0,0,0," + grade.vig + ")");
  c.fillStyle = vig;
  c.fillRect(0, 0, W, H);
}

function renderPreview() {
  const [w, h] = state.size.split("x").map(Number);
  canvas.width = w;
  canvas.height = h;
  drawCover(ctx, w, h, state);
  const layout = LAYOUTS[state.layoutIndex];
  document.getElementById("sizeLabel").textContent =
    state.size.replace("x", " × ") + " · layout: " + layout.name;
  const f = state.focals[state.selectedPanel] || { x: 0.5, y: 0.3 };
  document.getElementById("faceInfo").textContent =
    "Panel " + (state.selectedPanel + 1) + " of " + layout.panels.length +
    " · focal point " + Math.round(f.x * 100) + "% / " + Math.round(f.y * 100) +
    "% — panels dodge the title band.";
}

// ---------------------------------------------------------------- interface
function buildSampleGrid() {
  const grid = document.getElementById("sampleGrid");
  grid.innerHTML = "";
  state.photos.forEach((p, i) => {
    const img = document.createElement("img");
    img.src = p.src;
    img.alt = p.label;
    img.title = p.label + " — click, then click a panel to place it";
    if (i === state.pickedPhoto) img.classList.add("picked");
    img.addEventListener("click", () => {
      state.pickedPhoto = i;
      buildSampleGrid();
    });
    grid.appendChild(img);
  });
  document.getElementById("photoCount").textContent = state.photos.length + " photos loaded";
}

function buildLayoutGrid() {
  const grid = document.getElementById("layoutGrid");
  grid.innerHTML = "";
  LAYOUTS.forEach((layout, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "layout-btn" + (i === state.layoutIndex ? " active" : "");
    const thumb = document.createElement("span");
    thumb.className = "thumb";
    thumb.style.background = "linear-gradient(135deg," +
      GRADES[state.gradeIndex].sky[1] + " 0%," + GRADES[state.gradeIndex].sky[2] + " 100%)";
    b.appendChild(thumb);
    b.appendChild(document.createTextNode(layout.name + " · " + layout.panels.length + " panels"));
    b.addEventListener("click", () => {
      state.layoutIndex = i;
      resetLayoutState();
      buildLayoutGrid();
      renderPreview();
    });
    grid.appendChild(b);
  });
}

function buildGradeGrid() {
  const grid = document.getElementById("gradeGrid");
  grid.innerHTML = "";
  GRADES.forEach((grade, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "grade-btn" + (i === state.gradeIndex ? " active" : "");
    const sw = document.createElement("span");
    sw.className = "swatch";
    sw.style.background = grade.swatch;
    b.appendChild(sw);
    b.appendChild(document.createTextNode(grade.name));
    b.addEventListener("click", () => {
      state.gradeIndex = i;
      buildGradeGrid();
      buildLayoutGrid();
      renderPreview();
    });
    grid.appendChild(b);
  });
}

function syncTagInput() {
  const input = document.getElementById("tagInput");
  input.value = state.tagTexts[state.selectedPanel] || "";
  input.placeholder = "Tag for panel " + (state.selectedPanel + 1);
}

// Click the preview: if the click lands on a panel, that panel becomes the
// selected one — and its face-aware focal point moves to the face clicked.
// The click is mapped through the panel's crop back into photo fractions.
canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const px = (event.clientX - rect.left) / rect.width;
  const py = (event.clientY - rect.top) / rect.height;
  const layout = LAYOUTS[state.layoutIndex];
  // Panels are checked hero-last so the pop-out hero wins its overlap.
  const order = layout.panels.map((p, i) => i).sort((a, b) => {
    if (layout.panels[a].hero) return 1;
    if (layout.panels[b].hero) return -1;
    return a - b;
  });
  for (const i of order.slice().reverse()) {
    const p = layout.panels[i];
    const py0 = p.y * VSCALE, ph = p.h * VSCALE;
    if (px >= p.x && px <= p.x + p.w && py >= py0 && py <= py0 + ph) {
      state.selectedPanel = i;
      // Place the picked photo into this panel.
      state.assignments[i] = state.pickedPhoto;
      state.tagTexts[i] = photoLabel(state.pickedPhoto) + " — " + ROLES[i % ROLES.length];
      // Face-aware crop: the clicked point, in photo fractions.
      const photo = state.photos[state.pickedPhoto];
      if (photo) {
        const img = photo.img;
        const panelAspect = p.w / p.h;
        const photoAspect = img.naturalWidth / img.naturalHeight;
        if (photoAspect > panelAspect) {
          const sw = img.naturalHeight * panelAspect;
          const sx = Math.min(Math.max(((px - p.x) / p.w) * sw - sw / 2, 0), img.naturalWidth - sw);
          state.focals[i] = { x: (sx + sw / 2) / img.naturalWidth, y: state.focals[i].y };
        } else {
          const sh = img.naturalWidth / panelAspect;
          const sy = Math.min(Math.max(((py - py0) / ph) * sh - sh / 2, 0), img.naturalHeight - sh);
          state.focals[i] = { x: state.focals[i].x, y: (sy + sh / 2) / img.naturalHeight };
        }
      }
      syncTagInput();
      renderPreview();
      return;
    }
  }
});

document.getElementById("faceReset").addEventListener("click", () => {
  const layout = LAYOUTS[state.layoutIndex];
  state.focals[state.selectedPanel] = defaultFocal(layout.panels[state.selectedPanel]);
  renderPreview();
});

document.getElementById("titleInput").addEventListener("input", (e) => {
  state.title = (e.target.value || "NEON PALMS").toUpperCase();
  renderPreview();
});
document.getElementById("captionInput").addEventListener("input", (e) => {
  state.caption = (e.target.value || "").toUpperCase();
  renderPreview();
});
document.getElementById("sealInput").addEventListener("input", (e) => {
  state.sealText = (e.target.value || "VICE CITY").toUpperCase();
  renderPreview();
});
document.getElementById("tagInput").addEventListener("input", (e) => {
  state.tagTexts[state.selectedPanel] = e.target.value.toUpperCase();
  renderPreview();
});
document.getElementById("sizeSelect").addEventListener("change", (e) => {
  state.size = e.target.value;
  renderPreview();
});
for (const [id, key] of [["chromeTitle", "chromeTitle"], ["sealToggle", "seal"], ["tagsToggle", "tags"], ["reviewToggle", "review"], ["billingToggle", "billing"]]) {
  document.getElementById(id).addEventListener("change", (e) => {
    state[key] = e.target.checked;
    renderPreview();
  });
}

document.getElementById("uploadInput").addEventListener("change", async (e) => {
  for (const file of e.target.files) {
    const url = await new Promise((resolve) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.readAsDataURL(file);
    });
    try {
      const img = await loadImage(url);
      const label = (file.name || "YOU").replace(/\.[^.]+$/, "").toUpperCase().slice(0, 12);
      state.photos.push({ img, label, src: url });
    } catch (err) {
      console.warn("upload skipped:", file.name);
    }
  }
  buildSampleGrid();
  renderPreview();
});

// ---------------------------------------------------------------- export
async function exportPng(size) {
  const [w, h] = size.split("x").map(Number);
  const off = document.createElement("canvas");
  off.width = w;
  off.height = h;
  drawCover(off.getContext("2d"), w, h, state);
  const blob = await new Promise((resolve) => off.toBlob(resolve, "image/png"));
  const url = URL.createObjectURL(blob);
  lastExport = { size, dataUrl: url, bytes: blob.size };
  const a = document.createElement("a");
  a.href = url;
  a.download = "neon-palms-cover-" + size + ".png";
  document.body.appendChild(a);
  a.click();
  a.remove();
  const note = document.getElementById("exportNote");
  note.textContent = "Exported " + size.replace("x", " × ") + " PNG (" + Math.round(blob.size / 1024) + " KB).";
  note.classList.add("ok");
  return blob;
}

document.querySelectorAll(".export-btn").forEach((b) => {
  b.addEventListener("click", () => exportPng(b.dataset.export));
});

// ---------------------------------------------------------------- presets
// Screenshot presets via the URL: ?shot=cover&layout=2&grade=0&size=1920x1080
// loads a hero cover full-screen; ?shot=editor keeps the editor visible;
// ?shot=square / ?shot=portrait render that cover size full-screen.
function applyPreset() {
  const q = new URLSearchParams(location.search);
  const shot = q.get("shot");
  if (!shot) return;
  const layout = parseInt(q.get("layout") || "", 10);
  if (!Number.isNaN(layout) && layout >= 0 && layout < LAYOUTS.length) state.layoutIndex = layout;
  const grade = parseInt(q.get("grade") || "", 10);
  if (!Number.isNaN(grade) && grade >= 0 && grade < GRADES.length) state.gradeIndex = grade;
  const size = q.get("size");
  if (size && /^\d+x\d+$/.test(size)) state.size = size;
  const title = q.get("title");
  if (title) state.title = title.toUpperCase();
  const caption = q.get("caption");
  if (caption) state.caption = caption.toUpperCase();
  resetLayoutState();
  // "photos" is a comma list of photo indexes (e.g. ?photos=1,3,0). An absent
  // parameter means "keep the defaults" — note Number("") is 0, not NaN, so
  // an empty string must not be mapped into a [0] list.
  const photosParam = q.get("photos");
  const photos = photosParam ? photosParam.split(",").map(Number).filter((n) => !Number.isNaN(n)) : [];
  if (photos.length) {
    state.assignments = state.assignments.map((_, i) => photos[i % photos.length]);
    state.tagTexts = state.tagTexts.map((_, i) =>
      photoLabel(state.assignments[i]) + " — " + ROLES[i % ROLES.length]);
  }
  if (shot === "cover" || shot === "square" || shot === "portrait") {
    document.body.classList.add("shot-cover");
    document.getElementById("sizeSelect").value = state.size;
  }
  document.getElementById("titleInput").value = state.title;
  document.getElementById("captionInput").value = state.caption;
  buildLayoutGrid();
  buildGradeGrid();
}

// ---------------------------------------------------------------- init
window.NeonPalms = { state, exportPng, renderPreview, get lastExport() { return lastExport; } };

(async function init() {
  await loadSamples();
  try { await document.fonts.load('100px Anton'); } catch (e) { /* fallback font */ }
  resetLayoutState();
  buildSampleGrid();
  buildLayoutGrid();
  buildGradeGrid();
  applyPreset();
  renderPreview();
})();

// Neon Palms Cover Studio — the cover renderer.
// Draws a multi-panel GTA-style poster cover onto any canvas: slanted photo panels, a
// skin-safe sunset/neon colour grade, a painterly ink wash, and bold poster lettering
// (Anton, SIL OFL) over a slanted title band. All coordinates are normalised (0..1)
// so the same layout works at 1080x1080, 1080x1350 and 1920x1080.

// ---------------------------------------------------------------- layouts
// Each layout is a list of panels. A panel is a polygon (normalised points) and a
// photo slot index. The slant comes from the diagonal edges of the polygons.
export const LAYOUTS = [
  {
    id: 'slash-trio', name: 'Slash Trio',
    panels: [
      { poly: [[0, 0], [0.36, 0], [0.28, 1], [0, 1]], slot: 0 },
      { poly: [[0.36, 0], [0.68, 0], [0.60, 1], [0.28, 1]], slot: 1 },
      { poly: [[0.68, 0], [1, 0], [1, 1], [0.60, 1]], slot: 2 },
    ],
  },
  {
    id: 'key-art', name: 'Key Art',
    panels: [
      { poly: [[0, 0], [1, 0], [1, 0.60], [0, 0.66]], slot: 0 },
      { poly: [[0, 0.66], [0.52, 0.60], [0.47, 1], [0, 1]], slot: 1 },
      { poly: [[0.52, 0.60], [1, 0.60], [1, 1], [0.47, 1]], slot: 2 },
    ],
  },
  {
    id: 'comic-strip', name: 'Comic Strip',
    panels: [
      { poly: [[0, 0], [1, 0], [1, 0.20], [0, 0.25]], slot: 0 },
      { poly: [[0, 0.25], [1, 0.20], [1, 0.45], [0, 0.50]], slot: 1 },
      { poly: [[0, 0.50], [1, 0.45], [1, 0.70], [0, 0.75]], slot: 2 },
      { poly: [[0, 0.75], [1, 0.70], [1, 1], [0, 1]], slot: 3 },
    ],
  },
  {
    id: 'neon-grid', name: 'Neon Grid',
    panels: [
      { poly: [[0, 0], [0.55, 0], [0.47, 0.50], [0, 0.55]], slot: 0 },
      { poly: [[0.55, 0], [1, 0], [1, 0.45], [0.47, 0.50]], slot: 1 },
      { poly: [[0, 0.55], [0.47, 0.50], [0.42, 1], [0, 1]], slot: 2 },
      { poly: [[0.47, 0.50], [1, 0.45], [1, 1], [0.42, 1]], slot: 3 },
    ],
  },
  {
    id: 'center-stage', name: 'Center Stage',
    panels: [
      { poly: [[0, 0], [0.16, 0], [0.10, 1], [0, 1]], slot: 0 },
      { poly: [[0.16, 0], [0.84, 0], [0.90, 1], [0.10, 1]], slot: 1 },
      { poly: [[0.84, 0], [1, 0], [1, 1], [0.90, 1]], slot: 2 },
    ],
  },
  {
    id: 'sunset-split', name: 'Sunset Split',
    panels: [
      { poly: [[0, 0], [0.62, 0], [0.54, 1], [0, 1]], slot: 0 },
      { poly: [[0.62, 0], [1, 0], [1, 0.48], [0.54, 0.52]], slot: 1 },
      { poly: [[0.54, 0.52], [1, 0.48], [1, 1], [0.54, 1]], slot: 2 },
    ],
  },
  {
    id: 'poster-stack', name: 'Poster Stack',
    // Rows end at y 0.76, the top of the title band on a square cover, so
    // every row stays visible: the old rows ran to y 1.0 and the band hid
    // the whole bottom row, cutting every face it held.
    panels: [
      { poly: [[0, 0], [1, 0], [1, 0.26], [0, 0.30]], slot: 0 },
      { poly: [[0, 0.30], [0.53, 0.26], [0.50, 0.52], [0, 0.54]], slot: 1 },
      { poly: [[0.53, 0.26], [1, 0.26], [1, 0.50], [0.50, 0.52]], slot: 2 },
      { poly: [[0, 0.54], [0.50, 0.52], [0.47, 0.76], [0, 0.76]], slot: 3 },
      { poly: [[0.50, 0.52], [1, 0.50], [1, 0.76], [0.47, 0.76]], slot: 4 },
    ],
  },
  {
    id: 'diagonal-duo', name: 'Diagonal Duo',
    panels: [
      { poly: [[0, 0], [1, 0], [0.35, 1], [0, 1]], slot: 0 },
      { poly: [[1, 0], [1, 1], [0.35, 1]], slot: 1 },
    ],
  },
  {
    id: 'vice-columns', name: 'Vice Columns',
    panels: [
      { poly: [[0, 0.10], [0.34, 0], [0.30, 1], [0, 1]], slot: 0 },
      { poly: [[0.34, 0], [0.67, 0.06], [0.63, 1], [0.30, 1]], slot: 1 },
      { poly: [[0.67, 0.06], [1, 0], [1, 1], [0.63, 1]], slot: 2 },
    ],
  },
];

// ---------------------------------------------------------------- grades
// Skin-safe by construction: no hue rotation, saturation capped at 1.5, and the
// colour wash is a soft-light overlay at low alpha, so skin tones stay natural
// while skies and shadows pick up the sunset / neon mood.
export const GRADES = [
  {
    id: 'vice-sunset', name: 'Vice Sunset',
    filter: 'saturate(1.28) contrast(1.08) brightness(1.02)',
    wash: ['#ff9a3d', '#ff2d78', '#7b2ff7'], washAlpha: 0.32, washBlend: 'soft-light',
  },
  {
    id: 'neon-nights', name: 'Neon Nights',
    filter: 'saturate(1.40) contrast(1.12) brightness(1.03)',
    wash: ['#ff2d78', '#7b2ff7', '#00e5ff'], washAlpha: 0.30, washBlend: 'soft-light',
  },
  {
    id: 'golden-hour', name: 'Golden Hour',
    filter: 'saturate(1.20) contrast(1.05) brightness(1.05)',
    wash: ['#ffd166', '#ff7a18', '#ff5e62'], washAlpha: 0.24, washBlend: 'overlay',
  },
  {
    id: 'palm-noir', name: 'Palm Noir',
    filter: 'saturate(0.85) contrast(1.25) brightness(0.98)',
    wash: ['#0f2027', '#2c5364', '#203a43'], washAlpha: 0.26, washBlend: 'soft-light',
  },
  {
    id: 'candy-pop', name: 'Candy Pop',
    filter: 'saturate(1.50) contrast(1.05) brightness(1.06)',
    wash: ['#ff8fd1', '#ff2d78', '#ffb347'], washAlpha: 0.28, washBlend: 'soft-light',
  },
  {
    id: 'retro-vhs', name: 'Retro VHS',
    filter: 'saturate(1.05) contrast(0.95) brightness(1.04) sepia(0.25)',
    wash: ['#f7b733', '#fc4a1a', '#8e2de2'], washAlpha: 0.18, washBlend: 'overlay',
  },
  {
    id: 'ocean-drive', name: 'Ocean Drive',
    filter: 'saturate(1.30) contrast(1.08) brightness(1.02)',
    wash: ['#00e5ff', '#00b4a2', '#ff2d78'], washAlpha: 0.30, washBlend: 'soft-light',
  },
];

export const SIZES = [
  { id: 'square', name: 'Square', w: 1080, h: 1080 },
  { id: 'portrait', name: 'Portrait', w: 1080, h: 1350 },
  { id: 'wide', name: 'Wide', w: 1920, h: 1080 },
];

// ---------------------------------------------------------------- helpers
function tracePath(ctx, poly, w, h) {
  ctx.beginPath();
  poly.forEach(([x, y], i) => {
    const px = x * w;
    const py = Math.min(1, Math.max(0, y)) * h;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  });
  ctx.closePath();
}

/** Classic ray-cast point-in-polygon test on normalised coordinates. */
export function panelAt(layout, nx, ny) {
  for (let i = layout.panels.length - 1; i >= 0; i--) {
    const poly = layout.panels[i].poly;
    let inside = false;
    for (let a = 0, b = poly.length - 1; a < poly.length; b = a++) {
      const [ax, ay] = poly[a];
      const [bx, by] = poly[b];
      if ((ay > ny) !== (by > ny) && nx < ((bx - ax) * (ny - ay)) / (by - ay) + ax) {
        inside = !inside;
      }
    }
    if (inside) return i;
  }
  return -1;
}

function panelBounds(poly, w, h) {
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (const [x, y] of poly) {
    x0 = Math.min(x0, x * w);
    y0 = Math.min(y0, Math.max(0, y) * h);
    x1 = Math.max(x1, x * w);
    y1 = Math.max(y1, Math.max(0, y) * h);
  }
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

// A cached offscreen canvas of short translucent brush strokes — the painterly
// ink wash laid over the whole cover at low alpha.
const brushCache = new Map();
function brushTexture(w, h) {
  const key = `${w}x${h}`;
  if (brushCache.has(key)) return brushCache.get(key);
  const off = document.createElement('canvas');
  off.width = w;
  off.height = h;
  const c = off.getContext('2d');
  const palette = ['#ff9a3d', '#ff2d78', '#7b2ff7', '#ffd166', '#00e5ff', '#ffffff'];
  // Seeded so the same cover always paints the same strokes.
  let seed = 20261119;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  const count = Math.round((w * h) / 9000);
  for (let i = 0; i < count; i++) {
    const x = rnd() * w;
    const y = rnd() * h;
    const len = (14 + rnd() * 70) * (w / 1080);
    const ang = (rnd() - 0.5) * 0.9 + (rnd() < 0.5 ? 0 : Math.PI);
    c.strokeStyle = palette[Math.floor(rnd() * palette.length)];
    c.globalAlpha = 0.03 + rnd() * 0.05;
    c.lineWidth = (1.5 + rnd() * 5) * (w / 1080);
    c.lineCap = 'round';
    c.beginPath();
    c.moveTo(x, y);
    c.lineTo(x + Math.cos(ang) * len, y + Math.sin(ang) * len);
    c.stroke();
  }
  c.globalAlpha = 1;
  brushCache.set(key, off);
  return off;
}

// ---------------------------------------------------------------- drawing
function drawPhotoPanel(ctx, photo, poly, crop, grade, w, h) {
  const b = panelBounds(poly, w, h);
  if (b.w <= 0 || b.h <= 0) return;
  ctx.save();
  tracePath(ctx, poly, w, h);
  ctx.clip();
  if (photo) {
    const iw = photo.naturalWidth;
    const ih = photo.naturalHeight;
    const base = Math.max(b.w / iw, b.h / ih) * (crop?.zoom ?? 1);
    const pw = iw * base;
    const ph = ih * base;
    const cx = b.x + b.w / 2 + (crop?.dx ?? 0) * b.w;
    // Smart default framing: in a panel wider than tall, cover-fit crops the
    // photo top and bottom, and a centred crop lands on the torso — faces sit
    // in the upper third of most photos, so they get cut. The default vertical
    // anchor is therefore the top of the photo (a small margin in), not its
    // centre; the pan slider still offsets from there, so the user keeps full
    // control. Tall panels show the whole photo height already, so they are
    // left alone.
    let dy = crop?.dy ?? 0;
    if (b.w > b.h) {
      const visFrac = b.h / ph; // fraction of the photo's height on screen
      const anchor = Math.min(0.5, visFrac / 2 + 0.03);
      dy += (0.5 - anchor) / visFrac;
    }
    const cy = b.y + b.h / 2 + dy * b.h;
    ctx.filter = grade.filter;
    ctx.drawImage(photo, cx - pw / 2, cy - ph / 2, pw, ph);
    ctx.filter = 'none';
  } else {
    const g = ctx.createLinearGradient(b.x, b.y, b.x + b.w, b.y + b.h);
    g.addColorStop(0, '#3d1e5a');
    g.addColorStop(1, '#12081f');
    ctx.fillStyle = g;
    ctx.fillRect(b.x, b.y, b.w, b.h);
  }
  // Sunset / neon wash, clipped to the panel.
  const wash = ctx.createLinearGradient(b.x, b.y, b.x + b.w, b.y + b.h);
  grade.wash.forEach((color, i) => wash.addColorStop(i / (grade.wash.length - 1), color));
  ctx.globalCompositeOperation = grade.washBlend;
  ctx.globalAlpha = grade.washAlpha;
  ctx.fillStyle = wash;
  ctx.fillRect(b.x, b.y, b.w, b.h);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
  // Soft inner shade so the panel reads as a printed plate.
  const shade = ctx.createLinearGradient(b.x, b.y, b.x, b.y + b.h);
  shade.addColorStop(0, 'rgba(0,0,0,0)');
  shade.addColorStop(1, 'rgba(10,0,25,0.28)');
  ctx.fillStyle = shade;
  ctx.fillRect(b.x, b.y, b.w, b.h);
  ctx.restore();
  // Panel frame: a white plate edge with a neon inner line.
  ctx.save();
  tracePath(ctx, poly, w, h);
  ctx.lineWidth = Math.max(2, w * 0.004);
  ctx.strokeStyle = '#fff8ee';
  ctx.stroke();
  ctx.lineWidth = Math.max(1, w * 0.0016);
  ctx.strokeStyle = '#ff2d78';
  ctx.stroke();
  ctx.restore();
}

function drawSun(ctx, cx, cy, r) {
  const g = ctx.createLinearGradient(cx, cy - r, cx, cy + r);
  g.addColorStop(0, '#ffd166');
  g.addColorStop(0.55, '#ff7a18');
  g.addColorStop(1, '#ff2d78');
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = g;
  ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  // Horizontal slits, synthwave style, widening toward the bottom.
  ctx.fillStyle = '#1a0b2e';
  let y = cy + r * 0.05;
  let slit = r * 0.06;
  while (y < cy + r) {
    ctx.fillRect(cx - r, y, r * 2, slit);
    y += slit + r * 0.16;
    slit *= 1.45;
  }
  ctx.restore();
}

function drawTitleBand(ctx, state, w, h) {
  const aspect = w / h;
  const bandH = h * (aspect > 1.5 ? 0.30 : aspect > 0.9 ? 0.24 : 0.19);
  const top = h - bandH;
  const slant = bandH * 0.35;
  // Slanted band, dark violet fading up into the art.
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0, top + slant);
  ctx.lineTo(w, top);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  const bg = ctx.createLinearGradient(0, top, 0, h);
  bg.addColorStop(0, 'rgba(26, 8, 46, 0.82)');
  bg.addColorStop(1, 'rgba(16, 4, 30, 0.97)');
  ctx.fillStyle = bg;
  ctx.fill();
  // Neon rule along the slanted top edge.
  ctx.beginPath();
  ctx.moveTo(0, top + slant);
  ctx.lineTo(w, top);
  ctx.lineWidth = Math.max(2, w * 0.003);
  ctx.strokeStyle = '#ff2d78';
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, top + slant + w * 0.004);
  ctx.lineTo(w, top + w * 0.004);
  ctx.lineWidth = Math.max(1, w * 0.0012);
  ctx.strokeStyle = '#00e5ff';
  ctx.stroke();
  ctx.restore();

  const pad = w * 0.045;
  const sunR = bandH * 0.38;
  const sunCx = w - pad - sunR;
  const sunCy = top + bandH * 0.52;
  drawSun(ctx, sunCx, sunCy, sunR);

  const textW = sunCx - sunR - pad * 1.6;
  const kicker = (state.subtitle || '').trim().toUpperCase();
  const title = (state.title || '').trim().toUpperCase() || 'NEON PALMS';
  // Kicker line.
  let ky = top + bandH * 0.24;
  if (kicker) {
    let ks = bandH * 0.13;
    ctx.font = `700 ${ks}px system-ui, sans-serif`;
    while (ctx.measureText(kicker).width > textW && ks > 8) {
      ks -= 1;
      ctx.font = `700 ${ks}px system-ui, sans-serif`;
    }
    ctx.fillStyle = '#ffd166';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    // Letter-spaced kicker, drawn character by character.
    let kx = pad;
    const gap = ks * 0.28;
    for (const ch of kicker) {
      ctx.fillText(ch, kx, ky);
      kx += ctx.measureText(ch).width + gap;
    }
    ky = top + bandH * 0.30;
  }
  // Main title in Anton, pink offset shadow + warm-white face.
  let size = bandH * (kicker ? 0.52 : 0.62);
  ctx.font = `${size}px Anton, 'Arial Black', sans-serif`;
  while (ctx.measureText(title).width > textW && size > 10) {
    size -= 2;
    ctx.font = `${size}px Anton, 'Arial Black', sans-serif`;
  }
  const ty = top + bandH * (kicker ? 0.86 : 0.72);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#ff2d78';
  ctx.fillText(title, pad + size * 0.045, ty + size * 0.045);
  ctx.fillStyle = '#fff8ee';
  ctx.lineWidth = Math.max(1, size * 0.02);
  ctx.strokeStyle = 'rgba(20, 0, 30, 0.55)';
  ctx.strokeText(title, pad, ty);
  ctx.fillText(title, pad, ty);
}

/**
 * Draws the whole cover onto `canvas` (its own pixel size is the output size).
 * `state`: { photos, assignment, crops, layout, grade, title, subtitle }.
 * photos are HTMLImageElements (or null); assignment maps layout slot -> photo
 * index; crops maps slot -> { zoom, dx, dy }.
 */
export function drawCover(canvas, state) {
  const ctx = canvas.getContext('2d');
  const { width: w, height: h } = canvas;
  const layout = LAYOUTS.find((l) => l.id === state.layout) ?? LAYOUTS[0];
  const grade = GRADES.find((g) => g.id === state.grade) ?? GRADES[0];
  // Deep violet base.
  const base = ctx.createLinearGradient(0, 0, w, h);
  base.addColorStop(0, '#2b1145');
  base.addColorStop(1, '#12081f');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, w, h);
  for (const panel of layout.panels) {
    const photo = state.photos[state.assignment?.[panel.slot] ?? panel.slot] ?? null;
    drawPhotoPanel(ctx, photo, panel.poly, state.crops?.[panel.slot], grade, w, h);
  }
  // Painterly ink wash over the whole cover.
  ctx.save();
  ctx.globalCompositeOperation = 'overlay';
  ctx.globalAlpha = 0.55;
  ctx.drawImage(brushTexture(w, h), 0, 0);
  ctx.restore();
  drawTitleBand(ctx, state, w, h);
}

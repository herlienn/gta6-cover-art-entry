// Neon Palms Cover Studio — wires the editor page: load photos, pick a layout and a
// grade, crop and position each panel, type the caption, export the PNG.
// A `?shot=` query sets up a fixed scene for a screenshot instead (./shots.js).
import { drawCover, LAYOUTS, GRADES, SIZES, panelAt } from './cover.js';
import { runShot } from './shots.js';

const $ = (id) => document.getElementById(id);
const preview = $('preview');
const status = $('status');

const state = {
  photos: [], // { img, name } — the five built-in samples once loaded
  assignment: [0, 1, 0, 1, 0],
  crops: [{ zoom: 1, dx: 0, dy: 0 }, { zoom: 1, dx: 0, dy: 0 }, { zoom: 1, dx: 0, dy: 0 }, { zoom: 1, dx: 0, dy: 0 }, { zoom: 1, dx: 0, dy: 0 }],
  layout: 'slash-trio',
  grade: 'vice-sunset',
  size: 'square',
  title: 'Neon Palms',
  subtitle: 'Vice City • 2026',
  onePhoto: false,
  selectedPanel: 0,
};

function currentLayout() {
  return LAYOUTS.find((l) => l.id === state.layout) ?? LAYOUTS[0];
}

function currentSize() {
  return SIZES.find((s) => s.id === state.size) ?? SIZES[0];
}

function photoFor(slot) {
  const idx = state.onePhoto ? 0 : (state.assignment[slot] ?? 0);
  return state.photos[idx]?.img ?? null;
}

function redraw() {
  const size = currentSize();
  const scale = Math.min(1, 900 / Math.max(size.w, size.h));
  preview.width = Math.round(size.w * scale);
  preview.height = Math.round(size.h * scale);
  const photos = currentLayout().panels.map((p) => photoFor(p.slot));
  drawCover(preview, {
    photos,
    assignment: currentLayout().panels.map((p) => p.slot),
    crops: state.crops,
    layout: state.layout,
    grade: state.grade,
    title: state.title,
    subtitle: state.subtitle,
  });
}

function renderLayoutButtons() {
  const grid = $('layoutGrid');
  grid.innerHTML = '';
  for (const layout of LAYOUTS) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'pick' + (layout.id === state.layout ? ' active' : '');
    b.textContent = `${layout.name} · ${layout.panels.length} panels`;
    b.addEventListener('click', () => {
      state.layout = layout.id;
      state.selectedPanel = 0;
      syncPanelControls();
      renderLayoutButtons();
      redraw();
    });
    grid.appendChild(b);
  }
}

function renderGradeButtons() {
  const grid = $('gradeGrid');
  grid.innerHTML = '';
  for (const grade of GRADES) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'pick' + (grade.id === state.grade ? ' active' : '');
    b.textContent = grade.name;
    b.style.setProperty('--swatch', grade.wash[1]);
    b.addEventListener('click', () => {
      state.grade = grade.id;
      renderGradeButtons();
      redraw();
    });
    grid.appendChild(b);
  }
}

function renderPhotoStrip() {
  const strip = $('photoStrip');
  strip.innerHTML = '';
  state.photos.forEach((p, i) => {
    const thumb = document.createElement('button');
    thumb.type = 'button';
    thumb.className = 'thumb' + (i === 0 && state.onePhoto ? ' primary' : '');
    thumb.title = p.name;
    const img = document.createElement('img');
    img.src = p.img.src;
    img.alt = p.name;
    thumb.appendChild(img);
    thumb.appendChild(document.createTextNode(p.name));
    thumb.addEventListener('click', () => {
      // Assign the clicked photo to the selected panel's slot.
      const slot = currentLayout().panels[state.selectedPanel]?.slot ?? 0;
      state.assignment[slot] = i;
      syncPanelControls();
      redraw();
    });
    strip.appendChild(thumb);
  });
  $('photoCount').textContent = `${state.photos.length} photo${state.photos.length === 1 ? '' : 's'} loaded — click one to fill the selected panel.`;
}

function syncPanelControls() {
  const layout = currentLayout();
  const panel = layout.panels[state.selectedPanel] ?? layout.panels[0];
  const slot = panel?.slot ?? 0;
  $('panelLabel').textContent = `Panel ${state.selectedPanel + 1} of ${layout.panels.length} (${layout.name})`;
  const sel = $('panelPhoto');
  sel.innerHTML = '';
  state.photos.forEach((p, i) => {
    const opt = document.createElement('option');
    opt.value = String(i);
    opt.textContent = p.name;
    sel.appendChild(opt);
  });
  sel.value = String(state.assignment[slot] ?? 0);
  const crop = state.crops[slot] ?? { zoom: 1, dx: 0, dy: 0 };
  $('zoom').value = String(crop.zoom);
  $('panX').value = String(crop.dx);
  $('panY').value = String(crop.dy);
  $('zoomVal').textContent = `${Math.round(crop.zoom * 100)}%`;
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

async function addPhoto(img, name) {
  state.photos.push({ img, name });
  renderPhotoStrip();
  syncPanelControls();
  redraw();
}

async function loadSamples() {
  for (const [file, name] of [['samples/boulevard.jpg', 'Boulevard'], ['samples/pier.jpg', 'Pier'], ['samples/rider.jpg', 'Rider'], ['samples/neon.jpg', 'Neon'], ['samples/biker.jpg', 'Biker']]) {
    if (state.photos.some((p) => p.name === name)) continue;
    try {
      const img = await loadImage(file);
      state.photos.push({ img, name });
    } catch {
      status.textContent = `Could not load sample ${name}.`;
    }
  }
  renderPhotoStrip();
  syncPanelControls();
  redraw();
}

function exportPng() {
  const size = currentSize();
  const off = document.createElement('canvas');
  off.width = size.w;
  off.height = size.h;
  drawCover(off, {
    photos: currentLayout().panels.map((p) => photoFor(p.slot)),
    assignment: currentLayout().panels.map((p) => p.slot),
    crops: state.crops,
    layout: state.layout,
    grade: state.grade,
    title: state.title,
    subtitle: state.subtitle,
  });
  off.toBlob((blob) => {
    if (!blob) {
      status.textContent = 'Export failed — please try again.';
      return;
    }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `neon-palms-cover-${size.w}x${size.h}.png`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    status.textContent = `Saved neon-palms-cover-${size.w}x${size.h}.png`;
  }, 'image/png');
}

// ------------------------------------------------------------- controls
$('photoInput').addEventListener('change', async (e) => {
  for (const file of e.target.files) {
    try {
      const img = await loadImage(URL.createObjectURL(file));
      await addPhoto(img, file.name.replace(/\.[^.]+$/, '').slice(0, 18) || 'Photo');
    } catch {
      status.textContent = `Could not read ${file.name}.`;
    }
  }
  e.target.value = '';
});
$('useSamples').addEventListener('click', loadSamples);
$('onePhoto').addEventListener('change', (e) => {
  state.onePhoto = e.target.checked;
  redraw();
});
$('panelPhoto').addEventListener('change', (e) => {
  const layout = currentLayout();
  const slot = layout.panels[state.selectedPanel]?.slot ?? 0;
  state.assignment[slot] = Number(e.target.value);
  redraw();
});
for (const [id, key] of [['zoom', 'zoom'], ['panX', 'dx'], ['panY', 'dy']]) {
  $(id).addEventListener('input', (e) => {
    const layout = currentLayout();
    const slot = layout.panels[state.selectedPanel]?.slot ?? 0;
    state.crops[slot] = state.crops[slot] ?? { zoom: 1, dx: 0, dy: 0 };
    state.crops[slot][key] = Number(e.target.value);
    if (key === 'zoom') $('zoomVal').textContent = `${Math.round(Number(e.target.value) * 100)}%`;
    redraw();
  });
}
$('caption').addEventListener('input', (e) => {
  state.title = e.target.value;
  redraw();
});
$('subtitle').addEventListener('input', (e) => {
  state.subtitle = e.target.value;
  redraw();
});
$('sizeRow').addEventListener('change', (e) => {
  state.size = e.target.value;
  redraw();
});
$('exportBtn').addEventListener('click', exportPng);

// Drag on the preview to pan the photo inside the panel under the cursor,
// and click a panel to select it for the crop controls.
let drag = null;
preview.addEventListener('pointerdown', (e) => {
  const rect = preview.getBoundingClientRect();
  const nx = (e.clientX - rect.left) / rect.width;
  const ny = (e.clientY - rect.top) / rect.height;
  const panelIndex = panelAt(currentLayout(), nx, ny);
  if (panelIndex < 0) return;
  state.selectedPanel = panelIndex;
  syncPanelControls();
  const slot = currentLayout().panels[panelIndex].slot;
  drag = { slot, x: e.clientX, y: e.clientY };
  preview.setPointerCapture(e.pointerId);
});
preview.addEventListener('pointermove', (e) => {
  if (!drag) return;
  const rect = preview.getBoundingClientRect();
  const crop = state.crops[drag.slot] ?? { zoom: 1, dx: 0, dy: 0 };
  crop.dx = Math.min(0.5, Math.max(-0.5, crop.dx + ((e.clientX - drag.x) / rect.width) * 0.6));
  crop.dy = Math.min(0.5, Math.max(-0.5, crop.dy + ((e.clientY - drag.y) / rect.height) * 0.6));
  state.crops[drag.slot] = crop;
  drag.x = e.clientX;
  drag.y = e.clientY;
  syncPanelControls();
  redraw();
});
preview.addEventListener('pointerup', () => {
  drag = null;
});

// ------------------------------------------------------------- shot scenes
const shot = new URLSearchParams(location.search).get('shot');
const api = {
  state,
  loadSamples,
  renderLayoutButtons,
  renderGradeButtons,
  renderPhotoStrip,
  syncPanelControls,
  redraw,
  async loadImageByName(name) {
    const img = await loadImage(`samples/${name}.jpg`);
    return { img, name: name[0].toUpperCase() + name.slice(1) };
  },
  setPhotos(list) {
    state.photos = list;
    renderPhotoStrip();
    syncPanelControls();
  },
};

renderLayoutButtons();
renderGradeButtons();
if (shot) {
  runShot(shot, new URLSearchParams(location.search), api);
} else {
  loadSamples().then(async () => {
    try {
      await document.fonts.load('100px Anton');
    } catch {
      // Anton ships under app/fonts; if it fails to load the canvas falls back
      // to a heavy system sans — the cover still draws.
    }
    redraw();
  });
}

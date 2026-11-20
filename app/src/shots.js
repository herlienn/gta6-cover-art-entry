// Fixed scenes for screenshots: ?shot=editor shows the page with sample photos
// loaded; ?shot=cover shows the cover alone, drawn at the window's own size.
// `photo` picks the samples (comma-separated names under samples/), `caption` and
// `subtitle` the words, `layout`, `grade` and `size` the cover settings.
// window.__shotReady is set once the cover is painted and fonts are ready.
import { drawCover, LAYOUTS } from './cover.js';

async function loadNamed(api, names) {
  const list = [];
  for (const name of names) {
    try {
      list.push(await api.loadImageByName(name));
    } catch {
      // A missing sample just leaves that slot empty.
    }
  }
  return list;
}

function applySettings(api, query) {
  const s = api.state;
  if (query.get('caption')) s.title = query.get('caption');
  if (query.get('subtitle')) s.subtitle = query.get('subtitle');
  if (query.get('layout') && LAYOUTS.some((l) => l.id === query.get('layout'))) {
    s.layout = query.get('layout');
  }
  if (query.get('grade')) s.grade = query.get('grade');
  if (query.get('size')) s.size = query.get('size');
  if (query.get('onePhoto') === '1') s.onePhoto = true;
  s.selectedPanel = 0;
}

function markReady() {
  const done = () => {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      window.__shotReady = true;
    }));
  };
  if (document.fonts?.ready) document.fonts.ready.then(done).catch(done);
  else done();
}

export async function runShot(shot, query, api) {
  const names = (query.get('photo') ?? 'pier').split(',').map((n) => n.trim()).filter(Boolean);
  const photos = await loadNamed(api, names);
  applySettings(api, query);
  if (photos.length === 0) {
    await api.loadSamples();
  } else {
    api.setPhotos(photos);
  }
  const s = api.state;
  // Default assignment: slot i takes photo i, cycling through the loaded photos.
  s.assignment = [0, 1, 2, 3, 4].map((slot) => (photos.length ? slot % photos.length : 0));
  try {
    await document.fonts.load('100px Anton');
  } catch {
    // Falls back to a heavy system sans on the canvas.
  }
  if (shot === 'cover') {
    document.body.classList.add('shot-cover');
    const canvas = document.getElementById('preview');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const layout = LAYOUTS.find((l) => l.id === s.layout) ?? LAYOUTS[0];
    drawCover(canvas, {
      photos: layout.panels.map((p) => s.photos[s.assignment[p.slot]]?.img ?? null),
      assignment: layout.panels.map((p) => p.slot),
      crops: s.crops,
      layout: s.layout,
      grade: s.grade,
      title: s.title,
      subtitle: s.subtitle,
    });
  } else {
    api.renderLayoutButtons();
    api.renderGradeButtons();
    api.syncPanelControls();
    api.redraw();
  }
  markReady();
}

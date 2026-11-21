// Neon Palms Cover Studio v3 — a make.fun entry for the GTA 6 Cover Art bounty.
// Turns your photos into GTA 6-style poster key art: 12 layouts, 9 grades,
// face-aware crops, pop-out heroes, cast tags, seal and billing block.

[![make.fun](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/bounty/gta6-cover-art-01)
[![rank](https://make.fun/badge/gta6-cover-art-01/herlienn/gta6-cover-art-entry/rank.svg)](https://make.fun/bounty/gta6-cover-art-01/leaderboard)
[![reward](https://make.fun/badge/gta6-cover-art-01/herlienn/gta6-cover-art-entry/reward.svg)](https://make.fun/bounty/gta6-cover-art-01)

**Neon Palms Cover Studio v3** turns your photos into GTA 6-style poster key art — a make.fun entry for the [GTA 6 Cover Art bounty](https://make.fun/bounty/gta6-cover-art-01).

## What it does

- **12 layouts** — slanted multi-panel collages, two pop-out hero layouts (Hero Pop-Out, Hero Left), a 7-panel Cast Mosaic, Billboard, Golden Hour, Vice Nights, Neon Grid, Duo, Trio and Neon Strip.
- **9 skin-safe grades** — Vice Sunset, Neon Nights, Golden Hour, Heatwave, Noir, Teal Noir, Bubblegum, Mono Chrome, Vivid Pop. Faces stay natural.
- **Face-aware crop** — click any face in the preview to set that panel's focal point; panels dodge the title band. A "Reset to face" button restores the default focal point.
- **Movie-poster chrome** — round "VICE CITY ★ EST. 2026" seal, billing block, name/role cast tags on every panel, a 5-star review strip, and a striped chrome title in Anton (SIL OFL).
- **6 steps** — photos, layout, grade, caption, size, export. PNG export in 1080 × 1080, 1080 × 1350 and 1920 × 1080.

## Run it

Serve `app/` with any static server and open `index.html` in desktop Chrome. No network is needed: every script, font and photo is a file under `app/`, and your own photos are read on your machine, never uploaded.

## Sample photos

Four portraits were made with an image model for this entry (Mara, Diego, Nina, Carlos), plus the kit's two free-to-use scenes (pier, boulevard). No real person, no Rockstar artwork, no Rockstar fonts.

## Entry

Built for the make.fun GTA 6 Cover Art bounty. `main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to `/output` and writes `dossier.json` with the kit's vendored `buildDossier`.

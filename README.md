# Neon Palms Cover Studio v2

[![make.fun](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/bounty/gta6-cover-art-01)
[![rank](https://make.fun/badge/gta6-cover-art-01/herlienn/gta6-cover-art-entry/rank.svg)](https://make.fun/bounty/gta6-cover-art-01/leaderboard)
[![reward](https://make.fun/badge/gta6-cover-art-01/herlienn/gta6-cover-art-entry/reward.svg)](https://make.fun/bounty/gta6-cover-art-01)

**Neon Palms Cover Studio v2** turns your photos into GTA 6-style poster key art — a make.fun entry for the [GTA 6 Cover Art bounty](https://make.fun/bounty/gta6-cover-art-01).

## What it does

- **12 layouts** — slanted multi-panel collages, two pop-out hero layouts (one big hero close-up bursting out of the collage) and a 7-panel cast mosaic.
- **Face-aware crop** — click any face in the preview to set that panel's focal point; panels dodge the title band, and wide panels anchor to the top of the photo so faces never get cut.
- **Movie-poster chrome** — striped chrome title, round seal/stamp, name & role cast tags on every panel, a review strip and a billing block.
- **9 skin-safe Vice City grades** — warm sunset light that keeps skin tones natural.
- **6-step editor** with a live preview: photos → layout → grade → title & caption → poster chrome → export.
- **PNG export in 3 sizes**: 1080 × 1080, 1080 × 1350, 1920 × 1080.

## Try it

Serve `app/` with any static server and open `app/index.html` in desktop Chrome. Everything runs offline — every photo, font and script is a file under `app/`. The Anton font is under the SIL Open Font License (`app/fonts/OFL.txt`). No Rockstar logo, artwork or font is used anywhere.

## Run the entry program

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the kit's vendored `buildDossier` library.

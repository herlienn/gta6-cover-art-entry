[![make.fun](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/bounty/gta6-cover-art-01)
[![Rank](https://make.fun/badge/gta6-cover-art-01/herlienn/gta6-cover-art-entry/rank.svg)](https://make.fun/bounty/gta6-cover-art-01)
[![Reward](https://make.fun/badge/gta6-cover-art-01/herlienn/gta6-cover-art-entry/reward.svg)](https://make.fun/bounty/gta6-cover-art-01)

# Neon Palms Cover Studio

A make.fun entry for [Make GTA 6 Cover Art](https://make.fun/bounty/gta6-cover-art-01):
a web app that turns your photos and a caption into GTA-style poster cover art —
multi-panel collages with slanted panels, a sunset/neon colour grade, painterly
ink, and bold poster lettering — exported as a PNG to share.

## What it does

- **9 layouts** — Slash Trio, Key Art, Comic Strip, Neon Grid, Center Stage,
  Sunset Split, Poster Stack, Diagonal Duo, Vice Columns. Every layout slices
  the poster into slanted photo panels with the title over the art.
- **7 colour grades** — Vice Sunset, Neon Nights, Golden Hour, Palm Noir,
  Candy Pop, Retro VHS, Ocean Drive. All skin-safe: no hue rotation, saturation
  capped, and the sunset wash is a soft-light overlay at low alpha, so skin
  tones stay natural.
- **Any photo** — load your own photos from your machine (never uploaded), fill
  several panels with one photo or several, crop and position each panel with
  sliders or by dragging the photo inside the preview, and edit the title and
  kicker line. Panels wider than tall frame the top of the photo by default,
  so faces stay in view instead of being cropped to the torso.
- **Fast export** — one click exports a PNG in 1080 × 1080, 1080 × 1350 or
  1920 × 1080.
- **Live preview** — the editor shows the cover as you change it; click a panel
  to select it for cropping.

## Originality

Everything is original: no Rockstar Games logo, wordmark, official artwork,
character, or font. The display typeface is **Anton** (Copyright 2020 The Anton
Project Authors), shipped under the SIL Open Font License — see
`app/fonts/OFL.txt`. The five sample photos under `app/samples/` were made with
an image model for make.fun and are free to use.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

Static files only, no build step, no network requests. Handed in with:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

MIT — see `LICENSE`.

<div align="center">

# sathvikloke.github.io

**A cinematic dark portfolio with a point cloud that reassembles itself per page, and a music section wired to real listening data.**

[![Live](https://img.shields.io/badge/LIVE-sathvikloke.github.io-c77dff?style=for-the-badge)](https://sathvikloke.github.io)
[![React](https://img.shields.io/badge/React-18.3-1a1526?style=for-the-badge&logo=react&logoColor=c77dff)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.4-1a1526?style=for-the-badge&logo=vite&logoColor=ff79c6)](https://vite.dev)
[![Bundle](https://img.shields.io/badge/54.5_kB_gzipped-1a1526?style=for-the-badge)](#performance)

</div>

---

## What this is

A personal site built around one idea: a 2,800-point cloud floating behind the content that **morphs into a different formation on every route**.

| Route | Formation | Contents |
|---|---|---|
| `/` | a figure waving | hero only — full viewport, nothing stacked beneath |
| `#work` | a computer | projects, experience, education |
| `#research` | a DNA double helix | papers, competitions |
| `#music` | an audio waveform | now playing, recent tracks, top artists |
| `#about` | a phone | about, contact |

Zero runtime dependencies beyond React. No Three.js, no animation library, no CSS framework.

## How the point cloud works

[`src/Particles.jsx`](src/Particles.jsx) — about 250 lines, plain canvas 2D with a hand-rolled perspective projection.

**Figurative shapes are sampled from silhouettes.** Each one is drawn once to a hidden 240×240 canvas, then its opaque pixels are read and turned into particle targets. The system isn't limited to what's hardcoded — anything you can draw becomes a formation, including a real photograph.

**The helix and waveform are parametric.** The helix runs 3.2 turns with base-pair rungs every ninth point. The waveform is 96 discrete vertical bars whose heights come from stacked sines, and it keeps oscillating after it lands — each point on its own phase offset — so the Music page breathes instead of freezing.

Three details that took a while to get right, written down so they don't regress:

- **Screen y grows downward, world y grows upward.** Miss the sign flip and every figurative shape renders upside down. The helix and waveform hide the bug, because both are vertically symmetric.
- **Flat silhouettes sway, they don't spin.** Rotating a flat shape a full turn sends it edge-on, where it collapses to a line and nearly vanishes. Person, computer, and phone oscillate within ±24°; the volumetric shapes rotate freely.
- **The animation loop owns the shape.** An effect pushing the shape in can end up holding a `morph` bound to a discarded particle array under React's dev double-mount, silently leaving the cloud stuck on its first formation. The loop re-morphs when it notices `shape` changed.

## How the music section works

The Last.fm API key never reaches the browser.

```
GitHub Actions (every ~5 min)
  └─ scripts/fetch-listening.mjs   reads LASTFM_API_KEY from Secrets
       └─ public/listening.json    Vite copies public/ into dist/
            └─ src/Listening.jsx   fetches it, re-polls every 60s
```

The fetch is a **build step**, not a separate committing workflow. That's deliberate: pushes made by a workflow's own token don't trigger other workflows, so a bot that committed the data would never have triggered a deploy. It's also `continue-on-error`, so a Last.fm outage can't block a deploy of the rest of the site.

Two things the page does to stay honest:

- **It never claims live data it doesn't have.** GitHub Pages serves JSON with `Cache-Control: max-age=600`, so the request carries a timestamp and `no-store`. Once a snapshot passes 30 minutes old it stops saying "playing now", switches to "last played", and shows a "checked 12m ago" stamp.
- **It never invents a track list.** No key, no data, or a failed fetch all render an explicit empty state.

> Setup is in [LISTENING-SETUP.md](LISTENING-SETUP.md). Spotify's own API is deliberately not used — it requires the app owner to hold **Premium** for development-mode apps to function at all. Last.fm scrobbles from a free Spotify account and needs only an API key.

## Editing the content

**Everything lives in [`src/data.js`](src/data.js)** — profile, about, skills, education, projects, research, experience, awards, socials. No other file needs touching to change what the site says.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
npm run preview  # serve the built output
```

## Deploying

Push to `main`. [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) installs, fetches listening data, builds, and publishes `dist/` to Pages — roughly 45 seconds end to end.

The repo is named `sathvikloke.github.io`, which serves from the root, so `vite.config.js` keeps `base: '/'`. **Rename the repo and that must change to `/repo-name/`** or every asset path breaks.

## Performance

| | |
|---|---|
| JS | 166 kB raw, **54.5 kB gzipped** |
| CSS | 13.9 kB raw, **3.6 kB gzipped** |
| Webfonts | none — system stacks only |
| Third-party requests | none |
| Particles | 2,800 desktop / 1,200 mobile |
| `devicePixelRatio` | capped at 2 |

## Accessibility

`prefers-reduced-motion` is a real branch rather than just shorter durations — particle rotation stops, reveals resolve instantly, and the equaliser holds still. There is a visible `:focus-visible` ring throughout, and **no content is gated behind animation**: every section is in the DOM and readable whether or not the canvas ever paints.

<div align="center">
<br/>
<sub>Built by <a href="https://github.com/sathvikloke">Sathvik Loke</a> · <a href="https://sathvikloke.github.io">sathvikloke.github.io</a></sub>
</div>

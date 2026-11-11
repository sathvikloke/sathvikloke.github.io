<div align="center">

# sathvikloke.github.io

**A dark personal site: one centered column over a living background of AI agents and a heartbeat, a signature that writes itself, and a music page fed by real listening data.**

[![Live](https://img.shields.io/badge/LIVE-sathvikloke.github.io-2b4c8c?style=for-the-badge)](https://sathvikloke.github.io)
[![React](https://img.shields.io/badge/React-18.3-f4f7fb?style=for-the-badge&logo=react&logoColor=2b4c8c)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.4-f4f7fb?style=for-the-badge&logo=vite&logoColor=2b4c8c)](https://vite.dev)

</div>

---

## What this is

| Page | Contents |
|---|---|
| `/` | a short intro, the things he's proudest of, and the last song played |
| `/projects/` | previous projects: LANDER and Inclusion Health |
| `/research/` | every paper, newest first, with venue and authors |
| `/music/` | cello for hospice patients, @vikownsdabeat, recent songs and top artists from Last.fm |

All four are real URLs. [`vite.config.js`](vite.config.js) builds one HTML entry per page (`index.html`, `projects/index.html`, `research/index.html`, `music/index.html`), each with its own title and description, so GitHub Pages serves them with a 200 instead of a hash route or a `404.html` fallback. [`src/App.jsx`](src/App.jsx) picks the page from `location.pathname`. To add a page, add an entry to `PAGES` in `App.jsx`, a folder with an `index.html`, and an input in `vite.config.js`.

Zero runtime dependencies beyond React.

## Layout

[`src/index.css`](src/index.css) is one column, at most 600px wide, centered horizontally and vertically on a dark ground (`#0b0d11`, with `#2458f5` / `#8caaff` blues). The `.sheet` uses `min-height` rather than `height`, so a page taller than the window grows and scrolls instead of being clipped. Its bottom padding equals the background band's height, so text never sits on the busy part of the drawing. Text is IBM Plex Sans at 16.5px on a 28px line; the nav, paper venues and "last played" line are JetBrains Mono.

## The background

[`src/Scene.jsx`](src/Scene.jsx) is one canvas pinned to the bottom of every page, in three layers:

- **A heartbeat.** An ECG trace runs the width of the page, built as a sum of gaussians per beat (P, Q, R, S, T). A sweep moves along it like a bedside monitor, lighting the trace behind it.
- **An agent network.** Nodes (agents drawn as `>_` prompts, plus a cross, heart, DNA helix, benzene ring and pill) are wired to each other and to the R peaks. When the sweep crosses a wired beat, a signal climbs to that agent, which lights up and passes it on to its neighbours, two hops out.
- **Contour mountains.** Behind everything, a range drawn as stacked contour lines, front to back. Each line is hidden wherever a nearer line already covers it, the same trick as a ridgeline plot. The peaks sit toward the edges, so the text column has a valley under it.

The canvas is 1.7× the band's height (`RISE` in the script, `* 1.7` in the CSS; keep them in step). The extra height holds only the peaks, and a CSS mask fades them out as they rise into the page.

The layout is seeded, so it's the same drawing on every visit. The dim structure is drawn once per resize to an offscreen canvas, and each frame only adds the sweep, the signals and the lit nodes. It stops drawing while scrolled out of view, and `prefers-reduced-motion` gets the still drawing.

## The signature

[`src/Signature.jsx`](src/Signature.jsx) is a hand-drawn signature, not a font. Each `<path>` is one pen stroke in writing order: S, athvik, the t-cross, the i-dot, then Loke and the underline. The strokes were plotted as points and smoothed with Catmull-Rom splines.

It writes itself the first time it scrolls into view. Every path has `pathLength="1"`, so a dash of 1 is the whole stroke, and `stroke-dashoffset` animates from 1 down to 0. Each stroke's start time and duration are set so the pen moves at a constant speed, with a short pause at each lift. It's about 3 seconds in total.

**Every stroke stays at `opacity: 0` until its own start time.** A fully offset dash still paints its round line cap, and on short strokes like the i-dot and the t-cross that cap was a visible stray dot while it waited. The keyframes set opacity to 1, and the animation uses `forwards` rather than `both` so the hidden base style holds during each delay.

## How the music works

The Last.fm API key never reaches the browser.

```
GitHub Actions (every ~5 min)
  └─ scripts/fetch-listening.mjs   reads LASTFM_API_KEY from Secrets
       └─ public/listening.json    Vite copies public/ into dist/
            └─ src/Listening.jsx   useListening() fetches it, re-polls every 60s
```

The fetch is a **build step**, not a separate committing workflow. That's deliberate: pushes made by a workflow's own token don't trigger other workflows, so a bot that committed the data would never have triggered a deploy. It's also `continue-on-error`, so a Last.fm outage can't block a deploy of the rest of the site.

The page stays honest about what it knows:

- **It never claims live data it doesn't have.** GitHub Pages serves JSON with `Cache-Control: max-age=600`, so the request carries a timestamp and `no-store`. Once a snapshot is more than 30 minutes old, the page stops saying "listening to" and says "last played" instead.
- **It never invents a track list.** With no key, no data, or a failed fetch, the page says the listening data isn't connected yet.
- **The fetch path is absolute** (`/listening.json`). A relative one would resolve to `/music/listening.json` on the music page and miss.

> Setup is in [LISTENING-SETUP.md](LISTENING-SETUP.md). Spotify's own API is deliberately not used. It only works for development-mode apps if the app owner has **Premium**, while Last.fm scrobbles from a free Spotify account and needs only an API key.

To preview locally with real data, copy the live snapshot in (it's gitignored):

```bash
curl -s https://sathvikloke.github.io/listening.json -o public/listening.json
```

## Editing the content

**Everything the site says lives in [`src/data.js`](src/data.js).** Write links inline as `[text](url)`. Papers go in `papers`, newest first; "S. Loke" is bolded automatically in each author list.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
npm run preview  # serve the built output
```

## Deploying

Push to `main`. [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) installs, fetches listening data, builds, and publishes `dist/` to Pages.

The repo is named `sathvikloke.github.io`, which serves from the root, so `vite.config.js` keeps `base: '/'`. **If you rename the repo, change that to `/repo-name/`**, or every asset path breaks.

## Weight

| | |
|---|---|
| JS | 162 kB raw, **54.4 kB gzipped** (mostly React; the scene is about 10 kB) |
| CSS | 2.6 kB raw, **1.1 kB gzipped** |
| Webfonts | IBM Plex Sans and JetBrains Mono, from Google Fonts |

## Accessibility

Readers who set `prefers-reduced-motion` get the finished signature, with no drawing animation. The signature SVG has `role="img"` and an `aria-label` of the name, and every page works the same with or without the animation.

<div align="center">
<br/>
<sub>Built by <a href="https://github.com/sathvikloke">Sathvik Loke</a> · <a href="https://sathvikloke.github.io">sathvikloke.github.io</a></sub>
</div>

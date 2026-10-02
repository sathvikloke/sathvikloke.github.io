<div align="center">

# sathvikloke.github.io

**A plain white personal site: one centered column, a signature that writes itself, and a music page fed by real listening data.**

[![Live](https://img.shields.io/badge/LIVE-sathvikloke.github.io-2b4c8c?style=for-the-badge)](https://sathvikloke.github.io)
[![React](https://img.shields.io/badge/React-18.3-f4f7fb?style=for-the-badge&logo=react&logoColor=2b4c8c)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.4-f4f7fb?style=for-the-badge&logo=vite&logoColor=2b4c8c)](https://vite.dev)

</div>

---

## What this is

| Page | Contents |
|---|---|
| `/` | a short intro, the seven things he's proudest of, and the last song played |
| `/music/` | cello for hospice patients, @vikownsdabeat, recent songs and top artists from Last.fm |

Both are real URLs. [`vite.config.js`](vite.config.js) builds one HTML entry per page ([`index.html`](index.html), [`music/index.html`](music/index.html)), so GitHub Pages serves `/music/` with a 200 instead of a hash route or a `404.html` fallback. [`src/App.jsx`](src/App.jsx) picks the page from `location.pathname`.

Zero runtime dependencies beyond React.

## Layout

[`src/index.css`](src/index.css) is one column, at most 600px wide, centered on a white page both horizontally and vertically. The `.sheet` uses `min-height` rather than `height`, so a page taller than the window, like the music page on a phone, grows and scrolls instead of being clipped. Text is left-aligned inside the column, set in Newsreader at 18px on a 30px line, with gaps in whole or half lines.

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

**Everything the site says lives in [`src/data.js`](src/data.js).** Write links inline as `[text](url)`.

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
| JS | 151 kB raw, **49.6 kB gzipped** (almost all of it React) |
| CSS | 1.8 kB raw, **0.8 kB gzipped** |
| Webfonts | Newsreader, from Google Fonts |

## Accessibility

Readers who set `prefers-reduced-motion` get the finished signature, with no drawing animation. The signature SVG has `role="img"` and an `aria-label` of the name, and every page works the same with or without the animation.

<div align="center">
<br/>
<sub>Built by <a href="https://github.com/sathvikloke">Sathvik Loke</a> · <a href="https://sathvikloke.github.io">sathvikloke.github.io</a></sub>
</div>

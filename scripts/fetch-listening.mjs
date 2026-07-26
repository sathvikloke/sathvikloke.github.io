// Fetches listening data from Last.fm and writes data/listening.json.
//
// Runs inside GitHub Actions as a build step, so the API key lives in GitHub
// Secrets and never reaches the browser. Vite copies public/ into dist/, so the
// published site serves this at /listening.json.
//
// Env: LASTFM_API_KEY, LASTFM_USER

import { writeFile, readFile, mkdir } from 'node:fs/promises';

const API = 'https://ws.audioscrobbler.com/2.0/';
const OUT = 'public/listening.json';

const call = async (params) => {
  const qs = new URLSearchParams({ ...params, format: 'json' });
  const res = await fetch(`${API}?${qs}`, {
    headers: { 'User-Agent': 'sathvikloke.github.io' },
  });
  if (!res.ok) throw new Error(`last.fm ${params.method} -> ${res.status}`);
  return res.json();
};

const pickImage = (images) => {
  if (!Array.isArray(images)) return null;
  for (const size of ['extralarge', 'large', 'medium']) {
    const hit = images.find(i => i.size === size && i['#text']);
    if (hit) return hit['#text'];
  }
  return null;
};

const shape = (t) => ({
  track:  t.name ?? '',
  artist: typeof t.artist === 'string' ? t.artist : (t.artist?.name ?? t.artist?.['#text'] ?? ''),
  album:  t.album?.['#text'] || null,
  art:    pickImage(t.image),
  url:    t.url ?? null,
  at:     t.date?.uts ? Number(t.date.uts) : null,
});

const { LASTFM_API_KEY: api_key, LASTFM_USER: user } = process.env;

if (!api_key || !user) {
  console.error('Missing LASTFM_API_KEY or LASTFM_USER.');
  process.exit(1);
}

const [recentRaw, topRaw] = await Promise.all([
  call({ method: 'user.getrecenttracks', user, api_key, limit: '8', extended: '1' }),
  call({ method: 'user.gettopartists',   user, api_key, limit: '6', period: '1month' }),
]);

const tracks = recentRaw?.recenttracks?.track;
const list = Array.isArray(tracks) ? tracks : tracks ? [tracks] : [];

// The live track carries @attr.nowplaying and has no timestamp.
const live = list.find(t => t['@attr']?.nowplaying === 'true') ?? null;

const artists = topRaw?.topartists?.artist;

const payload = {
  ok: true,
  playing: Boolean(live),
  now: live ? shape(live) : null,
  recent: list.filter(t => t !== live).map(shape).filter(t => t.track).slice(0, 6),
  top: (Array.isArray(artists) ? artists : []).map(a => ({
    name:  a.name ?? '',
    plays: Number(a.playcount ?? 0),
    url:   a.url ?? null,
  })).filter(a => a.name),
};

// If nothing about the music changed, leave the file completely alone.
// Stamping a fresh timestamp on every run would produce a commit every
// 15 minutes forever and bury the repo history under bot noise.
let previous = null;
try {
  previous = JSON.parse(await readFile(OUT, 'utf8'));
} catch { /* first run, or the file was removed */ }

if (previous) {
  const { updated: _drop, ...prevRest } = previous;
  if (JSON.stringify(prevRest) === JSON.stringify(payload)) {
    console.log('No change since last run — leaving', OUT, 'untouched.');
    process.exit(0);
  }
}

await mkdir('public', { recursive: true });
await writeFile(OUT, JSON.stringify({ ...payload, updated: new Date().toISOString() }, null, 2) + '\n');

console.log(
  `wrote ${OUT} — playing: ${payload.playing}, ` +
  `recent: ${payload.recent.length}, top: ${payload.top.length}`
);

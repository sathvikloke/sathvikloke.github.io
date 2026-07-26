# Publishing on GitHub Pages, with live-ish listening data

No Netlify. No Spotify Premium. No serverless functions. Everything below is free and lives entirely on GitHub.

## How it works

A scheduled GitHub Action runs every ~15 minutes, calls Last.fm with a key stored in **GitHub Secrets**, and commits a small `data/listening.json` into the repo. GitHub Pages serves that file alongside the site, and the music page reads it.

Your API key never reaches the browser and never appears in the repo. The only thing published is the music data itself.

**Why Last.fm and not Spotify directly:** Spotify's docs state that "the app owner must have a Spotify Premium account for apps in development mode to function." That's the whole app, not one endpoint. Last.fm scrobbles from a free Spotify account and exposes the same history with a plain API key.

---

## Step 1 — Last.fm

1. Create an account at <https://www.last.fm/join>. Note the **username** — the API keys on it.
2. Go to <https://www.last.fm/settings/applications>, find **Spotify Scrobbling**, click **Connect**, authorize.
3. Play something on Spotify for a minute, then check `https://www.last.fm/user/YOUR_USERNAME`. If the track shows up, it's working.
4. Get an API key at <https://www.last.fm/api/account/create>. Name and description can be anything; leave the callback URL blank. Copy the **API key** — you don't need the shared secret.

## Step 2 — Create the repo

Name it **`sathvikloke.github.io`**. That exact form makes it a *user site*, served from the root at `https://sathvikloke.github.io`. Any other name serves under `/repo-name/`, which breaks the site's absolute `/assets/…` paths.

Create it empty on GitHub — no README, no .gitignore, no license — then from this folder:

```bash
git remote add origin https://github.com/YOUR_USERNAME/sathvikloke.github.io.git
git push -u origin main
```

The repo is already initialized and committed locally, and `node_modules` is already excluded.

## Step 3 — Turn on Pages

**Settings → Pages → Build and deployment → Source: `Deploy from a branch`**, branch `main`, folder `/ (root)`. Save.

Use *Deploy from a branch*, not *GitHub Actions*. This matters: pushes made by a workflow's built-in token deliberately do not trigger other workflows, so an Actions-based Pages deploy would never fire when the listening bot commits. Deploying straight from the branch sidesteps that entirely — every push serves, including the bot's.

## Step 4 — Add the secrets

**Settings → Secrets and variables → Actions → New repository secret.** Add two:

| Name | Value |
|---|---|
| `LASTFM_API_KEY` | from step 1 |
| `LASTFM_USER` | your Last.fm username |

Secrets, not variables — variables are visible in logs.

## Step 5 — First run

Go to the **Actions** tab → **Refresh listening data** → **Run workflow**. It runs immediately instead of waiting for the schedule.

When it finishes you should see a new commit adding `data/listening.json`. Open `https://sathvikloke.github.io/data/listening.json` to confirm it's being served. The music page will then fill itself in.

---

## What to expect

- **Refresh cadence** is roughly every 15–30 minutes. GitHub runs scheduled workflows late under load, and this is a documented behavior of free Actions, not a bug in the workflow.
- **The page never lies about freshness.** It shows "checked 12m ago" next to the track, and if the snapshot is older than 25 minutes it stops claiming anything is playing and says "last played" instead.
- **No commit spam.** The script compares against the previous file and exits without writing when nothing has changed, so a quiet day produces zero commits rather than 96.
- **Spotify Free lag:** Last.fm doesn't scrobble until the ads finish and the next track starts, so now-playing can trail by a track. History and play counts are exact.

---

## One decision still open

Your repo root currently holds the **old** site — `index.html` plus the compiled `assets/`. The redesign lives at `.impeccable/mocks/v3/index.html`.

Whichever sits at the root is what GitHub Pages serves. I have deliberately not overwritten your live site. When you want the redesign to be the real thing, say so and I'll promote it — it's a small move, and git means the old one is never lost.

---

## Troubleshooting

| Symptom | Cause |
|---|---|
| Action fails with "Missing LASTFM_API_KEY" | Secrets not added, or added to the wrong repo |
| Action succeeds, no commit | Expected when nothing changed since the last run |
| `data/listening.json` 404s | Pages isn't enabled yet, or is set to the wrong branch/folder |
| Page says "Not connected yet" | The JSON isn't published yet — run the workflow manually once |
| Site serves under `/repo-name/` | Repo isn't named `USERNAME.github.io`; rename it or the asset paths need rewriting |
| Empty `recent` array | Scrobbling isn't connected, or nothing has played since you connected it |

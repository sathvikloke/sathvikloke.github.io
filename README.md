# Personal Portfolio — React + Vite

A clean, responsive single-page portfolio/resume site. Dark/light mode follows your system. Mobile-friendly nav. All content lives in one file so it's easy to customize.

## Customize

Open `src/data.js` and edit the values — that's the only file you need to touch:

- `profile` — your name, role, tagline, location, email, optional resume link
- `about` — your bio paragraphs
- `skills` — skill tags
- `projects` — your projects (title, description, tags, link)
- `experience` — work history
- `socials` — contact / social links

Colors and styling live in `src/index.css` (see the `:root` variables at the top).

## Run locally

You need [Node.js](https://nodejs.org) installed (v18+). Then:

```bash
npm install      # first time only
npm run dev      # start dev server → http://localhost:5173
```

## Build for production

```bash
npm run build    # outputs static files to dist/
npm run preview  # preview the production build locally
```

## Deploy (free options)

The `dist/` folder is plain static files — host it anywhere.

- **Vercel** or **Netlify**: connect your GitHub repo, they auto-detect Vite. Zero config.
- **GitHub Pages**: push the repo, then deploy the `dist/` folder.

Quickest path: push this folder to a GitHub repo, go to vercel.com, import the repo, and click Deploy.

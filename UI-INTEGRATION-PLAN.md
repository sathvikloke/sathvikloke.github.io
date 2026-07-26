# Integration Plan — sathvikloke.com (compiled-only Vite/React 18 portfolio)

Verified against the actual folder before writing: `/Users/sathvikloke/Downloads/sathvik-portfolio-netlify` contains `index.html` (490 bytes), `assets/index-DoJnvX63.js` (155,718 bytes, 50.6 KB gzipped), `assets/index-Spj1AZHf.css` (8,783 bytes, 2.7 KB gzipped). No `package.json`, no `src/`, no `node_modules`, and **no sourcemap** (`sourceMappingURL` appears zero times in the bundle).

---

## 1. THE BLOCKER

Every single "install a package" recommendation in that research — Motion, Anime.js, shadcn, Aceternity, Skiper, Vengeance, Origin UI, daisyUI, OriginKit, the Casberry React export — dies on the same line: `npm install` has nothing to install into. There is no `package.json` to write a dependency to, no `src/` to put a component in, no Vite config to re-run. `npx shadcn@latest add button` errors out immediately looking for `components.json`. You cannot bolt a React library onto a folder that contains only React's *output*.

So there is exactly one first task, and it is not on the list of 17: **get a source tree back.**

**Option A — find the repo.** Check GitHub, check the Netlify site's Deploys tab (Netlify records the linked repo and the deploy commit), check `~/Downloads` and any other Vite project folder on this Mac, check whatever machine you built it on. This build is dated 2026-06-28. If the repo exists anywhere, this whole document collapses to "clone it and skip to section 3." Spend thirty minutes here before writing a line of code.

**Option B — reconstruct.** This is much less scary than it sounds, and I checked the numbers specifically:

- Of the 155,718 bytes of JS, roughly **142 KB is React + ReactDOM vendor code** (React 18.3.1 — the string appears four times). Your actual application starts around byte 142,527 and runs to the end: **about 13 KB of app code total**, containing 96 `jsx()`/`jsxs()` calls and 8 `useState` sites.
- All your *content* is sitting in the bundle as plain readable object literals — the papers array (DriftScore, the TP53 CRISPR preprint, the Parkinson's review), the experience array (Einstein, UIC, Project Pulmonary, Health For Humanity, Northwestern, Stanford journal club), the projects array with their live links. You copy-paste those into `data.js` verbatim. Zero design decisions, zero guessing.
- `assets/index-Spj1AZHf.css` is **not obfuscated** — it is your hand-written CSS on one line with real class names. Run it through Prettier and you have your stylesheet back, unchanged, including the full `:root` token block: `--bg: #08070d`, `--card: #110f1a`, `--border: #241f33`, `--text: #ece9f7`, `--muted: #9b95b3`, `--accent: #c77dff`, `--accent-2: #ff79c6`, `--accent-soft: rgba(199,125,255,.12)`, `--radius: 14px`, `--max: 900px`, `--font`, `--serif`.
- The component tree is fully recoverable from the CSS alone, because your class names *are* the structure: `.nav` / `.nav__toggle` / `.nav__links.is-open`, `.hero` with `__eyebrow __name __tagline __sub __meta __actions`, `.section` + `.section__title`, `.cards` / `.card` / `.card__title __desc __link`, `.papers` / `.paper` with `__head __title __year __authors __venue __desc`, `.timeline` / `.job` / `.job__head __role __company __period __bullets`, `.awards` / `.awards__row __title __detail`, `.about__text`, `.contact__lead __list __label`, `.skills`, `.tags`, `.page-intro` / `.page-title` / `.page-back` for the hash subpages, and `.cursor-glow` / `.cursor-ring.is-active` for the follower. Six routes are in the bundle: `home`, `about`, `papers`, `experience`, `awards`, `contact`.

Realistic scope: `npm create vite@latest sathvik-portfolio -- --template react`, drop in the formatted CSS untouched, paste the data arrays, and write ~8 components against the class names above. Rebuild the two behaviours: the IntersectionObserver that adds `body.reveal-ready` and toggles `.is-visible` on `.section`, and the rAF loop that moves `.cursor-glow` / `.cursor-ring`. **This is an afternoon, not a project.** Verify by diffing the rendered DOM against the live Netlify site.

Do this first. Do not evaluate a single library until it is done, because right now "should I use Motion" is not a real question.

---

## 2. THE TAILWIND FORK IN THE ROAD

**Tailwind is mandatory:** shadcn/ui, Aceternity UI, Skiper UI, Vengeance UI (v4 specifically), Origin UI / coss.com/ui, daisyUI in any normal use.

**Tailwind is irrelevant or optional:** Motion (styling-agnostic, animates inline transforms), Anime.js (vanilla JS), OriginKit (you pick CSS / CSS Modules / Tailwind at fetch time), Uiverse (filter to the CSS-only half), Refero Styles (CSS Variables export tab), Particles by Casberry (canvas/WebGL — no CSS at all), Godly/recent.design and Mobbin (pictures).

Here is the real cost, not the theoretical one. You have 8,783 bytes — 2.7 KB gzipped — of CSS that is *already a design system*: twelve semantic tokens, one radius, one max-width, one serif stack, consistent BEM naming across every section. That is genuinely good work and it is the reason the site is 2.7 KB of CSS instead of 40.

Adopting Tailwind means: adding PostCSS to the build, adopting Tailwind v4's `@theme` layer, and then living with **two token systems describing the same colors** — your `--accent: #c77dff` next to shadcn's or daisyUI's oklch `--primary`. Preflight will reset your typography and you will spend an evening winning it back for the Iowan Old Style headings. And the payoff is components that all share a recognizable neutral/SaaS look, on a site whose entire point is that it looks like *yours*. Aceternity is the one that aesthetically matches — dark, purple, glow — but it is also the one whose look is most instantly identifiable as "Aceternity landing page," which is the opposite of what a personal portfolio is for.

**Recommendation, unhedged: do not adopt Tailwind.** Not now, not as part of this. Keep the hand-written CSS. Everything you actually want from these libraries — a background effect, a hover treatment, a scroll animation — is reachable through the Tailwind-optional column. If you ever start a different project that is genuinely component-heavy (a dashboard, an app with forms), start *that* one on Tailwind + shadcn. Do not retrofit it here.

Corollary: this rules out shadcn, Aceternity, Skiper, Vengeance, Origin UI, and daisyUI as dependencies. All six drop to reference-only or skip below.

---

## 3. WHAT TO ACTUALLY ADOPT, RANKED

### #1 — Refero Styles (styles.refero.design) — free, no account, works *today*

The only thing on this list that survives having no source code, because retheming through CSS custom properties is the one change a compiled build cannot stop you from making. `assets/index-Spj1AZHf.css` is plain readable CSS; edit the `:root` block and the entire site changes with no rebuild.

**First move:** open a dark-editorial style (Linear, Vercel, Resend), click the **CSS Variables** tab — not Tailwind v4 — and read what they do that you don't. The specific gaps I'd look at in your `:root`: you have one `--border: #241f33` doing every job, no shadow ramp, and no spacing scale at all (spacing is hardcoded per rule — `padding:26px 0` on `.paper`, `translateY(-3px)` on `.card:hover`). Steal the *structure* — a two-step border token (hairline vs. emphasis), a named shadow ramp, a `--space-*` scale — and keep your own values. Do **not** paste someone else's palette over `#c77dff` / `#ff79c6`; that palette plus Iowan Old Style is your identity, and it's the reason the site reads as designed rather than assembled.

Read the Do/Don't notes on each style page. That's the actual product; the tokens are the souvenir. Skip the paid Refero MCP — $120-ish/yr for a one-page portfolio is not a trade.

### #2 — Motion (`motion`, v12.42.2, MIT) — after the rebuild, and only then

The one runtime dependency worth adding. No Tailwind, no styling opinions, peer range `react ^18 || ^19` so your React 18.3.1 is inside it, and it earns its place by **deleting code you already have** rather than adding surface area.

```
npm i motion
```
```js
import { motion, AnimatePresence, useSpring } from 'motion/react'
```

Three specific places, in priority order:

1. **The `.section` scroll-reveal.** Today: an IntersectionObserver, a `body.reveal-ready` class, an `.is-visible` toggle, and a `transition: opacity .6s ease, transform .6s ease`. That becomes `<motion.section initial={{opacity:0, y:16}} whileInView={{opacity:1, y:0}} viewport={{once:true}}>` and the observer plus both CSS rules get deleted. Same result, less machinery, and you get proper stagger for free — the `.papers` list and the `.cards` grid should reveal their children in sequence, not as a single block. That stagger on your three-paper list is the highest-visible-impact change on the whole site.
2. **Hash-route transitions.** Six routes (`home`/`about`/`papers`/`experience`/`awards`/`contact`) currently hard-swap. Wrap the route body in `<AnimatePresence mode="wait">` keyed on the hash and you get a real crossfade on `.page-intro` / `.page-title` instead of a jump-cut.
3. **The cursor follower.** Your rAF loop moving `.cursor-glow` and `.cursor-ring` becomes `useSpring` on two motion values — physically nicer damping, less code. Lowest priority; the current one works. Do it only if you're already in the file.

Leave `.card:hover` (`translateY(-3px)`, border to `--accent`, `box-shadow: 0 14px 32px #c77dff24`) alone. It is a pure CSS transition, it costs 0 KB, and Motion would make it worse and heavier.

Install `motion`, not `framer-motion`. Same code, same version, but `motion/react` is the current front door.

### #3 — Particles by Casberry — **as a wallpaper export only**

Generate a still in your `#c77dff` / `#ff79c6` palette, export PNG/WebP, and use it as a `.hero` background layer under the existing subtle grid. **Zero JavaScript, zero dependencies, no source recovery needed** — you could do this against the compiled site tonight by adding a `background-image` to the `.hero` rule.

Do **not** take the React or Three.js export. That path is `three` (~600 KB minified) plus `@react-three/fiber` plus `drei` — and current R3F peers `react >=19`, so you'd be pinning back to v8/v9 on top of everything else. A 20,000-particle WebGL swarm is also just louder than a 900px serif editorial column deserves.

Caveat worth respecting: the site publishes no license or terms page. For a still image you generated yourself in your own colors this is low risk, but if you ship it, message the author first.

### #4 — OriginKit / Uiverse (CSS-only filter) — parts bin, one or two items max

Both are Tailwind-optional and both are copy-paste, so both compose with your stylesheet. Use them for *one isolated thing you don't have* — a nicer `.nav__toggle` hamburger animation, a link underline treatment on `.contact__list a`, a text effect for `.hero__name`. Rules: rename every class into your BEM scheme (Uiverse snippets ship unscoped `.btn` / `.card` that will collide head-on with your existing `.btn` and `.card`), and re-token every hardcoded color to `var(--accent)` / `var(--accent-soft)` / `var(--border)`. If a snippet needs more than ~20 lines of reconciliation, write it yourself instead.

OriginKit gates source behind a free account API key and has ~50 components from a young project — fine for lifting one effect you then own, not something to build on. Verify the component license before shipping; it wasn't retrievable.

### #5 — Anime.js — only if your ambitions change

MIT, zero dependencies, ~24.5 KB full with per-module splits (Animation ~5.2 KB, Scroll ~4.3 KB). Genuinely good, but for *this* site it's a lateral move: scroll-reveal, route transitions and hover states are declarative component-lifecycle problems, which is Motion's shape, not Anime's. It earns its keep the day you want SVG path drawing, morphing, motion-path, or real timeline choreography — none of which the site currently does. Don't install both.

---

## 4. REFERENCE ONLY — look, don't integrate

- **Godly → now recent.design** (godly.website 301-redirects there). Free, no account, optional weekly email. Its house style — dark canvases, gradient-clipped serif, glow, single-column editorial — is *exactly* your neighborhood, so it's the best taste input on this list. Use it for scroll choreography, section rhythm, and type scale. One warning: much of what's featured is heavy WebGL/Lenis agency work. Copy the *composition*, never the tech stack, or you throw away your speed. Note `godly.design` is a separate site under the same name; unclear if same team.
- **Aceternity UI, Skiper UI, Vengeance UI.** All three are Tailwind-mandatory, so as dependencies they're out — but as an idea library for dark purple motion they're excellent and free to browse. See an effect you like, reimplement it in plain CSS or Motion. Two things to know if you're ever tempted to actually install: Skiper's free tier **requires visible attribution on your site**, and Vengeance UI has **no LICENSE file at all** (GitHub API reports `license: null`), which under default copyright means all rights reserved, not free-for-all.
- **shadcn/ui.** MIT and readable — worth opening the source of `dialog` or `dropdown-menu` purely to see how focus trapping and keyboard navigation are done properly, then implementing the same behavior in your own markup. That's real transferable knowledge. Don't run the CLI.
- **Mobbin.** $10/mo billed yearly (~$120), free tier is 4 apps / 4 sites and useless. Content skews mobile app UI — paywalls, onboarding, settings — which maps to almost nothing on a portfolio with no product surface. Not worth the money for this.

---

## 5. WHAT TO SKIP

- **daisyUI** — the CDN micro-CSS escape hatch is clever and would technically work on your compiled site, but it injects a competing OKLCH theme layer next to your tokens and its default look is rounded generic SaaS. You'd retheme every variable to match `#08070d` + purple, which is more work than just writing the component. Net negative for a 2.7 KB stylesheet.
- **Origin UI** — acquired by Cal.com, `originui.com` 301s to `coss.com/ui`, and the original is explicitly a frozen legacy snapshot with limited maintenance. It's also a forms-and-dashboard kit: comboboxes, data tables, date pickers. You have zero of those. It solves a problem you don't have, on a deprecated foundation, and requires Tailwind plus Radix plus React Aria.
- **shadcn / Aceternity / Skiper / Vengeance as dependencies** — Tailwind-mandatory, per section 2. Skiper and Vengeance additionally assume Next.js (`next/link` imports, `"use client"`) which is meaningless in your Vite app and has to be hand-stripped per component.
- **Animmaster Lib (animmasterlib.dev)** — skip, and I want to be direct about why. There is no checkout. The stated purchase flow is DMing a stranger on Telegram or WhatsApp and sending card details or irreversible crypto, on a domain registered a few months ago with anonymous WHOIS, with no published license, no terms, no refund path, and zero independent reviews. **I will not walk you through entering payment details into that flow, and you shouldn't either.** Separately, even if it were trustworthy: ~70% of the pack is vanilla DOM (not React), the components lean on GSAP and Three.js, and the marketing describes them as rebuilds of other studios' award-winning sites with no clarity on what you may ship. If you want these effects, GSAP is now fully free including every plugin, and Motion is MIT.
- **The Casberry React/Three.js exports** (as opposed to the wallpaper) — payload, per section 6.
- **Nothing on the list turned out to be fake.** Vengeance UI is real (974 stars, actively pushed this month) despite the misspelled domain. Two decoys to avoid: the Solana memecoin also called "Particles by Casberry," and the npm package `vengeance-ui`, which is an unrelated 2023 publication that was unpublished. Also don't install `shadcn-ui` (stuck at 0.9.5) or `react-tsparticles` (deprecated).

---

## 6. BUNDLE-SIZE REALITY CHECK

Measured, not estimated:

| | raw | gzipped |
|---|---|---|
| `index-DoJnvX63.js` | 155,718 B | **50.6 KB** |
| `index-Spj1AZHf.css` | 8,783 B | **2.7 KB** |
| **Total over the wire** | | **~53 KB** |

The important detail: **~142 KB of that JS is React + ReactDOM itself. Your actual site is ~13 KB of it.** So "156 KB" overstates your own weight by more than 10x. The site is not fat; React is.

What each recommendation costs:

- **Refero Styles: 0 KB.** You are editing values in a file that already ships. This is the free lunch, and it's why it's ranked first.
- **Casberry wallpaper: 0 KB of JS.** Budget 40–150 KB for a WebP background image, which is a *separate*, lazy, cacheable, non-blocking request that never touches your parse time. Good trade.
- **Motion, full import: ~34 KB** per the official docs, and that figure can't be tree-shaken down. On a 50.6 KB gz payload that's a **~65% increase** — real, and I won't pretend otherwise.
- **Motion via `LazyMotion` + `m` + `domAnimation`: ~4.6 KB initial, ~15 KB loaded lazily.** This is the version you should ship. 4.6 KB blocking is under 10% growth, and `domAnimation` covers everything in section 3 (`whileInView`, `AnimatePresence`, springs). Import `m` instead of `motion` and wrap the app once in `<LazyMotion features={domAnimation}>`. If you find yourself needing `domMax` (~25 KB), you've probably over-animated.
- **Uiverse / OriginKit snippets: 1–3 KB of CSS each.** Negligible. The cost is maintenance and class-name collisions, not bytes.
- **Anime.js: ~24.5 KB full, ~5–10 KB if you import only `animate` and `onScroll`.** Fine in isolation, but it's paying bytes to replace things that already work.
- **Three.js + R3F + drei: ~600 KB minified for `three` alone**, before the wrappers. That is roughly **a 5x payload increase** to add decoration to a text-forward site. Absolute no. This is the single clearest bad trade in the entire research set, and it's the reason Casberry, Vengeance's 3D components, and half of Skiper are off the table.

**Verdict on the trades:** Refero and the wallpaper are free and you should do both. `LazyMotion` + `m` at ~4.6 KB to delete an IntersectionObserver, a `reveal-ready` class dance, and eventually a hand-rolled rAF loop — while *adding* stagger on the papers list and real route transitions — is worth it. Full `motion` at 34 KB is worth it only if you're actually going to use variants and layout animations, not just fade-ins. Anything that pulls Three.js is not worth it at any level of ambition this site has.

**One last thing that costs nothing and matters more than any of this:** your experience data still contains three literal placeholder bullets in the bundle — `"[Add a bullet on what you lead at Project Pulmonary.]"`, `"[Add a bullet on what you do as Chapter Development Director.]"` (Health For Humanity), and `"[Add a bullet on your volunteer work at Northwestern Medicine.]"`. Verified: exactly three occurrences, not four. Those are live on the deployed site right now. Fix that before you animate anything.
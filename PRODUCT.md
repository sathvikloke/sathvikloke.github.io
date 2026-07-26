# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary: Sathvik himself.** Confirmed in the ask round — when asked who most needs to be convinced, he chose "It's my home on the internet" over admissions, research, and recruiting audiences. This is a personal site built to represent him, not a conversion surface. Design decisions resolve toward what he'd be proud to own, not what a reviewer would score well.

**Secondary, unbidden: people who look him up.** Admissions readers, PIs, internship leads, and startup people will land here because it is the only page with his name on it. They must be able to find the credential record and the contact paths without the site being organized around them.

## Product Purpose

A personal home on the internet for Sathvik Loke — a record of what he builds, researches, and cares about. Success is that the page reads unmistakably as *him* rather than as a template a student filled in, and that a stranger who reads it comes away with both the work and the person.

## Positioning

A high schooler operating at genuine research level across biomedicine and machine learning — three papers, two startups, a lab bench and a model-training loop — who also has a real interior life outside the résumé (cello in a memory-care unit, math competitions, robotics, music). The combination is the position; neither half alone is unusual enough.

## Operating Context

Content is authored by one person, updated irregularly, and hosted as static files on Netlify. The site is read on desktop and phone, most often after someone is handed the link directly rather than through search. There is no CMS, no build pipeline currently in place, and no editorial process.

## Capabilities and Constraints

- **Hosting:** Netlify, static. No server. Serverless functions are available on the free tier if a feature needs one.
- **No source code exists.** The deploy folder contains only a compiled Vite build (`index.html` + two hashed assets). Any rebuild starts from a recovered or reconstructed source tree. See [[portfolio-folder-is-build-only]].
- **Current stack (as built):** React 18.3.1, Vite, hand-written plain CSS, hash-based routing, no runtime dependencies. ~53KB over the wire.
- **Performance is a real value, not a nice-to-have.** The current site loads fast with zero third-party requests and zero webfonts. Any addition trades against that budget explicitly.
- **Spotify (confirmed scope):** a small now-playing / recent-listening strip on the homepage — explicitly *not* a full music section, not a co-equal pillar, not an organizing metaphor. Chosen from four options in the ask round.
- **Spotify API (verified 2026-07-25):** free. Development mode serves up to 5 authenticated users at no cost, which is sufficient since only Sathvik authenticates. Requires the app owner to hold a Spotify **Premium** account. Extended quota mode is unavailable to individuals as of 2025-05-15 and is not needed here. Any live integration requires a serverless function holding a refresh token; Sathvik performs the OAuth step himself.
- **Undecided:** whether the music strip pulls live data or is curated. He asked whether the API was free rather than choosing; the answer is yes, but the choice itself remains open.

## Brand Commitments

- Name displayed as **Sathvik Loke**. Current hero treatment renders it with a trailing period.
- **Dark ground is binding.** Asked how much of the current look should survive, he answered "whatever the best color that matches with dark" — dark stays; the accent color is explicitly delegated to the designer rather than pinned to the incumbent purple/pink.
- Everything else in the incumbent visual world (heliotrope `#c77dff` / Dracula pink `#ff79c6`, Iowan Old Style serif display, blueprint-grid background, two-part custom cursor) is **evidence, not authority** — it is available to replace.
- **Voice is a genuine asset and should survive.** The existing copy — "I build cool things.", "a research project that started as a random idea at 2am", the cello-in-a-memory-care-unit line — reads as an actual teenager rather than a résumé. Preserve this register; do not corporatize it.

## Evidence on Hand

Real, verified from the current bundle:

- **Research (3):** a CRISPR–Cas9 / TP53 hotspot-correction preprint (bioRxiv, with N. Movva and M. Hota); *DriftScore*, an anchor-relative metric for quality drift in multi-turn multimodal generation (accepted, EvalMG @ ACM SIGIR 2026); a Parkinson's disease narrative review (Journal of Research High School, NEUROLOGY 2026).
- **Projects (2):** LANDER (co-founder — ACL tear risk screening, live at land-r.netlify.app) and Vivantal (developer — healthcare gaps, live at vivantal.com).
- **Experience (9 entries):** Albert Einstein College of Medicine (researcher, LVLMs + medical imaging), UIC (research intern, cell culture), Project Pulmonary, Health For Humanity, Northwestern Medicine, Stanford Neuroscience Journal Club, Leadership Initiatives (Washington DC / Nigeria), hospice cello volunteering, UPenn Summer Academies.
- **Awards:** USABO Semifinalist (2026); AMC 10A 124.5 / 10B 127.5, 2× Honor Roll, AIME qualifier; ICTM 2× State Qualifier and 11th in Geometry at State; HOSA State Leadership Conference finalist; VEX V5RC state results with teams 2360Z and 355Y.
- **Education:** IMSA (Aurora, IL, Aug 2025–present); Neuqua Valley High School (Naperville, IL, Aug 2024–2025).
- **Contact:** lokesathvik@gmail.com, sloke@imsa.edu, linkedin.com/in/sathvik-loke.

**Absences that must not be fabricated:**

- **Three experience entries have no written content.** Project Pulmonary, Health For Humanity, and Northwestern Medicine currently ship literal placeholder text (`[Add a bullet on what you lead at…]`). Sathvik must write these; no rebuild may invent duties, outcomes, or dates for them.
- **No paper is linked.** All three `link` fields are empty. No DOI, arXiv ID, bioRxiv URL, or PDF exists anywhere in the bundle. Do not invent identifiers.
- **No GitHub, Google Scholar, or ORCID presence** appears anywhere on the site.
- **No photograph or image asset of any kind** currently exists.
- **No résumé PDF exists**, despite the current meta description promising one.
- **No music data yet** — no Spotify app, token, or listening history is on hand.

## Product Principles

1. **Built for him first.** Where a choice pits legibility-to-a-reviewer against being genuinely his, being his wins. That is the stated audience.
2. **Both halves or neither.** The research record and the person outside it are the position. A version that drops either is a worse site even if it looks better.
3. **Proof over assertion.** Where evidence exists, link it and show it. Where it does not yet exist, leave an honest gap rather than decorative filler — and never a placeholder that reads as unfinished.
4. **Fast is part of the design.** Zero webfonts and no third-party requests is a real achievement worth defending; every byte added should be argued for.
5. **The voice is load-bearing.** Copy stays in first person, specific, and unpolished in the way a real person is unpolished.

## Accessibility & Inclusion

No user-specific requirement was established. Baseline standard for the rebuild is WCAG 2.1 AA, which the incumbent already meets on color contrast (lowest measured pair 6.10:1) but fails on focus visibility, reduced-motion support, and the collapsed mobile menu's focus order. These are regressions to avoid repeating, not new requirements.

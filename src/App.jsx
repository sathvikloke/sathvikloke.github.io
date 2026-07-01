import { useState, useEffect } from 'react'
import { profile, about, skills, education, projects, research, experience, awards, socials } from './data'

// Bold the site owner's name within an author list
function Authors({ value }) {
  const me = 'S. Loke'
  const parts = value.split(me)
  return (
    <p className="paper__authors">
      {parts.map((p, i) => (
        <span key={i}>
          {p}
          {i < parts.length - 1 && <strong>{me}</strong>}
        </span>
      ))}
    </p>
  )
}

function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash)
  useEffect(() => {
    const on = () => setHash(window.location.hash)
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return hash
}

function CursorFX() {
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    const glow = document.createElement('div')
    glow.className = 'cursor-glow'
    const ring = document.createElement('div')
    ring.className = 'cursor-ring'
    document.body.append(glow, ring)

    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my
    const onMove = (e) => {
      mx = e.clientX; my = e.clientY
      glow.style.transform = `translate(${mx}px, ${my}px)`
    }
    let raf
    const loop = () => {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16
      ring.style.transform = `translate(${rx}px, ${ry}px)`
      raf = requestAnimationFrame(loop)
    }
    const onOver = (e) => { if (e.target.closest('a, button')) ring.classList.add('is-active') }
    const onOut = (e) => { if (e.target.closest('a, button')) ring.classList.remove('is-active') }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    loop()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      glow.remove(); ring.remove()
    }
  }, [])
  return null
}

function Intro({ onFinish }) {
  const [lines, setLines] = useState([])
  const [pct, setPct] = useState(0)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) { onFinish(); return }

    const script = [
      '> initializing system…',
      '> loading modules [ neuro · ml · imaging ]',
      '> compiling portfolio.jsx',
      '> establishing secure connection',
      '> decrypting identity: SATHVIK LOKE',
      '> ready.',
    ]
    document.body.style.overflow = 'hidden'

    const timers = []
    let li = 0
    const addLine = () => {
      const line = script[li]
      if (line !== undefined) setLines((prev) => [...prev, line])
      li += 1
      if (li < script.length) timers.push(setTimeout(addLine, 220 + Math.random() * 160))
    }
    timers.push(setTimeout(addLine, 200))

    const prog = setInterval(() => {
      setPct((p) => Math.min(100, p + Math.random() * 11 + 3))
    }, 120)

    timers.push(setTimeout(() => {
      clearInterval(prog)
      setPct(100)
      setLeaving(true)
      timers.push(setTimeout(onFinish, 650))
    }, 2000))

    return () => {
      timers.forEach(clearTimeout)
      clearInterval(prog)
      document.body.style.overflow = ''
    }
  }, [])

  const lineClass = (l = '') =>
    l.includes('SATHVIK') ? 'intro__line intro__line--id'
      : l.includes('ready') ? 'intro__line intro__line--ok'
      : 'intro__line'

  return (
    <div className={`intro ${leaving ? 'intro--leave' : ''}`} aria-hidden="true">
      <div className="intro__scan" />
      <div className="intro__inner">
        <div className="intro__log">
          {lines.map((l, i) => <div key={i} className={lineClass(l)}>{l}</div>)}
          <span className="intro__cursor">▋</span>
        </div>
        <div className="intro__bar"><div className="intro__fill" style={{ width: `${pct}%` }} /></div>
        <div className="intro__pct">{Math.floor(pct)}%</div>
      </div>
    </div>
  )
}

function Nav({ page }) {
  const [open, setOpen] = useState(false)
  const links = page === 'research'
    ? [
        ['#top', '← Home'],
        ['#research', 'Research'],
        ['#awards', 'Awards'],
      ]
    : [
        ['#about', 'About'],
        ['#experience', 'Experience'],
        ['#projects', 'Projects'],
        ['#research', 'Research & Awards'],
        ['#contact', 'Contact'],
      ]
  return (
    <header className="nav">
      <a href="#top" className="nav__brand">{profile.name}</a>
      <button className="nav__toggle" aria-label="Toggle menu" onClick={() => setOpen((o) => !o)}>
        <span /><span /><span />
      </button>
      <nav className={`nav__links ${open ? 'is-open' : ''}`}>
        {links.map(([href, label]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>
        ))}
      </nav>
    </header>
  )
}

function Hero({ ready }) {
  const fullName = `${profile.name}.`
  const [typed, setTyped] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!ready) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) { setTyped(fullName); setDone(true); return }
    let i = 0
    const id = setInterval(() => {
      i += 1
      setTyped(fullName.slice(0, i))
      if (i >= fullName.length) {
        clearInterval(id)
        setTimeout(() => setDone(true), 350)
      }
    }, 90)
    return () => clearInterval(id)
  }, [ready])

  const reveal = (base, delay) => ({
    className: `${base} reveal-el ${done ? 'is-in' : ''}`,
    style: { transitionDelay: done ? delay : '0s' },
  })

  return (
    <section id="top" className="hero">
      <p className="hero__eyebrow">{profile.role}</p>
      <h1 className="hero__name" aria-label={fullName}>
        <span>{typed}</span><span className={`caret ${done ? 'caret--idle' : ''}`} aria-hidden="true" />
      </h1>
      <p {...reveal('hero__sub', '0.05s')}>{profile.subhead}</p>
      <p {...reveal('hero__tagline', '0.15s')}>{profile.tagline}</p>
      <div {...reveal('hero__actions', '0.25s')}>
        <a className="btn btn--primary" href="#research">View research</a>
        <a className="btn" href="https://www.linkedin.com/in/sathvik-loke" target="_blank" rel="noreferrer">LinkedIn ↗</a>
        <a className="btn" href={`mailto:${profile.email}`}>Email</a>
      </div>
      <p {...reveal('hero__meta', '0.35s')}>{profile.location}</p>
    </section>
  )
}

function Section({ id, title, children }) {
  return (
    <section id={id} className="section">
      <h2 className="section__title">{title}</h2>
      {children}
    </section>
  )
}

function About() {
  return (
    <Section id="about" title="About">
      <div className="about">
        <div className="about__text">
          {about.map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <ul className="skills">
          {skills.map((s) => <li key={s}>{s}</li>)}
        </ul>
      </div>
    </Section>
  )
}

function Education() {
  return (
    <Section id="education" title="Education">
      <div className="timeline">
        {education.map((e, i) => (
          <div key={i} className="job">
            <div className="job__head">
              <h3 className="job__role">{e.school}</h3>
              {e.period && <span className="job__period">{e.period}</span>}
            </div>
            {e.detail && <p className="job__company">{e.detail}</p>}
          </div>
        ))}
      </div>
    </Section>
  )
}

function Experience() {
  return (
    <Section id="experience" title="Experience">
      <div className="timeline">
        {experience.map((job, i) => (
          <div key={i} className="job">
            <div className="job__head">
              <h3 className="job__role">{job.role}</h3>
              {job.period && <span className="job__period">{job.period}</span>}
            </div>
            <p className="job__company">{job.company}</p>
            <ul className="job__bullets">
              {job.bullets.map((b, j) => <li key={j}>{b}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}

function Projects() {
  return (
    <Section id="projects" title="Projects">
      <div className="cards">
        {projects.map((p) => (
          <article key={p.title} className="card">
            <h3 className="card__title">{p.title}</h3>
            <p className="card__desc">{p.description}</p>
            <ul className="tags">
              {p.tags.map((t) => <li key={t}>{t}</li>)}
            </ul>
            {p.link && (
              <a className="card__link" href={p.link} target="_blank" rel="noreferrer">
                Visit site ↗
              </a>
            )}
          </article>
        ))}
      </div>
    </Section>
  )
}

function Research() {
  return (
    <Section id="research" title="Research">
      <div className="papers">
        {research.map((r) => (
          <article key={r.title} className="paper">
            <div className="paper__head">
              <h3 className="paper__title">
                {r.link ? (
                  <a href={r.link} target="_blank" rel="noreferrer">{r.title} ↗</a>
                ) : r.title}
              </h3>
              {r.year && <span className="paper__year">{r.year}</span>}
            </div>
            {r.authors && <Authors value={r.authors} />}
            {r.venue && <p className="paper__venue">{r.venue}</p>}
            <p className="paper__desc">{r.description}</p>
            <ul className="tags">
              {r.tags.map((t) => <li key={t}>{t}</li>)}
            </ul>
          </article>
        ))}
      </div>
    </Section>
  )
}

function Awards() {
  return (
    <Section id="awards" title="Awards & Honors">
      <dl className="awards">
        {awards.map((a, i) => (
          <div key={i} className="awards__row">
            <dt className="awards__title">{a.title}</dt>
            <dd className="awards__detail">{a.detail}</dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}

function Contact() {
  return (
    <Section id="contact" title="Contact">
      <p className="contact__lead">
        Want to collaborate, talk research, or just say hi? Reach me here.
      </p>
      <ul className="contact__list">
        {socials.map((s) => (
          <li key={s.label}>
            <span className="contact__label">{s.label}</span>
            <a href={s.href} target="_blank" rel="noreferrer">{s.value}</a>
          </li>
        ))}
      </ul>
    </Section>
  )
}

export default function App() {
  const hash = useHashRoute()
  const page = (hash.startsWith('#research') || hash.startsWith('#awards')) ? 'research' : 'home'
  const [booting, setBooting] = useState(true)

  useEffect(() => {
    document.title = `${profile.name} · Portfolio`
  }, [])

  // Safety: make sure scrolling is never left locked once the intro is gone
  useEffect(() => {
    if (!booting) document.body.style.overflow = ''
  }, [booting])

  // Scroll to the target section after a page/hash change
  useEffect(() => {
    const id = hash.slice(1)
    if (!id || id === 'top') { window.scrollTo({ top: 0 }); return }
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }, [hash, page])

  // Scroll-reveal for sections (with a fail-safe so content can never stay hidden)
  useEffect(() => {
    const els = document.querySelectorAll('.section')
    const revealAll = () => els.forEach((el) => el.classList.add('is-visible'))

    if (!('IntersectionObserver' in window)) { revealAll(); return }

    document.body.classList.add('reveal-ready')
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('is-visible') })
    }, { threshold: 0.05, rootMargin: '0px 0px 120px 0px' })
    els.forEach((el) => obs.observe(el))

    // Fail-safe: whatever happens, reveal everything within 1.5s
    const fallback = setTimeout(revealAll, 1500)
    return () => { obs.disconnect(); clearTimeout(fallback) }
  }, [page])

  return (
    <>
      {booting && <Intro onFinish={() => setBooting(false)} />}
      <CursorFX />
      <Nav page={page} />
      {page === 'research' ? (
        <main className="container">
          <div className="page-intro">
            <a href="#top" className="page-back">← Back to home</a>
            <h1 className="page-title">Research & Awards</h1>
          </div>
          <Research />
          <Awards />
        </main>
      ) : (
        <main className="container">
          <Hero ready={!booting} />
          <About />
          <Education />
          <Experience />
          <Projects />
          <Contact />
        </main>
      )}
    </>
  )
}

import { intro, thingsHeading, things, projects, papers, music, contact } from './data'
import { useListening, ago } from './Listening'
import Signature from './Signature'
import Scene from './Scene'

const PAGES = [
  ['home', '/'],
  ['projects', '/projects/'],
  ['research', '/research/'],
  ['music', '/music/'],
]

const path = window.location.pathname
const page = PAGES.slice(1).find(([, href]) => path.startsWith(href.slice(0, -1)))?.[0] ?? 'home'

// Renders "[text](url)" spans in data.js strings as links.
function Inline({ text }) {
  const parts = text.split(/\[([^\]]+)\]\(([^)]+)\)/)
  const out = []
  for (let i = 0; i < parts.length; i += 3) {
    if (parts[i]) out.push(parts[i])
    if (i + 1 < parts.length) out.push(<a key={i} href={parts[i + 2]}>{parts[i + 1]}</a>)
  }
  return out
}

function Track({ t, live }) {
  return (
    <span className="lc">
      <a href={t.url || undefined}>{t.track}</a>, {t.artist}
      <span className="soft"> · {live ? 'now' : ago(t.at)}</span>
    </span>
  )
}

function Home() {
  const { live, now, recent } = useListening()
  const head = now ?? recent[0]

  return (
    <>
      {intro.map((p, i) => <p key={i}><Inline text={p} /></p>)}

      <p className="tight">{thingsHeading}</p>
      <ul>
        {things.map((t, i) => <li key={i}><Inline text={t} /></li>)}
      </ul>

      {head && (
        <p className="mono">
          {live ? 'listening to: ' : 'last played: '}
          <Track t={head} live={live} />
          {' — '}<a href="/music/">more music</a>
        </p>
      )}
    </>
  )
}

function Projects() {
  return (
    <>
      <p>previous projects.</p>
      <ul>
        {projects.map((t, i) => <li key={i}><Inline text={t} /></li>)}
      </ul>
    </>
  )
}

// Bolds the site owner's name in an author list.
function Authors({ value }) {
  const me = 'S. Loke'
  return value.split(me).flatMap((part, i) => (i ? [<strong key={i}>{me}</strong>, part] : [part]))
}

function Research() {
  return (
    <>
      <p>research.</p>
      <ul className="papers">
        {papers.map((p) => (
          <li key={p.title}>
            <a href={p.link}>{p.title}</a>
            <span className="meta">{p.venue}</span>
            <span className="meta"><Authors value={p.authors} /></span>
          </li>
        ))}
      </ul>
    </>
  )
}

function Music() {
  const { status, live, now, recent, top } = useListening()

  return (
    <>
      <p>music.</p>
      {music.map((p, i) => <p key={i} className={i < music.length - 1 ? 'tight' : ''}><Inline text={p} /></p>)}

      {status === 'empty' && <p className="soft">listening data isn't connected yet.</p>}

      {(now || recent.length > 0) && (
        <>
          <p className="tight">{live ? 'listening to now, then recently:' : 'recently:'}</p>
          <ul>
            {now && <li><Track t={now} live /></li>}
            {recent.map((t, i) => <li key={`${t.track}-${i}`}><Track t={t} /></li>)}
          </ul>
        </>
      )}

      {top.length > 0 && (
        <>
          <p className="tight">most played this month:</p>
          <p>
            {top.map((a, i) => (
              <span key={a.name} className="lc">
                {i > 0 && ' · '}
                <a href={a.url || undefined}>{a.name}</a>
                {a.plays > 0 && <span className="soft"> ({a.plays})</span>}
              </span>
            ))}
          </p>
        </>
      )}
    </>
  )
}

export default function App() {
  return (
    <div className="sheet">
      <div className="col">
        <header>
          <nav>
            {PAGES.map(([name, href], i) => (
              <span key={name}>
                {i > 0 && ' · '}
                {name === page ? <span className="here">{name}</span> : <a href={href}>{name}</a>}
              </span>
            ))}
          </nav>
        </header>

        <main>
          {{ home: <Home />, projects: <Projects />, research: <Research />, music: <Music /> }[page]}
        </main>

        <footer>
          <p>
            {contact.map((c, i) => (
              <span key={c.href}>{i > 0 && ' · '}<a href={c.href}>{c.label}</a></span>
            ))}
          </p>
          <Signature />
        </footer>
      </div>
      <Scene />
    </div>
  )
}

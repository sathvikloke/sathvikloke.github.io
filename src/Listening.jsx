import { useEffect, useState } from 'react'

/*
  Reads /listening.json, written at build time by scripts/fetch-listening.mjs
  from Last.fm. The API key lives in GitHub Secrets and never reaches the
  browser. Before the first successful build the file does not exist, so this
  renders an honest "not connected" state rather than inventing a track list.
*/

const ago = (uts) => {
  if (!uts) return ''
  const m = Math.floor(Date.now() / 1000 / 60 - uts / 60)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  return h < 24 ? `${h}h ago` : `${Math.floor(h / 24)}d ago`
}

export default function Listening({ onPlayingChange }) {
  const [state, setState] = useState({ status: 'loading' })

  useEffect(() => {
    let alive = true
    fetch('listening.json', { cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('missing'))))
      .then((d) => {
        if (!alive) return
        if (!d || !d.ok) return setState({ status: 'empty' })
        setState({ status: 'ok', data: d })
      })
      .catch(() => alive && setState({ status: 'empty' }))
    return () => { alive = false }
  }, [])

  const d = state.data
  // The snapshot refreshes on a schedule, so stop claiming something is playing
  // once it has gone cold. Report when it was taken instead.
  const ageMin = d?.updated ? Math.floor((Date.now() - Date.parse(d.updated)) / 60000) : null
  const fresh = ageMin !== null && ageMin <= 30
  const live = Boolean(d?.playing && d?.now && fresh)
  const stamp = ageMin === null ? '' : ageMin < 1 ? 'checked just now' : ageMin < 60 ? `checked ${ageMin}m ago` : `checked ${Math.floor(ageMin / 60)}h ago`

  useEffect(() => { onPlayingChange?.(live) }, [live, onPlayingChange])

  if (state.status === 'loading') {
    return <p className="listen__note">Checking what's on…</p>
  }

  if (state.status === 'empty') {
    return (
      <p className="listen__note">
        Not connected yet — add <code>LASTFM_API_KEY</code> and <code>LASTFM_USER</code> as
        repository secrets and the next build will fill this in.
      </p>
    )
  }

  const headline = live ? d.now : d.recent?.[0]

  return (
    <div className="listen">
      {headline && (
        <div className="listen__now">
          {headline.art && <img className="listen__art" src={headline.art} alt="" />}
          <div>
            <p className="listen__label">{live ? 'Playing now' : 'Last played'}</p>
            <p className="listen__track">{headline.track}</p>
            <p className="listen__artist">
              {[headline.artist, stamp].filter(Boolean).join(' · ')}
            </p>
          </div>
          {live && (
            <span className="listen__eq" aria-hidden="true">
              <i /><i /><i /><i /><i />
            </span>
          )}
        </div>
      )}

      {d.recent?.length > 0 && (
        <div className="listen__col">
          <h3 className="listen__h">Recently played</h3>
          <ul className="listen__list">
            {d.recent.map((t, i) => (
              <li key={`${t.track}-${i}`}>
                <a href={t.url || undefined} target="_blank" rel="noreferrer">{t.track}</a>
                <span>{t.artist}</span>
                <em>{ago(t.at)}</em>
              </li>
            ))}
          </ul>
        </div>
      )}

      {d.top?.length > 0 && (
        <div className="listen__col">
          <h3 className="listen__h">Top artists · last 4 weeks</h3>
          <ul className="listen__list">
            {d.top.map((a, i) => (
              <li key={`${a.name}-${i}`}>
                <a href={a.url || undefined} target="_blank" rel="noreferrer">{a.name}</a>
                <span />
                <em>{a.plays ? `${a.plays} plays` : ''}</em>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

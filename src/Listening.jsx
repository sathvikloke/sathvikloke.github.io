import { useEffect, useState } from 'react'

/*
  Reads /listening.json, written at build time by scripts/fetch-listening.mjs
  from Last.fm. The API key lives in GitHub Secrets and never reaches the
  browser. Before the first successful build the file does not exist, so
  callers get status 'empty' and should say so rather than invent a track list.
*/

export const ago = (uts) => {
  if (!uts) return ''
  const m = Math.floor(Date.now() / 1000 / 60 - uts / 60)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  return h < 24 ? `${h}h ago` : `${Math.floor(h / 24)}d ago`
}

export function useListening() {
  const [state, setState] = useState({ status: 'loading' })

  useEffect(() => {
    let alive = true

    const load = () =>
      // Absolute path: the music page lives at /music/, where a relative URL
      // would miss. GitHub Pages serves this with Cache-Control: max-age=600,
      // so the timestamp and no-store keep a stale track from sticking around.
      fetch(`/listening.json?t=${Date.now()}`, { cache: 'no-store' })
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error('missing'))))
        .then((d) => {
          if (!alive) return
          if (!d || !d.ok) return setState({ status: 'empty' })
          setState({ status: 'ok', data: d })
        })
        .catch(() => alive && setState((s) => (s.status === 'ok' ? s : { status: 'empty' })))

    load()
    // A page left open should pick up new snapshots without a refresh.
    const id = setInterval(load, 60_000)
    const onFocus = () => load()
    window.addEventListener('focus', onFocus)

    return () => {
      alive = false
      clearInterval(id)
      window.removeEventListener('focus', onFocus)
    }
  }, [])

  const d = state.data
  // The snapshot refreshes on a schedule, so stop claiming something is
  // playing once it has gone cold.
  const ageMin = d?.updated ? Math.floor((Date.now() - Date.parse(d.updated)) / 60000) : null
  const live = Boolean(d?.playing && d?.now && ageMin !== null && ageMin <= 30)

  return {
    status: state.status,
    live,
    now: live ? d.now : null,
    recent: d?.recent ?? [],
    top: d?.top ?? [],
  }
}

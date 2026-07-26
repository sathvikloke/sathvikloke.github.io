import { useEffect, useRef } from 'react'

/*
  A point cloud that morphs between formations, one per route.

  Figurative shapes (person, computer, phone) are sampled from silhouettes drawn
  to an offscreen canvas — the same trick particle generators use. Anything you
  can draw becomes a formation, including a real photo if one is ever dropped in.

  Deliberately plain canvas 2D with a hand-rolled perspective projection rather
  than Three.js, which would cost ~600KB for the same silhouette.
*/

const SS = 240 // silhouette sample resolution

function sampleDrawing(draw, count) {
  const oc = document.createElement('canvas')
  oc.width = oc.height = SS
  const g = oc.getContext('2d', { willReadFrequently: true })
  g.clearRect(0, 0, SS, SS)
  g.fillStyle = '#fff'
  g.strokeStyle = '#fff'
  g.lineCap = 'round'
  g.lineJoin = 'round'
  draw(g, SS)

  const px = g.getImageData(0, 0, SS, SS).data
  const hits = []
  for (let y = 0; y < SS; y++) {
    for (let x = 0; x < SS; x++) {
      if (px[(y * SS + x) * 4 + 3] > 120) hits.push(x + y * SS)
    }
  }

  const out = new Array(count)
  if (!hits.length) return out.fill([0, 0, 0])
  for (let i = 0; i < count; i++) {
    const h = hits[(Math.random() * hits.length) | 0]
    const x = h % SS
    const y = (h / SS) | 0
    out[i] = [
      (x / SS - 0.5) * 2.25,
      -(y / SS - 0.5) * 2.25, // canvas y grows down, world y grows up
      (Math.random() - 0.5) * 0.2, // a little depth so it still reads when turning
    ]
  }
  return out
}

function drawPerson(g, S) {
  const u = S / 240
  g.beginPath(); g.arc(120 * u, 44 * u, 21 * u, 0, 6.283); g.fill()
  g.beginPath()
  g.moveTo(98 * u, 80 * u); g.lineTo(142 * u, 80 * u)
  g.lineTo(136 * u, 152 * u); g.lineTo(104 * u, 152 * u)
  g.closePath(); g.fill()
  g.lineWidth = 12 * u
  g.beginPath(); g.moveTo(101 * u, 88 * u); g.lineTo(74 * u, 62 * u); g.lineTo(83 * u, 27 * u); g.stroke()
  g.beginPath(); g.arc(84 * u, 21 * u, 8 * u, 0, 6.283); g.fill()
  g.beginPath(); g.moveTo(140 * u, 88 * u); g.lineTo(162 * u, 120 * u); g.lineTo(157 * u, 152 * u); g.stroke()
  g.lineWidth = 15 * u
  g.beginPath(); g.moveTo(111 * u, 152 * u); g.lineTo(105 * u, 212 * u); g.stroke()
  g.beginPath(); g.moveTo(129 * u, 152 * u); g.lineTo(137 * u, 212 * u); g.stroke()
}

function drawComputer(g, S) {
  const u = S / 240
  g.lineWidth = 9 * u
  g.beginPath(); g.roundRect(38 * u, 52 * u, 164 * u, 116 * u, 10 * u); g.stroke()
  g.lineWidth = 6 * u
  ;[[60, 84, 110], [60, 102, 142], [60, 120, 96], [60, 138, 126]].forEach(([x, y, w]) => {
    g.beginPath(); g.moveTo(x * u, y * u); g.lineTo((x + w) * u, y * u); g.stroke()
  })
  g.lineWidth = 11 * u
  g.beginPath(); g.moveTo(120 * u, 168 * u); g.lineTo(120 * u, 192 * u); g.stroke()
  g.beginPath(); g.moveTo(84 * u, 196 * u); g.lineTo(156 * u, 196 * u); g.stroke()
}

function drawPhone(g, S) {
  const u = S / 240
  g.lineWidth = 9 * u
  g.beginPath(); g.roundRect(88 * u, 30 * u, 64 * u, 180 * u, 15 * u); g.stroke()
  g.lineWidth = 5 * u
  g.beginPath(); g.moveTo(110 * u, 46 * u); g.lineTo(130 * u, 46 * u); g.stroke()
  g.beginPath(); g.moveTo(107 * u, 197 * u); g.lineTo(133 * u, 197 * u); g.stroke()
  g.lineWidth = 4 * u
  ;[[100, 86, 40], [100, 104, 26], [100, 122, 34]].forEach(([x, y, w]) => {
    g.beginPath(); g.moveTo(x * u, y * u); g.lineTo((x + w) * u, y * u); g.stroke()
  })
}

const helixPt = (i, N) => {
  const t = (i / N) * Math.PI * 11
  const off = i % 2 ? Math.PI : 0
  const r = 0.4
  if (i % 14 === 0) {
    const f = (i / 14) % 1
    return [Math.cos(t + off) * r * (1 - 2 * f), (i / N - 0.5) * 2.1, Math.sin(t + off) * r * (1 - 2 * f)]
  }
  return [Math.cos(t + off) * r, (i / N - 0.5) * 2.1, Math.sin(t + off) * r]
}

const wavesPt = (i) => {
  const cols = 74
  const c = i % cols
  const u = c / (cols - 1)
  const env = Math.sin(u * Math.PI)
  const amp = env * (0.3 + 0.58 * Math.abs(Math.sin(u * 9.1) * 0.6 + Math.sin(u * 23.7) * 0.4))
  const span = (((i / cols) | 0) % 9) / 8
  return [(u - 0.5) * 2.15, (span - 0.5) * 2 * amp, ((((i * 37) % 11) / 10) - 0.5) * 0.34]
}

const scatterPt = (i, N) => {
  const a = (i / N) * Math.PI * 2
  const r = 0.5 + Math.random() * 0.9
  return [Math.cos(a) * r, (Math.random() - 0.5) * 1.8, Math.sin(a) * r]
}

export default function Particles({ shape = 'scatter', playing = false }) {
  const ref = useRef(null)
  const api = useRef({ morph: null })

  // keep the latest props visible to the animation loop without restarting it
  const live = useRef({ shape, playing })
  live.current = { shape, playing }

  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    const cx = cv.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const N = window.innerWidth < 760 ? 1200 : 2800

    let W, H, DPR
    const size = () => {
      DPR = Math.min(window.devicePixelRatio || 1, 2)
      W = cv.width = window.innerWidth * DPR
      H = cv.height = window.innerHeight * DPR
      cv.style.width = window.innerWidth + 'px'
      cv.style.height = window.innerHeight + 'px'
    }
    size()
    window.addEventListener('resize', size)

    const cache = {}
    const pointsFor = (name) => {
      if (cache[name]) return cache[name]
      let pts
      if (name === 'person') pts = sampleDrawing(drawPerson, N)
      else if (name === 'computer') pts = sampleDrawing(drawComputer, N)
      else if (name === 'phone') pts = sampleDrawing(drawPhone, N)
      else if (name === 'helix') pts = Array.from({ length: N }, (_, i) => helixPt(i, N))
      else if (name === 'waves') pts = Array.from({ length: N }, (_, i) => wavesPt(i))
      else pts = Array.from({ length: N }, (_, i) => scatterPt(i, N))
      cache[name] = pts
      return pts
    }

    const P = Array.from({ length: N }, (_, i) => {
      const s = scatterPt(i, N)
      return { x: s[0], y: s[1], z: s[2], tx: s[0], ty: s[1], tz: s[2], d: Math.random(), ph: Math.random() * 6.283 }
    })

    const morph = (name) => {
      const pts = pointsFor(name)
      for (let i = 0; i < N; i++) {
        P[i].tx = pts[i][0]; P[i].ty = pts[i][1]; P[i].tz = pts[i][2]
      }
    }
    api.current.morph = morph
    morph(live.current.shape)

    let rot = 0, mx = 0, my = 0, tmx = 0, tmy = 0, raf
    const onMove = (e) => {
      tmx = e.clientX / window.innerWidth - 0.5
      tmy = e.clientY / window.innerHeight - 0.5
    }
    window.addEventListener('mousemove', onMove)

    const frame = (now = 0) => {
      cx.clearRect(0, 0, W, H)
      rot += reduce ? 0 : 0.0016
      mx += (tmx - mx) * 0.045
      my += (tmy - my) * 0.045

      const cxp = W / 2
      const cyp = H * (window.innerWidth < 760 ? 0.4 : 0.46)
      const scale = Math.min(W, H) * (window.innerWidth < 760 ? 0.3 : 0.27)
      const cosR = Math.cos(rot + mx * 0.55), sinR = Math.sin(rot + mx * 0.55)
      const tilt = -0.32 + my * 0.3
      const cosT = Math.cos(tilt), sinT = Math.sin(tilt)
      const isWaves = live.current.shape === 'waves'
      const amp = live.current.playing ? 0.52 : 0.22

      for (let i = 0; i < N; i++) {
        const p = P[i]
        p.x += (p.tx - p.x) * 0.055
        p.y += (p.ty - p.y) * 0.055
        p.z += (p.tz - p.z) * 0.055

        // the waveform is the one formation that keeps moving after it lands
        const wy = isWaves && !reduce ? p.y * (1 + Math.sin(now * 0.0022 + p.ph) * amp) : p.y

        const x1 = p.x * cosR - p.z * sinR
        const z1 = p.x * sinR + p.z * cosR
        const y2 = wy * cosT - z1 * sinT
        const z2 = wy * sinT + z1 * cosT

        const persp = 2.6 / (2.6 + z2)
        const sx = cxp + x1 * scale * persp
        const sy = cyp - y2 * scale * persp // screen y grows down; world y grows up

        const depth = Math.max(0, Math.min(1, (z2 + 1.2) / 2.4))
        const a = depth * 0.82 + 0.06
        const r = Math.max(0.35, (p.d * 1.15 + 0.42) * persp * DPR * 0.8)

        // heliotrope in the distance, warming toward the pink up close
        cx.fillStyle = `rgba(${Math.round(158 + depth * 97)},${Math.round(101 + depth * 26)},${Math.round(222 - depth * 14)},${a})`
        cx.beginPath()
        cx.arc(sx, sy, r, 0, 6.283)
        cx.fill()
      }
      raf = requestAnimationFrame(frame)
    }
    frame()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', size)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  useEffect(() => {
    if (api.current.morph) api.current.morph(shape)
  }, [shape])

  return <canvas className="field" ref={ref} aria-hidden="true" />
}

import { useEffect, useRef } from 'react'

/*
  The background: a heart-monitor trace along the bottom of the page, with a
  network of AI agents growing out of its beats. A sweep runs along the trace
  like a bedside monitor; when it crosses a beat that an agent is wired to, a
  signal climbs to that agent, which lights up and hands it on to its
  neighbours, two hops out.

  Behind it all, a mountain range drawn as stacked contour lines, front to
  back, with each line hidden wherever a nearer one already covers it. The
  peaks sit toward the edges so the text column stays clear, and the canvas
  extends above the band so they can rise and fade into the page.

  The dim structure is drawn once per resize to an offscreen canvas; each frame
  only adds the sweep, the moving signals and the lit nodes. The layout is
  seeded, so it is the same drawing on every visit. Readers who prefer reduced
  motion get the still drawing.
*/

const BG = '#0b0d11'
const BLUE = [36, 88, 245] // #2458f5
const GLOW = [140, 170, 255] // #8caaff
const MUTED = [148, 160, 180]
const TOPO = [113, 133, 207] // #7185cf, the contour lines
const RISE = 0.7 // canvas extends this fraction of the band above it, for the peaks
const rgba = ([r, g, b], a) => `rgba(${r},${g},${b},${a})`

const GLYPHS = ['cross', 'heart', 'helix', 'ring', 'pill']
const LABELS = ['triage', 'radiology', 'labs', 'scribe', 'genomics', 'pharmacy', 'follow-up', 'imaging', 'trials']

const SPEED = 240 // sweep, px/s
const TRAIL = 260 // px of lit trace behind the sweep
const HOPS = 2 // how far a beat's signal travels through the network

function seeded(seed) {
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return seed / 4294967296
  }
}

function layout(W, H) {
  const r = seeded(11)
  const base = H - 30

  const peaks = []
  for (let x = 70 + r() * 80; x < W - 40; x += 200 + r() * 70) peaks.push(x)

  // The trace as a sum of gaussians per beat: P, Q, R, S, T.
  const g = (d, w) => Math.exp(-(d * d) / (2 * w * w))
  const ys = new Float32Array(Math.ceil(W) + 1)
  for (let x = 0; x < ys.length; x++) {
    let v = 0
    for (const p of peaks) {
      const d = x - p
      if (d < -70 || d > 80) continue
      v += -5 * g(d + 40, 6) + 5 * g(d + 6, 2.2) - 44 * g(d, 2.6) + 9 * g(d - 6, 2.4) - 9 * g(d - 44, 9)
    }
    ys[x] = base + v
  }
  const yAt = (x) => ys[Math.max(0, Math.min(ys.length - 1, Math.round(x)))]

  // Nodes live between the top of the band and just above the R peaks, and
  // never closer than MIN_GAP to each other so glyphs don't overlap.
  const top = 18
  const bottom = base - 62
  const MIN_GAP = 30
  const nodes = []
  for (let x = 26 + r() * 20; x < W - 24; x += 56 + r() * 26) {
    const count = r() < 0.4 ? 2 : 1
    for (let i = 0; i < count; i++) {
      for (let tries = 0; tries < 6; tries++) {
        const nx = x + (r() - 0.5) * 22
        const ny = top + r() * (bottom - top)
        if (nodes.some((n) => Math.hypot(n.x - nx, n.y - ny) < MIN_GAP)) continue
        nodes.push({
          x: nx,
          y: ny,
          type: r() < 0.55 ? 'agent' : GLYPHS[Math.floor(r() * GLYPHS.length)],
          glow: 0,
          links: [],
        })
        break
      }
    }
  }

  const edges = []
  const seen = new Set()
  nodes.forEach((a, i) => {
    const near = nodes
      .map((b, j) => [Math.hypot(a.x - b.x, a.y - b.y), j])
      .filter(([d, j]) => j !== i && d < 150)
      .sort((p, q) => p[0] - q[0])
      .slice(0, 2)
    for (const [, j] of near) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`
      if (seen.has(key)) continue
      seen.add(key)
      edges.push([i, j])
      a.links.push(j)
      nodes[j].links.push(i)
    }
  })

  // Wire each beat's R peak to the agent nearest above it.
  const anchors = new Map()
  peaks.forEach((p, pi) => {
    let best = -1
    let bestD = 170
    nodes.forEach((n, i) => {
      const d = Math.hypot(n.x - p, (n.y - yAt(p)) * 0.6)
      if (d < bestD) { bestD = d; best = i }
    })
    if (best >= 0) anchors.set(pi, best)
  })

  let li = 0
  nodes.forEach((n, i) => {
    if (n.type === 'agent' && i % 3 === 1 && li < LABELS.length && n.x < W - 90) n.label = LABELS[li++]
  })

  return { base, peaks, ys, yAt, nodes, edges, anchors }
}

function glyph(c, { x, y, type }, stroke) {
  c.save()
  c.translate(x, y)
  c.strokeStyle = stroke
  c.fillStyle = BG
  c.lineWidth = 1.2
  c.beginPath()
  if (type === 'agent') c.roundRect(-8, -7, 16, 14, 3)
  else if (type === 'ring') {
    for (let k = 0; k < 6; k++) {
      const a = -Math.PI / 2 + (k * Math.PI) / 3
      c.lineTo(9 * Math.cos(a), 9 * Math.sin(a))
    }
    c.closePath()
  } else c.arc(0, 0, 9, 0, Math.PI * 2)
  c.fill()
  c.stroke()

  c.beginPath()
  switch (type) {
    case 'agent': // a prompt: >_
      c.moveTo(-4, -3); c.lineTo(-1, 0); c.lineTo(-4, 3)
      c.moveTo(1, 3); c.lineTo(4, 3)
      break
    case 'cross':
      c.moveTo(-4, 0); c.lineTo(4, 0)
      c.moveTo(0, -4); c.lineTo(0, 4)
      break
    case 'heart':
      c.moveTo(0, 3.5)
      c.bezierCurveTo(-6, -0.5, -3.5, -6, 0, -2.5)
      c.bezierCurveTo(3.5, -6, 6, -0.5, 0, 3.5)
      break
    case 'helix':
      c.moveTo(-3, -5.5); c.bezierCurveTo(4, -2, -4, 2, 3, 5.5)
      c.moveTo(3, -5.5); c.bezierCurveTo(-4, -2, 4, 2, -3, 5.5)
      c.moveTo(-2, -2.8); c.lineTo(2, -2.8)
      c.moveTo(-2, 2.8); c.lineTo(2, 2.8)
      break
    case 'ring': // a benzene ring
      c.arc(0, 0, 4, 0, Math.PI * 2)
      break
    case 'pill':
      c.rotate(-0.6)
      c.roundRect(-5.5, -2.5, 11, 5, 2.5)
      c.moveTo(0, -2.5); c.lineTo(0, 2.5)
      break
  }
  c.stroke()
  c.restore()
}

function drawTerrain(c, W, H, frontY) {
  const r = seeded(29)
  const peaks = [
    { x: 0.84 * W, d: 0.55, a: 0.55 * H, wx: Math.max(130, 0.11 * W), wd: 0.3 },
    { x: 0.11 * W, d: 0.7, a: 0.42 * H, wx: Math.max(110, 0.09 * W), wd: 0.28 },
    { x: 0.69 * W, d: 0.9, a: 0.24 * H, wx: Math.max(90, 0.06 * W), wd: 0.22 },
  ]
  const ph = [r() * 6, r() * 6, r() * 6]
  const height = (x, d) => {
    let h = 0
    for (const p of peaks) h += p.a * Math.exp(-((x - p.x) ** 2) / (2 * p.wx ** 2) - ((d - p.d) ** 2) / (2 * p.wd ** 2))
    // Ridges and gullies, so the slopes don't look airbrushed.
    return h * (1 + 0.12 * Math.sin(x / 37 + ph[0] + d * 9) + 0.08 * Math.sin(x / 13 + ph[1] - d * 14))
  }

  const ROWS = 22
  const STEP = 4
  const depth = H * 0.32 // how far the rows recede up the canvas
  const horizon = new Float32Array(Math.ceil(W / STEP) + 1).fill(Infinity)
  c.lineWidth = 0.7
  for (let k = 0; k < ROWS; k++) {
    const d = k / (ROWS - 1)
    // Rows bunch together with distance, like a surface seen at an angle.
    const rowY = frontY - depth * (1 - (1 - d) ** 1.8)
    c.strokeStyle = rgba(TOPO, 0.26 * (1 - 0.6 * d))
    c.beginPath()
    let pen = false
    for (let i = 0; i < horizon.length; i++) {
      const x = i * STEP
      const h = height(x, d) * (1 - 0.35 * d)
      const y = rowY - h
      // Draw only on the mountains, not the flat plain, and only where no
      // nearer line is already in the way.
      if (y < horizon[i] - 0.6 && h > 12) {
        pen ? c.lineTo(x, y) : c.moveTo(x, y)
        pen = true
      } else pen = false
      horizon[i] = Math.min(horizon[i], y)
    }
    c.stroke()
  }
}

function drawStatic(c, L, W) {
  drawTerrain(c, W, L.H, L.oy + L.base - 8)
  c.save()
  c.translate(0, L.oy)

  c.lineCap = 'round'
  c.lineJoin = 'round'
  // Fainter toward the top, so the drawing fades up into the page.
  const fade = (y) => 0.3 + 0.7 * Math.min(1, y / L.base)

  c.lineWidth = 1
  c.setLineDash([2, 4])
  for (const [pi, ni] of L.anchors) {
    const p = L.peaks[pi]
    const n = L.nodes[ni]
    c.strokeStyle = rgba(BLUE, 0.3 * fade(n.y))
    c.beginPath(); c.moveTo(p, L.yAt(p)); c.lineTo(n.x, n.y); c.stroke()
  }
  c.setLineDash([])

  for (const [i, j] of L.edges) {
    const a = L.nodes[i]
    const b = L.nodes[j]
    c.strokeStyle = rgba(BLUE, 0.32 * fade((a.y + b.y) / 2))
    c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke()
  }

  c.strokeStyle = rgba(BLUE, 0.55)
  c.lineWidth = 1.3
  c.beginPath()
  for (let x = 0; x <= W; x++) c.lineTo(x, L.yAt(x))
  c.stroke()

  for (const n of L.nodes) glyph(c, n, rgba(GLOW, 0.55 * fade(n.y)))

  c.font = '10px "JetBrains Mono", ui-monospace, Menlo, monospace'
  for (const n of L.nodes) {
    if (!n.label) continue
    c.fillStyle = rgba(MUTED, 0.45 * fade(n.y))
    c.fillText(n.label, n.x + 13, n.y + 3.5)
  }
  c.restore()
}

const ease = (t) => t * t * (3 - 2 * t)

export default function Scene() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let W = 0
    let dpr = 1
    let L = null
    let layer = null
    let head = 0
    let signals = []
    let raf = 0
    let last = 0
    let visible = true

    const send = (ax, ay, to, hops, prev) => {
      if (signals.length > 60) return
      const n = L.nodes[to]
      signals.push({ ax, ay, to, hops, prev, t: 0, dur: Math.hypot(n.x - ax, n.y - ay) / 200 + 0.15 })
    }

    const arrive = (s) => {
      const n = L.nodes[s.to]
      n.glow = 1
      if (s.hops <= 0) return
      const next = n.links.filter((j) => j !== s.prev).sort(() => Math.random() - 0.5).slice(0, 2)
      for (const j of next) send(n.x, n.y, j, s.hops - 1, s.to)
    }

    const paint = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(layer, 0, 0)
      if (still) return
      ctx.setTransform(dpr, 0, 0, dpr, 0, dpr * L.oy)
      ctx.lineCap = 'round'

      // The monitor sweep: lit trace fading out behind the head.
      ctx.lineWidth = 1.6
      const from = Math.max(0, Math.floor(head - TRAIL))
      const to = Math.min(W, head)
      for (let x = from; x < to; x += 3) {
        const a = (x - (head - TRAIL)) / TRAIL
        ctx.strokeStyle = rgba(GLOW, a * a * 0.9)
        ctx.beginPath(); ctx.moveTo(x, L.yAt(x)); ctx.lineTo(Math.min(x + 3, to), L.yAt(Math.min(x + 3, to))); ctx.stroke()
      }
      if (head >= 0 && head <= W) {
        ctx.shadowColor = rgba(GLOW, 1)
        ctx.shadowBlur = 12
        ctx.fillStyle = rgba(GLOW, 1)
        ctx.beginPath(); ctx.arc(head, L.yAt(head), 2.2, 0, Math.PI * 2); ctx.fill()
      }

      for (const s of signals) {
        const n = L.nodes[s.to]
        const e = ease(Math.min(1, s.t))
        const e0 = ease(Math.max(0, s.t - 0.18))
        const x = s.ax + (n.x - s.ax) * e
        const y = s.ay + (n.y - s.ay) * e
        ctx.shadowBlur = 0
        ctx.strokeStyle = rgba(GLOW, 0.5)
        ctx.lineWidth = 1.4
        ctx.beginPath(); ctx.moveTo(s.ax + (n.x - s.ax) * e0, s.ay + (n.y - s.ay) * e0); ctx.lineTo(x, y); ctx.stroke()
        ctx.shadowBlur = 10
        ctx.fillStyle = rgba(GLOW, 1)
        ctx.beginPath(); ctx.arc(x, y, 1.8, 0, Math.PI * 2); ctx.fill()
      }

      for (const n of L.nodes) {
        if (n.glow < 0.02) continue
        ctx.shadowColor = rgba(GLOW, n.glow)
        ctx.shadowBlur = 14 * n.glow
        glyph(ctx, n, rgba(GLOW, 0.3 + 0.7 * n.glow))
        if (n.label) {
          ctx.shadowBlur = 0
          ctx.font = '10px "JetBrains Mono", ui-monospace, Menlo, monospace'
          ctx.fillStyle = rgba(GLOW, 0.8 * n.glow)
          ctx.fillText(n.label, n.x + 13, n.y + 3.5)
        }
      }
      ctx.shadowBlur = 0
    }

    const frame = (t) => {
      const dt = last ? Math.min((t - last) / 1000, 0.05) : 0
      last = t
      const prev = head
      head += SPEED * dt
      if (head > W + TRAIL) head = -40

      L.peaks.forEach((p, pi) => {
        if (prev < p && head >= p && L.anchors.has(pi)) send(p, L.yAt(p), L.anchors.get(pi), HOPS, -1)
      })
      for (const s of signals) s.t += dt / s.dur
      signals.filter((s) => s.t >= 1).forEach(arrive)
      signals = signals.filter((s) => s.t < 1)
      for (const n of L.nodes) n.glow *= Math.exp(-dt * 1.8)

      paint()
      raf = requestAnimationFrame(frame)
    }

    const start = () => {
      if (still || raf || !visible || !L) return
      last = 0
      raf = requestAnimationFrame(frame)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    const build = () => {
      const box = canvas.getBoundingClientRect()
      if (!box.width || !box.height) return
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = box.width
      canvas.width = Math.round(box.width * dpr)
      canvas.height = Math.round(box.height * dpr)
      // The network lives in the bottom band; the space above is for the peaks.
      const band = box.height / (1 + RISE)
      L = layout(box.width, band)
      L.H = box.height
      L.oy = box.height - band
      layer = document.createElement('canvas')
      layer.width = canvas.width
      layer.height = canvas.height
      const lc = layer.getContext('2d')
      lc.scale(dpr, dpr)
      drawStatic(lc, L, W)
      signals = []
      paint()
      start()
    }

    let pending = 0
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(pending)
      pending = requestAnimationFrame(build)
    })
    ro.observe(canvas)

    // Stop drawing while the band is scrolled out of view.
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      visible ? start() : stop()
    })
    io.observe(canvas)

    // Labels use a webfont; redraw once it has arrived.
    document.fonts?.ready.then(() => build())

    return () => {
      stop()
      cancelAnimationFrame(pending)
      ro.disconnect()
      io.disconnect()
    }
  }, [])

  return <canvas ref={ref} className="scene" aria-hidden="true" />
}

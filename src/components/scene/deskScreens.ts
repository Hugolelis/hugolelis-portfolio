// Canvas painters for the desk: the person-detector loop on the laptop, and the
// portrait / skyline / QR note props.
import { asciiPortraitDark } from '../../data/asciiPortrait'
import { qrMatrix } from '../../utils/qr'

type Ctx2D = CanvasRenderingContext2D

// ── person detector loop on the laptop ───────────────────────────────────

export const DETECTOR_W = 600
export const DETECTOR_H = 380

export function createDetector() {
  const people = [
    { a: 0.3, w: 0.55, ph: 0, y: 0.64, s: 1.0 },
    { a: 0.26, w: 0.37, ph: 2, y: 0.74, s: 1.3 },
    { a: 0.3, w: 0.29, ph: 4, y: 0.58, s: 0.8 },
  ]
  const LIMIT = 2
  let t = 0, above = 0, below = 0, alert = false, clips = 0

  return (c: Ctx2D, dt: number) => {
    const W = DETECTOR_W, H = DETECTOR_H
    t += dt
    const zone = { x: W * 0.36, y: H * 0.3, w: W * 0.34, h: H * 0.62 }
    const pos = people.map(p => ({ ...p, px: W * (0.5 + p.a * Math.sin(p.w * t + p.ph)) }))
    const inZone = pos.filter(p => p.px > zone.x && p.px < zone.x + zone.w).length

    // debounce: start after 8 frames over the limit, end after 6 below
    if (inZone >= LIMIT) { above++; below = 0 } else { below++; above = 0 }
    if (!alert && above >= 8) { alert = true; clips++ }
    if (alert && below >= 6) alert = false

    const g = c.createLinearGradient(0, 0, 0, H)
    g.addColorStop(0, '#1f2937')
    g.addColorStop(1, '#0b1220')
    c.fillStyle = g
    c.fillRect(0, 0, W, H)
    c.fillStyle = '#111c2e'
    c.fillRect(0, H * 0.5, W, H * 0.5)

    c.setLineDash([10, 7])
    c.lineWidth = 3
    c.strokeStyle = alert ? '#f87171' : '#f59e0b'
    c.fillStyle = alert ? 'rgba(248,113,113,0.14)' : 'rgba(245,158,11,0.08)'
    c.fillRect(zone.x, zone.y, zone.w, zone.h)
    c.strokeRect(zone.x, zone.y, zone.w, zone.h)
    c.setLineDash([])

    const closest = pos.reduce((a, b) => (b.y > a.y ? b : a))
    c.font = '15px monospace'
    ;[...pos].sort((a, b) => a.y - b.y).forEach((p, i) => {
      const bh = 150 * p.s * (0.7 + p.y * 0.6), bw = bh * 0.38
      const x = p.px - bw / 2, y = p.y * H - bh * 0.55
      c.fillStyle = '#374151'
      c.beginPath()
      c.roundRect(x + bw * 0.1, y + bh * 0.22, bw * 0.8, bh * 0.78, 8)
      c.fill()
      c.beginPath()
      c.arc(p.px, y + bh * 0.13, bw * 0.28, 0, Math.PI * 2)
      c.fill()
      const hot = p === closest
      c.lineWidth = 2
      c.strokeStyle = hot ? '#f472b6' : '#4ade80'
      c.strokeRect(x, y, bw, bh)
      c.fillStyle = hot ? '#f472b6' : '#4ade80'
      c.fillText(hot ? 'closest 0.94' : `person 0.${86 + i}`, x, y - 6)
    })

    c.font = 'bold 17px monospace'
    c.fillStyle = '#e6edf3'
    c.fillText(`ZONE ${inZone}/${LIMIT}`, 14, 26)
    c.fillStyle = alert ? '#f87171' : '#6b7280'
    c.fillText(alert ? `ALERT  ● REC  clips: ${clips}` : `clips: ${clips}`, 14, 48)
    c.fillStyle = '#1f2937'
    c.fillRect(14, H - 36, 220, 10)
    c.fillStyle = alert ? '#f87171' : '#f59e0b'
    c.fillRect(14, H - 36, 220 * Math.min(1, alert ? 1 - below / 6 : above / 8), 10)
    c.font = '14px monospace'
    c.fillStyle = '#6b7280'
    c.fillText('debounce', 14, H - 42)
    c.textAlign = 'right'
    c.fillText('14.8 fps · CPU only', W - 12, H - 14)
    c.textAlign = 'left'
  }
}

// ── static props ─────────────────────────────────────────────────────────

/** the ASCII portrait from the About section, framed */
export function paintPortrait(c: Ctx2D, w: number, h: number) {
  c.fillStyle = '#14110f'
  c.fillRect(0, 0, w, h)
  const rows = asciiPortraitDark.split('\n').filter(r => r.length > 0)
  const cols = Math.max(...rows.map(r => r.length))
  const fs = w / (cols * 0.6)
  c.font = `${fs}px monospace`
  c.fillStyle = '#d8d0c0'
  rows.forEach((r, i) => c.fillText(r, 0, (i + 1) * fs))
}

const LEETCODE_PY = [
  '# two_sum.py · leetcodes-study',
  'def two_sum(nums: list[int], target: int):',
  '    seen = {}',
  '    for i, n in enumerate(nums):',
  '        if target - n in seen:',
  '            return [seen[target - n], i]',
  '        seen[n] = i',
  '    return []',
]

/** framed code, syntax-colored: a LeetCode-style solution (the frame links to the leetcodes-study repo) */
export function paintCodeFrame(c: Ctx2D, w: number, h: number) {
  c.fillStyle = '#0d1117'
  c.fillRect(0, 0, w, h)
  c.fillStyle = '#161b22'
  c.fillRect(0, 0, w, 46)
  ;['#ff5f56', '#ffbd2e', '#27c93f'].forEach((col, i) => {
    c.fillStyle = col
    c.beginPath()
    c.arc(26 + i * 28, 23, 7, 0, Math.PI * 2)
    c.fill()
  })
  c.font = '24px monospace'
  const cw = c.measureText('M').width
  const KEYWORD = /^(class|def|for|in|if|else|not|and|return|True|False)$/
  const TYPE = /^(int|bool|list)$/
  LEETCODE_PY.forEach((line, i) => {
    let x = 24
    const y = 92 + i * 36
    if (line.startsWith('#')) {
      c.fillStyle = '#8b949e'
      c.fillText(line, x, y)
      return
    }
    for (const tok of line.split(/(#.*|\s+|[A-Za-z_]\w*|\d+)/).filter(Boolean)) {
      c.fillStyle = tok.startsWith('#') ? '#8b949e'
        : KEYWORD.test(tok) ? '#ff7b72'
        : TYPE.test(tok) || /^\d+$/.test(tok) ? '#79c0ff'
        : tok === 'self' ? '#d2a8ff'
        : tok === 'two_sum' || tok === 'enumerate' ? '#ffa657'
        : '#e6edf3'
      c.fillText(tok, x, y)
      x += tok.length * cw
    }
  })
}

/** yellow sticky note with a QR code that really encodes `url` */
export function paintQrNote(c: Ctx2D, w: number, h: number, url: string, caption: string) {
  c.fillStyle = '#fde68a'
  c.fillRect(0, 0, w, h)
  const m = qrMatrix(url)
  const side = w * 0.78
  const px = Math.floor((side * 0.9) / m.length)
  const qw = px * m.length
  c.fillStyle = '#fff'
  c.fillRect((w - side) / 2, h * 0.07, side, side)
  c.fillStyle = '#000'
  const ox = (w - qw) / 2, oy = h * 0.07 + (side - qw) / 2
  m.forEach((row, y) => row.forEach((on, x) => { if (on) c.fillRect(ox + x * px, oy + y * px, px, px) }))
  c.fillStyle = '#78350f'
  c.font = `bold ${w * 0.075}px monospace`
  c.textAlign = 'center'
  c.fillText(caption, w / 2, h * 0.07 + side + h * 0.1)
  c.textAlign = 'left'
}

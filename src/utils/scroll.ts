// Eased, interruptible scroll to a section. The browser's own anchor/`scroll-behavior`
// scrolling is linear-ish and janky on long pages, so the page is moved by hand:
// ease-in-out, duration scaled with distance, re-aimed every frame (layout can shift
// while it travels) and cancelled the moment the visitor grabs the wheel or a key.
let raf = 0

export function smoothScrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return false
  cancelAnimationFrame(raf)

  const aim = () => Math.max(0, el.getBoundingClientRect().top + window.scrollY - (parseFloat(getComputedStyle(el).scrollMarginTop) || 0))
  const start = window.scrollY
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.scrollTo({ top: aim(), behavior: 'instant' })
    return true
  }

  const distance = Math.abs(aim() - start)
  if (distance < 2) return true
  const duration = Math.min(1200, 450 + distance * 0.22)
  const t0 = performance.now()

  const stop = () => {
    cancelAnimationFrame(raf)
    window.removeEventListener('wheel', stop)
    window.removeEventListener('touchstart', stop)
    window.removeEventListener('keydown', stop)
  }
  window.addEventListener('wheel', stop, { passive: true, once: true })
  window.addEventListener('touchstart', stop, { passive: true, once: true })
  window.addEventListener('keydown', stop, { once: true })

  const step = (now: number) => {
    const p = Math.min(1, (now - t0) / duration)
    const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2
    // 'instant' so the html { scroll-behavior: smooth } rule doesn't smooth every frame again
    window.scrollTo({ top: start + (aim() - start) * eased, behavior: 'instant' })
    if (p < 1) raf = requestAnimationFrame(step)
    else stop()
  }
  raf = requestAnimationFrame(step)
  return true
}

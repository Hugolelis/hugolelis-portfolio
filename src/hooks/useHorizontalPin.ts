import { useEffect, useRef, useState } from 'react'

interface PinState {
  progress: number
  offset: number
  active: boolean
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

// >1 stretches the scroll distance beyond what the horizontal travel alone
// needs, so each pixel of horizontal movement takes more vertical scroll —
// a slower, more deliberate reveal instead of rushing through it.
const SCROLL_EASE = 1.6

// Converts vertical scroll into horizontal movement. The section is grown
// tall enough to hold the scroll distance the track needs; CSS `position:
// sticky` on the track's wrapper (see Timeline.module.css) does the actual
// pinning and — crucially — the release back to normal scroll once the
// section's bottom passes, natively and unconditionally. This hook only
// has to compute how far across that range the scroll currently is, and
// turn that into a horizontal offset.
export function useHorizontalPin<TSection extends HTMLElement, TTrack extends HTMLElement>(enabled = true) {
  const sectionRef = useRef<TSection>(null)
  const trackRef = useRef<TTrack>(null)
  const [state, setState] = useState<PinState>({ progress: 0, offset: 0, active: false })

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    if (!enabled) {
      section.style.height = ''
      return
    }

    let maxTranslate = 0
    let ticking = false

    const update = () => {
      ticking = false
      if (maxTranslate <= 0) {
        setState((prev) => (prev.active ? { progress: 0, offset: 0, active: false } : prev))
        return
      }

      const viewportH = window.innerHeight
      const rect = section.getBoundingClientRect()
      const scrollRange = rect.height - viewportH
      const progress = scrollRange > 0 ? clamp(-rect.top / scrollRange, 0, 1) : 0

      setState({ progress, offset: progress * maxTranslate, active: true })
    }

    const measure = () => {
      // Width available to the track: the section's own box. Reading this
      // off .trackArea (a flex child sized by shrinking around a grid with
      // width:max-content) resolved inconsistently in Firefox at narrower
      // widths — sometimes reporting the track's full content width back,
      // which zeroed maxTranslate and silently disabled the whole pin.
      // The section itself is a plain block box, not involved in any of
      // that flex/grid sizing, so its width is unambiguous everywhere.
      const availableW = section.clientWidth
      const viewportH = window.innerHeight
      maxTranslate = Math.max(0, track.scrollWidth - availableW)
      section.style.height = maxTranslate > 0 ? `${viewportH + maxTranslate * SCROLL_EASE}px` : ''
      update()
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }

    measure()
    // Web fonts can still be swapping in at mount time, which shifts text
    // (and therefore track) width — remeasure once they've settled.
    document.fonts?.ready.then(measure)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
      section.style.height = ''
    }
  }, [enabled])

  return { sectionRef, trackRef, ...(enabled ? state : { progress: 0, offset: 0, active: false }) }
}

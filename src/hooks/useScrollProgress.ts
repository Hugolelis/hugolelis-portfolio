import { useCallback, useEffect, useState } from 'react'

// 0 when the element's top is just entering the bottom of the viewport,
// 1 once its bottom has scrolled past the top — a smooth read of "how far
// through this element has the page scrolled", for scroll-linked fills
// on elements that aren't pinned (see useHorizontalPin for the pinned case).
export function useScrollProgress<T extends HTMLElement>() {
  // a callback ref (not a plain useRef) so the effect below re-attaches
  // if the node mounts after this hook's first run — e.g. a conditionally
  // rendered element that isn't there yet on first paint
  const [node, setNode] = useState<T | null>(null)
  const ref = useCallback((el: T | null) => setNode(el), [])
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!node) return

    let ticking = false
    const update = () => {
      ticking = false
      const rect = node.getBoundingClientRect()
      const viewportH = window.innerHeight
      const total = viewportH + rect.height
      const traveled = viewportH - rect.top
      setProgress(Math.min(1, Math.max(0, total > 0 ? traveled / total : 0)))
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', update)
    }
  }, [node])

  return { ref, progress }
}

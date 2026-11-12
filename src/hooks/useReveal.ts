import { useState, useEffect, useRef } from 'react'

// repeat: hide again when it leaves the viewport, so it animates in on every pass (scrolling up too)
export function useReveal<T extends HTMLElement>(threshold = 0.15, repeat = false) {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (!repeat) observer.disconnect()
        } else if (repeat) {
          setVisible(false)
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, repeat])

  return { ref, visible }
}

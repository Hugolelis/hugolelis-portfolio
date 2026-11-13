import { useEffect, useRef, useState } from 'react'

// true enquanto o elemento está na tela (volta a false ao sair, então a animação repete a cada passagem)
export function useInView<T extends HTMLElement>(threshold = 0.08) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  return { ref, inView }
}

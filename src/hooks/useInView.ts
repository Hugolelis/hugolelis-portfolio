import { useEffect, useRef, useState } from 'react'

// true enquanto o elemento está na tela (volta a false ao sair, então a animação repete a cada passagem).
// No celular (≤768px) toca só na primeira vez: repetir a cada rolagem faz o layout pular.
export function useInView<T extends HTMLElement>(threshold = 0.08) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const once = window.matchMedia('(max-width:768px)').matches
    const io = new IntersectionObserver(([e]) => {
      setInView(e.isIntersecting)
      if (once && e.isIntersecting) io.disconnect()
    }, { threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  return { ref, inView }
}

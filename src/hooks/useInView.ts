import { useEffect, useRef, useState } from 'react'

// celular e tablet pequeno (≤768px): sem animações de entrada, o conteúdo já nasce visível
export const isMobile = () => window.matchMedia('(max-width:768px)').matches

// true enquanto o elemento está na tela (volta a false ao sair, então a animação repete a cada passagem).
// No celular fica sempre true: animar ao rolar faz o layout pular.
export function useInView<T extends HTMLElement>(threshold = 0.08) {
  const ref = useRef<T>(null)
  const [mobile] = useState(isMobile)
  const [inView, setInView] = useState(mobile)

  useEffect(() => {
    const el = ref.current
    if (!el || mobile) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [threshold, mobile])

  return { ref, inView }
}

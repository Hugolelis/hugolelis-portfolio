import type { CSSProperties, ReactNode } from 'react'
import { useInView } from '../hooks/useInView'

// anima ao entrar na tela e de novo a cada passagem, como no site anterior
export function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const { ref, inView } = useInView<HTMLDivElement>()
  return (
    <div ref={ref} className={`reveal${inView ? ' in' : ''}`} style={{ '--d': `${delay}s` } as CSSProperties}>
      {children}
    </div>
  )
}

import { type ReactNode } from 'react'
import { useReveal } from '../../hooks/useReveal'

interface Props {
  children: ReactNode
  delay?: number
  className?: string
  repeat?: boolean
}

export function Reveal({ children, delay = 0, className, repeat }: Props) {
  const { ref, visible } = useReveal<HTMLDivElement>(0.08, repeat)

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(20px)',
        transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

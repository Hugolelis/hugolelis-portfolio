import type { ReactNode } from 'react'

export function Expandable({ expanded, children }: { expanded: boolean; children: ReactNode }) {
  return (
    <div className={`wrap${expanded ? ' expanded' : ''}`} inert={!expanded}>
      <div className="inner">{children}</div>
    </div>
  )
}

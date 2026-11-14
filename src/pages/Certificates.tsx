import { useState } from 'react'
import { Reveal } from '../components/Reveal'
import { Expandable } from '../components/Expandable'
import { PdfModal } from '../components/PdfModal'
import { useApp } from '../context/AppContext'
import { certificates } from '../data'
import type { Certificate } from '../types'

const INITIAL = 6 // 2 linhas de 3; o que passar disso fica atrás de "Ver mais"
const preview = (c: Certificate) => c.file.replace('/courses/', '/courses/previews/').replace('.pdf', '.webp')

export function Certificates() {
  const { t } = useApp()
  const [selected, setSelected] = useState<Certificate | null>(null)
  const [expanded, setExpanded] = useState(false)
  const remaining = certificates.length - INITIAL

  return (
    <div className="page">
      <main>
        <div className="head">
          <span className="eyebrow">{t.cCount.replace('{n}', String(certificates.length))}</span>
          <h2 className="title">{t.certs}</h2>
          <p className="summary">{t.cSummary}</p>
        </div>
        <div className="gallery certs">
          {certificates.map((c, i) => {
            const card = (
              <Reveal delay={(i % 3) * 0.12}>
                <button className="card" onClick={() => setSelected(c)}>
                  <span className="media"><img src={preview(c)} alt="" loading="lazy" /></span>
                  <span className="meta">
                    <span className="name">{c.name}</span>
                    <span className="year">{c.year}</span>
                  </span>
                  <span className="issuer">{c.issuer}</span>
                </button>
              </Reveal>
            )
            return i < INITIAL
              ? <div key={c.file}>{card}</div>
              : <Expandable key={c.file} expanded={expanded}>{card}</Expandable>
          })}
        </div>
        {remaining > 0 && (
          <div className="showmore">
            <button className="btn ghost" onClick={() => setExpanded(e => !e)}>
              {expanded ? t.less : t.more.replace('{n}', String(remaining))}
            </button>
          </div>
        )}
      </main>
      {selected && (
        <PdfModal name={selected.name} issuer={`${selected.issuer} · ${selected.year}`} file={selected.file} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}

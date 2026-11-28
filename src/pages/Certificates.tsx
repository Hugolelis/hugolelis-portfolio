import { useState } from 'react'
import { Link } from '../components/Link'
import { Reveal } from '../components/Reveal'
import { Expandable } from '../components/Expandable'
import { PdfModal } from '../components/PdfModal'
import { useApp } from '../context/AppContext'
import { certificates } from '../data'
import type { Certificate } from '../types'

const INITIAL = 6 // 2 linhas de 3; o que passar disso fica atrás de "Ver mais"

export function Certificates({ compact = false }: { compact?: boolean }) {
  const { t } = useApp()
  const [selected, setSelected] = useState<Certificate | null>(null)
  const [expanded, setExpanded] = useState(false)
  const remaining = certificates.length - INITIAL
  const list = compact ? certificates.slice(0, 4) : certificates

  return (
    <div className="page">
      <section>
        <Reveal>
          <div className="head">
            <span className="eyebrow">{t.certs} · {certificates.length}</span>
            {!compact && <h1 className="title">{t.cTitle}</h1>}
          </div>
        </Reveal>
        <div className={compact ? 'gallery certs two' : 'gallery certs'}>
          {list.map((c, i) => {
            const card = (
              <Reveal delay={(i % (compact ? 2 : 3)) * 0.12}>
                <button className="card cert" onClick={() => setSelected(c)}>
                  <span className="cert-top"><span>{c.issuer}</span><span>{c.year}</span></span>
                  <span className="cert-name">{c.name}</span>
                  <span className="cert-open">{t.openPdf}</span>
                </button>
              </Reveal>
            )
            return i < INITIAL
              ? <div key={c.file}>{card}</div>
              : <Expandable key={c.file} expanded={expanded}>{card}</Expandable>
          })}
        </div>
        {compact ? (
          <Reveal>
            <div className="showmore">
              <Link to="/certificados" className="viewall">{t.viewAll} <span aria-hidden="true">→</span></Link>
            </div>
          </Reveal>
        ) : remaining > 0 && (
          <div className="showmore">
            <button className="btn ghost" onClick={() => setExpanded(e => !e)}>
              {expanded ? t.less : t.more.replace('{n}', String(remaining))}
            </button>
          </div>
        )}
      </section>
      {selected && (
        <PdfModal name={selected.name} issuer={`${selected.issuer} · ${selected.year}`} file={selected.file} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}

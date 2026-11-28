import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { timeline } from '../data'
import { Expandable } from './Expandable'
import type { TimelineEntry } from '../types'

// os dados vêm do mais novo para o mais antigo; a lista lê de cima para baixo como trajetória
const ordered = [...timeline].reverse()

// linhas separadas por fios, como a lista de links da home: período na coluna da esquerda, texto na da direita.
// "Ver detalhes" abre o que fez, em mais profundidade, e as tecnologias usadas (só nas entradas que têm isso)
function Item({ entry }: { entry: TimelineEntry }) {
  const { t, lang } = useApp()
  const [open, setOpen] = useState(false)
  const details = entry.details?.[lang] ?? []
  const skills = entry.skills ?? []
  return (
    <div className="tl-item">
      <span className={`tl-period${entry.current ? ' current' : ''}`}>
        {entry.period[lang]}
        {entry.current && <b>{t.tlPresent}</b>}
      </span>
      <div className="tl-text">
        <h3 className="tl-org">{entry.org[lang]}</h3>
        <span className="tl-role">{entry.role[lang]}</span>
        <ul className="tl-desc">{entry.description[lang].map(l => <li key={l}>{l}</li>)}</ul>
        {details.length > 0 && (
          <>
            <Expandable expanded={open}>
              <ul className="tl-more">{details.map(l => <li key={l}>{l}</li>)}</ul>
              {skills.length > 0 && (
                <ul className="tl-skills">{skills.map(s => <li key={s} className="chip">{s}</li>)}</ul>
              )}
            </Expandable>
            <button type="button" className="tl-toggle" aria-expanded={open} onClick={() => setOpen(o => !o)}>
              {open ? t.tlLess : t.tlMore} <span aria-hidden="true">{open ? '↑' : '↓'}</span>
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export function Timeline() {
  const { t } = useApp()
  return (
    <section className="tl">
      <h2 className="label"><span>{t.tlTitle}</span><span className="n">{ordered.length}</span></h2>
      <div className="tl-list">
        {ordered.map(e => <Item key={e.id} entry={e} />)}
      </div>
    </section>
  )
}

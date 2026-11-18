import { useApp } from '../context/AppContext'
import { timeline } from '../data'
import type { TimelineEntry } from '../types'

// os dados vêm do mais novo para o mais antigo; a lista lê de cima para baixo como trajetória
const ordered = [...timeline].reverse()

// linhas separadas por fios, como a lista de links da home: período na coluna da esquerda, texto na da direita
function Item({ entry }: { entry: TimelineEntry }) {
  const { t, lang } = useApp()
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

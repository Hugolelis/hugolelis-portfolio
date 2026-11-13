import { useApp } from '../context/AppContext'
import { timeline } from '../data'
import { BriefcaseIcon, GraduationCapIcon, TrophyIcon } from './icons'
import type { TimelineCategory, TimelineEntry } from '../types'

// os dados vêm do mais novo para o mais antigo; a lista lê de cima para baixo como trajetória
const ordered = [...timeline].reverse()
const icons: Record<TimelineCategory, typeof BriefcaseIcon> = { work: BriefcaseIcon, education: GraduationCapIcon, competition: TrophyIcon }

function Item({ entry }: { entry: TimelineEntry }) {
  const { t, lang } = useApp()
  const Icon = icons[entry.category]
  return (
    <div className="tl-item">
      <span className={`tl-dot${entry.current ? ' current' : ''}`}>
        <Icon size={13} />
      </span>
      <div className="tl-text">
        <span className="tl-period">{entry.period[lang]}</span>
        <h3 className="tl-org">{entry.org[lang]}</h3>
        <span className="tl-role">{entry.role[lang]}</span>
        <ul className="tl-desc">{entry.description[lang].map(l => <li key={l}>{l}</li>)}</ul>
        <span className={`tl-status${entry.current ? ' current' : ''}`}>{entry.current ? t.tlPresent : t.tlEnded}</span>
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

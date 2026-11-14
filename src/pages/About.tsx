import { Timeline } from '../components/Timeline'
import { Top } from '../components/Top'
import { useApp } from '../context/AppContext'
import { interests } from '../i18n'

export function About() {
  const { t, lang } = useApp()
  const list = interests[lang]
  return (
    <div className="page">
      <Top cross={{ to: '/projetos', label: t.projects }} />
      <main className="narrow about">
        <div className="head">
          <span className="eyebrow">Hugo Lelis</span>
          <h2 className="title">{t.about}</h2>
        </div>
        <p className="about-text">{t.aboutText}</p>
        <section className="tl">
          <h2 className="label"><span>{t.interestsLabel}</span><span className="n">{list.length}</span></h2>
          <ul className="chips">
            {list.map(i => <li key={i} className="chip">{i}</li>)}
          </ul>
        </section>
        <Timeline />
      </main>
    </div>
  )
}

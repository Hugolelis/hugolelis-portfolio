import { Timeline } from '../components/Timeline'
import { stack } from '../data'
import { useApp } from '../context/AppContext'
import { interests } from '../i18n'

export function About() {
  const { t, lang } = useApp()
  const list = interests[lang]
  const techs = [...stack.languages, ...stack.databases, ...stack.infra]
  return (
    <div className="page">
      <section className="narrow about">
        <div className="head">
          <span className="eyebrow">{t.about}</span>
          <h1 className="title">{t.aboutTitle}</h1>
        </div>
        <div className="about-bio">
          <img className="avatar" src="/avatar.jpg" alt="Hugo Lelis" />
          <p className="about-text">{t.aboutText}</p>
        </div>
        <section className="tl">
          <h2 className="label"><span>{t.interestsLabel}</span><span className="n">{list.length}</span></h2>
          <ul className="chips">
            {list.map(i => <li key={i} className="chip">{i}</li>)}
          </ul>
        </section>
        <section className="tl">
          <h2 className="label"><span>{t.stackLabel}</span><span className="n">{techs.length}</span></h2>
          <ul className="chips">
            {techs.map(x => <li key={x} className="chip">{x}</li>)}
          </ul>
        </section>
        <Timeline />
      </section>
    </div>
  )
}

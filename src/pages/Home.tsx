import { stack } from '../data'
import { Link } from '../components/Link'
import { useApp } from '../context/AppContext'

const techs = [...stack.languages, ...stack.databases, ...stack.infra]

export function Home() {
  const { t } = useApp()
  return (
    <main className="home">
      <div className="who">
        <img className="avatar" src="/avatar.jpg" alt="Hugo Lelis" />
        <div>
          <b>Hugo Lelis</b>
          <span>{t.role}</span>
        </div>
      </div>
      <h1><span className="l">{t.h1a}</span><span className="l l2">{t.h1b}</span></h1>
      <p className="sub">{t.sub}</p>
      <ul className="chips">
        {techs.map(x => <li key={x} className="chip">{x}</li>)}
      </ul>
      <div className="btns">
        <Link to="/projetos" className="btn primary">{t.projects}</Link>
        <Link to="/certificados" className="btn">{t.certs}</Link>
        <Link to="/sobre" className="btn green">{t.about}</Link>
      </div>
    </main>
  )
}

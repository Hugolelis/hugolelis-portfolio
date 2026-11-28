import { useApp } from '../context/AppContext'
import { GithubIcon, LinkedinIcon, MailIcon } from './icons'
import { Link } from './Link'

export function Footer() {
  const { t } = useApp()
  const pages = [
    { to: '/', name: t.home },
    { to: '/projetos', name: t.projects },
    { to: '/certificados', name: t.certs },
    { to: '/sobre', name: t.about },
  ]
  return (
    <footer className="wrapw">
      <div className="f-main">
        <div className="f-brand">
          <b>hugolelis.</b>
          <span>{t.role}</span>
        </div>
        <nav className="f-nav" aria-label="Footer">
          {pages.map(p => <Link key={p.to} to={p.to}>{p.name}</Link>)}
        </nav>
        <nav className="social">
          <a href="https://github.com/Hugolelis" target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub"><GithubIcon /></a>
          <a href="https://www.linkedin.com/in/hugolelis/" target="_blank" rel="noreferrer" aria-label="LinkedIn" title="LinkedIn"><LinkedinIcon /></a>
          <a href="mailto:hugodelelis05@gmail.com" aria-label={t.mail} title={t.mail}><MailIcon /></a>
        </nav>
      </div>
      <div className="f-base">
        <span>© {new Date().getFullYear()} Hugo Lelis</span>
        <span>{t.built}</span>
      </div>
    </footer>
  )
}

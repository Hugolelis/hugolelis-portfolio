import { useApp } from '../context/AppContext'
import { GithubIcon, LinkedinIcon, MailIcon } from './icons'

export function Footer() {
  const { t } = useApp()
  return (
    <footer className="wrapw">
      <b>hugolelis.</b>
      <nav className="social">
        <a href="https://github.com/Hugolelis" target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub"><GithubIcon /></a>
        <a href="https://www.linkedin.com/in/hugolelis/" target="_blank" rel="noreferrer" aria-label="LinkedIn" title="LinkedIn"><LinkedinIcon /></a>
        <a href="mailto:hugodelelis05@gmail.com" aria-label={t.mail} title={t.mail}><MailIcon /></a>
      </nav>
      <span className="year">© {new Date().getFullYear()}</span>
    </footer>
  )
}

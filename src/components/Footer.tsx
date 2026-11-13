import { useApp } from '../context/AppContext'

export function Footer() {
  const { t } = useApp()
  return (
    <footer className="wrapw">
      <b>hugolelis.</b>
      <span>{t.foot}</span>
      <span className="right">
        <a href="https://github.com/Hugolelis" target="_blank" rel="noreferrer">GitHub ↗</a>
        <span>© {new Date().getFullYear()}</span>
      </span>
    </footer>
  )
}

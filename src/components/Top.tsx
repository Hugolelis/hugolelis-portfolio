import { useState } from 'react'
import { ContactModal } from './ContactModal'
import { useApp } from '../context/AppContext'
import { Link } from './Link'
import { ChatIcon, Logo } from './icons'

// topo fixo: logo à esquerda; atalho para a outra página, contato, idioma e tema à direita
export function Top({ cross }: { cross?: { to: string; label: string } }) {
  const { lang, theme, t, toggleLang, toggleTheme } = useApp()
  const [contactOpen, setContactOpen] = useState(false)
  return (
    <>
    <header className="top">
      <Link to="/" className="logo" aria-label="Hugo Lelis"><Logo /></Link>
      <div className="right">
        {cross && <Link to={cross.to}>{cross.label} ↓</Link>}
        <div className="tools">
          <button className="contact" onClick={() => setContactOpen(true)} title={t.contact} aria-label={t.contact}>
            <span className="lbl">{t.contact}</span>
            <ChatIcon />
          </button>
          <button onClick={toggleLang} title={t.langTitle}>{lang === 'pt' ? 'EN' : 'PT'}</button>
          <button onClick={toggleTheme} title={t.themeTitle}>{theme === 'dark' ? '☀' : '☾'}</button>
        </div>
      </div>
    </header>
    {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
    </>
  )
}

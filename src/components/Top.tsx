import { useEffect, useRef, useState } from 'react'
import { ContactModal } from './ContactModal'
import { useApp } from '../context/AppContext'
import { Link } from './Link'
import { ChatIcon, Logo, MenuIcon } from './icons'
import { usePath } from '../router'

const items = [
  { to: '/', key: 'home' },
  { to: '/projetos', key: 'projects' },
  { to: '/certificados', key: 'certs' },
  { to: '/sobre', key: 'about' },
] as const

// topo fixo: logo à esquerda; contato, idioma, tema e o menu (as 4 seções) à direita
export function Top() {
  const { lang, theme, t, toggleLang, toggleTheme } = useApp()
  const path = usePath().replace(/\/$/, '') || '/'
  const [contactOpen, setContactOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // fecha o menu ao clicar fora ou com Esc
  useEffect(() => {
    if (!menuOpen) return
    const down = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false)
    }
    const key = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    document.addEventListener('pointerdown', down)
    document.addEventListener('keydown', key)
    return () => {
      document.removeEventListener('pointerdown', down)
      document.removeEventListener('keydown', key)
    }
  }, [menuOpen])

  const isActive = (to: string) => path === to || (to === '/projetos' && path.startsWith('/projetos/'))

  return (
    <>
      <header className="top">
        <Link to="/" className="logo" aria-label="Hugo Lelis"><Logo /></Link>
        <div className="tools">
          <button className="contact" onClick={() => setContactOpen(true)} title={t.contact} aria-label={t.contact}>
            <ChatIcon />
            <span className="lbl">{t.contact}</span>
          </button>
          <button onClick={toggleLang} title={t.langTitle}>{lang === 'pt' ? 'EN' : 'PT'}</button>
          <button onClick={toggleTheme} title={t.themeTitle}>{theme === 'dark' ? '☀' : '☾'}</button>
          <div className="menuwrap" ref={menuRef}>
            <button onClick={() => setMenuOpen(o => !o)} aria-expanded={menuOpen} aria-label={t.menu} title={t.menu}>
              <MenuIcon open={menuOpen} />
            </button>
            {menuOpen && (
              <nav className="menu" aria-label={t.menu}>
                {items.map(i => (
                  <Link key={i.to} to={i.to} className={isActive(i.to) ? 'on' : undefined} onClick={() => setMenuOpen(false)}>
                    {t[i.key]}
                  </Link>
                ))}
              </nav>
            )}
          </div>
        </div>
      </header>
      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
    </>
  )
}

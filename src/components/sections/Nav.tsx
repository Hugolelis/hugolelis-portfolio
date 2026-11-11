import { Activity, useCallback, useEffect, useRef, useState } from 'react'
import { useApp } from '../../context/AppContext'
import { useActiveSection } from '../../hooks/useActiveSection'
import { useScrollY } from '../../hooks/useScrollY'
import { isEmbed, sectionHref, useDeskMode } from '../../hooks/useDeskMode'
import { useDialog } from '../../hooks/useDialog'
import { ScrollProgress } from '../ui/ScrollProgress'
import styles from './Nav.module.css'

const EMAIL = 'hugodelelis05@gmail.com'
const SECTION_IDS = ['hero', 'stack', 'sobre', 'projetos', 'timeline', 'certificados'] as const

export function Nav() {
  const { t, theme, toggleTheme, lang, toggleLang } = useApp()
  const scrollY = useScrollY()
  const [contactOpen, setContactOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)
  const closeContact = useCallback(() => setContactOpen(false), [])
  useDialog(contactRef, closeContact, contactOpen)
  const [copied, setCopied] = useState(false)

  const copyEmail = () => {
    navigator.clipboard?.writeText(EMAIL).then(() => {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    })
  }
  const currentPath = window.location.pathname
  const onSubPage = currentPath !== '/'
  const isHomeRoute = !onSubPage
  const deskMode = useDeskMode()
  const href = (id: string) => sectionHref(id, deskMode, onSubPage)
  // desk mode: every link is a section of /portfolio (scroll-spy there); the logo goes back to the room
  const onPortfolio = currentPath === '/portfolio'
  const activeSection = useActiveSection(SECTION_IDS, deskMode ? onPortfolio : isHomeRoute)
  const linkActive = (id: string) => {
    const on = deskMode
      ? (onPortfolio && activeSection === id)
      : isHomeRoute && activeSection === id
    return on ? styles.active : undefined
  }

  const closeMenu = () => setMenuOpen(false)

  // lets the 3D room zoom back out once the contact modal is dismissed
  const wasContactOpen = useRef(false)
  useEffect(() => {
    if (wasContactOpen.current && !contactOpen) window.dispatchEvent(new Event('contact-closed'))
    wasContactOpen.current = contactOpen
  }, [contactOpen])

  useEffect(() => {
    const open = () => setContactOpen(true)
    window.addEventListener('open-contact', open)
    return () => window.removeEventListener('open-contact', open)
  }, [])

  useEffect(() => {
    if (!contactOpen && !menuOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setContactOpen(false)
        setMenuOpen(false)
      }
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node

      if (menuOpen && !navRef.current?.contains(target) && !mobileMenuRef.current?.contains(target)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('pointerdown', handlePointerDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [contactOpen, menuOpen])

  return (
    <>
      <a href="#main-content" className={styles.skipLink}>
        {lang === 'pt' ? 'Pular para o conteúdo' : 'Skip to content'}
      </a>

      <Activity mode={!onSubPage || onPortfolio ? "visible" : "hidden"}>
          <ScrollProgress />
      </Activity>

      <nav
        ref={navRef}
        className={`${styles.nav} ${scrollY > 40 || onSubPage ? styles.scrolled : ''}`}
        aria-label={lang === 'pt' ? 'Navegação principal' : 'Main navigation'}
      >
        <a href={isEmbed ? '#hero' : deskMode || onSubPage ? '/' : '#hero'} className={styles.logo} aria-label={lang === 'pt' ? 'Voltar ao início' : 'Back to home'}>
          <svg viewBox="0 0 32 32" width="26" height="26" fill="none" style={{ display: 'block', color: 'var(--accent)' }}>
            <rect x="6" y="7" width="5" height="18" rx="1" fill="currentColor" opacity="0.15" />
            <rect x="21" y="7" width="5" height="18" rx="1" fill="currentColor" opacity="0.15" />
            <rect x="6" y="13" width="20" height="6" rx="1" fill="currentColor" />
            <rect x="6" y="7" width="5" height="6" rx="1" fill="currentColor" opacity="0.35" />
            <rect x="6" y="19" width="5" height="6" rx="1" fill="currentColor" opacity="0.35" />
            <rect x="21" y="7" width="5" height="6" rx="1" fill="currentColor" opacity="0.35" />
            <rect x="21" y="19" width="5" height="6" rx="1" fill="currentColor" opacity="0.35" />
            <circle cx="27" cy="26" r="1.5" fill="currentColor" />
          </svg>
        </a>

        <div className={styles.right}>
          <div className={styles.links}>
            <a href={href('hero')} className={linkActive('hero')} aria-current={linkActive('hero') ? 'page' : undefined}>{t.nav.home}</a>
            <a href={href('stack')} className={linkActive('stack')} aria-current={linkActive('stack') ? 'page' : undefined}>{t.stack.title}</a>
            <a href={href('sobre')} className={linkActive('sobre')} aria-current={linkActive('sobre') ? 'page' : undefined}>{t.nav.about}</a>
            <a href={href('projetos')} className={linkActive('projetos')} aria-current={linkActive('projetos') ? 'page' : undefined}>{t.nav.projects}</a>
            <a href={href('timeline')} className={linkActive('timeline')} aria-current={linkActive('timeline') ? 'page' : undefined}>{t.timeline.title}</a>
            <a href={href('certificados')} className={linkActive('certificados')} aria-current={linkActive('certificados') ? 'page' : undefined}>{t.certificates.title}</a>
            <button className={styles.contactTrigger} onClick={() => setContactOpen(true)}>
              {t.nav.media}
            </button>
          </div>

          <div className={styles.controls}>
            <button
              className={styles.toggle}
              onClick={toggleLang}
              title={lang === 'pt' ? 'Switch to English' : 'Mudar para português'}
              aria-label={lang === 'pt' ? 'Switch to English' : 'Mudar para português'}
            >
              {lang === 'pt' ? 'PT' : 'EN'}
            </button>
            <button
              className={styles.toggle}
              onClick={toggleTheme}
              title={lang === 'pt' ? 'Alternar tema' : 'Toggle theme'}
              aria-label={lang === 'pt' ? 'Alternar tema' : 'Toggle theme'}
            >
              {theme === 'dark' ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 1020.354 15.354z" />
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              )}
            </button>
            <button
              className={`${styles.menuToggle} ${menuOpen ? styles.menuToggleOpen : ''}`}
              onClick={() => setMenuOpen(previous => !previous)}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              aria-label={menuOpen ? (lang === 'pt' ? 'Fechar menu' : 'Close menu') : (lang === 'pt' ? 'Abrir menu' : 'Open menu')}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div ref={mobileMenuRef} id="mobile-navigation" className={styles.mobileMenu}>
          <a href={href('hero')} className={linkActive('hero')} aria-current={linkActive('hero') ? 'page' : undefined} onClick={closeMenu}>{t.nav.home}</a>
          <a href={href('stack')} className={linkActive('stack')} aria-current={linkActive('stack') ? 'page' : undefined} onClick={closeMenu}>{t.stack.title}</a>
          <a href={href('sobre')} className={linkActive('sobre')} aria-current={linkActive('sobre') ? 'page' : undefined} onClick={closeMenu}>{t.nav.about}</a>
          <a href={href('projetos')} className={linkActive('projetos')} aria-current={linkActive('projetos') ? 'page' : undefined} onClick={closeMenu}>{t.nav.projects}</a>
          <a href={href('timeline')} className={linkActive('timeline')} aria-current={linkActive('timeline') ? 'page' : undefined} onClick={closeMenu}>{t.timeline.title}</a>
          <a href={href('certificados')} className={linkActive('certificados')} aria-current={linkActive('certificados') ? 'page' : undefined} onClick={closeMenu}>{t.certificates.title}</a>
          <button
            className={styles.mobileContactTrigger}
            onClick={() => {
              closeMenu()
              setContactOpen(true)
            }}
          >
            {t.nav.media}
          </button>
        </div>
      )}

      {contactOpen && (
        <div
          className={styles.contactOverlay}
          onClick={(event) => {
            if (event.target === event.currentTarget) setContactOpen(false)
          }}
          role="presentation"
        >
          <div
            ref={contactRef}
            tabIndex={-1}
            className={styles.contactModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-dialog-title"
          >
            <div className={styles.contactHeader}>
              <div>
                <span className={styles.contactEyebrow}>{t.nav.social}</span>
                <h2 id="contact-dialog-title">
                  {t.nav.media}
                </h2>
              </div>
              <button
                className={styles.closeContact}
                onClick={() => setContactOpen(false)}
                aria-label={lang === 'pt' ? 'Fechar contato' : 'Close contact'}
              >
                ×
              </button>
            </div>

            <div className={styles.socialLinks}>
              <div className={styles.emailRow}>
                <a href={`mailto:${EMAIL}`}>
                  <span className={styles.socialName}>
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18v14H3V5zm1.5 1.5v.25l7.5 4.7 7.5-4.7V6.5L12 11.2 4.5 6.5z" /></svg>
                    {t.nav.email}
                  </span>
                  <span aria-hidden="true">↗</span>
                </a>
                <button type="button" className={styles.copyBtn} onClick={copyEmail} aria-live="polite">
                  {copied ? t.nav.copied : t.nav.copy}
                </button>
              </div>
              <a href="https://github.com/Hugolelis" target="_blank" rel="noreferrer">
                <span className={styles.socialName}>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48v-1.69c-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0112 6.85c.85 0 1.7.12 2.5.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10.01 10.01 0 0022 12c0-5.52-4.48-10-10-10z" /></svg>
                  GitHub
                </span>
                <span aria-hidden="true">↗</span>
              </a>
              <a href="https://www.linkedin.com/in/hugolelis/" target="_blank" rel="noreferrer">
                <span className={styles.socialName}>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.2 3.5A2.1 2.1 0 113.1 5.6a2.1 2.1 0 012.1-2.1zM3.4 8.3h3.6V20H3.4V8.3zm5.8 0h3.4v1.6h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45V20h-3.55v-5.76c0-1.37-.03-3.13-1.91-3.13-1.91 0-2.2 1.49-2.2 3.03V20H9.2V8.3z" /></svg>
                  LinkedIn
                </span>
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

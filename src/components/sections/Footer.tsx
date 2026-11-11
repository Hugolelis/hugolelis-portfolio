import { useApp } from '../../context/AppContext'
import { sectionHref, useDeskMode } from '../../hooks/useDeskMode'
import styles from './Footer.module.css'

const email = 'hugodelelis05@gmail.com'

export function Footer() {
  const { t } = useApp()
  const year = new Date().getFullYear()
  const onSubPage = window.location.pathname !== '/'
  const deskMode = useDeskMode()
  const href = (id: string) => sectionHref(id, deskMode, onSubPage)

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.name}>Hugo de Lelis</span>
          <span className={styles.tagline}>{t.footer.tagline}</span>
        </div>

        <nav className={styles.links} aria-label={t.footer.linksLabel}>
          <a href={href('hero')}>{t.nav.home}</a>
          <a href={href('sobre')}>{t.about.title}</a>
          <a href={href('stack')}>{t.stack.title}</a>
          <a href={href('projetos')}>{t.nav.projects}</a>
          <a href={href('timeline')}>{t.timeline.title}</a>
          <a href={href('certificados')}>{t.certificates.title}</a>
        </nav>

        <div className={styles.social}>
          <a
            href={`mailto:${email}`}
            className={styles.socialLink}
            aria-label={`${t.nav.email}: ${email}`}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18v14H3V5zm1.5 1.5v.25l7.5 4.7 7.5-4.7V6.5L12 11.2 4.5 6.5z" /></svg>
          </a>
          <a
            href="https://github.com/Hugolelis"
            target="_blank"
            rel="noreferrer"
            className={styles.socialLink}
            aria-label="GitHub"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48v-1.69c-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0112 6.85c.85 0 1.7.12 2.5.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10.01 10.01 0 0022 12c0-5.52-4.48-10-10-10z" /></svg>
          </a>
          <a
            href="https://www.linkedin.com/in/hugolelis/"
            target="_blank"
            rel="noreferrer"
            className={styles.socialLink}
            aria-label="LinkedIn"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.2 3.5A2.1 2.1 0 113.1 5.6a2.1 2.1 0 012.1-2.1zM3.4 8.3h3.6V20H3.4V8.3zm5.8 0h3.4v1.6h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45V20h-3.55v-5.76c0-1.37-.03-3.13-1.91-3.13-1.91 0-2.2 1.49-2.2 3.03V20H9.2V8.3z" /></svg>
          </a>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.bottomInner}>
          <span>© {year} Hugo de Lelis · {t.footer.rights}</span>
        </div>
      </div>
    </footer>
  )
}

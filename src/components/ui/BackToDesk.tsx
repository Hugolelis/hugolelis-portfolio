import { useApp } from '../../context/AppContext'
import styles from './BackToDesk.module.css'

export function BackToDesk() {
  const { lang } = useApp()
  return (
    <a href="/#mesa" className={styles.pill}>
      <span className={styles.icon} aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M11 6l-6 6 6 6" />
        </svg>
      </span>
      {lang === 'pt' ? 'Voltar à mesa' : 'Back to desk'}
    </a>
  )
}

import { useApp } from '../../context/AppContext'
import styles from './Loading.module.css'

interface LoadingProps {
  fullScreen?: boolean
}

export function Loading({ fullScreen = false }: LoadingProps) {
  const { t } = useApp()
  return (
    <div className={`${styles.loading} ${fullScreen ? styles.fullScreen : ''}`} role="status" aria-live="polite">
      <span className={styles.spinner} aria-hidden="true" />
      <span>{t.ui.loading}</span>
    </div>
  )
}

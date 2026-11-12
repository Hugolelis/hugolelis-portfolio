import { useEffect, useState, useSyncExternalStore } from 'react'
import { useApp } from '../../context/AppContext'
import { isReady, markReady, onReadyChange } from '../../utils/loadGate'
import styles from './Preloader.module.css'

const GIVE_UP_MS = 8000 // never trap the visitor behind the loader (no WebGL, slow network, ...)

/** Full-screen loader for the first paint: stays until every key in `needs` is ready, then fades out. */
export function Preloader({ needs }: { needs: string[] }) {
  const { t } = useApp()
  const done = useSyncExternalStore(onReadyChange, () => needs.filter(isReady).length)
  const [gone, setGone] = useState(false)
  const finished = done >= needs.length

  useEffect(() => {
    document.fonts?.ready.then(() => markReady('fonts'))
    if (document.readyState === 'complete') markReady('window')
    else window.addEventListener('load', () => markReady('window'), { once: true })
    const giveUp = window.setTimeout(() => needs.forEach(markReady), GIVE_UP_MS)
    return () => window.clearTimeout(giveUp)
  }, [needs])

  // unmount after the fade so it stops costing anything
  useEffect(() => {
    if (!finished) return
    const id = window.setTimeout(() => setGone(true), 800)
    return () => window.clearTimeout(id)
  }, [finished])

  if (gone) return null
  return (
    <div className={`${styles.overlay} ${finished ? styles.hide : ''}`} role="status" aria-live="polite">
      <span className={styles.name}>Hugo de Lelis</span>
      <div className={styles.bar}><div className={styles.fill} style={{ width: `${Math.max(8, (done / needs.length) * 100)}%` }} /></div>
      <span className={styles.label}>{t.ui.settingUp}</span>
    </div>
  )
}

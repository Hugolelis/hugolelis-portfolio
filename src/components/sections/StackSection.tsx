import { lazy, Suspense } from 'react'
import { useApp } from '../../context/AppContext'
import { useGithubContributions } from '../../hooks/useGithubContributions'
import { stack } from '../../data'
import { Reveal } from '../ui/Reveal'
import styles from './StackSection.module.css'

const GITHUB_USERNAME = 'Hugolelis'

// motion (~100 kB) is only needed once the heatmap shows, so it stays out of the initial bundle
const ActivityHeatmap = lazy(() => import('./ActivityHeatmap').then(m => ({ default: m.ActivityHeatmap })))

export function StackSection() {
  const { t, lang } = useApp()
  const { days, loading, error } = useGithubContributions(GITHUB_USERNAME)
  const spinner = (
    <div className={styles.heatmapLoader} role="status" aria-label={t.stack.loading}>
      <span className={styles.spinner} aria-hidden="true" />
    </div>
  )

  const groups = [
    { label: t.stack.languages, values: stack.languages },
    { label: t.stack.databases, values: stack.databases },
    { label: t.stack.infra, values: stack.infra },
  ]

  return (
    <section id="stack" className={styles.stack}>
      <div className="container">
        <Reveal repeat className={styles.sectionHeader}>
          <span className={styles.count}>{t.stack.eyebrow}</span>
          <h2 className={`section-title ${styles.sectionTitle}`}>{t.stack.title}</h2>
        </Reveal>

        <div className={styles.grid}>
          <Reveal repeat className={styles.list}>
            <ul className={styles.items}>
              {groups.map((group) => (
                <li key={group.label} className={styles.item}>
                  <span className={styles.itemLabel}>{group.label}</span>
                  <span className={styles.itemValue}>
                    {group.values.map((tech) => (
                      <span key={tech} className={styles.tech}>{tech}</span>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <div className={styles.heatmapCard}>
            {!error && !loading && days.length > 0 && (
              <Suspense fallback={spinner}>
                <ActivityHeatmap
                  days={days}
                  label={t.stack.heatmapLabel}
                  period={t.stack.heatmapPeriod}
                  connector={t.stack.heatmapConnector}
                  unit={{ one: t.stack.unitOne, other: t.stack.unitOther }}
                  noActivityWord={t.stack.noActivity}
                  lessLabel={t.stack.less}
                  moreLabel={t.stack.more}
                  locale={lang === 'pt' ? 'pt-BR' : 'en-US'}
                />
              </Suspense>
            )}
            {loading && spinner}
            {!loading && error && <span className={styles.heatmapStatus}>{t.stack.unavailable}</span>}
          </div>

          <a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noreferrer"
            className={styles.githubLink}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48v-1.69c-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0112 6.85c.85 0 1.7.12 2.5.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10.01 10.01 0 0022 12c0-5.52-4.48-10-10-10z" /></svg>
            {t.stack.visitGithub}
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  )
}

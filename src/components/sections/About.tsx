import { useApp } from '../../context/AppContext'
import { asciiPortraitDark, asciiPortraitLight } from '../../data'
import styles from './About.module.css'

const interests = [
  'Arquitetura de Sistemas', 'Sistemas Distribuídos', 'Backend e APIs', 'Visão Computacional',
  'Bancos Relacionais', 'Performance', 'Testes', 'IA',
]
const interestsEn = [
  'System Architecture', 'Distributed Systems', 'Backend & APIs', 'Computer Vision',
  'Relational Databases', 'Performance', 'Testing', 'AI',
]

// cycled by position (pt/en stay aligned index-for-index) — same accent
// colors already used for the project type badges, just text, no fill
const interestColors = [
  'var(--tag-api-color)',
  'var(--tag-cli-color)',
  'var(--tag-ai-color)',
  'var(--accent-term)',
  'var(--tag-red-color)',
]

export function About() {
  const { t, lang, theme } = useApp()
  const interestTags = lang === 'pt' ? interests : interestsEn
  const asciiPortrait = theme === 'dark' ? asciiPortraitDark : asciiPortraitLight

  return (
    <section id="sobre" className={styles.about}>
      <div className="container">
        <div className={styles.layout}>
          <div
            className={styles.photoCard}
            role="img"
            aria-label={lang === 'pt' ? 'Foto de Hugo de Lelis' : 'Photo of Hugo de Lelis'}
          >
            <pre className={styles.ascii} aria-hidden="true">{asciiPortrait}</pre>
          </div>

          <div className={styles.content}>
            <h2 className={`section-title ${styles.title}`}>{t.about.title}</h2>
            <div className={styles.body}>
              <p>{t.about.p1}</p>
              <p>{t.about.p3}</p>
            </div>
            <p className={styles.location}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              {t.about.location}
            </p>
          </div>
        </div>

        <div className={styles.subsection}>
          <p className={styles.interestsLabel}>{lang === 'pt' ? 'Áreas de interesse' : 'Areas of interest'}</p>
          <div className={styles.interests}>
            {interestTags.map((tag, i) => (
              <span
                key={tag}
                className={styles.interest}
                style={{ color: interestColors[i % interestColors.length] }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

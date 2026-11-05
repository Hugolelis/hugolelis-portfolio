import { useApp } from '../../context/AppContext'
import { asciiPortraitDark, asciiPortraitLight } from '../../data'
import styles from './About.module.css'

const interests = [
  'Engenharia de Software', 'Algoritmos', 'Estruturas de Dados',
  'Arquitetura de Sistemas', 'Performance', 'Backend', 'Visão Computacional', 'IA',
]
const interestsEn = [
  'Software Engineering', 'Algorithms', 'Data Structures',
  'System Architecture', 'Performance', 'Backend', 'Computer Vision', 'AI',
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

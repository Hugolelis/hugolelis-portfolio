import { useApp } from '../../context/AppContext'
import { Reveal } from '../ui/Reveal'
import styles from './About.module.css'

export function About() {
  const { t } = useApp()

  return (
    <section id="sobre" className={styles.about}>
      <div className="container">
        <div className={styles.layout}>
          <div className={styles.content}>
            <Reveal repeat delay={0.08}>
              <p className={styles.role}>{t.hero.role}</p>
              <h2 className={`section-title ${styles.title}`}>Hugo de Lelis</h2>
            </Reveal>
            <div className={styles.body}>
              <Reveal repeat delay={0.16}><p>{t.about.p1}</p></Reveal>
            </div>
          </div>
        </div>

        <Reveal repeat className={styles.subsection}>
          <p className={styles.interestsLabel}>{t.about.interestsLabel}</p>
          <div className={styles.interests}>
            {t.about.interests.map(tag => (
              <span key={tag} className={styles.interest}>{tag}</span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

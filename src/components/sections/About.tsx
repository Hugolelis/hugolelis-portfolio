import { useApp } from '../../context/AppContext'
import { Reveal } from '../ui/Reveal'
import styles from './About.module.css'

const interests = [
  'Arquitetura de Sistemas', 'Sistemas Distribuídos', 'Backend e APIs', 'Visão Computacional',
  'Bancos Relacionais', 'Performance', 'Testes', 'IA',
]
const interestsEn = [
  'System Architecture', 'Distributed Systems', 'Backend & APIs', 'Computer Vision',
  'Relational Databases', 'Performance', 'Testing', 'AI',
]

export function About() {
  const { t, lang } = useApp()
  const interestTags = lang === 'pt' ? interests : interestsEn

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
          <p className={styles.interestsLabel}>{lang === 'pt' ? 'Áreas de interesse' : 'Areas of interest'}</p>
          <div className={styles.interests}>
            {interestTags.map(tag => (
              <span key={tag} className={styles.interest}>{tag}</span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

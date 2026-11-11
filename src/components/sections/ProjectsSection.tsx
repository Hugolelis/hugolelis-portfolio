import { useCallback, useState } from 'react'
import { useApp } from '../../context/AppContext'
import { projects } from '../../data'
import { ProjectModal } from '../modals/ProjectModal'
import { projectTypeBadgeStyle } from '../../utils/projectTypeColor'
import styles from './ProjectsSection.module.css'

// Only the newest projects are shown here, however many exist; the rest is one click away on GitHub
const FEATURED = 5
const GITHUB = 'https://github.com/Hugolelis'

export function ProjectsSection() {
  const { t, lang } = useApp()
  const p = t.projects
  const [openId, setOpenId] = useState<number | null>(null)
  const featured = projects.slice(0, FEATURED)
  const open = projects.find(x => x.id === openId)
  const close = useCallback(() => setOpenId(null), [])

  return (
    <section id="projetos" className={styles.projects}>
      <div className="container">
        <header className={styles.header}>
          <span className={styles.eyebrow}>{p.count.replace('{n}', String(featured.length))}</span>
          <h2 className={`section-title ${styles.title}`}>{p.title}</h2>
          <p className={styles.summary}>{p.summary}</p>
        </header>

        <ul className={styles.grid}>
          {featured.map(project => (
            <li key={project.id}>
              <button type="button" className={styles.card} onClick={() => setOpenId(project.id)}>
                <span className={styles.media}>
                  {project.image ? (
                    <img src={project.image} alt="" loading="lazy" />
                  ) : (
                    <pre className={styles.banner} aria-hidden="true">{project.banner?.[lang]}</pre>
                  )}
                </span>

                <span className={styles.body}>
                  <span className={styles.meta}>
                    <span className={styles.badge} style={projectTypeBadgeStyle(project.type)}>{project.type}</span>
                    <span className={styles.year}>{project.year}</span>
                  </span>
                  <span className={styles.name}>{project.title[lang]}</span>
                  <span className={styles.tag}>{project.tag}</span>
                  <span className={styles.desc}>{project.description[lang][0]}</span>
                  <span className={`btn btn--ghost ${styles.cta}`}>{p.clickToView}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>

        <a href={GITHUB} target="_blank" rel="noreferrer" className={`btn btn--ghost ${styles.more}`}>
          {p.moreOnGithub} <span aria-hidden="true">↗</span>
        </a>
      </div>

      {open && (
        <ProjectModal project={open} lang={lang} translations={p} onClose={close} />
      )}
    </section>
  )
}

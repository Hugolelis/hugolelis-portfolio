import { useApp } from '../../context/AppContext'
import { projects } from '../../data'
import { projectPath } from '../../utils/projectSlug'
import { Reveal } from '../ui/Reveal'
import styles from './ProjectsSection.module.css'

// Only the newest projects are shown here, however many exist; the rest is one click away on GitHub
const FEATURED = 5
const GITHUB = 'https://github.com/Hugolelis'

export function ProjectsSection() {
  const { t, lang } = useApp()
  const p = t.projects
  const featured = projects.slice(0, FEATURED)

  return (
    <section id="projetos" className={styles.projects}>
      <div className="container">
        <Reveal repeat className={styles.header}>
          <span className={styles.eyebrow}>{p.count.replace('{n}', String(featured.length))}</span>
          <h2 className={`section-title ${styles.title}`}>{p.title}</h2>
          <p className={styles.summary}>{p.summary}</p>
        </Reveal>

        <ul className={styles.grid}>
          {featured.map((project, i) => (
            <li key={project.id}>
              {/* each card reveals as it scrolls in; the right column trails by a beat */}
              <Reveal repeat delay={(i % 2) * 0.12}>
              <a href={projectPath(project)} className={styles.card}>
                <span className={styles.media}>
                  {project.image ? (
                    <img src={project.image} alt="" loading="lazy" />
                  ) : (
                    <pre className={styles.banner} aria-hidden="true">{project.banner?.[lang]}</pre>
                  )}
                </span>

                <span className={styles.meta}>
                  <span className={styles.name}>{project.title[lang]}</span>
                  <span className={styles.year}>{project.year}</span>
                </span>
                <span className={styles.desc}>{project.description[lang][0]}</span>
              </a>
              </Reveal>
            </li>
          ))}
        </ul>

        <a href={GITHUB} target="_blank" rel="noreferrer" className={`btn btn--ghost ${styles.more}`}>
          {p.moreOnGithub} <span aria-hidden="true">↗</span>
        </a>
      </div>

    </section>
  )
}

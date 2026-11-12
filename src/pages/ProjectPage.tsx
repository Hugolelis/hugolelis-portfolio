import { Nav, Reveal } from '../components'
import { useApp } from '../context/AppContext'
import { projects } from '../data'
import { GithubIcon } from '../components/ui/icons'
import { sectionHref, useDeskMode } from '../hooks/useDeskMode'
import type { Project } from '../types'
import { projectPath } from '../utils/projectSlug'
import cards from '../components/sections/ProjectsSection.module.css'
import styles from './ProjectPage.module.css'

export function ProjectPage({ project }: { project: Project }) {
  const { t, lang } = useApp()
  const p = t.projects
  const deskMode = useDeskMode()
  const others = projects.filter(x => x !== project)
  const pt = lang === 'pt'

  return (
    <div className={styles.page}>
      <Nav />
      <main className={styles.main}>
        <Reveal repeat>
          <a href={sectionHref('projetos', deskMode, true)} className={styles.back}>← {t.nav.projects}</a>
          <span className={styles.meta}>{project.type} · {project.year}</span>
          <h1 className={styles.title}>{project.title[lang]}</h1>
          <span className={styles.tag}>{project.tag}</span>
          <div className={styles.lead}>
            {project.description[lang].map(line => <p key={line}>{line}</p>)}
          </div>
          <div className={styles.links}>
            {project.link && (
              <a href={project.link} target="_blank" rel="noreferrer" className="btn btn--primary">
                <GithubIcon size={16} />
                {p.viewCode}
              </a>
            )}
            {project.deploy && (
              <a href={project.deploy} target="_blank" rel="noreferrer" className="btn btn--ghost">
                {p.viewDeploy}
                <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        </Reveal>

        <Reveal repeat className={styles.media}>
          {project.image ? (
            <img src={project.image} alt={project.title[lang]} />
          ) : (
            <span className={styles.banner} aria-hidden="true">{project.banner?.[lang] ?? project.type}</span>
          )}
        </Reveal>

        <Reveal repeat className={styles.section}>
          <h2 className={styles.label}>{p.problem}</h2>
          <p className={styles.text}>{project.caseStudy.problem[lang]}</p>
        </Reveal>

        <Reveal repeat className={styles.section}>
          <h2 className={styles.label}>{p.decision}</h2>
          <p className={styles.text}>{project.caseStudy.decision[lang]}</p>
          <ul className={styles.facts}>
            {project.caseStudy.facts.map(f => <li key={f}>{f}</li>)}
          </ul>
        </Reveal>

        <Reveal repeat className={styles.section}>
          <h2 className={styles.label}>{p.tabFeatures}</h2>
          <ul className={styles.features}>
            {project.features[lang].map(item => {
              const [lead, ...rest] = item.split(': ')
              return (
                <li key={item}>
                  <strong>{lead}</strong>
                  <span>{rest.join(': ')}</span>
                </li>
              )
            })}
          </ul>
        </Reveal>

        {others.length > 0 && (
          <section className={styles.others}>
            <Reveal repeat>
              <h2 className={styles.label}>{pt ? 'Outros projetos' : 'Other projects'}</h2>
            </Reveal>
            {/* same cards as the home gallery, so they look and behave the same */}
            <ul className={cards.grid}>
              {others.map((other, i) => (
                <li key={other.id}>
                  <Reveal repeat delay={(i % 2) * 0.12}>
                    <a href={projectPath(other)} className={cards.card}>
                      <span className={cards.media}>
                        {other.image ? (
                          <img src={other.image} alt="" loading="lazy" />
                        ) : (
                          <pre className={cards.banner} aria-hidden="true">{other.banner?.[lang]}</pre>
                        )}
                      </span>
                      <span className={cards.meta}>
                        <span className={cards.name}>{other.title[lang]}</span>
                        <span className={cards.year}>{other.year}</span>
                      </span>
                      <span className={cards.desc}>{other.description[lang][0]}</span>
                    </a>
                  </Reveal>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  )
}

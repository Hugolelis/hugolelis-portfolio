import { useState } from 'react'
import { Top } from '../components/Top'
import { Banner } from '../components/Banner'
import { ProjectCard } from '../components/ProjectCard'
import { Reveal } from '../components/Reveal'
import { GithubIcon } from '../components/icons'
import { useApp } from '../context/AppContext'
import { projects } from '../data'
import { projectSlug } from '../utils/projectSlug'
import type { Project as ProjectType } from '../types'

// até 4 outros projetos, em ordem aleatória (Fisher-Yates); sorteado uma vez por visita à página
function pickOthers(current: ProjectType | undefined) {
  const pool = projects.filter(p => p !== current)
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, 4)
}

export function Project({ slug }: { slug: string }) {
  const { t, lang } = useApp()
  const project = projects.find(p => projectSlug(p) === slug)
  const [others] = useState(() => pickOthers(project))
  const cross = { to: '/projetos', label: t.projects }

  if (!project) {
    return (
      <div className="page">
        <Top cross={cross} />
        <p className="summary" style={{ marginTop: '3rem' }}>{t.notFound}</p>
      </div>
    )
  }

  return (
    <div className="page">
      <Top cross={cross} />
      <main className="narrow">
        <Reveal>
          <span className="pmeta">{project.type} · {project.year}</span>
          <h1 className="ptitle">{project.title[lang]}</h1>
          <span className="ptag">{project.tag}</span>
          <div className="lead">{project.description[lang].map(l => <p key={l}>{l}</p>)}</div>
          {project.link && (
            <div className="links2">
              <a className="btn solid" href={project.link} target="_blank" rel="noreferrer">
                <GithubIcon size={16} /> {t.viewCode}
              </a>
            </div>
          )}
        </Reveal>

        <Reveal>
          <div className="pmedia">
            {project.image
              ? <img src={project.image} alt={project.title[lang]} />
              : <Banner text={project.banner?.[lang] ?? project.type} />}
          </div>
        </Reveal>

        <div className="psec"><Reveal>
          <h2 className="label">{t.problem}</h2>
          <p className="text">{project.caseStudy.problem[lang]}</p>
        </Reveal></div>

        <div className="psec"><Reveal>
          <h2 className="label">{t.decision}</h2>
          <p className="text">{project.caseStudy.decision[lang]}</p>
          <ul className="facts">{project.caseStudy.facts.map(f => <li key={f}>{f}</li>)}</ul>
        </Reveal></div>

        <div className="psec"><Reveal>
          <h2 className="label">{t.features}</h2>
          <ul className="features">
            {project.features[lang].map(item => {
              const [lead, ...rest] = item.split(': ')
              return <li key={item}><strong>{lead}</strong><span>{rest.join(': ')}</span></li>
            })}
          </ul>
        </Reveal></div>

        <section className="others">
          <Reveal><h2 className="label">{t.others}</h2></Reveal>
          <ul className="gallery two">
            {others.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
          </ul>
        </section>
      </main>
    </div>
  )
}

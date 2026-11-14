import { ProjectCard } from '../components/ProjectCard'
import { useApp } from '../context/AppContext'
import { projects } from '../data'

export function Projects() {
  const { t } = useApp()
  return (
    <div className="page">
      <main>
        <div className="head">
          <span className="eyebrow">{t.pCount.replace('{n}', String(projects.length))}</span>
          <h2 className="title">{t.projects}</h2>
          <p className="summary">{t.pSummary}</p>
        </div>
        <ul className="gallery flex">
          {projects.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
        </ul>
      </main>
    </div>
  )
}

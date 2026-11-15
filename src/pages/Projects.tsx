import { ProjectCard } from '../components/ProjectCard'
import { useApp } from '../context/AppContext'
import { projects } from '../data'

export function Projects() {
  const { t } = useApp()
  return (
    <div className="page">
      <main>
        <div className="head">
          <span className="eyebrow">{t.projects} · {projects.length}</span>
          <h1 className="title">{t.pTitle}</h1>
        </div>
        <ul className="gallery flex">
          {projects.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
        </ul>
      </main>
    </div>
  )
}

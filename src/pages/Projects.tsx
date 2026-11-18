import { Link } from '../components/Link'
import { Reveal } from '../components/Reveal'
import { ProjectCard } from '../components/ProjectCard'
import { useApp } from '../context/AppContext'
import { projects } from '../data'

const COMPACT = 4 // na home: 2x2 e um "Ver todos" para a página completa

export function Projects({ compact = false }: { compact?: boolean }) {
  const { t } = useApp()
  const list = compact ? projects.slice(0, COMPACT) : projects
  return (
    <div className="page">
      <section>
        <Reveal>
          <div className="head">
            <span className="eyebrow">{t.projects} · {projects.length}</span>
            {!compact && <h1 className="title">{t.pTitle}</h1>}
          </div>
        </Reveal>
        <ul className={compact ? 'gallery two tight' : 'gallery flex'}>
          {list.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
        </ul>
        {compact && (
          <Reveal>
            <div className="showmore">
              <Link to="/projetos" className="viewall">{t.viewAll} <span aria-hidden="true">→</span></Link>
            </div>
          </Reveal>
        )}
      </section>
    </div>
  )
}

import { useApp } from '../context/AppContext'
import { Banner } from './Banner'
import { Reveal } from './Reveal'
import { Link } from './Link'
import { projectSlug } from '../utils/projectSlug'
import type { Project } from '../types'

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { lang } = useApp()
  return (
    <li>
      <Reveal delay={(index % 3) * 0.12}>
        <Link to={`/projetos/${projectSlug(project)}`} className="card">
          <span className="media">
            {project.image ? (
              <img src={project.image} alt="" loading="lazy" />
            ) : (
              <Banner text={project.banner?.[lang] ?? project.type} />
            )}
          </span>
          <span className="meta">
            <span className="name">{project.title[lang]}</span>
            <span className="year">{project.year}</span>
          </span>
          <span className="desc">{project.description[lang][0]}</span>
        </Link>
      </Reveal>
    </li>
  )
}

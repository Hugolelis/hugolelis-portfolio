import type { Project } from '../types'

// /projetos/person-detector: the URL is derived from the title, so a new project needs no extra field
export const projectSlug = (p: Project) => p.title.en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
export const projectPath = (p: Project) => `/projetos/${projectSlug(p)}`

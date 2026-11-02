import type { CSSProperties } from 'react'
import type { Project } from '../types'

// mirrors the dot colors already used in the projects filter dropdown —
// kept in one place so the type badge and the filter stay in sync
const TYPE_COLOR: Record<Project['type'], string> = {
  API: 'var(--tag-api-color)',
  WEB: 'var(--tag-api-color)',
  CLI: 'var(--tag-cli-color)',
  AI: 'var(--tag-ai-color)',
  TOOL: 'var(--accent-term)',
  STUDY: 'var(--tag-default-color)',
  LIB: 'var(--tag-default-color)',
  OTHER: 'var(--tag-default-color)',
}

export function projectTypeBadgeStyle(type: Project['type']): CSSProperties {
  return { color: TYPE_COLOR[type] }
}

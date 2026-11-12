import { useEffect, useMemo, useRef, useState } from 'react'
import { Expandable, Nav, ProjectCard, Reveal } from '../components'
import { useApp } from '../context/AppContext'
import { projects } from '../data'
import type { Project } from '../types'
import { useShowMore } from '../hooks/useShowMore'
import styles from './ProjectsPage.module.css'

const INITIAL_COUNT = 4

const TYPE_DOT: Record<Project['type'], string> = {
  API: 'var(--tag-api-color)',
  CLI: 'var(--tag-cli-color)',
  WEB: 'var(--tag-api-color)',
  LIB: 'var(--tag-default-color)',
  TOOL: 'var(--accent-term)',
  STUDY: 'var(--tag-default-color)',
  AI: 'var(--tag-ai-color)',
  OTHER: 'var(--tag-default-color)',
}

export function ProjectsPage() {
  const { t, lang } = useApp()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<Project['type'] | null>(null)
  const [filterOpen, setFilterOpen] = useState(false)
  const filterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!filterOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!filterRef.current?.contains(event.target as Node)) setFilterOpen(false)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setFilterOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [filterOpen])

  const availableTypes = useMemo(() => {
    const seen: Project['type'][] = []
    for (const p of projects) {
      if (!seen.includes(p.type)) seen.push(p.type)
    }
    return seen
  }, [])

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase()
    return projects.filter(p => {
      if (typeFilter && p.type !== typeFilter) return false
      if (!query) return true
      const haystack = `${p.title[lang]} ${p.tag} ${p.description[lang].join(' ')}`.toLowerCase()
      return haystack.includes(query)
    })
  }, [search, typeFilter, lang])

  const { expanded, remaining, canShowLess, showMore, showLess } = useShowMore(filteredProjects, INITIAL_COUNT)

  return (
    <div className={styles.page}>
      <Nav />
        <main className={styles.main}>
          <Reveal>
            <header className={styles.header}>
              <span className={styles.count}>{t.projects.count.replace('{n}', String(filteredProjects.length))}</span>
              <div className={styles.controls}>
                <div className={styles.searchWrap}>
                  <svg className={styles.searchIcon} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="11" cy="11" r="7" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder={t.projects.search}
                    className={styles.searchInput}
                    aria-label={t.projects.searchLabel}
                  />
                </div>
                <div className={styles.selectWrap} ref={filterRef}>
                  <button
                    type="button"
                    className={styles.selectTrigger}
                    onClick={() => setFilterOpen(open => !open)}
                    aria-haspopup="listbox"
                    aria-expanded={filterOpen}
                  >
                    {typeFilter && <span className={styles.selectDot} style={{ background: TYPE_DOT[typeFilter] }} aria-hidden="true" />}
                    <span className={styles.selectLabel}>{typeFilter ?? t.projects.allTypes}</span>
                    <svg className={`${styles.selectChevron} ${filterOpen ? styles.selectChevronOpen : ''}`} width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {filterOpen && (
                    <ul className={styles.selectMenu} role="listbox">
                      <li role="option" aria-selected={typeFilter === null}>
                        <button
                          type="button"
                          className={`${styles.selectOption} ${typeFilter === null ? styles.selectOptionActive : ''}`}
                          onClick={() => { setTypeFilter(null); setFilterOpen(false) }}
                        >
                          {t.projects.allTypes}
                        </button>
                      </li>
                      {availableTypes.map(type => (
                        <li key={type} role="option" aria-selected={typeFilter === type}>
                          <button
                            type="button"
                            className={`${styles.selectOption} ${typeFilter === type ? styles.selectOptionActive : ''}`}
                            onClick={() => { setTypeFilter(type); setFilterOpen(false) }}
                          >
                            <span className={styles.selectDot} style={{ background: TYPE_DOT[type] }} aria-hidden="true" />
                            {type}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </header>
          </Reveal>
          {filteredProjects.length === 0 ? (
            <p className={styles.empty}>
              {t.projects.noResults}
            </p>
          ) : (
            <div className={styles.list}>
              {filteredProjects.map((project, i) => {
                const isInitial = i < INITIAL_COUNT
                const card = (
                  <ProjectCard
                    project={project}
                    lang={lang}
                    translations={t.projects}
                  />
                )
                return isInitial ? (
                  <div key={project.id} className={styles.item}>
                    {card}
                  </div>
                ) : (
                  <Expandable key={project.id} expanded={expanded}>{card}</Expandable>
                )
              })}
            </div>
          )}
          {(remaining > 0 || canShowLess) && (
            <div className={styles.showMore}>
              {remaining > 0 ? (
                <button className="btn btn--ghost" onClick={showMore}>
                  {t.ui.showMore.replace('{n}', String(remaining))}
                </button>
              ) : (
                <button className="btn btn--ghost" onClick={showLess}>
                  {t.ui.showLess}
                </button>
              )}
            </div>
          )}
      </main>
    </div>
  )
}

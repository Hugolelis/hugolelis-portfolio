import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import { flushSync } from 'react-dom'
import { Helmet } from 'react-helmet-async'
import { Footer, Loading, Nav, Hero, About, CertificatesSection, StackSection, ProjectsSection, Timeline, Reveal } from './components'
import { Preloader } from './components/ui/Preloader'
import { BackToDesk } from './components/ui/BackToDesk'
import { DeskSection } from './components/scene/DeskSection'
import { useApp } from './context/AppContext'
import { isEmbed, useDeskMode } from './hooks/useDeskMode'
import { NAV_EVENT, ROUTES, navigate } from './utils/navigate'
import { smoothScrollToId } from './utils/scroll'
import styles from './components/ui/BackToTop.module.css'
import notFoundStyles from './components/ui/NotFound.module.css'

const ProjectsPage = lazy(() => import('./pages/ProjectsPage').then(m => ({ default: m.ProjectsPage })))

export default function App() {
  const { lang } = useApp()
  const deskMode = useDeskMode()
  // re-render on client-side navigation (see utils/navigate.ts); the URL itself is the source of truth
  const [loc, setLoc] = useState(() => window.location.pathname + window.location.hash)
  const path = window.location.pathname
  const isProjectsPage = path === '/projetos'
  const isPortfolio = path === '/portfolio'
  // desk mode: '/' is the room alone, '/portfolio' is the real site (hero + every section)
  const isRoom = deskMode && !isEmbed && path === '/'
  const isUnknown = !isProjectsPage && !isPortfolio && path !== '/'

  const [showBackToTop, setShowBackToTop] = useState(false)
  const navScrolled = useRef(false) // the last location change already positioned the scroll
  // what the first-load screen waits for (decided once: later navigations are already warm)
  const [needs] = useState(() => ['fonts', 'window', ...(isRoom ? ['scene', 'screen'] : [])])

  useEffect(() => {
    const sync = () => setLoc(window.location.pathname + window.location.hash)
    // route change: swap the page under a transition, landing at the top (no jump, no half-revealed
    // section), then glide down to the requested section once the transition is over
    const onNavigate = () => {
      const id = window.location.hash.slice(1)
      navScrolled.current = true
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced || !document.startViewTransition) {
        sync()
        const target = id && document.getElementById(id)
        if (target) target.scrollIntoView({ behavior: 'instant' })
        else window.scrollTo({ top: 0, behavior: 'instant' })
        return
      }
      const vt = document.startViewTransition(() => {
        flushSync(sync)
        window.scrollTo({ top: 0, behavior: 'instant' })
      })
      if (id) vt.finished.then(() => smoothScrollToId(id)).catch(() => {})
    }
    // internal links navigate without a reload; files and external links stay native
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as Element).closest('a')
      if (!a || a.target || a.hasAttribute('download')) return
      const url = new URL(a.href, window.location.href)
      if (url.origin !== window.location.origin || !ROUTES.includes(url.pathname)) return
      if (url.pathname === window.location.pathname && url.hash) {
        // same page: glide to the section instead of a hard anchor jump (skip link keeps its native focus move)
        if (url.hash === '#main-content' || !document.getElementById(url.hash.slice(1))) return
        e.preventDefault()
        window.history.pushState(null, '', url.hash)
        smoothScrollToId(url.hash.slice(1))
        return
      }
      e.preventDefault()
      navigate(url.pathname + url.search + url.hash)
    }
    window.addEventListener(NAV_EVENT, onNavigate)
    const onPop = () => { navScrolled.current = false; sync() }
    window.addEventListener('popstate', onPop)
    document.addEventListener('click', onClick)
    return () => {
      window.removeEventListener(NAV_EVENT, onNavigate)
      window.removeEventListener('popstate', onPop)
      document.removeEventListener('click', onClick)
    }
  }, [])

  useEffect(() => {
    if (navScrolled.current) { navScrolled.current = false; return } // client-side navigation positions itself
    const hash = window.location.hash
    const target = hash ? document.getElementById(hash.slice(1)) : null
    if (!target) {
      window.scrollTo(0, 0)
      return
    }

    target.scrollIntoView({ behavior: 'instant' })

    // Hero's typewriter/reveal animation keeps growing the page for ~1.2s,
    // which can push the target out of place after the jump above. Correct
    // once more, but only if the user hasn't taken the wheel in the meantime.
    let userScrolled = false
    const markScrolled = () => { userScrolled = true }
    window.addEventListener('wheel', markScrolled, { once: true, passive: true })
    window.addEventListener('touchstart', markScrolled, { once: true, passive: true })
    window.addEventListener('keydown', markScrolled, { once: true })

    const timeoutId = window.setTimeout(() => {
      if (!userScrolled) target.scrollIntoView({ behavior: 'instant' })
    }, 1300)

    return () => {
      window.clearTimeout(timeoutId)
      window.removeEventListener('wheel', markScrolled)
      window.removeEventListener('touchstart', markScrolled)
      window.removeEventListener('keydown', markScrolled)
    }
  }, [loc])

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (isUnknown) {
    return (
      <>
        <Helmet>
          <title>404 — Page not found</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <Nav />
        <main id="main-content" className={notFoundStyles.notFound}>
          <div className={notFoundStyles.inner}>
            <span className={notFoundStyles.code}>404</span>
            <h1 className={notFoundStyles.title}>Page not found</h1>
            <p className={notFoundStyles.desc}>The page you are looking for does not exist or has been moved.</p>
            <a href="/" className={notFoundStyles.link}>Back to home</a>
          </div>
        </main>
      </>
    )
  }

  if (isProjectsPage) {
    return (
      <>
        <Helmet>
          <title>{'Hugo | Projects'}</title>
          <meta name="description" content="Projects by Hugo de Lelis | Software Developer." />
          <meta property="og:title" content="Hugo | Projects" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={window.location.href} />
        </Helmet>
        <Suspense fallback={<Loading fullScreen />}>
          <ProjectsPage />
        </Suspense>
        <Footer />
      </>
    )
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Hugo de Lelis',
    jobTitle: 'Software Developer',
    url: 'https://hugolelis.dev',
    sameAs: [
      'https://github.com/Hugolelis',
      'https://www.linkedin.com/in/hugolelis/',
    ],
  }

  return (
    <>
      <Helmet>
        <title>{'Hugo | Software Developer'}</title>
        <meta name="description" content="Portfolio de Hugo de Lelis | Software Developer com foco em backend, APIs, bancos de dados relacionais e aplicações com IA." />
        <meta property="og:title" content="Hugo | Software Developer" />
        <meta property="og:description" content="Portfolio de Hugo de Lelis | Software Developer com foco em backend, APIs, bancos de dados relacionais e aplicações com IA." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hugolelis.dev" />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      {!isEmbed && <Preloader needs={needs} />}
      <div style={{ overflowX: 'clip' }}>
        <Nav />
        <main id="main-content">
          {isRoom ? <DeskSection /> : (
            <>
              <Hero />
              {/* the monitor's embedded copy only ever shows the hero */}
              {!isEmbed && (
                <>
                  <Reveal><StackSection /></Reveal>
                  <Reveal><About /></Reveal>
                  <Reveal><ProjectsSection /></Reveal>
                  <Timeline />
                  <Reveal><CertificatesSection /></Reveal>
                </>
              )}
            </>
          )}
        </main>
        {!isRoom && !isEmbed && (
          <>
            <button
              className={`${styles.backToTop} ${showBackToTop ? styles.backToTopVisible : ''}`}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label={lang === 'pt' ? 'Voltar ao topo' : 'Back to top'}
              tabIndex={showBackToTop ? 0 : -1}
              inert={!showBackToTop}
            >
              ↑
            </button>
            {deskMode && isPortfolio && <BackToDesk />}
          </>
        )}
        {!isEmbed && <Footer />}
      </div>
    </>
  )
}

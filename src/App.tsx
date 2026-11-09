import { useState, useEffect, lazy, Suspense } from 'react'
import { Helmet } from 'react-helmet-async'
import { Footer, Loading, Nav, Hero, About, CertificatesSection, StackSection, ProjectsSection, Timeline, Reveal } from './components'
import { useApp } from './context/AppContext'
import { useAppReady } from './hooks/useAppReady'
import styles from './components/ui/BackToTop.module.css'
import notFoundStyles from './components/ui/NotFound.module.css'

const ProjectsPage = lazy(() => import('./pages/ProjectsPage').then(m => ({ default: m.ProjectsPage })))

export default function App() {
  const { lang } = useApp()
  const path = window.location.pathname
  const isProjectsPage = path === '/projetos'
  const isUnknown = !isProjectsPage && path !== '/'
  const homeReady = useAppReady()

  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    // On the home route this content doesn't exist until the loading
    // screen clears — wait for that before chasing a hash target.
    const isHomePath = !isProjectsPage && !isUnknown
    if (isHomePath && !homeReady) return

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
  }, [homeReady, isProjectsPage, isUnknown])

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
      {!homeReady ? (
        <Loading fullScreen />
      ) : (
        <div style={{ overflowX: 'clip' }}>
          <Nav />
          <main id="main-content">
            <Hero />
            <Reveal><StackSection /></Reveal>
            <Reveal><About /></Reveal>
            <Reveal><ProjectsSection /></Reveal>
            <Timeline />
            <Reveal><CertificatesSection /></Reveal>
          </main>
          <button
            className={`${styles.backToTop} ${showBackToTop ? styles.backToTopVisible : ''}`}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label={lang === 'pt' ? 'Voltar ao topo' : 'Back to top'}
            tabIndex={showBackToTop ? 0 : -1}
            inert={!showBackToTop}
          >
            ↑
          </button>
          <Footer />
        </div>
      )}
    </>
  )
}

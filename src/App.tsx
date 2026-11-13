import { Footer } from './components/Footer'
import { Certificates } from './pages/Certificates'
import { Home } from './pages/Home'
import { Project } from './pages/Project'
import { Projects } from './pages/Projects'
import { usePath } from './router'

export default function App() {
  const path = usePath().replace(/\/$/, '') || '/'
  const page =
    path === '/projetos' ? <Projects /> :
    path === '/certificados' ? <Certificates /> :
    path.startsWith('/projetos/') ? <Project key={path} slug={path.slice('/projetos/'.length)} /> :
    <Home />
  return (
    <>
      {page}
      <Footer />
    </>
  )
}

import { useEffect, useState } from 'react'

// Navegação mínima no cliente: muda a URL e avisa o <App>. O vercel.json manda todo caminho para o index.html.
const NAV = 'app:navigate'

export function navigate(to: string) {
  window.history.pushState(null, '', to)
  window.dispatchEvent(new Event(NAV))
  window.scrollTo(0, 0)
}

export function usePath() {
  const [path, setPath] = useState(window.location.pathname)
  useEffect(() => {
    const sync = () => setPath(window.location.pathname)
    window.addEventListener('popstate', sync)
    window.addEventListener(NAV, sync)
    return () => {
      window.removeEventListener('popstate', sync)
      window.removeEventListener(NAV, sync)
    }
  }, [])
  return path
}

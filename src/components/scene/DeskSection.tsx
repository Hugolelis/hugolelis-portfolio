import { lazy, Suspense } from 'react'
import { useApp } from '../../context/AppContext'
import { navigate } from '../../utils/navigate'

const DeskScene = lazy(() => import('./DeskScene'))

// Objects that open the portfolio at their section (the monitor opens it from the top).
const ROUTE = {
  books: '/portfolio#stack',
  frame: '/portfolio#certificados',
  portrait: '/portfolio#sobre',
  clock: '/portfolio#timeline',
} as const

// Browser Back / the pill return to the desk, and the camera zooms back out from `from`.
function leaveDesk(from: string, to: string) {
  window.history.replaceState(null, '', '/#mesa')
  try { sessionStorage.setItem('desk-from', from) } catch { /* private mode: no zoom-out */ }
  navigate(to)
}

export function DeskSection() {
  const { t, theme } = useApp()
  return (
    <section id="mesa" style={{ position: 'relative', height: '100vh', minHeight: 560 }}>
      <Suspense fallback={null}>
        <DeskScene
          theme={theme}
          labels={{
            monitor: t.desk.monitor,
            laptop: 'Person Detector · GitHub', books: t.stack.title,
            frame: t.certificates.title, portrait: t.nav.about, clock: t.timeline.title, phone: t.nav.media,
            lamp: t.desk.lamp,
            qr: t.desk.qr,
            code: 'leetcodes-study · GitHub',
          }}
          onSelect={(id) => {
            if (id === 'phone') window.dispatchEvent(new Event('open-contact'))
            else leaveDesk(id, ROUTE[id])
          }}
          onOpenFull={() => leaveDesk('monitor', '/portfolio')}
        />
      </Suspense>
    </section>
  )
}

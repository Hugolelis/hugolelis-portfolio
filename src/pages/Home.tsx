import { useEffect, useState } from 'react'
import { Books } from '../components/Books'
import { Certificates } from './Certificates'
import { Projects } from './Projects'
import { useApp } from '../context/AppContext'

export function Home() {
  const { t } = useApp()
  // a entrada palavra a palavra só vale na abertura; depois disso, trocar de idioma não reanima a frase
  const [intro, setIntro] = useState(true)
  useEffect(() => { const id = setTimeout(() => setIntro(false), 2600); return () => clearTimeout(id) }, [])
  let i = 0
  // cada palavra entra em sequência; a segunda frase fica em tom mais suave
  const words = (s: string, cls?: string) =>
    s.split(' ').map(w => <span key={i} className={cls ? `w ${cls}` : 'w'} style={{ '--i': i++ } as React.CSSProperties}>{w} </span>)
  return (
    <>
    <section className="home">
      <p className="eyebrow">{t.role}</p>
      <h1 className={intro ? 'intro' : undefined} aria-label={`${t.h1a} ${t.h1b}`}>
        <span aria-hidden="true">{words(t.h1a)}{words(t.h1b, 'dim')}</span>
      </h1>
      <p className="by">Hugo Lelis</p>
    </section>
    <Projects compact />
    <Certificates compact />
    <div className="page"><section className="narrow about shelfhome"><Books /></section></div>
    </>
  )
}

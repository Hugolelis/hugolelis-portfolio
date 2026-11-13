import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import { FileIcon, GithubIcon, LinkedinIcon, MailIcon } from './icons'
import { PdfModal } from './PdfModal'

export function ContactModal({ onClose }: { onClose: () => void }) {
  const { t } = useApp()
  const [cvOpen, setCvOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const key = (e: KeyboardEvent) => e.key === 'Escape' && !cvOpen && onClose()
    document.addEventListener('keydown', key)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', key)
    }
  }, [onClose, cvOpen])

  const links = [
    { href: 'https://github.com/Hugolelis', icon: <GithubIcon />, name: 'GitHub', desc: t.ghd, extra: { target: '_blank', rel: 'noreferrer' } },
    { href: 'https://www.linkedin.com/in/hugolelis/', icon: <LinkedinIcon />, name: 'LinkedIn', desc: t.lid, extra: { target: '_blank', rel: 'noreferrer' } },
    { href: 'mailto:hugodelelis05@gmail.com', icon: <MailIcon />, name: t.mail, desc: t.maild, extra: {} },
    { href: '/Hugolelis_cv.pdf', icon: <FileIcon />, name: t.cv, desc: t.cvd, extra: {}, preview: true },
  ]

  return (
    <>
      <div className="overlay" onClick={onClose} role="presentation">
        <div className="modal sm" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={t.contact}>
          <div className="mhead">
            <span className="mname">{t.contact}</span>
            <div className="mact"><button onClick={onClose} title={t.close}>✕</button></div>
          </div>
          <ul className="links">
            {links.map(l => {
              const row = (
                <>
                  {l.icon}
                  <b>{l.name}</b>
                  <small>{l.desc}</small>
                  <i>↗</i>
                </>
              )
              return (
                <li key={l.href}>
                  {l.preview
                    ? <button type="button" onClick={() => setCvOpen(true)}>{row}</button>
                    : <a href={l.href} {...l.extra}>{row}</a>}
                </li>
              )
            })}
          </ul>
        </div>
      </div>
      {cvOpen && <PdfModal name={t.cv} issuer="Hugo de Lelis" file="/Hugolelis_cv.pdf" onClose={() => setCvOpen(false)} />}
    </>
  )
}

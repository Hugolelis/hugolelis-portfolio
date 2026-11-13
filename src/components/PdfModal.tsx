import { useEffect } from 'react'
import { useApp } from '../context/AppContext'

interface Props {
  name: string
  issuer: string
  file: string
  onClose: () => void
}

export function PdfModal({ name, issuer, file, onClose }: Props) {
  const { t } = useApp()
  const mobile = window.innerWidth <= 768

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const key = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', key)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', key)
    }
  }, [onClose])

  return (
    <div className="overlay" onClick={onClose} role="presentation">
      <div className="modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={name}>
        <div className="mhead">
          <div className="minfo">
            <span className="mname">{name}</span>
            <span className="missuer">{issuer}</span>
          </div>
          <div className="mact">
            <a href={file} download title={t.download}>↓</a>
            <button onClick={onClose} title={t.close}>✕</button>
          </div>
        </div>
        {mobile ? (
          <div className="fallback">
            <p>{t.noPrev}</p>
            <a className="btn solid" href={file} target="_blank" rel="noopener noreferrer">{t.openPdf}</a>
            <a className="btn ghost" href={file} download>{t.dlPdf}</a>
          </div>
        ) : (
          <embed className="viewer" src={file} title={name} />
        )}
      </div>
    </div>
  )
}

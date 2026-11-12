import { Fragment, useState } from 'react'
import { useApp } from '../../context/AppContext'
import { certificates } from '../../data'
import type { Certificate } from '../../types'
import { useShowMore } from '../../hooks/useShowMore'
import { Expandable } from '../ui/Expandable'
import { Reveal } from '../ui/Reveal'
import { PdfModal } from '../modals/PdfModal'
import styles from './CertificatesSection.module.css'

const INITIAL_COUNT = 4

export function CertificatesSection() {
  const { t } = useApp()
  const [selected, setSelected] = useState<Certificate | null>(null)
  const certsShown = useShowMore(certificates, INITIAL_COUNT)

  return (
    <section id="certificados" className={styles.certificates}>
      <div className="container">
        <Reveal repeat className={styles.sectionHeader}>
          <span className={styles.count}>{t.certificates.count.replace('{n}', String(certificates.length))}</span>
          <h2 className={`section-title ${styles.sectionTitle}`}>{t.certificates.title}</h2>
        </Reveal>
        <div className={styles.grid}>
          {certificates.map((cert, i) => {
            const isInitial = i < INITIAL_COUNT
            const card = (
              <Reveal repeat delay={(i % 2) * 0.12}>
              <button
                className={styles.card}
                onClick={() => setSelected(cert)}
              >
                <span className={styles.media}>
                  <img src={cert.file.replace('/courses/', '/courses/previews/').replace('.pdf', '.webp')} alt="" loading="lazy" />
                </span>
                <span className={styles.meta}>
                  <span className={styles.name}>{cert.name}</span>
                  <span className={styles.year}>{cert.year}</span>
                </span>
                <span className={styles.issuer}>{cert.issuer}</span>
              </button>
              </Reveal>
            )
            return isInitial ? (
              <Fragment key={i}>{card}</Fragment>
            ) : (
              <Expandable key={i} expanded={certsShown.expanded}>{card}</Expandable>
            )
          })}
        </div>
        {(certsShown.remaining > 0 || certsShown.canShowLess) && (
          <div className={styles.showMore}>
            {certsShown.remaining > 0 ? (
              <button className="btn btn--ghost" onClick={certsShown.showMore}>
                {t.ui.showMore.replace('{n}', String(certsShown.remaining))}
              </button>
            ) : (
              <button className="btn btn--ghost" onClick={certsShown.showLess}>
                {t.ui.showLess}
              </button>
            )}
          </div>
        )}
      </div>

      {selected && (
        <PdfModal
          name={selected.name}
          issuer={`${selected.issuer} · ${selected.year}`}
          file={selected.file}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  )
}

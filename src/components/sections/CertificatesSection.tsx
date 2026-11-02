import { Fragment, useState } from 'react'
import { useApp } from '../../context/AppContext'
import { certificates } from '../../data'
import type { Certificate } from '../../types'
import { useShowMore } from '../../hooks/useShowMore'
import { getIssuerBadge } from '../../utils/issuerBadge'
import { Expandable } from '../ui/Expandable'
import { PdfModal } from '../modals/PdfModal'
import { GoogleIcon, UdemyIcon } from '../ui/icons'
import type { CertificateIcon } from '../../types'
import styles from './CertificatesSection.module.css'

const certIcon: Record<CertificateIcon, typeof GoogleIcon> = {
  google: GoogleIcon,
  udemy: UdemyIcon,
}

const INITIAL_COUNT = 4

export function CertificatesSection() {
  const { t, lang } = useApp()
  const [selected, setSelected] = useState<Certificate | null>(null)
  const certsShown = useShowMore(certificates, INITIAL_COUNT)

  return (
    <section id="certificados" className={styles.certificates}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <span className={styles.count}>{t.certificates.count.replace('{n}', String(certificates.length))}</span>
          <h2 className={`section-title ${styles.sectionTitle}`}>{t.certificates.title}</h2>
        </div>
        <div className={styles.grid}>
          {certificates.map((cert, i) => {
            const badge = getIssuerBadge(cert.issuer)
            const Icon = cert.icon ? certIcon[cert.icon] : null
            const isInitial = i < INITIAL_COUNT
            const card = (
              <button
                className={styles.card}
                style={isInitial ? { animation: `fadeUp 0.4s ease ${i * 0.06}s both` } : undefined}
                onClick={() => setSelected(cert)}
              >
                <div
                  className={styles.icon}
                  style={Icon ? undefined : { color: badge.color }}
                  aria-hidden="true"
                  title={badge.org}
                >
                  {Icon ? <Icon size={18} /> : badge.initials}
                </div>
                <div className={styles.info}>
                  <span className={styles.name}>{cert.name}</span>
                  <span className={styles.issuer}>{cert.issuer}</span>
                </div>
                <div className={styles.meta}>
                  <span className={styles.year}>{cert.year}</span>
                  <span className={styles.arrow} aria-hidden="true">↗</span>
                </div>
              </button>
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
                {lang === 'pt' ? `Ver mais (${certsShown.remaining})` : `Show more (${certsShown.remaining})`}
              </button>
            ) : (
              <button className="btn btn--ghost" onClick={certsShown.showLess}>
                {lang === 'pt' ? 'Ver menos' : 'Show less'}
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

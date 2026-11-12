import { useEffect, useState } from 'react'
import { useApp } from '../../context/AppContext'
import styles from './PdfModal.module.css'

interface PdfModalProps {
    name: string
    issuer: string
    file: string
    onClose: () => void
}

function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false)
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth <= 768)
        check()
        window.addEventListener('resize', check)
        return () => window.removeEventListener('resize', check)
    }, [])
    return isMobile
}

export function PdfModal({ name, issuer, file, onClose }: PdfModalProps) {
    const isMobile = useIsMobile()
    const { t } = useApp()

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        document.addEventListener('keydown', handleKey)
        return () => {
            document.body.style.overflow = ''
            document.removeEventListener('keydown', handleKey)
        }
    }, [onClose])

    return (
        <div className={styles.overlay} onClick={onClose} role="presentation">
        <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={name}
        >
            <div className={styles.modalHeader}>
            <div className={styles.modalInfo}>
                <span className={styles.modalName}>{name}</span>
                <span className={styles.modalIssuer}>{issuer}</span>
            </div>
            <div className={styles.modalActions}>
                <a
                href={file}
                download
                className={styles.downloadBtn}
                title={t.ui.download}
                >
                ↓
                </a>
                <button
                className={styles.closeBtn}
                onClick={onClose}
                title={t.ui.close}
                >
                ✕
                </button>
            </div>
            </div>

            {isMobile ? (
            <div className={styles.mobileFallback}>
                <p className={styles.fallbackText}>
                {t.ui.previewUnavailable}
                </p>
                <a
                href={file}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.fallbackBtn}
                >
                {t.ui.openPdf}
                </a>
                <a
                href={file}
                download
                className={styles.fallbackBtnOutline}
                >
                {t.ui.downloadPdf}
                </a>
            </div>
            ) : (
            <embed
                src={file}
                className={styles.viewer}
                title={name}
            />
            )}
        </div>
        </div>
    )
}

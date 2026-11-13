import { useEffect, useRef, useState, type RefObject } from 'react'
import { useApp } from '../../context/AppContext'
import { timeline } from '../../data'
import { TimelineItem } from './TimelineItem'
import { Reveal } from '../ui/Reveal'
import styles from './Timeline.module.css'

// Data is stored newest -> oldest; the list reads top to bottom as a
// trajectory, so it's walked in reverse (oldest -> newest).
const orderedTimeline = [...timeline].reverse()

interface LineRect {
  top: number
  height: number
}

// Measures the first and last dot's centers so the line/fill pair can span
// exactly between them — item heights vary with description length, so
// this can't be done with CSS alone (see Timeline.module.css .stackedLine).
function useStackedLineRect(listRef: RefObject<HTMLDivElement | null>) {
  const [rect, setRect] = useState<LineRect>({ top: 0, height: 0 })

  useEffect(() => {
    const list = listRef.current
    if (!list) return

    const measure = () => {
      const dots = list.querySelectorAll<HTMLElement>('[data-timeline-dot]')
      if (dots.length < 2) return
      const containerTop = list.getBoundingClientRect().top
      const first = dots[0].getBoundingClientRect()
      const last = dots[dots.length - 1].getBoundingClientRect()
      const firstCenter = first.top + first.height / 2 - containerTop
      const lastCenter = last.top + last.height / 2 - containerTop
      setRect({ top: firstCenter, height: lastCenter - firstCenter })
    }

    measure()
    document.fonts?.ready.then(measure)
    const ro = new ResizeObserver(measure)
    ro.observe(list)
    return () => ro.disconnect()
  }, [listRef])

  return rect
}

// The fill follows a reading line 60% down the screen: it reaches each dot
// exactly when the line passes it, so the filled part always ends at the
// entry the reader is on. (Progress through the whole list, as before,
// ignored where the dots actually sit, so it looked early or late.)
const READING_LINE = 0.6

function useReadingProgress(listRef: RefObject<HTMLDivElement | null>) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const list = listRef.current
    if (!list) return

    const center = (el: HTMLElement) => {
      const r = el.getBoundingClientRect()
      return r.top + r.height / 2
    }
    const update = () => {
      const dots = list.querySelectorAll<HTMLElement>('[data-timeline-dot]')
      if (dots.length < 2) return
      const first = center(dots[0])
      const span = center(dots[dots.length - 1]) - first
      const value = (window.innerHeight * READING_LINE - first) / span
      setProgress(Math.round(Math.min(1, Math.max(0, value)) * 1000) / 1000)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [listRef])

  return progress
}

export function Timeline() {
  const { t, lang } = useApp()
  const listRef = useRef<HTMLDivElement>(null)
  const lineRect = useStackedLineRect(listRef)
  const scrollProgress = useReadingProgress(listRef)

  return (
    <section id="timeline" className={styles.timeline}>
      <div className="container">
        <div className={styles.intro}>
          <Reveal repeat><span className={styles.count}>{t.timeline.count.replace('{n}', String(orderedTimeline.length))}</span></Reveal>
          <Reveal repeat delay={0.08}><h2 className={`section-title ${styles.title}`}>{t.timeline.title}</h2></Reveal>
          <Reveal repeat delay={0.16}><p className={styles.summary}>{t.timeline.summary}</p></Reveal>
        </div>
        <div ref={listRef} className={styles.stackedList}>
          <span className={styles.stackedLine} style={{ top: lineRect.top, height: lineRect.height }} />
          <span
            className={styles.stackedLineFill}
            style={{ top: lineRect.top, height: lineRect.height, transform: `scaleY(${scrollProgress})` }}
          />
          {orderedTimeline.map((entry) => (
            <TimelineItem key={entry.id} entry={entry} lang={lang} present={t.timeline.present} ended={t.timeline.ended} />
          ))}
        </div>
      </div>
    </section>
  )
}

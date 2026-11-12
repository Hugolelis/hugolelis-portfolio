import { useEffect, useRef, useState, type RefObject } from 'react'
import { useApp } from '../../context/AppContext'
import { timeline } from '../../data'
import { TimelineItem } from './TimelineItem'
import { useHorizontalPin } from '../../hooks/useHorizontalPin'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { Reveal } from '../ui/Reveal'
import styles from './Timeline.module.css'

// Data is stored newest -> oldest; the horizontal track reads left to right
// as a trajectory, so it's walked in reverse (oldest -> newest).
const orderedTimeline = [...timeline].reverse()

// below this, the horizontal scroll-jack (see useHorizontalPin) stops
// being a nice effect and starts being an awkward sideways swipe on a
// narrow screen — a plain stacked list reads much better there
const MOBILE_QUERY = '(max-width: 760px)'

interface LineRect {
  top: number
  height: number
}

// Measures the first and last dot's centers so the line/fill pair can span
// exactly between them — item heights vary with description length, so
// this can't be done with CSS alone (see Timeline.module.css .stackedLine).
// `active` gates when this measures — the stacked list only exists in the
// DOM while isMobile is true, and a ref flipping from null to an element
// doesn't by itself re-trigger an effect, so that mount/unmount has to be
// an explicit dependency or this would keep reading a stale {0,0} forever
// once the list mounts after the hook's first run (e.g. on desktop at
// first paint, then resized down to mobile without a full reload)
function useStackedLineRect(listRef: RefObject<HTMLDivElement | null>, active: boolean) {
  const [rect, setRect] = useState<LineRect>({ top: 0, height: 0 })

  useEffect(() => {
    const list = listRef.current
    if (!active || !list) return

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
  }, [listRef, active])

  return rect
}

// The fill follows a reading line 60% down the screen: it reaches each dot
// exactly when the line passes it, so the filled part always ends at the
// entry the reader is on. (Progress through the whole list, as before,
// ignored where the dots actually sit, so it looked early or late.)
const READING_LINE = 0.6

function useReadingProgress(listRef: RefObject<HTMLDivElement | null>, active: boolean) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const list = listRef.current
    if (!active || !list) return

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
  }, [listRef, active])

  return progress
}

export function Timeline() {
  const { t, lang } = useApp()
  const isMobile = useMediaQuery(MOBILE_QUERY)
  const { sectionRef, trackRef, progress, offset } = useHorizontalPin<HTMLElement, HTMLDivElement>(!isMobile)
  const listRef = useRef<HTMLDivElement>(null)
  const lineRect = useStackedLineRect(listRef, isMobile)
  const scrollProgress = useReadingProgress(listRef, isMobile)

  const intro = (
    <>
      <Reveal repeat><span className={styles.count}>{t.timeline.count.replace('{n}', String(orderedTimeline.length))}</span></Reveal>
      <Reveal repeat delay={0.08}><h2 className={`section-title ${styles.title}`}>{t.timeline.title}</h2></Reveal>
      <Reveal repeat delay={0.16}><p className={styles.summary}>{t.timeline.summary}</p></Reveal>
    </>
  )

  if (isMobile) {
    return (
      <section id="timeline" ref={sectionRef} className={`${styles.timeline} ${styles.mobileWrap}`}>
        <div className="container">
          <div className={styles.mobileIntro}>{intro}</div>
          <div ref={listRef} className={styles.stackedList}>
            <span className={styles.stackedLine} style={{ top: lineRect.top, height: lineRect.height }} />
            <span
              className={styles.stackedLineFill}
              style={{ top: lineRect.top, height: lineRect.height, transform: `scaleY(${scrollProgress})` }}
            />
            {orderedTimeline.map((entry) => (
              <TimelineItem key={entry.id} entry={entry} lang={lang} present={t.timeline.present} stacked />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="timeline" ref={sectionRef} className={styles.timeline}>
      <div className={styles.pin}>
        <div className={styles.trackArea}>
          <div
            ref={trackRef}
            className={styles.track}
            style={{ transform: `translateX(-${offset}px)` }}
          >
            <div className={styles.intro}>{intro}</div>

            <span className={styles.line} style={{ gridColumn: `2 / ${orderedTimeline.length + 2}` }} />
            <span
              className={styles.lineFill}
              style={{ gridColumn: `2 / ${orderedTimeline.length + 2}`, transform: `scaleX(${progress})` }}
            />

            {orderedTimeline.map((entry, i) => (
              <TimelineItem
                key={entry.id}
                entry={entry}
                lang={lang}
                present={t.timeline.present}
                above={i % 2 === 0}
                column={i + 2}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

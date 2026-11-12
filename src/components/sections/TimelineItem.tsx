import type { TimelineEntry, Lang, TimelineCategory } from '../../types'
import { useReveal } from '../../hooks/useReveal'
import { BriefcaseIcon, GraduationCapIcon, TrophyIcon } from '../ui/icons'
import styles from './Timeline.module.css'

type Props =
  | { entry: TimelineEntry; lang: Lang; present: string; stacked: true; above?: never; column?: never }
  | { entry: TimelineEntry; lang: Lang; present: string; stacked?: false; above: boolean; column: number }

const categoryIcon: Record<TimelineCategory, typeof BriefcaseIcon> = {
  work: BriefcaseIcon,
  education: GraduationCapIcon,
  competition: TrophyIcon,
}

export function TimelineItem({ entry, lang, present, above, column, stacked }: Props) {
  const ended = lang === 'pt' ? 'Experiência encerrada' : 'Experience ended'
  const CategoryIcon = categoryIcon[entry.category]
  // fades in as it scrolls into view (sideways on desktop, down the page on mobile) and back out when it leaves
  const { ref, visible } = useReveal<HTMLDivElement>(0.2, true)

  const dot = (
    <span
      className={`${styles.dot} ${entry.current ? styles.dotCurrent : ''} ${visible ? '' : styles.dotHidden}`}
      style={stacked ? undefined : { gridColumn: column }}
      data-timeline-dot={stacked ? '' : undefined}
    >
      <CategoryIcon size={13} />
    </span>
  )

  const content = (
    <>
      <span className={styles.period}>{entry.period[lang]}</span>
      <h3 className={styles.org}>{entry.org[lang]}</h3>
      <span className={styles.role}>{entry.role[lang]}</span>
      <ul className={styles.desc}>
        {entry.description[lang].map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>
      <span className={`${styles.status} ${entry.current ? styles.statusCurrent : ''}`}>
        {entry.current ? present : ended}
      </span>
    </>
  )

  if (stacked) {
    return (
      <div ref={ref} className={`${styles.stackedItem} ${styles.fade} ${visible ? styles.fadeIn : ''}`}>
        {dot}
        <div className={styles.stackedText}>{content}</div>
      </div>
    )
  }

  return (
    <>
      {dot}
      <div
        ref={ref}
        className={`${styles.text} ${above ? styles.textAbove : styles.textBelow} ${styles.fade} ${visible ? styles.fadeIn : ''}`}
        style={{ gridColumn: column }}
      >
        {content}
      </div>
    </>
  )
}

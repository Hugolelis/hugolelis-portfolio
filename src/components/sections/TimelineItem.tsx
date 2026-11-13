import type { TimelineEntry, Lang, TimelineCategory } from '../../types'
import { useReveal } from '../../hooks/useReveal'
import { BriefcaseIcon, GraduationCapIcon, TrophyIcon } from '../ui/icons'
import styles from './Timeline.module.css'

interface Props {
  entry: TimelineEntry
  lang: Lang
  present: string
  ended: string
}

const categoryIcon: Record<TimelineCategory, typeof BriefcaseIcon> = {
  work: BriefcaseIcon,
  education: GraduationCapIcon,
  competition: TrophyIcon,
}

export function TimelineItem({ entry, lang, present, ended }: Props) {
  const CategoryIcon = categoryIcon[entry.category]
  // fades in as it scrolls into view and back out when it leaves
  const { ref, visible } = useReveal<HTMLDivElement>(0.2, true)

  return (
    <div ref={ref} className={`${styles.stackedItem} ${styles.fade} ${visible ? styles.fadeIn : ''}`}>
      <span
        className={`${styles.dot} ${entry.current ? styles.dotCurrent : ''} ${visible ? '' : styles.dotHidden}`}
        data-timeline-dot=""
      >
        <CategoryIcon size={13} />
      </span>
      <div className={styles.stackedText}>
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
      </div>
    </div>
  )
}

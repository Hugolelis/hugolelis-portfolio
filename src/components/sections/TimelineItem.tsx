import type { TimelineEntry, Lang, TimelineCategory } from '../../types'
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

  const dot = (
    <span
      className={`${styles.dot} ${entry.current ? styles.dotCurrent : ''}`}
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
      <div className={styles.stackedItem}>
        {dot}
        <div className={styles.stackedText}>{content}</div>
      </div>
    )
  }

  return (
    <>
      {dot}
      <div
        className={`${styles.text} ${above ? styles.textAbove : styles.textBelow}`}
        style={{ gridColumn: column }}
      >
        {content}
      </div>
    </>
  )
}

interface LocalizedText {
  pt: string
  en: string
}

interface LocalizedList {
  pt: string[]
  en: string[]
}

export interface Project {
  id: number
  title: LocalizedText
  tag: string
  type: 'API' | 'CLI' | 'WEB' | 'LIB' | 'TOOL' | 'STUDY' | 'AI' | 'OTHER'
  description: LocalizedList
  year: string
  link?: string
  deploy?: string
  image?: string
  /** shown instead of a screenshot when the project has none */
  banner?: LocalizedText
  features: LocalizedList
  caseStudy: {
    problem: LocalizedText
    decision: LocalizedText
    facts: string[]
  }
}

export type CertificateIcon = 'google' | 'udemy'

export interface Certificate {
  name: string
  issuer: string
  year: string
  file: string
  icon?: CertificateIcon
}

export type TimelineCategory = 'work' | 'education' | 'competition'

export interface TimelineEntry {
  id: string
  role: LocalizedText
  org: LocalizedText
  period: LocalizedText
  current?: boolean
  description: LocalizedList
  category: TimelineCategory
}

export type Theme = 'dark' | 'light'
export type Lang = 'pt' | 'en'

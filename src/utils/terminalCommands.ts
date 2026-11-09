import { certificates, projects, stack, timeline } from '../data'
import type { Translations } from '../i18n'
import type { Lang, Project } from '../types'
import cvUrl from '/Hugolelis_cv.pdf'

export type Tone = 'blue' | 'purple' | 'pink' | 'red' | 'amber' | 'green' | 'muted'

export interface Part {
  text: string
  tone?: Tone
  bold?: boolean
  href?: string
  /** clicking runs this command */
  run?: string
  /** clicking puts this text in the input (for commands that need an argument) */
  fill?: string
}

export interface TermLine {
  kind: 'in' | 'out' | 'err' | 'head'
  parts: Part[]
  /** left padding, in characters */
  indent?: number
  /** how many characters the first line sticks out (hanging indent) */
  hang?: number
}

export type TermAction = 'clear' | 'exit' | 'theme' | 'lang' | { goto: string }

interface Ctx {
  lang: Lang
  t: Translations
}

export const COMMANDS = [
  'about', 'stack', 'experience', 'education', 'projects', 'project',
  'certificates', 'contact', 'cv', 'goto', 'theme', 'lang', 'clear', 'exit', 'help',
]

// accepts both languages, so `goto about` and `goto sobre` work either way
const SECTIONS: Record<string, string> = {
  stack: 'stack',
  about: 'sobre',
  sobre: 'sobre',
  projects: 'projetos',
  projetos: 'projetos',
  timeline: 'timeline',
  certificates: 'certificados',
  certificados: 'certificados',
}

const DETAILS = ['problem', 'decision', 'features'] as const
type Detail = (typeof DETAILS)[number]
const DETAIL_ALIAS: Record<string, Detail> = {
  problem: 'problem', problema: 'problem',
  decision: 'decision', decisão: 'decision', decisao: 'decision',
  features: 'features', funcionalidades: 'features',
}

// same hues the site already uses for project types and the Stack section
const TYPE_TONE: Record<Project['type'], Tone> = {
  AI: 'pink', API: 'blue', WEB: 'blue', CLI: 'purple', TOOL: 'green', LIB: 'muted', STUDY: 'muted', OTHER: 'muted',
}
const DETAIL_TONE: Record<Detail, Tone> = { problem: 'red', decision: 'blue', features: 'purple' }

const p = (text: string, tone?: Tone, extra: Partial<Part> = {}): Part => ({ text, tone, ...extra })
const line = (kind: TermLine['kind'], parts: Part[], indent?: number, hang?: number): TermLine => ({ kind, parts, indent, hang })
const out = (...parts: Part[]) => line('out', parts)
/** columns: wrapped text lines up under the text, not under the label */
const cols = (width: number, ...parts: Part[]) => line('out', parts, width, width)
const paragraph = (s: string) => line('out', [p(s)], 2)
const blank = () => out(p(''))
const err = (s: string) => line('err', [p(s)])
const bullet = (s: string): TermLine => {
  const [lead, ...rest] = s.split(': ')
  const parts = rest.length
    ? [p('- ', 'muted'), p(lead, undefined, { bold: true }), p(': ', 'muted'), p(rest.join(': '))]
    : [p('- ', 'muted'), p(s)]
  return line('out', parts, 4, 2)
}

// "about            who I am" -> command in blue (clickable), <args> in purple, description muted
function helpLine(s: string): TermLine {
  const m = s.match(/^(\s+)(.+?)(\s{2,})(.+)$/)
  if (!m) return line('head', [p(s, undefined, { bold: true })])
  const [, indent, left, gap, desc] = m
  const needsArg = left.includes('<')
  const leftParts = left.split(/(<[^>]+>|\s\|\s)/).filter(Boolean).map(piece => {
    if (piece.startsWith('<')) return p(piece, 'purple')
    if (piece.trim() === '|') return p(piece, 'muted')
    return p(piece, 'blue', { bold: true, run: needsArg ? undefined : piece, fill: needsArg ? `${piece.trim()} ` : undefined })
  })
  return cols(indent.length + left.length + gap.length, p(indent), ...leftParts, p(gap), p(desc, 'muted'))
}

export function welcomeLines(welcome: string[]): TermLine[] {
  const [first, second = ''] = welcome
  const [before, ...after] = second.split(/\b(help)\b/)
  return [
    line('out', [p(first, undefined, { bold: true })]),
    out(p(before), p('help', 'blue', { bold: true, run: 'help' }), p(after.slice(1).join(''))),
  ]
}

const findProject = (ref: string, lang: Lang) =>
  /^\d+$/.test(ref) ? projects[Number(ref) - 1] : projects.find(x => x.title[lang].toLowerCase().includes(ref))

export function runCommand(raw: string, { lang, t }: Ctx): { lines: TermLine[]; action?: TermAction } {
  const [cmd, ...args] = raw.trim().split(/\s+/)
  const arg = args.join(' ').toLowerCase()
  const tt = t.terminal
  const echo = line('in', [p(cmd, 'blue', { bold: true }), p(raw.trim().slice(cmd.length))])
  const reply = (lines: TermLine[], action?: TermAction) => ({ lines: [echo, ...lines], action })
  const detailLabel: Record<Detail, string> = { problem: t.projects.problem, decision: t.projects.decision, features: t.projects.tabFeatures }

  switch (cmd.toLowerCase()) {
    case 'help':
      return reply(tt.help.map(helpLine))

    case 'about':
      return reply(tt.about.map(s => out(p(s))))

    case 'stack':
      return reply([
        cols(11, p(t.stack.languages.padEnd(11), 'muted'), p(stack.languages.join(' · '), 'blue')),
        cols(11, p(t.stack.databases.padEnd(11), 'muted'), p(stack.databases.join(' · '), 'amber')),
        cols(11, p(t.stack.infra.padEnd(11), 'muted'), p(stack.infra.join(' · '), 'green')),
      ])

    case 'experience':
    case 'education': {
      const name = cmd.toLowerCase()
      const entries = timeline.filter(e => (name === 'experience' ? ['work'] : ['education', 'competition']).includes(e.category))
      const summary = (e: (typeof entries)[number]) => [
        p(e.period[lang], 'amber', { bold: true }), p(' · ', 'muted'), p(e.role[lang], undefined, { bold: true }), p(' · ', 'muted'), p(e.org[lang], 'blue'),
        ...(e.current ? [p(` [${t.timeline.present}]`, 'green')] : []),
      ]

      if (/^\d+$/.test(arg)) {
        const e = entries[Number(arg) - 1]
        if (!e) return reply([err(tt.notFoundItem.replace('{x}', arg))])
        return reply([line('head', summary(e)), ...e.description[lang].map(bullet)])
      }
      return reply([
        ...entries.map((e, i) => cols(3, p(`${i + 1}  `, 'muted', { run: `${name} ${i + 1}` }), ...summary(e).map(part => ({ ...part, run: `${name} ${i + 1}` })))),
        blank(),
        out(p(tt.listHint.replace('{cmd}', name), 'muted')),
      ])
    }

    case 'projects':
      return reply([
        ...projects.map((proj, i) => cols(25,
          p(`${i + 1}  `, 'muted', { run: `project ${i + 1}` }),
          p(proj.title[lang].padEnd(16), undefined, { bold: true, run: `project ${i + 1}` }),
          p(proj.type.padEnd(6), TYPE_TONE[proj.type]),
          p(proj.tag, 'muted'),
        )),
        blank(),
        out(p(tt.projectsHint, 'muted')),
      ])

    case 'project': {
      const tokens = arg.split(/\s+/).filter(Boolean)
      const detail = DETAIL_ALIAS[tokens[tokens.length - 1]]
      const ref = (detail ? tokens.slice(0, -1) : tokens).join(' ')
      if (!ref) return reply([err(tt.projectUsage)])
      const project = findProject(ref, lang)
      if (!project) return reply([err(tt.projectNotFound.replace('{x}', ref))])

      const n = projects.indexOf(project) + 1
      const cs = project.caseStudy
      const more = (skip?: Detail) => out(
        p(`${tt.more} `, 'muted'),
        ...DETAILS.filter(d => d !== skip).flatMap(d => [p(detailLabel[d], DETAIL_TONE[d], { bold: true, run: `project ${n} ${d}` }), p('  ')]),
        ...(skip ? [p(project.title[lang], 'muted', { run: `project ${n}` })] : []),
      )

      if (detail === 'features') {
        return reply([line('head', [p(detailLabel.features, DETAIL_TONE.features, { bold: true })]), ...project.features[lang].map(bullet), blank(), more(detail)])
      }
      if (detail) {
        return reply([line('head', [p(detailLabel[detail], DETAIL_TONE[detail], { bold: true })]), paragraph(cs[detail][lang]), blank(), more(detail)])
      }
      return reply([
        line('head', [p(project.title[lang], undefined, { bold: true }), p(' · ', 'muted'), p(project.type, TYPE_TONE[project.type], { bold: true }), p(` · ${project.year}`, 'muted')]),
        out(p(project.tag, 'muted')),
        paragraph(project.description[lang][0]),
        paragraph(cs.facts.join(' · ')),
        ...(project.link ? [line('out', [p(project.link, 'blue', { href: project.link })], 2)] : []),
        blank(),
        more(),
      ])
    }

    case 'certificates':
      return reply(certificates.map(c => cols(6, p(c.year, 'amber'), p('  '), p(c.name, undefined, { bold: true }), p(` (${c.issuer})`, 'muted'))))

    case 'contact':
      return reply([
        cols(10, p('Email     ', 'muted'), p('hugodelelis05@gmail.com', 'blue', { href: 'mailto:hugodelelis05@gmail.com' })),
        cols(10, p('GitHub    ', 'muted'), p('github.com/Hugolelis', 'blue', { href: 'https://github.com/Hugolelis' })),
        cols(10, p('LinkedIn  ', 'muted'), p('linkedin.com/in/hugolelis', 'blue', { href: 'https://www.linkedin.com/in/hugolelis/' })),
      ])

    case 'cv':
      return reply([out(p(tt.cv, 'blue', { href: cvUrl }))])

    case 'goto': {
      const id = SECTIONS[arg]
      if (!id) return reply([err(tt.gotoUsage)])
      return reply([out(p(tt.goto.replace('{x}', arg), 'muted'))], { goto: id })
    }

    case 'theme':
      return reply([out(p(tt.theme, 'muted'))], 'theme')
    case 'lang':
      return reply([out(p(tt.lang, 'muted'))], 'lang')
    case 'clear':
      return { lines: [], action: 'clear' }
    case 'exit':
      return { lines: [], action: 'exit' }
    default:
      return reply([err(tt.notFound.replace('{cmd}', cmd))])
  }
}

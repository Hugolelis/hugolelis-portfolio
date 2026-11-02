const STOPWORDS = new Set(['of', 'and', 'the', 'for', 'de', 'da', 'do'])

function primaryOrg(issuer: string): string {
  const [first] = issuer.split('·')
  return first.trim()
}

function getInitials(org: string): string {
  const words = org.split(/\s+/).filter(word => !STOPWORDS.has(word.toLowerCase()))
  if (words.length <= 1) {
    const letters = (words[0] ?? org).replace(/[^A-Za-z]/g, '')
    return letters.length <= 3 ? letters.toUpperCase() : letters.slice(0, 2).toUpperCase()
  }
  return words.slice(0, 2).map(word => word[0]).join('').toUpperCase()
}

// orgs without a brand icon still get a color, so the badge text isn't
// stuck at the neutral default — picked to fit the site's existing tag
// palette rather than each org's real brand color
const ORG_COLOR: Record<string, string> = {
  IBM: 'var(--tag-api-color)',
  'University of Illinois': 'var(--tag-red-color)',
}

export interface IssuerBadge {
  org: string
  initials: string
  color: string
}

export function getIssuerBadge(issuer: string): IssuerBadge {
  const org = primaryOrg(issuer)
  return { org, initials: getInitials(org), color: ORG_COLOR[org] ?? 'var(--accent)' }
}

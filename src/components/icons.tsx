export const GithubIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
)

export const LinkedinIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
)

export const MailIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="3" /><path d="m2 7 10 6 10-6" /></svg>
)

// logo do portfólio: usa currentColor, então acompanha o tema (claro no escuro, escuro no claro)
export const Logo = () => (
  <svg viewBox="0 0 32 32" width="26" height="26" fill="none" aria-hidden="true" style={{ display: 'block' }}>
    <rect x="6" y="7" width="5" height="18" rx="1" fill="currentColor" opacity="0.15" />
    <rect x="21" y="7" width="5" height="18" rx="1" fill="currentColor" opacity="0.15" />
    <rect x="6" y="13" width="20" height="6" rx="1" fill="currentColor" />
    <rect x="6" y="7" width="5" height="6" rx="1" fill="currentColor" opacity="0.35" />
    <rect x="6" y="19" width="5" height="6" rx="1" fill="currentColor" opacity="0.35" />
    <rect x="21" y="7" width="5" height="6" rx="1" fill="currentColor" opacity="0.35" />
    <rect x="21" y="19" width="5" height="6" rx="1" fill="currentColor" opacity="0.35" />
    <circle cx="27" cy="26" r="1.5" fill="currentColor" />
  </svg>
)

const stroke = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

export const BriefcaseIcon = ({ size = 16 }: { size?: number }) => (
  <svg {...stroke} width={size} height={size} aria-hidden="true">
    <rect x="2.5" y="7" width="19" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M2.5 13h19" />
  </svg>
)

export const GraduationCapIcon = ({ size = 16 }: { size?: number }) => (
  <svg {...stroke} width={size} height={size} aria-hidden="true">
    <path d="M2 9.5 12 5l10 4.5-10 4.5-10-4.5Z" /><path d="M6.5 11.7V17c0 1.4 2.46 2.5 5.5 2.5s5.5-1.1 5.5-2.5v-5.3" /><path d="M21 9.5V15" />
  </svg>
)

export const TrophyIcon = ({ size = 16 }: { size?: number }) => (
  <svg {...stroke} width={size} height={size} aria-hidden="true">
    <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" /><path d="M7 5H4a1 1 0 0 0-1 1v1a4 4 0 0 0 4 4" /><path d="M17 5h3a1 1 0 0 1 1 1v1a4 4 0 0 1-4 4" />
    <path d="M12 14v3" /><path d="M8.5 20.5h7" /><path d="M9.5 17.3 8.5 20.5" /><path d="M14.5 17.3l1 3.2" />
  </svg>
)

export const FileIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /><path d="M9 13h6M9 17h4" /></svg>
)

export const ChatIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-5.4A8 8 0 1 1 21 12Z" /></svg>
)

export const MenuIcon = ({ open }: { open: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
  </svg>
)

// ícones do botão de tema: sol (no escuro, leva ao claro) e lua (no claro, leva ao escuro)
export const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
)

export const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
  </svg>
)

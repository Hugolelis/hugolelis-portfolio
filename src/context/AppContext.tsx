import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { Theme, Lang } from '../types'
import { pt, en } from '../i18n'
import type { Translations } from '../i18n'

interface AppContextValue {
  theme: Theme
  toggleTheme: () => void
  lang: Lang
  toggleLang: () => void
  t: Translations
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'light' || saved === 'dark') return saved
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem('lang')
    if (saved === 'pt' || saved === 'en') return saved
    return navigator.language?.toLowerCase().startsWith('pt') ? 'pt' : 'en'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem('lang', lang)
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en'
  }, [lang])

  const toggleTheme = () => {
    // fade colors for a moment instead of snapping (see .theme-fade in index.css)
    const root = document.documentElement
    root.classList.add('theme-fade')
    window.setTimeout(() => root.classList.remove('theme-fade'), 400)
    setTheme(t => t === 'dark' ? 'light' : 'dark')
  }
  const toggleLang = () => setLang(l => l === 'pt' ? 'en' : 'pt')

  const t = lang === 'pt' ? pt : en

  return (
    <AppContext.Provider value={{ theme, toggleTheme, lang, toggleLang, t }}>
      {children}
    </AppContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

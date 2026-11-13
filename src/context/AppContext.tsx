import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { dict, type Dict } from '../i18n'
import type { Lang, Theme } from '../types'

interface AppState {
  lang: Lang
  theme: Theme
  t: Dict
  toggleLang: () => void
  toggleTheme: () => void
}

const Ctx = createContext<AppState | null>(null)

const read = (k: string) => {
  try { return localStorage.getItem(k) } catch { return null }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const s = read('lang')
    return s === 'pt' || s === 'en' ? s : navigator.language.startsWith('pt') ? 'pt' : 'en'
  })
  const [theme, setTheme] = useState<Theme>(() => {
    const s = read('theme')
    return s === 'dark' || s === 'light' ? s : matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en'
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('lang', lang); localStorage.setItem('theme', theme) } catch { /* modo privado */ }
  }, [lang, theme])

  const value: AppState = {
    lang,
    theme,
    t: dict[lang],
    toggleLang: () => setLang(l => (l === 'pt' ? 'en' : 'pt')),
    toggleTheme: () => setTheme(m => (m === 'dark' ? 'light' : 'dark')),
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useApp fora do AppProvider')
  return v
}

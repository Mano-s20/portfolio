import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { copy, type Copy, type Lang } from './content'

interface LanguageValue {
  lang: Lang
  setLang: (lang: Lang) => void
  t: Copy
}

const LanguageContext = createContext<LanguageValue | null>(null)
const STORAGE_KEY = 'moony-language'

function initialLanguage(): Lang {
  const fromUrl = new URLSearchParams(window.location.search).get('lang')
  if (fromUrl === 'ar' || fromUrl === 'en') return fromUrl
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'ar' || stored === 'en') return stored
  return window.navigator.language.toLowerCase().startsWith('ar') ? 'ar' : 'en'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLanguage)

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    const current = copy[lang]
    const path = window.location.pathname
    const isNotFound = path !== '/' && path !== '/index.html'
    document.title = isNotFound ? `${current.notFound.code} — ${current.pageTitle}` : current.pageTitle
    document.querySelector('meta[name="description"]')?.setAttribute('content', current.description)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', current.ogTitle)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', current.ogDescription)
    document.querySelector('meta[property="og:locale"]')?.setAttribute('content', lang === 'ar' ? 'ar_EG' : 'en_US')
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', current.ogTitle)
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', current.ogDescription)
    const canonical = document.querySelector<HTMLLinkElement>('link[data-app-canonical]')
    if (canonical) canonical.href = `${window.location.origin}${path === '/index.html' ? '/' : path}`
  }, [lang])

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    window.localStorage.setItem(STORAGE_KEY, next)
    const url = new URL(window.location.href)
    if (next === 'ar') url.searchParams.set('lang', 'ar')
    else url.searchParams.delete('lang')
    window.history.replaceState(null, '', url)
  }, [])

  const value = useMemo(() => ({ lang, setLang, t: copy[lang] }), [lang, setLang])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const value = useContext(LanguageContext)
  if (!value) throw new Error('useLanguage must be used inside LanguageProvider')
  return value
}

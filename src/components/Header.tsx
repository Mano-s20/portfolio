import { useEffect, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

const SECTIONS = ['about', 'skills', 'experience', 'education', 'safety', 'contact'] as const

export function Header() {
  const { lang, setLang, t } = useLanguage()
  const [active, setActive] = useState<string>('')
  const [pathname, setPathname] = useState(() => window.location.pathname)
  const isNotFound = pathname !== '/' && pathname !== '/index.html'
  const homeHref = lang === 'ar' ? '/?lang=ar' : '/'

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    if (isNotFound) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-25% 0px -55% 0px', threshold: [0, 0.2, 0.5] },
    )
    SECTIONS.forEach((id) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })
    return () => observer.disconnect()
  }, [isNotFound])

  const labels = {
    about: t.nav.about,
    skills: t.nav.skills,
    experience: t.nav.experience,
    education: t.nav.education,
    safety: t.nav.safety,
    contact: t.nav.contact,
  }

  return (
    <header className="site-header">
      <div className="section-shell header-inner">
        <a className="brand" href={isNotFound ? homeHref : '#hero'} aria-label={`A·M·F — ${t.nav.home}`}>
          <svg viewBox="0 0 32 32" aria-hidden="true" className="brand-mark">
            <circle cx="16" cy="16" r="11" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
            <path d="M16 2v28M2 16h28" stroke="currentColor" strokeWidth="1" opacity="0.75" />
            <circle cx="16" cy="16" r="3" fill="currentColor" />
          </svg>
          <span className="brand-text" aria-hidden="true">A·M·F</span>
        </a>

        <nav aria-label={t.nav.primary} className="primary-nav">
          <ul>
            {SECTIONS.map((id) => (
              <li key={id}>
                <a
                  href={isNotFound ? `${homeHref}#${id}` : `#${id}`}
                  aria-current={!isNotFound && active === id ? 'location' : undefined}
                  data-active={!isNotFound && active === id}
                >
                  {labels[id]}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lang-switch" role="group" aria-label={t.nav.language}>
          <button
            type="button"
            lang="en"
            aria-pressed={lang === 'en'}
            onClick={() => setLang('en')}
          >
            EN
          </button>
          <span aria-hidden="true">/</span>
          <button
            type="button"
            lang="ar"
            aria-pressed={lang === 'ar'}
            onClick={() => setLang('ar')}
          >
            AR
          </button>
        </div>
      </div>
    </header>
  )
}

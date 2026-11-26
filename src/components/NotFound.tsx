import { useEffect } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

export function NotFound() {
  const { lang, t } = useLanguage()

  useEffect(() => {
    const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
    document.title = `${t.notFound.code} — ${t.pageTitle}`
    robots?.setAttribute('content', 'noindex, follow')
    return () => {
      document.title = t.pageTitle
      robots?.setAttribute('content', 'index, follow')
    }
  }, [t.notFound.code, t.pageTitle])

  return (
    <div className="section-shell not-found">
      <p className="mono-label not-found-code">{t.notFound.code}</p>
      <h1>{t.notFound.title}</h1>
      <p>{t.notFound.body}</p>
      <a className="btn btn-primary" href={lang === 'ar' ? '/?lang=ar' : '/'}>
        {t.notFound.cta}
      </a>
    </div>
  )
}

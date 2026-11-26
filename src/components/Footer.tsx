import { useEffect, useState } from 'react'
import { useEnvironmentContext } from '../context/EnvironmentContext'
import { useLanguage } from '../i18n/LanguageContext'

export function Footer() {
  const { lang, t } = useLanguage()
  const { reduced, systemReduced, userReduced, setUserReduced } = useEnvironmentContext()
  const [pathname, setPathname] = useState(() => window.location.pathname)
  const isNotFound = pathname !== '/' && pathname !== '/index.html'
  const homeHref = lang === 'ar' ? '/?lang=ar' : '/'

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  return (
    <footer className="site-footer">
      <div className="section-shell footer-inner">
        <p className="footer-note">{t.footer.note}</p>
        {reduced && (
          <span className="motion-indicator" role="status">
            {systemReduced ? t.motionStatusSystemOff : t.motionStatusOff}
          </span>
        )}
        <button
          type="button"
          className="footer-control"
          aria-pressed={reduced}
          onClick={() => setUserReduced(!userReduced)}
        >
          {reduced ? t.footer.motionOff : t.footer.motion}
        </button>
        <a className="footer-control" href={isNotFound ? homeHref : '#hero'}>{t.footer.backToTop}</a>
      </div>
    </footer>
  )
}

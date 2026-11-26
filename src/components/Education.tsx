import { useRef } from 'react'
import { useInView } from 'motion/react'
import { useLanguage } from '../i18n/LanguageContext'
import { SectionHeading } from './SectionHeading'

export function Education() {
  const { t } = useLanguage()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-12% 0px -12% 0px' })

  return (
    <section id="education" className="section section-shell" aria-labelledby="education-title">
      <SectionHeading id="education" label={t.education.label} heading={t.education.heading} />

      <div ref={ref} className="certificate" data-unfolded={inView}>
        <div className="certificate-grid">
          <svg className="certificate-seal" viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="1" opacity="0.55" />
            <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="1" opacity="0.3" />
            <path d="M50 18v64M18 50h64" stroke="currentColor" strokeWidth="1" opacity="0.75" />
            <path d="M34 50l11 11 22-24" stroke="currentColor" strokeWidth="2" />
          </svg>
          <div>
            <h3>{t.education.qualification}</h3>
            <div className="certificate-meta">
              <span>{t.education.institution}</span>
              <span>{t.education.years}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

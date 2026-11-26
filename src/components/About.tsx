import { useEffect, useRef, useState } from 'react'
import { useInView } from 'motion/react'
import { useEnvironmentContext } from '../context/EnvironmentContext'
import { useLanguage } from '../i18n/LanguageContext'
import { SectionHeading } from './SectionHeading'

const PORTRAIT_SRC = '/images/profile.jpg'
const PORTRAIT_SRC_SET = '/images/profile.jpg 1x, /images/profile@2x.jpg 2x'

export function About() {
  const { t } = useLanguage()
  const { reduced } = useEnvironmentContext()
  const portraitRef = useRef<HTMLButtonElement>(null)
  const inView = useInView(portraitRef, { once: true, margin: '-18% 0px -18% 0px' })
  const [revealed, setRevealed] = useState(reduced)

  useEffect(() => {
    if (reduced) setRevealed(true)
  }, [reduced])

  useEffect(() => {
    if (inView) setRevealed(true)
  }, [inView])

  return (
    <section id="about" className="section section-shell about-grid" aria-labelledby="about-title">
      <div className="about-copy">
        <SectionHeading id="about" label={t.about.label} heading={t.about.heading} />
        <p>{t.about.p1}</p>
        <p className="about-second">{t.about.p2}</p>
      </div>

      <div className="about-visual">
        <figure className="about-figure">
          <button
            ref={portraitRef}
            type="button"
            className="portrait"
            data-revealed={revealed}
            aria-pressed={!revealed}
            aria-label={t.about.photoAction}
            onClick={() => setRevealed((value) => !value)}
          >
            <img
              className="portrait-negative"
              src={PORTRAIT_SRC}
              srcSet={PORTRAIT_SRC_SET}
              sizes="(max-width: 640px) 70vw, 340px"
              alt=""
              aria-hidden="true"
            />
            <img
              className="portrait-positive"
              src={PORTRAIT_SRC}
              srcSet={PORTRAIT_SRC_SET}
              sizes="(max-width: 640px) 70vw, 340px"
              width={320}
              height={430}
              alt={t.about.caption}
            />
            <span className="portrait-scan" aria-hidden="true" />
            <span className="portrait-ring" aria-hidden="true" />
            <span className="portrait-tick portrait-tick--top" aria-hidden="true" />
            <span className="portrait-tick portrait-tick--end" aria-hidden="true" />
            <span className="portrait-tick portrait-tick--bottom" aria-hidden="true" />
            <span className="portrait-tick portrait-tick--start" aria-hidden="true" />
          </button>
          <figcaption className="portrait-caption">{t.about.caption}</figcaption>
        </figure>
      </div>
    </section>
  )
}

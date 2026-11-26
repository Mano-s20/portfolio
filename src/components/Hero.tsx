import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { useEnvironmentContext } from '../context/EnvironmentContext'
import { useLanguage } from '../i18n/LanguageContext'
import { Diagram } from './Diagrams'

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1]

interface Props {
  start: boolean
}

export function Hero({ start }: Props) {
  const { t } = useLanguage()
  const { reduced } = useEnvironmentContext()
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const visible = reduced || start

  const rise = (delay: number, distance = 12) => ({
    hidden: { opacity: 0, y: distance, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: reduced ? 0 : 0.62, delay: reduced ? 0 : delay, ease: EASE_OUT },
    },
  })

  return (
    <section ref={heroRef} id="hero" className="section hero" aria-labelledby="hero-title">
      <div className="section-shell hero-grid">
        <div className="hero-copy">
          <motion.p className="mono-label" variants={rise(0.72, 0)} initial="hidden" animate={visible ? 'visible' : 'hidden'}>
            {t.hero.eyebrow}
          </motion.p>

          <motion.h1
            id="hero-title"
            className="hero-title"
            variants={rise(0.8)}
            initial="hidden"
            animate={visible ? 'visible' : 'hidden'}
          >
            {t.hero.title}
          </motion.h1>

          <motion.p className="hero-role" variants={rise(0.88, 8)} initial="hidden" animate={visible ? 'visible' : 'hidden'}>
            {t.hero.role}
          </motion.p>

          <motion.p className="hero-tagline" variants={rise(0.96, 8)} initial="hidden" animate={visible ? 'visible' : 'hidden'}>
            {t.hero.tagline}
          </motion.p>

          <motion.p className="hero-tag mono-label" variants={rise(1, 6)} initial="hidden" animate={visible ? 'visible' : 'hidden'}>
            {t.hero.tag}
          </motion.p>

          <motion.div className="hero-actions" variants={rise(1.04, 6)} initial="hidden" animate={visible ? 'visible' : 'hidden'}>
            <a className="btn btn-primary" href="#contact">{t.hero.primary}</a>
            <a className="btn btn-secondary" href="#experience">{t.hero.secondary}</a>
          </motion.div>

          <motion.ul
            className="hero-meta"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: reduced ? 0 : 0.48, delay: reduced ? 0 : 0.8 } } }}
            initial="hidden"
            animate={visible ? 'visible' : 'hidden'}
          >
            {t.hero.meta.map((item) => <li key={item}>{item}</li>)}
          </motion.ul>
        </div>

        <motion.div className="hero-visual" variants={rise(0.8, 10)} initial="hidden" animate={visible ? 'visible' : 'hidden'}>
          <div className="hero-frame panel">
            <span className="scan-corner scan-corner--tl" aria-hidden="true" />
            <span className="scan-corner scan-corner--tr" aria-hidden="true" />
            <span className="scan-corner scan-corner--bl" aria-hidden="true" />
            <span className="scan-corner scan-corner--br" aria-hidden="true" />
            <Diagram kind="panoramic" title={t.skills.devices[0].name} />
            <span className="hero-readout-line" role="status">
              {start || reduced ? t.hero.readoutReady : t.hero.readoutScanning}
            </span>
          </div>
        </motion.div>
      </div>

      <motion.p className="hero-scroll mono-label" style={{ opacity: scrollOpacity }}>
        {t.hero.scroll}
      </motion.p>
    </section>
  )
}

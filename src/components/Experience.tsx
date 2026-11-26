import { useEffect, useRef } from 'react'
import { useInView } from 'motion/react'
import { useEnvironmentContext } from '../context/EnvironmentContext'
import { useLanguage } from '../i18n/LanguageContext'
import { SectionHeading } from './SectionHeading'

type EnterMode = 'digital' | 'analog' | 'film'

interface ExperienceItem {
  org: string
  place: string
  duration: string
  role: string
  bullets: string[]
}

const ENTER_MODES: EnterMode[] = ['digital', 'analog', 'film']

function TimelineItem({ item, enter }: { item: ExperienceItem; enter: EnterMode }) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-12% 0px -12% 0px' })

  return (
    <article ref={ref} className="timeline-item" data-enter={inView ? enter : undefined}>
      <div className="timeline-head">
        <h3>{item.org}</h3>
        <div className="timeline-meta">
          <span>{item.place}</span>
          <span>{item.duration}</span>
        </div>
        <p className="timeline-role">{item.role}</p>
      </div>
      <div className="timeline-body">
        <ul className="timeline-bullets">
          {item.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
        </ul>
      </div>
    </article>
  )
}

export function Experience() {
  const { t } = useLanguage()
  const { reduced } = useEnvironmentContext()
  const timelineRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fill = fillRef.current
    const timeline = timelineRef.current
    if (!fill || !timeline) return

    if (reduced) {
      fill.style.transform = 'scaleY(1)'
      return
    }

    let cancelled = false
    let revert: (() => void) | undefined

    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([gsapModule, scrollModule]) => {
      if (cancelled) return
      const { gsap } = gsapModule
      const { ScrollTrigger } = scrollModule
      gsap.registerPlugin(ScrollTrigger)
      const context = gsap.context(() => {
        gsap.fromTo(
          fill,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: timeline,
              start: 'top 75%',
              end: 'bottom 75%',
              scrub: 0.4,
            },
          },
        )
      }, timeline)
      revert = () => context.revert()
    })

    return () => {
      cancelled = true
      revert?.()
    }
  }, [reduced])

  return (
    <section id="experience" className="section section-shell" aria-labelledby="experience-title">
      <SectionHeading
        id="experience"
        label={t.experience.label}
        heading={t.experience.heading}
        intro={t.experience.intro}
      />

      <div ref={timelineRef} className="timeline">
        <div className="timeline-rail" aria-hidden="true">
          <div ref={fillRef} className="timeline-rail-fill" />
        </div>
        {t.experience.items.map((item, index) => (
          <TimelineItem key={item.org} item={item} enter={ENTER_MODES[index] ?? 'digital'} />
        ))}
      </div>
    </section>
  )
}

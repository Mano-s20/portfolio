import { useRef } from 'react'
import { useInView } from 'motion/react'
import { useLanguage } from '../i18n/LanguageContext'
import { Diagram, type DiagramKind } from './Diagrams'
import { SectionHeading } from './SectionHeading'

const DEVICE_DIAGRAMS: DiagramKind[] = ['cbct', 'panoramic', 'cephalometric']

function SkillMeter({ name }: { name: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px -10% 0px' })

  return (
    <div ref={ref} className="skill-row">
      <h3>{name}</h3>
      <div className="meter meter-track" data-filled={inView} aria-hidden="true">
        <div className="meter-fill" />
      </div>
    </div>
  )
}

export function Skills() {
  const { t } = useLanguage()

  return (
    <section id="skills" className="section section-shell skills-grid" aria-labelledby="skills-title">
      <SectionHeading
        id="skills"
        label={t.skills.label}
        heading={t.skills.heading}
        intro={t.skills.intro}
        rail
      />

      <div className="section-content--wide">
        <h3 className="mono-label">{t.skills.deviceTitle}</h3>
        <div className="device-list">
          {t.skills.devices.map((device, index) => (
            <article key={device.name} className={`device-card${index === 0 ? ' device-card--feature' : ''}`}>
              <Diagram kind={DEVICE_DIAGRAMS[index]} title={device.name} />
              <div>
                <h3>{device.name}</h3>
                <p>{device.body}</p>
              </div>
            </article>
          ))}
        </div>

        <h3 className="mono-label skill-title">{t.skills.skillTitle}</h3>
        <div className="skill-list">
          {t.skills.skills.map((skill) => (
            <div key={skill.name} className="skill-entry">
              <SkillMeter name={skill.name} />
              <p>{skill.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

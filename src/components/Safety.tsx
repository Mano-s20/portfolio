import { useLanguage } from '../i18n/LanguageContext'
import { Diagram } from './Diagrams'
import { SectionHeading } from './SectionHeading'

export function Safety() {
  const { t } = useLanguage()

  return (
    <section id="safety" className="section section-shell" aria-labelledby="safety-title">
      <div className="safety-layout">
        <div className="safety-lead">
          <SectionHeading id="safety" label={t.safety.label} heading={t.safety.heading} intro={t.safety.intro} />
          <Diagram kind="trefoil" title={t.safety.heading} className="safety-icon" />
          <p className="alara-label">{t.safety.principle}</p>
        </div>

        <div className="alara-wrap">
          <div className="alara-grid">
            {t.safety.cards.map((card, index) => (
              <article key={card.title} className="alara-card panel">
                {index === 2 && <Diagram kind="apron" className="alara-diagram" />}
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </article>
            ))}
          </div>
          <p className="safety-closing">{t.safety.closing}</p>
        </div>
      </div>
    </section>
  )
}

import { type PointerEvent, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { useEnvironmentContext } from '../context/EnvironmentContext'
import { contactLinks } from '../i18n/content'
import { useLanguage } from '../i18n/LanguageContext'
import { Diagram } from './Diagrams'
import { SectionHeading } from './SectionHeading'

interface MagneticLinkProps {
  href: string
  className: string
  children: ReactNode
  external?: boolean
}

type RowIconKind = 'phone' | 'mail' | 'facebook' | 'arrow'

function MagneticLink({ href, className, children, external = false }: MagneticLinkProps) {
  const { reduced, finePointer } = useEnvironmentContext()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 24 })
  const springY = useSpring(y, { stiffness: 300, damping: 24 })

  const onPointerMove = (event: PointerEvent<HTMLAnchorElement>) => {
    if (reduced || !finePointer) return
    const rect = event.currentTarget.getBoundingClientRect()
    const offsetX = event.clientX - rect.left - rect.width / 2
    const offsetY = event.clientY - rect.top - rect.height / 2
    x.set(Math.max(-4, Math.min(4, offsetX * 0.08)))
    y.set(Math.max(-4, Math.min(4, offsetY * 0.08)))
  }

  const onPointerLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.a
      href={href}
      className={className}
      style={finePointer && !reduced ? { x: springX, y: springY } : undefined}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >
      {children}
    </motion.a>
  )
}

function RowIcon({ kind }: { kind: RowIconKind }) {
  const common = {
    viewBox: '0 0 20 20',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
    focusable: 'false' as const,
  }

  if (kind === 'phone') {
    return (
      <svg {...common}>
        <path d="M6.2 3.3 8.1 6.2 6.6 7.7a11.5 11.5 0 0 0 5.7 5.7l1.5-1.5 2.9 1.9-.4 2.6a1.8 1.8 0 0 1-2 1.5C8.2 17.5 2.5 11.8 1.7 5.7a1.8 1.8 0 0 1 1.5-2l2.6-.4Z" />
      </svg>
    )
  }

  if (kind === 'mail') {
    return (
      <svg {...common}>
        <rect x="2.5" y="4.5" width="15" height="11" rx="1" />
        <path d="m3 5 7 5.5L17 5" />
      </svg>
    )
  }

  if (kind === 'facebook') {
    return (
      <svg {...common} fill="currentColor" stroke="none">
        <path d="M11.4 17v-5.3h1.8l.3-2.1h-2.1V8.2c0-.6.2-1 1-1h1.2V5.3c-.2 0-1-.1-1.8-.1-1.8 0-3 1.1-3 3.1v1.4H7.9v2.1h1.9V17Z" />
      </svg>
    )
  }

  return (
    <svg {...common}>
      <path d="M4 10h11M11 6l4 4-4 4" />
    </svg>
  )
}

interface ContactRowProps {
  href: string
  icon: RowIconKind
  label: string
  value: string
  external?: boolean
}

function ContactRow({ href, icon, label, value, external = false }: ContactRowProps) {
  return (
    <a
      className="contact-row"
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >
      <span className="contact-row-icon">
        <RowIcon kind={icon} />
      </span>
      <span className="contact-row-text">
        <span className="contact-row-label">{label}</span>
        <span className="contact-row-value" dir="ltr">{value}</span>
      </span>
      <span className="contact-row-arrow">
        <RowIcon kind="arrow" />
      </span>
    </a>
  )
}

export function Contact() {
  const { t } = useLanguage()
  const whatsappHref = `${contactLinks.whatsapp}?text=${encodeURIComponent(t.waMessage)}`

  return (
    <section id="contact" className="section section-shell" aria-labelledby="contact-title">
      <div className="contact-grid">
        <div className="contact-copy">
          <SectionHeading id="contact" label={t.contact.label} heading={t.contact.heading} intro={t.contact.intro} />
          <p className="contact-location">{t.contact.location}</p>
        </div>

        <div className="contact-actions">
          <div className="contact-shell">
            <MagneticLink href={whatsappHref} className="btn btn-primary contact-whatsapp" external>
              {t.contact.primary}
            </MagneticLink>
            <div className="contact-links">
              <ContactRow
                href={contactLinks.tel}
                icon="phone"
                label={t.contact.call}
                value={contactLinks.phone}
              />
              <ContactRow
                href={`mailto:${contactLinks.email}`}
                icon="mail"
                label={t.contact.email}
                value={contactLinks.email}
              />
              <ContactRow
                href={contactLinks.facebook}
                icon="facebook"
                label={t.contact.social}
                value="3bdo.mony"
                external
              />
            </div>
            <Diagram kind="ecg" className="contact-ecg" />
          </div>
        </div>
      </div>
    </section>
  )
}

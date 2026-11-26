interface Props {
  id: string
  label: string
  heading: string
  intro?: string
  rail?: boolean
}

export function SectionHeading({ id, label, heading, intro, rail = false }: Props) {
  return (
    <div className={`section-head${rail ? ' section-head--rail' : ''}`}>
      <p className="mono-label">{label}</p>
      <h2 id={`${id}-title`}>{heading}</h2>
      {intro && <p className="section-intro">{intro}</p>}
    </div>
  )
}

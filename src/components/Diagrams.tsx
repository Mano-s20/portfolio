import { useRef } from 'react'
import { useInView } from 'motion/react'

export type DiagramKind = 'cbct' | 'panoramic' | 'cephalometric' | 'trefoil' | 'apron' | 'ecg'

interface Props {
  kind: DiagramKind
  className?: string
  title?: string
}

export function Diagram({ kind, className = '', title }: Props) {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true, margin: '-12% 0px -12% 0px' })
  const drawClass = `diagram draw ${inView ? 'is-visible' : ''} ${className}`

  const common = {
    ref,
    viewBox: '0 0 100 100',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.4,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className: drawClass,
    role: 'img' as const,
    'aria-hidden': title ? undefined : (true as const),
    'aria-label': title,
  }

  if (kind === 'cbct') {
    return (
      <svg {...common}>
        {/* Orbit track and rotating source/detector pair. */}
        <circle cx="50" cy="50" r="37" pathLength={1} style={{ '--delay': '0ms' } as React.CSSProperties} opacity="0.35" />
        <g className="diagram-spin">
          <path d="M50 13 A37 37 0 0 1 87 50 A37 37 0 0 1 50 87 A37 37 0 0 1 13 50 A37 37 0 0 1 50 13 Z" pathLength={1} style={{ '--delay': '120ms' } as React.CSSProperties} />
          <rect x="45" y="6" width="10" height="8" rx="1.5" pathLength={1} style={{ '--delay': '260ms' } as React.CSSProperties} />
          <rect x="45" y="86" width="10" height="8" rx="1.5" pathLength={1} style={{ '--delay': '360ms' } as React.CSSProperties} />
          <path d="M50 14 L50 86" pathLength={1} style={{ '--delay': '520ms' } as React.CSSProperties} opacity="0.38" />
        </g>
        {/* Head outline in the centre of the gantry. */}
        <path
          d="M50 25 C60 25 67 32 67 42 C67 49 63 54 61 58 L61 66 C61 71 56 74 50 74 C44 74 39 71 39 66 L39 58 C37 54 33 49 33 42 C33 32 40 25 50 25 Z"
          pathLength={1}
          style={{ '--delay': '620ms' } as React.CSSProperties}
        />
        <path d="M40 62 Q50 68 60 62" pathLength={1} style={{ '--delay': '760ms' } as React.CSSProperties} opacity="0.65" />
        <path d="M43 43 L47 43 M53 43 L57 43" pathLength={1} style={{ '--delay': '880ms' } as React.CSSProperties} opacity="0.55" />
        <path d="M44 74 L44 80 M56 74 L56 80" pathLength={1} style={{ '--delay': '980ms' } as React.CSSProperties} opacity="0.5" />
      </svg>
    )
  }

  if (kind === 'panoramic') {
    // Clean panoramic gantry: a source/detector pair orbits a head outline.
    return (
      <svg {...common}>
        <circle cx="50" cy="50" r="36" pathLength={1} style={{ '--delay': '0ms' } as React.CSSProperties} opacity="0.35" />
        <g className="diagram-spin">
          <path d="M50 14 A36 36 0 0 1 86 50 A36 36 0 0 1 50 86" pathLength={1} style={{ '--delay': '140ms' } as React.CSSProperties} opacity="0.7" />
          <rect x="46" y="8" width="8" height="7" rx="1.5" pathLength={1} style={{ '--delay': '280ms' } as React.CSSProperties} />
          <rect x="46" y="85" width="8" height="7" rx="1.5" pathLength={1} style={{ '--delay': '380ms' } as React.CSSProperties} />
          <path d="M50 16 L50 84" pathLength={1} style={{ '--delay': '520ms' } as React.CSSProperties} opacity="0.32" />
        </g>
        <path
          d="M50 26 C59 26 65 32 65 41 C65 48 61 53 59 57 L59 64 C59 70 55 73 50 73 C45 73 41 70 41 64 L41 57 C39 53 35 48 35 41 C35 32 41 26 50 26 Z"
          pathLength={1}
          style={{ '--delay': '640ms' } as React.CSSProperties}
        />
        <path d="M42 61 Q50 67 58 61" pathLength={1} style={{ '--delay': '820ms' } as React.CSSProperties} opacity="0.7" />
        <path d="M44 62 L44 66 M48 63 L48 67 M52 63 L52 67 M56 62 L56 66" pathLength={1} style={{ '--delay': '960ms' } as React.CSSProperties} opacity="0.45" />
      </svg>
    )
  }

  if (kind === 'cephalometric') {
    return (
      <svg {...common}>
        <path d="M34 24 C48 18 62 24 66 36 L72 44 L66 50 L68 62 L62 72 L50 78 L36 76 L28 66 L26 54 L30 46 L28 36 Z" pathLength={1} style={{ '--delay': '0ms' } as React.CSSProperties} />
        <path d="M26 62 L74 62" pathLength={1} style={{ '--delay': '700ms' } as React.CSSProperties} opacity="0.6" />
        <path d="M20 24 L20 80 M20 24 L26 24" pathLength={1} style={{ '--delay': '860ms' } as React.CSSProperties} opacity="0.4" />
      </svg>
    )
  }

  if (kind === 'trefoil') {
    return (
      <svg {...common}>
        <g className="trefoil">
          <path d="M50 50 L35 15 A40 40 0 0 1 65 15 Z" pathLength={1} fill="currentColor" fillOpacity="0.12" />
          <path d="M50 50 L35 15 A40 40 0 0 1 65 15 Z" pathLength={1} transform="rotate(120 50 50)" fill="currentColor" fillOpacity="0.12" />
          <path d="M50 50 L35 15 A40 40 0 0 1 65 15 Z" pathLength={1} transform="rotate(240 50 50)" fill="currentColor" fillOpacity="0.12" />
        </g>
        <circle cx="50" cy="50" r="5" pathLength={1} style={{ '--delay': '700ms' } as React.CSSProperties} />
      </svg>
    )
  }

  if (kind === 'apron') {
    return (
      <svg {...common}>
        <path d="M36 22 Q50 14 64 22 L78 82 Q50 88 22 82 Z" pathLength={1} style={{ '--delay': '0ms' } as React.CSSProperties} fill="currentColor" fillOpacity="0.06" />
        <path d="M36 22 Q50 34 64 22" pathLength={1} style={{ '--delay': '500ms' } as React.CSSProperties} />
        <path d="M50 36 L50 82" pathLength={1} style={{ '--delay': '760ms' } as React.CSSProperties} opacity="0.5" />
        <path d="M22 82 L78 82" pathLength={1} style={{ '--delay': '920ms' } as React.CSSProperties} opacity="0.5" />
      </svg>
    )
  }

  return (
    <svg {...common} viewBox="0 0 200 60" preserveAspectRatio="none">
      <path
        d="M0 30 L28 30 L36 30 L42 14 L52 48 L62 22 L70 30 L96 30 L104 30 L112 18 L120 40 L128 30 L200 30"
        pathLength={1}
        style={{ '--delay': '0ms' } as React.CSSProperties}
      />
    </svg>
  )
}

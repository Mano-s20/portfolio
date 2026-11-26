import { useEffect, useRef } from 'react'

interface Point {
  x: number
  y: number
}

function anatomyTargets(count: number, w: number, h: number): Point[] {
  const cx = w * 0.68
  const cy = h * 0.48
  const size = Math.min(w, h) * 0.26
  const points: Point[] = []

  for (let i = 0; i < count; i++) {
    const r = i / count
    let x: number
    let y: number
    if (r < 0.46) {
      const angle = (i / (count * 0.46)) * Math.PI * 2
      x = cx + Math.cos(angle) * size
      y = cy + Math.sin(angle) * size * 1.12 - size * 0.12
    } else if (r < 0.66) {
      const angle = ((i - count * 0.46) / (count * 0.2)) * Math.PI * 0.8 + Math.PI * 0.1
      x = cx + Math.cos(angle) * size * 0.72
      y = cy + size * 0.5 + Math.sin(angle) * size * 0.52
    } else if (r < 0.82) {
      const eyeIndex = Math.floor((i - count * 0.66) / (count * 0.08))
      const angle = (((i - count * 0.66) % (count * 0.08)) / (count * 0.08)) * Math.PI * 2
      x = cx + (eyeIndex === 0 ? -1 : 1) * size * 0.38 + Math.cos(angle) * size * 0.13
      y = cy - size * 0.02 + Math.sin(angle) * size * 0.15
    } else {
      const angle = ((i - count * 0.82) / (count * 0.18)) * Math.PI * 0.7 + Math.PI * 0.15
      x = cx + Math.cos(angle) * size * 0.52
      y = cy + size * 0.58 + Math.sin(angle) * size * 0.16
    }
    points.push({ x, y })
  }
  return points
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let width = 0
    let height = 0
    const count = 220
    let starts: Point[] = []
    let targets: Point[] = []
    let visible = true
    let frame = 0
    const started = performance.now()

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const cols = 22
      const rows = Math.ceil(count / cols)
      starts = Array.from({ length: count }, (_, i) => ({
        x: (i % cols) / (cols - 1) * width,
        y: Math.floor(i / cols) / (rows - 1) * height,
      }))
      targets = anatomyTargets(count, width, height)
    }

    const draw = (now: number) => {
      frame = requestAnimationFrame(draw)
      if (!visible || document.hidden) return
      ctx.clearRect(0, 0, width, height)
      const progress = Math.min(1, (now - started) / 1600)
      const eased = 1 - Math.pow(1 - progress, 3)
      const rotation = (now - started) * 0.00006
      const cos = Math.cos(rotation)
      const sin = Math.sin(rotation)
      const anchor = targets[0]

      for (let i = 0; i < count; i++) {
        const target = targets[i]
        const dx = target.x - anchor.x
        const dy = target.y - anchor.y
        const rx = anchor.x + dx * cos - dy * sin
        const ry = anchor.y + dx * sin + dy * cos
        const x = starts[i].x + (rx - starts[i].x) * eased
        const y = starts[i].y + (ry - starts[i].y) * eased
        const depth = 0.35 + (i % 7) / 14
        ctx.fillStyle = `rgba(107, 213, 255, ${depth * 0.55})`
        ctx.fillRect(x, y, 1.6, 1.6)
      }
    }

    const hero = document.getElementById('hero')
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting }, { threshold: 0 })
    if (hero) observer.observe(hero)
    resize()
    window.addEventListener('resize', resize, { passive: true })
    frame = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="particle-field" aria-hidden="true" />
}

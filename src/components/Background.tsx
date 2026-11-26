import { useEffect, useRef } from 'react'
import { createBackgroundConfig } from '../background/config'
import { BackgroundEngine } from '../background/engine'
import { useEnvironmentContext } from '../context/EnvironmentContext'

/** Fixed, non-interactive background. All motion lives in one engine instance. */
export function ScanBackground() {
  const { reduced, weak } = useEnvironmentContext()
  const rootRef = useRef<HTMLDivElement>(null)
  const baseRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wireRef = useRef<HTMLCanvasElement>(null)
  const lensRef = useRef<HTMLDivElement>(null)
  const grainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduced) return
    const root = rootRef.current
    const base = baseRef.current
    const grid = gridRef.current
    const canvas = canvasRef.current
    const wireCanvas = wireRef.current
    const lens = lensRef.current
    const grain = grainRef.current
    if (!root || !base || !grid || !canvas || !wireCanvas || !lens || !grain) return

    const engine = new BackgroundEngine(
      { root, base, grid, canvas, wireCanvas, lens, grain },
      createBackgroundConfig(weak),
    )
    engine.start()
    return () => engine.stop()
  }, [reduced, weak])

  return (
    <div className="bg-system" ref={rootRef} aria-hidden="true">
      <div className="bg-layer bg-base" ref={baseRef}>
        <div className="bg-glow" />
        <div className="bg-glow bg-glow--secondary" />
      </div>
      <div className="bg-layer bg-grid" ref={gridRef} />
      <canvas className="bg-wireframe" ref={wireRef} />
      <canvas className="bg-canvas" ref={canvasRef} />
      <div className="bg-layer bg-grain" ref={grainRef} />
      <div className="bg-layer bg-vignette" />
      <div className="bg-lens" ref={lensRef} />
    </div>
  )
}

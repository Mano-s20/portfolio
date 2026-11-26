import { SECTION_IDS, type BackgroundConfig, type SectionId } from './config'
import {
  createParticles,
  drawGridPulse,
  drawLensBones,
  drawMood,
  drawParticles,
  drawRareEvent,
  type GridPulse,
  type Particle,
  type RareEvent,
  type RenderState,
  wireCenter,
  wireSize,
} from './renderers'
import type { WebGLWireframe } from './webglWireframe'

interface EngineElements {
  root: HTMLElement
  grid: HTMLElement
  base: HTMLElement
  canvas: HTMLCanvasElement
  wireCanvas: HTMLCanvasElement
  lens: HTMLElement
  grain: HTMLElement
}

interface WireOptions {
  time: number
  alpha: number
  strokeAlpha: number
  pointAlpha: number
  glowAlpha: number
  beamWidth: number
  beamBrighten: number
  rotation: number
  x: number
  y: number
  size: number
  beamY: number
  pointer: { x: number; y: number; active: boolean }
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v))
const smooth = (t: number) => t * t * (3 - 2 * t)
const mod = (v: number, n: number) => ((v % n) + n) % n

function supportsWebGL(): boolean {
  try {
    const probe = document.createElement('canvas')
    return Boolean(probe.getContext('webgl2') || probe.getContext('webgl'))
  } catch {
    return false
  }
}

/** Grain is generated once as a static PNG; it never animates. */
function grainUrl(): string {
  const tile = document.createElement('canvas')
  tile.width = 128
  tile.height = 128
  const ctx = tile.getContext('2d')
  if (!ctx) return ''
  const image = ctx.createImageData(128, 128)
  for (let i = 0; i < image.data.length; i += 4) {
    const v = 120 + Math.random() * 135
    image.data[i] = v
    image.data[i + 1] = v
    image.data[i + 2] = v
    image.data[i + 3] = 255
  }
  ctx.putImageData(image, 0, 0)
  return tile.toDataURL('image/png')
}

export class BackgroundEngine {
  private ctx: CanvasRenderingContext2D | null
  private raf = 0
  private stopped = true
  private started = performance.now()
  private last = 0
  private width = 0
  private height = 0
  private dpr = 1
  private particles: Particle[] = []
  private active: SectionId = 'hero'
  private previous: SectionId | null = null
  private fadeStart = 0
  private observer: IntersectionObserver | null = null
  private wire: WebGLWireframe | null = null
  private wire2D = true
  private pointer = { x: -500, y: -500, active: false }
  private lastPointerAt = 0
  private pointerTarget: { x: number; y: number; active: boolean } = { x: -500, y: -500, active: false }
  private scrollY = window.scrollY
  private parallax = { x: 0, y: 0 }
  private gridPulses: GridPulse[] = []
  private nextGridPulse = 0
  private rareEvent: RareEvent | null = null
  private nextRareEvent = 0
  private contactTarget = { x: 0, y: 0 }
  private contactEcgY = 0
  private contactEl: HTMLElement | null = null
  private contactEcgEl: HTMLElement | null = null

  constructor(
    private readonly el: EngineElements,
    private readonly config: BackgroundConfig,
  ) {
    this.ctx = el.canvas.getContext('2d', { alpha: true })
  }

  private onScroll = () => { this.scrollY = window.scrollY; this.updateContactTarget() }
  private onResize = () => this.resize()
  private onPointerMove = (event: PointerEvent) => {
    this.pointerTarget.x = event.clientX
    this.pointerTarget.y = event.clientY
    this.pointerTarget.active = true
    this.lastPointerAt = performance.now()
  }
  private onPointerLeave = () => { this.pointerTarget.active = false; this.lastPointerAt = performance.now() }
  private onVisibility = () => {
    if (document.hidden) this.pause()
    else this.resume()
  }

  start(): void {
    if (!this.stopped) return
    this.stopped = false
    this.started = performance.now()
    this.last = this.started
    this.lastPointerAt = this.started
    this.nextGridPulse = this.started + 600
    this.nextRareEvent = this.started + this.config.rareMinMs + Math.random() * (this.config.rareMaxMs - this.config.rareMinMs)
    this.el.grain.style.backgroundImage = `url("${grainUrl()}")`
    this.contactEl = document.querySelector<HTMLElement>('#contact .contact-shell')
    this.contactEcgEl = document.querySelector<HTMLElement>('#contact .contact-ecg')
    this.resize()
    this.observe()
    window.addEventListener('resize', this.onResize, { passive: true })
    window.addEventListener('scroll', this.onScroll, { passive: true })
    document.addEventListener('visibilitychange', this.onVisibility)
    if (this.config.finePointer && !this.config.weak) {
      window.addEventListener('pointermove', this.onPointerMove, { passive: true })
      document.addEventListener('pointerleave', this.onPointerLeave)
    }
    this.initWire()
    this.raf = requestAnimationFrame(this.tick)
  }

  stop(): void {
    if (this.stopped) return
    this.stopped = true
    cancelAnimationFrame(this.raf)
    this.observer?.disconnect()
    window.removeEventListener('resize', this.onResize)
    window.removeEventListener('scroll', this.onScroll)
    document.removeEventListener('visibilitychange', this.onVisibility)
    window.removeEventListener('pointermove', this.onPointerMove)
    document.removeEventListener('pointerleave', this.onPointerLeave)
    this.wire?.destroy()
    this.wire = null
    this.wire2D = true
    this.pointer.active = false
    this.el.lens.style.opacity = '0'
    this.el.base.style.transform = 'none'
    this.el.grid.style.transform = 'none'
  }

  private pause(): void {
    cancelAnimationFrame(this.raf)
    this.raf = 0
  }

  private resume(): void {
    if (this.stopped || this.raf) return
    const now = performance.now()
    this.last = now
    this.lastPointerAt = Math.max(this.lastPointerAt, now - this.config.lensIdleMs)
    this.nextGridPulse = Math.max(this.nextGridPulse, now + 500)
    this.nextRareEvent = Math.max(this.nextRareEvent, now + 1000)
    this.raf = requestAnimationFrame(this.tick)
  }

  private resize(): void {
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.dpr = Math.min(window.devicePixelRatio || 1, this.config.dprCap)
    for (const canvas of [this.el.canvas, this.el.wireCanvas]) {
      canvas.width = Math.floor(this.width * this.dpr)
      canvas.height = Math.floor(this.height * this.dpr)
      canvas.style.width = `${this.width}px`
      canvas.style.height = `${this.height}px`
    }
    this.ctx?.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
    this.particles = createParticles(this.config, this.width, this.height)
    this.wire?.resize(this.width, this.height, this.dpr)
    this.updateContactTarget()
  }

  private updateContactTarget(): void {
    const rect = this.contactEl?.getBoundingClientRect()
    if (rect) {
      this.contactTarget = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
    } else {
      const section = document.getElementById('contact')?.getBoundingClientRect()
      this.contactTarget = { x: this.width * 0.66, y: (section?.top ?? this.height) + this.height * 0.5 }
    }
    const ecg = this.contactEcgEl?.getBoundingClientRect()
    this.contactEcgY = ecg ? ecg.top + ecg.height / 2 : 0
  }

  private observe(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        const top = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!top) return
        const next = top.target.id as SectionId
        if (!SECTION_IDS.includes(next) || next === this.active) return
        this.previous = this.active
        this.active = next
        this.fadeStart = performance.now()
      },
      { rootMargin: '-30% 0px -50% 0px', threshold: [0, 0.25, 0.6] },
    )
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) this.observer?.observe(el)
    })
  }

  private initWire(): void {
    if (this.config.weak || !supportsWebGL()) return
    void import('./webglWireframe')
      .then(({ createWebGLWireframe }) => {
        if (this.stopped) return
        const wire = createWebGLWireframe(this.el.wireCanvas)
        if (!wire) return
        this.wire = wire
        this.wire2D = false
        wire.resize(this.width, this.height, this.dpr)
      })
      .catch(() => { this.wire2D = true })
  }

  private tick = (now: number): void => {
    if (this.stopped) return
    this.raf = requestAnimationFrame(this.tick)
    const dt = Math.min(34, Math.max(1, now - this.last))
    this.last = now
    const time = now - this.started

    if (this.config.finePointer && !this.config.weak) {
      if (now - this.lastPointerAt > this.config.lensIdleMs) {
        const size = wireSize(this.config, this.width)
        const rtl = document.documentElement.dir === 'rtl'
        const center = wireCenter(this.config, this.width, this.height, rtl, this.parallax)
        const angle = (time / this.config.lensWanderMs) * Math.PI * 2
        this.pointerTarget.x = Math.max(12, Math.min(this.width - 12, center.x + Math.cos(angle) * size * 0.38))
        this.pointerTarget.y = Math.max(12, Math.min(this.height - 12, center.y + Math.sin(angle * 0.73) * size * 0.32))
        this.pointerTarget.active = true
      }
      const ease = Math.min(1, dt / 90)
      this.pointer.x += (this.pointerTarget.x - this.pointer.x) * ease
      this.pointer.y += (this.pointerTarget.y - this.pointer.y) * ease
      this.pointer.active = this.pointerTarget.active
      this.parallax.x = (this.pointer.x / this.width - 0.5) * this.config.pointerRangeX
      this.parallax.y = (this.pointer.y / this.height - 0.5) * this.config.pointerRangeY
    } else {
      this.pointer.active = false
      this.parallax.x = 0
      this.parallax.y = 0
    }

    const gridX = this.parallax.x * this.config.gridPointerParallax
    const gridY = -mod(this.scrollY * this.config.gridParallax, 64) + this.parallax.y * this.config.gridPointerParallax
    this.el.grid.style.transform = `translate3d(${gridX.toFixed(2)}px, ${gridY.toFixed(2)}px, 0)`
    this.el.base.style.transform = `translate3d(${(this.parallax.x * this.config.baseParallax).toFixed(2)}px, ${(this.parallax.y * this.config.baseParallax).toFixed(2)}px, 0)`

    const fade = clamp01((now - this.fadeStart) / this.config.moodFadeMs)
    const easedFade = smooth(fade)
    const weights: Array<[SectionId, number]> = this.previous && fade < 1
      ? [[this.previous, 1 - easedFade], [this.active, easedFade]]
      : [[this.active, 1]]
    if (fade >= 1) this.previous = null
    const heroWeight = weights.reduce((sum, [id, w]) => sum + (id === 'hero' ? w : 0), 0)
    this.el.lens.style.opacity = this.pointer.active && heroWeight > 0.05 ? '1' : '0'
    this.el.lens.style.transform = `translate3d(${this.pointer.x.toFixed(1)}px, ${this.pointer.y.toFixed(1)}px, 0)`

    this.gridPulses = this.gridPulses.filter((pulse) => now - pulse.start <= pulse.duration)
    if (now >= this.nextGridPulse && this.gridPulses.length < this.config.gridPulseMax) {
      const axis = Math.random() < 0.5 ? 'h' : 'v'
      this.gridPulses.push({
        axis,
        line: Math.random() * (axis === 'h' ? this.height : this.width),
        start: now,
        duration: this.config.gridPulseDurationMs,
      })
      if (Math.random() < 0.5 && this.gridPulses.length < this.config.gridPulseMax) {
        const other = axis === 'h' ? 'v' : 'h'
        this.gridPulses.push({
          axis: other,
          line: Math.random() * (other === 'h' ? this.height : this.width),
          start: now + 260,
          duration: this.config.gridPulseDurationMs,
        })
      }
      this.nextGridPulse = now + this.config.gridPulseMs * (0.75 + Math.random() * 0.5)
    }

    if (!this.rareEvent && now >= this.nextRareEvent) {
      const type = Math.random() < 0.5 ? 'flash' : 'ripple'
      this.rareEvent = {
        type,
        x: Math.random() * this.width,
        y: type === 'flash' ? this.height * (0.25 + Math.random() * 0.5) : Math.random() * this.height,
        start: now,
        duration: type === 'flash' ? this.config.rareFlashMs : this.config.rareRippleMs,
      }
      this.nextRareEvent = now + this.config.rareMinMs + Math.random() * (this.config.rareMaxMs - this.config.rareMinMs)
    }
    if (this.rareEvent && now - this.rareEvent.start > this.rareEvent.duration) this.rareEvent = null

    const ctx = this.ctx
    if (!ctx) return
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
    ctx.clearRect(0, 0, this.width, this.height)

    const sectionTop = document.getElementById('experience')?.offsetTop ?? 0
    const experienceProgress = clamp01((this.scrollY + this.height * 0.55 - sectionTop) / Math.max(1, this.height * 1.6))
    const state: RenderState = {
      ctx,
      width: this.width,
      height: this.height,
      time,
      alpha: 1,
      config: this.config,
      pointer: this.pointer,
      rtl: document.documentElement.dir === 'rtl',
      parallax: this.parallax,
      scroll: this.scrollY,
      experienceProgress,
      contactTarget: this.contactTarget,
      contactEcgY: this.contactEcgY,
      wireframe2D: this.wire2D,
    }

    drawParticles(state, this.particles, dt, this.active)
    for (const [id, alpha] of weights) {
      state.alpha = alpha
      drawMood(state, id)
      if (id === 'hero' && this.wire2D) drawLensBones(state)
    }

    if (!this.wire2D && this.wire && heroWeight > 0) {
      const center = wireCenter(this.config, this.width, this.height, state.rtl, this.parallax)
      const options: WireOptions = {
        time,
        alpha: heroWeight,
        strokeAlpha: this.config.wireStrokeAlpha,
        pointAlpha: this.config.wirePointAlpha,
        glowAlpha: this.config.wireGlowAlpha,
        beamWidth: this.config.beamHeight / 2,
        beamBrighten: this.config.beamBrighten,
        rotation: (time / this.config.wireframeRotateMs) * Math.PI * 2,
        x: center.x,
        y: center.y,
        size: wireSize(this.config, this.width),
        beamY: ((time % this.config.scanBeamMs) / this.config.scanBeamMs) * (this.height + this.config.beamHeight) - this.config.beamHeight / 2,
        pointer: this.pointer,
      }
      this.wire.render(options)
    }

    for (const pulse of this.gridPulses) drawGridPulse(ctx, pulse, now, 1, { x: gridX, y: gridY }, this.config)
    if (this.rareEvent) drawRareEvent(ctx, this.rareEvent, now, this.width, this.height, this.config.rareAlpha)
  }
}

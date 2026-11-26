import type { BackgroundConfig, SectionId } from './config'
import { makeWireGeometry } from './geometry'

export interface Particle {
  x: number
  y: number
  vy: number
  drift: number
  size: number
  bright: boolean
  phase: number
}

export interface RenderState {
  ctx: CanvasRenderingContext2D
  width: number
  height: number
  time: number
  alpha: number
  config: BackgroundConfig
  pointer: { x: number; y: number; active: boolean }
  rtl: boolean
  parallax: { x: number; y: number }
  scroll: number
  experienceProgress: number
  contactTarget: { x: number; y: number }
  contactEcgY: number
  wireframe2D: boolean
}

export interface GridPulse {
  axis: 'h' | 'v'
  line: number
  start: number
  duration: number
}

export interface RareEvent {
  type: 'flash' | 'ripple'
  x: number
  y: number
  start: number
  duration: number
}

const TAU = Math.PI * 2
const clamp01 = (v: number) => Math.max(0, Math.min(1, v))
const fadeInOut = (t: number) => Math.sin(clamp01(t) * Math.PI)

/** Shared placement/size helpers so the WebGL and 2D paths cannot drift apart. */
export function wireSize(config: BackgroundConfig, width: number): number {
  if (width < 640) return width * config.wireframeMobileVw / 100
  return Math.max(config.wireframeMin, Math.min(width * config.wireframeVw / 100, config.wireframeMax))
}

export function wireCenter(
  config: BackgroundConfig,
  width: number,
  height: number,
  rtl: boolean,
  parallax: { x: number; y: number },
): { x: number; y: number } {
  return {
    x: (rtl ? width * 0.32 : width * 0.68) + parallax.x * config.wireParallax,
    y: height * 0.48 + parallax.y * config.wireParallax,
  }
}

export function createParticles(config: BackgroundConfig, width: number, height: number): Particle[] {
  return Array.from({ length: config.mobile ? config.particleCountMobile : config.particleCount }, () => {
    const bright = Math.random() < config.brightParticleRatio
    const min = bright ? config.particleBrightMin : config.particleDimMin
    const max = bright ? config.particleBrightMax : config.particleDimMax
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vy: -(config.particleSpeedMin + Math.random() * (config.particleSpeedMax - config.particleSpeedMin)) / 1000,
      drift: (Math.random() - 0.5) * config.particleDrift / 1000,
      size: min + Math.random() * (max - min),
      bright,
      phase: Math.random() * TAU,
    }
  })
}

/** X-ray photons drift upward; in contact mood they converge on the contact card. */
export function drawParticles(
  state: RenderState,
  particles: Particle[],
  dt: number,
  mood: SectionId,
): void {
  const { ctx, width, height, alpha, time, contactTarget, config } = state
  ctx.save()
  ctx.globalAlpha = alpha
  for (const p of particles) {
    if (mood === 'contact') {
      p.x += (contactTarget.x - p.x) * config.particleConverge * dt
      p.y += (contactTarget.y - p.y) * config.particleConverge * dt
    } else {
      p.y += p.vy * dt
      p.x += (p.drift + Math.sin(time * 0.0004 + p.phase) * 0.004) * dt
      if (p.y < -8) { p.y = height + 8; p.x = Math.random() * width }
      if (p.x < -8) p.x = width + 8
      if (p.x > width + 8) p.x = -8
    }
    const shimmer = p.bright
      ? 0.6 + fadeInOut((time * config.particleTwinkleRate + p.phase / TAU) % 1) * 0.4
      : config.particleDimAlpha
    ctx.fillStyle = `rgba(210, 240, 255, ${shimmer})`
    if (p.bright) {
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size * config.particleHaloScale, 0, TAU)
      ctx.globalAlpha = alpha * config.particleHaloAlpha
      ctx.fill()
      ctx.globalAlpha = alpha
    }
    ctx.fillRect(p.x, p.y, p.size, p.size)
  }
  ctx.restore()
}

const sparseGeo = makeWireGeometry(false)
const denseGeo = makeWireGeometry(true)

function strokeWire(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  angle: number,
  alpha: number,
  dense: boolean,
  config: BackgroundConfig,
  beamY?: number,
): void {
  const geo = dense ? denseGeo : sparseGeo
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(angle)
  ctx.scale(size, size)
  ctx.beginPath()
  for (let i = 0; i < geo.edges.length; i += 2) {
    const a = geo.edges[i] * 2
    const b = geo.edges[i + 1] * 2
    ctx.moveTo(geo.points[a], geo.points[a + 1])
    ctx.lineTo(geo.points[b], geo.points[b + 1])
  }
  ctx.strokeStyle = `rgba(107, 213, 255, ${beamY === undefined ? config.wireStrokeAlpha : Math.min(1, config.wireStrokeAlpha + config.beamBrighten)})`
  ctx.lineWidth = (dense ? 0.0045 : 0.006) / size
  ctx.stroke()
  ctx.restore()

  ctx.save()
  ctx.fillStyle = `rgba(200, 236, 255, ${beamY === undefined ? config.wirePointAlpha : 1})`
  const step = dense ? 4 : 3
  for (let i = 0; i < geo.points.length; i += step * 2) {
    const px = x + (geo.points[i] * Math.cos(angle) - geo.points[i + 1] * Math.sin(angle)) * size
    const py = y + (geo.points[i] * Math.sin(angle) + geo.points[i + 1] * Math.cos(angle)) * size
    ctx.globalAlpha = alpha * config.wirePointAlpha
    ctx.fillRect(px, py, dense ? 1 : 1.4, dense ? 1 : 1.4)
  }
  ctx.restore()
}

/** Sparse fallback wireframe and the horizontal X-ray beam. */
export function drawHeroWire(state: RenderState): void {
  const { ctx, width, height, time, alpha, config, rtl, parallax, wireframe2D } = state
  const { x, y } = wireCenter(config, width, height, rtl, parallax)
  const size = wireSize(config, width)
  const angle = (time / config.wireframeRotateMs) * TAU
  const beamY = ((time % config.scanBeamMs) / config.scanBeamMs) * (height + config.beamHeight) - config.beamHeight / 2
  const halfBeam = config.beamHeight / 2

  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  const haloSize = size * 1.15
  const halo = ctx.createRadialGradient(x, y, 0, x, y, haloSize)
  halo.addColorStop(0, `rgba(107, 213, 255, ${config.wireGlowAlpha * alpha})`)
  halo.addColorStop(1, 'rgba(107, 213, 255, 0)')
  ctx.fillStyle = halo
  ctx.fillRect(x - haloSize, y - haloSize, haloSize * 2, haloSize * 2)
  ctx.restore()

  if (wireframe2D) strokeWire(ctx, x, y, size, angle, alpha, false, config)
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  const band = ctx.createLinearGradient(0, beamY - halfBeam, 0, beamY + halfBeam)
  band.addColorStop(0, 'rgba(107, 213, 255, 0)')
  band.addColorStop(0.42, `rgba(107, 213, 255, ${config.beamAlpha * 0.45 * alpha})`)
  band.addColorStop(0.5, `rgba(180, 236, 255, ${config.beamAlpha * alpha})`)
  band.addColorStop(0.58, `rgba(107, 213, 255, ${config.beamAlpha * 0.45 * alpha})`)
  band.addColorStop(1, 'rgba(107, 213, 255, 0)')
  ctx.fillStyle = band
  ctx.fillRect(0, beamY - halfBeam, width, config.beamHeight)
  ctx.fillStyle = `rgba(200, 240, 255, ${config.beamAlpha * 1.15 * alpha})`
  ctx.fillRect(0, beamY, width, 2)
  if (wireframe2D) {
    ctx.beginPath()
    ctx.rect(0, beamY - halfBeam, width, config.beamHeight)
    ctx.clip()
    strokeWire(ctx, x, y, size, angle, alpha, false, config, beamY)
  }
  ctx.restore()
}

/** CT-slice bands and a slow horizontal scan line. */
export function drawAbout(state: RenderState): void {
  const { ctx, width, height, time, alpha, parallax, config } = state
  const half = config.aboutBandWidth / 2
  ctx.save()
  ctx.globalAlpha = alpha
  for (let i = 0; i < config.aboutBandCount; i++) {
    const x = ((i * (width / 7) + time * config.aboutDriftSpeed / 1000 + parallax.x) % (width + config.aboutBandWidth)) - half
    const band = ctx.createLinearGradient(x - half, 0, x + half, 0)
    band.addColorStop(0, 'rgba(107, 213, 255, 0)')
    band.addColorStop(0.5, `rgba(107, 213, 255, ${config.aboutBandAlpha})`)
    band.addColorStop(1, 'rgba(107, 213, 255, 0)')
    ctx.fillStyle = band
    ctx.fillRect(x - half, 0, config.aboutBandWidth, height)
  }
  const y = ((time % config.aboutScanMs) / config.aboutScanMs) * height
  ctx.fillStyle = `rgba(200, 236, 255, ${config.aboutScanAlpha})`
  ctx.fillRect(0, y, width, 2)
  ctx.restore()
}

/** One large device outline at a time: draw progressively, hold, fade, repeat. */
export function drawSkills(state: RenderState): void {
  const { ctx, width, height, time, alpha, rtl, config } = state
  const cycle = config.skillCycleMs
  const position = (time % (cycle * 3)) / cycle
  const index = Math.floor(position)
  const local = position - index
  // Quick draw-in, long hold, soft fade-out before the next device.
  const envelope = Math.min(1, local / config.skillDrawIn) * Math.min(1, (1 - local) / config.skillFadeOut)
  const left = config.mobile ? config.skillSideLeftMobile : config.skillSideLeft
  const right = config.mobile ? config.skillSideRightMobile : config.skillSideRight
  const px = width * (rtl ? [left, right, left][index] : [right, left, right][index])
  const py = height * 0.5
  const size = Math.min(width, height) * (config.mobile ? config.skillSizeRatioMobile : config.skillSizeRatio)

  ctx.save()
  ctx.translate(px, py)
  const rate = config.mobile ? config.skillRotateRateMobile : config.skillRotateRate
  ctx.rotate(time * (index === 1 ? -rate : rate))
  ctx.globalAlpha = envelope * config.skillOutlineAlpha * alpha
  ctx.strokeStyle = '#6bd5ff'
  ctx.lineWidth = config.mobile ? config.skillLineWidthMobile : config.skillLineWidth
  ctx.lineCap = 'round'
  // stroke-dash offset creates the progressive drawing without layout work.
  ctx.setLineDash([size * 2.6, size * 2.6])
  ctx.lineDashOffset = size * 2.6 * (1 - Math.min(1, local / config.skillProgress))

  const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, size)
  halo.addColorStop(0, `rgba(107, 213, 255, ${envelope * config.skillHaloAlpha * alpha})`)
  halo.addColorStop(1, 'rgba(107, 213, 255, 0)')
  ctx.fillStyle = halo
  ctx.fillRect(-size, -size, size * 2, size * 2)

  ctx.beginPath()
  if (index === 0) {
    // Panoramic arc orbiting a head outline.
    ctx.arc(0, 0, size * 0.82, Math.PI * 1.06, Math.PI * 1.94)
    ctx.moveTo(-size * 0.3, -size * 0.12)
    ctx.arc(0, -size * 0.02, size * 0.3, Math.PI, 0)
  } else if (index === 1) {
    // CBCT ring with slice lines.
    ctx.arc(0, 0, size * 0.78, 0, TAU)
    ctx.moveTo(-size * 0.5, -size * 0.16)
    ctx.lineTo(size * 0.5, -size * 0.16)
    ctx.moveTo(-size * 0.42, size * 0.16)
    ctx.lineTo(size * 0.42, size * 0.16)
  } else {
    // Cephalometric side profile.
    ctx.moveTo(-size * 0.45, -size * 0.62)
    ctx.bezierCurveTo(size * 0.2, -size * 0.7, size * 0.55, -size * 0.2, size * 0.3, size * 0.1)
    ctx.bezierCurveTo(size * 0.5, size * 0.35, size * 0.05, size * 0.66, -size * 0.45, size * 0.52)
    ctx.moveTo(-size * 0.55, 0)
    ctx.lineTo(size * 0.48, 0)
  }
  const lineWidth = config.mobile ? config.skillLineWidthMobile : config.skillLineWidth
  ctx.globalAlpha = envelope * config.skillHaloAlpha * alpha
  ctx.lineWidth = lineWidth * 3
  ctx.stroke()
  ctx.globalAlpha = envelope * config.skillOutlineAlpha * alpha
  ctx.lineWidth = lineWidth
  ctx.stroke()
  ctx.restore()
}

/** Film perforations on both edges plus a developing wash tied to scroll. */
export function drawExperience(state: RenderState): void {
  const { ctx, width, height, time, alpha, experienceProgress, config } = state
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.fillStyle = `rgba(107, 213, 255, ${config.filmPerfAlpha})`
  const gap = config.filmPerfGap
  const shift = (time * config.filmPerfSpeed / 1000) % gap
  for (const edge of [18, width - config.filmPerfWidth - 18]) {
    for (let y = -gap + shift; y < height + gap; y += gap) {
      ctx.fillRect(edge, y, config.filmPerfWidth, config.filmPerfHeight)
    }
  }
  // Traditional film → digital: warm, murky at the first stop, clear cyan at the last.
  const murk = config.murkAlpha * (1 - experienceProgress)
  if (murk > 0.002) {
    const wash = ctx.createLinearGradient(0, 0, 0, height)
    wash.addColorStop(0, `rgba(84, 72, 54, ${murk})`)
    wash.addColorStop(1, `rgba(84, 72, 54, ${murk * 0.35})`)
    ctx.fillStyle = wash
    ctx.fillRect(0, 0, width, height)
  }
  const clarity = experienceProgress * config.clarityAlpha
  if (clarity > 0.002) {
    const clean = ctx.createLinearGradient(0, 0, 0, height)
    clean.addColorStop(0, 'rgba(107, 213, 255, 0)')
    clean.addColorStop(1, `rgba(107, 213, 255, ${clarity})`)
    ctx.fillStyle = clean
    ctx.fillRect(0, 0, width, height)
  }
  ctx.restore()
}

/** Faint rotating CT gantry dial. */
export function drawEducation(state: RenderState): void {
  const { ctx, width, height, time, alpha, rtl, parallax, config } = state
  const cx = (rtl ? width * 0.3 : width * 0.7) + parallax.x * config.dialParallax
  const cy = height * 0.5 + parallax.y * config.dialParallax
  const base = Math.min(width, height) * config.dialRadiusRatio
  const angle = (time / config.gantryRotateMs) * TAU
  const innerAngle = -(time / (config.gantryRotateMs * config.dialInnerSpeedRatio)) * TAU
  ctx.save()
  ctx.globalAlpha = alpha * config.dialLayerAlpha
  ctx.translate(cx, cy)
  ctx.strokeStyle = `rgba(107, 213, 255, ${config.dialStrokeAlpha})`
  ctx.lineWidth = 3

  ctx.save()
  ctx.rotate(angle)
  for (let i = 1; i <= config.dialRings; i += 2) {
    ctx.beginPath()
    ctx.arc(0, 0, base * i, 0, TAU)
    ctx.stroke()
  }
  ctx.restore()

  ctx.save()
  ctx.rotate(innerAngle)
  for (let i = 2; i <= config.dialRings; i += 2) {
    ctx.beginPath()
    ctx.arc(0, 0, base * i, 0, TAU)
    ctx.stroke()
  }
  for (let i = 0; i < config.dialTicks; i++) {
    const a = (i / config.dialTicks) * TAU
    const inner = i % 3 === 0 ? base * 0.86 : base * 0.94
    ctx.beginPath()
    ctx.moveTo(Math.cos(a) * inner, Math.sin(a) * inner)
    ctx.lineTo(Math.cos(a) * base * 1.04, Math.sin(a) * base * 1.04)
    ctx.stroke()
  }
  ctx.restore()
  ctx.restore()
}
/** Lens reveals the denser inner bone layer inside a 90px radius circle. */
export function drawLensBones(state: RenderState): void {
  if (!state.wireframe2D || !state.pointer.active) return
  const { ctx, width, height, time, alpha, config, rtl, parallax, pointer } = state
  const { x, y } = wireCenter(config, width, height, rtl, parallax)
  const size = wireSize(config, width)
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.beginPath()
  ctx.arc(pointer.x, pointer.y, config.lensSize / 2, 0, TAU)
  ctx.clip()
  strokeWire(ctx, x, y, size, (time / config.wireframeRotateMs) * TAU, alpha, true, config)
  ctx.restore()
}

/** Breathing radiation trefoil watermark with expanding ripple rings. */
export function drawSafety(state: RenderState): void {
  const { ctx, width, height, time, alpha, rtl, parallax, config } = state
  const cx = (rtl ? width * 0.3 : width * 0.7) + parallax.x * config.dialParallax
  const cy = height * 0.46 + parallax.y * config.dialParallax
  const pulse = 1 + 0.04 * Math.sin((time / config.pulseMs) * TAU)
  const size = Math.min(width, height) * config.trefoilSizeRatio * pulse

  const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 1.6)
  halo.addColorStop(0, `rgba(240, 179, 91, ${config.trefoilHaloAlpha * alpha})`)
  halo.addColorStop(1, 'rgba(240, 179, 91, 0)')
  ctx.fillStyle = halo
  ctx.fillRect(cx - size * 1.6, cy - size * 1.6, size * 3.2, size * 3.2)

  ctx.save()
  ctx.globalAlpha = alpha * config.trefoilAlpha
  ctx.translate(cx, cy)
  ctx.fillStyle = '#f0b35b'
  for (let blade = 0; blade < 3; blade++) {
    ctx.save()
    ctx.rotate((blade / 3) * TAU)
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.arc(0, 0, size * 0.95, -0.34, 0.34)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }
  ctx.restore()

  const ripple = (time % config.pulseMs * 1.4) / (config.pulseMs * 1.4)
  ctx.save()
  ctx.globalAlpha = alpha * (1 - ripple) * config.safetyRippleAlpha
  ctx.strokeStyle = '#f0b35b'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.arc(cx, cy, size * (0.6 + ripple * 2.2), 0, TAU)
  ctx.stroke()
  ctx.restore()
}

/** Wide ECG trace scrolling slowly across the background. */
export function drawContact(state: RenderState): void {
  const { ctx, width, height, time, alpha, contactTarget, contactEcgY, config } = state
  // Align the background trace with the ECG inside the contact card.
  const baseY = contactEcgY > 0 ? contactEcgY : height * 0.72
  const y = width < 640 ? height * config.ecgMobileStartRatio : baseY
  const offset = (time / config.ecgDurationMs) * config.ecgPeriod
  for (let i = 0; i < config.ecgRippleCount; i++) {
    const ripple = ((time / config.ecgDurationMs) + i / config.ecgRippleCount) % 1
    ctx.save()
    ctx.globalAlpha = alpha * (1 - ripple) * config.ecgRippleAlpha
    ctx.strokeStyle = '#6bd5ff'
    ctx.lineWidth = config.ecgRippleWidth
    ctx.beginPath()
    ctx.arc(contactTarget.x, contactTarget.y, 40 + ripple * config.ecgRippleRadius, 0, TAU)
    ctx.stroke()
    ctx.restore()
  }

  ctx.save()
  ctx.globalAlpha = alpha * config.ecgLineAlpha
  ctx.strokeStyle = '#6bd5ff'
  ctx.lineWidth = config.ecgLineWidth
  for (let trace = 0; trace < config.ecgTraceCount; trace++) {
    const traceY = y + trace * config.ecgTraceGap
    ctx.beginPath()
    for (let x = -config.ecgPeriod; x <= width + config.ecgPeriod; x += 3) {
      const t = ((x + offset) % config.ecgPeriod + config.ecgPeriod) % config.ecgPeriod
      const p = t / config.ecgPeriod
      let spike = 0
      if (p > 0.333 && p < 0.367) spike = -6
      else if (p >= 0.367 && p < 0.389) spike = config.ecgSpikeUp
      else if (p >= 0.389 && p < 0.411) spike = -config.ecgSpikeDown
      else if (p >= 0.411 && p < 0.444) spike = 3
      const py = traceY + spike + Math.sin((x + offset) * 0.012) * 2
      if (x === -config.ecgPeriod) ctx.moveTo(x, py)
      else ctx.lineTo(x, py)
    }
    ctx.stroke()
  }
  ctx.restore()
}

export function drawMood(state: RenderState, mood: SectionId): void {
  switch (mood) {
    case 'hero': drawHeroWire(state); break
    case 'about': drawAbout(state); break
    case 'skills': drawSkills(state); break
    case 'experience': drawExperience(state); break
    case 'education': drawEducation(state); break
    case 'safety': drawSafety(state); break
    case 'contact': drawContact(state); break
  }
}

/** A short signal travelling along a grid line. */
export function drawGridPulse(
  ctx: CanvasRenderingContext2D,
  pulse: GridPulse,
  now: number,
  alpha: number,
  parallax: { x: number; y: number },
  config: BackgroundConfig,
): void {
  const t = clamp01((now - pulse.start) / pulse.duration)
  if (t >= 1 || now < pulse.start) return
  const envelope = fadeInOut(t)
  const width = window.innerWidth
  const height = window.innerHeight
  const tail = config.gridPulseWidth * 3
  ctx.save()
  ctx.strokeStyle = '#6bd5ff'
  ctx.beginPath()
  if (pulse.axis === 'h') {
    const y = pulse.line + parallax.y
    const x = t * (width + 240) - 120
    ctx.moveTo(x - 360, y)
    ctx.lineTo(x, y)
  } else {
    const x = pulse.line + parallax.x
    const y = t * (height + 240) - 120
    ctx.moveTo(x, y - 360)
    ctx.lineTo(x, y)
  }
  ctx.globalAlpha = alpha * envelope * config.gridPulseTailAlpha
  ctx.lineWidth = tail
  ctx.stroke()
  ctx.globalAlpha = alpha * envelope * config.gridPulseHeadAlpha
  ctx.lineWidth = config.gridPulseWidth
  ctx.stroke()
  ctx.restore()
}

/** One full-width flash or one ripple; never two at once. */
export function drawRareEvent(ctx: CanvasRenderingContext2D, event: RareEvent, now: number, width: number, height: number, peakAlpha: number): void {
  const t = clamp01((now - event.start) / event.duration)
  if (t >= 1) return
  const envelope = fadeInOut(t)
  ctx.save()
  if (event.type === 'flash') {
    const band = ctx.createLinearGradient(0, event.y - 60, 0, event.y + 60)
    band.addColorStop(0, 'rgba(107, 213, 255, 0)')
    band.addColorStop(0.5, `rgba(150, 226, 255, ${envelope * peakAlpha})`)
    band.addColorStop(1, 'rgba(107, 213, 255, 0)')
    ctx.fillStyle = band
    ctx.fillRect(0, event.y - 60, width, 120)
  } else {
    ctx.globalAlpha = envelope * peakAlpha
    ctx.strokeStyle = '#6bd5ff'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(event.x, event.y, 12 + t * Math.max(width, height) * 0.45, 0, TAU)
    ctx.stroke()
  }
  ctx.restore()
}

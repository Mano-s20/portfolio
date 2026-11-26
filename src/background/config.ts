export type SectionId = 'hero' | 'about' | 'skills' | 'experience' | 'education' | 'safety' | 'contact'
export const SECTION_IDS: SectionId[] = ['hero', 'about', 'skills', 'experience', 'education', 'safety', 'contact']
export interface BackgroundConfig {
  glowSpeedMs: number; gridPulseMs: number; gridPulseDurationMs: number; gridPulseWidth: number
  gridPulseTailAlpha: number; gridPulseHeadAlpha: number; gridPulseMax: number
  particleCount: number; particleCountMobile: number; brightParticleRatio: number
  particleBrightMin: number; particleBrightMax: number; particleDimMin: number; particleDimMax: number
  particleSpeedMin: number; particleSpeedMax: number; particleDrift: number; particleTwinkleRate: number
  particleDimAlpha: number; particleHaloScale: number; particleHaloAlpha: number; particleConverge: number
  wireframeRotateMs: number; wireframeMin: number; wireframeVw: number; wireframeMax: number; wireframeMobileVw: number
  wireStrokeAlpha: number; wirePointAlpha: number; wireGlowAlpha: number
  scanBeamMs: number; beamHeight: number; beamAlpha: number; beamBrighten: number
  lensSize: number; lensIdleMs: number; lensWanderMs: number; moodFadeMs: number; pulseMs: number
  aboutBandCount: number; aboutBandAlpha: number; aboutBandWidth: number; aboutDriftSpeed: number
  aboutScanAlpha: number; aboutScanMs: number
  skillCycleMs: number; skillOutlineAlpha: number; skillHaloAlpha: number; skillLineWidth: number; skillLineWidthMobile: number
  skillSizeRatio: number; skillSizeRatioMobile: number; skillSideLeft: number; skillSideRight: number; skillSideLeftMobile: number; skillSideRightMobile: number
  skillDrawIn: number; skillFadeOut: number; skillProgress: number; skillRotateRate: number; skillRotateRateMobile: number
  gantryRotateMs: number; dialRadiusRatio: number; dialStrokeAlpha: number; dialLayerAlpha: number
  dialRings: number; dialTicks: number; dialInnerSpeedRatio: number
  trefoilAlpha: number; trefoilSizeRatio: number; trefoilHaloAlpha: number; safetyRippleAlpha: number
  filmPerfAlpha: number; filmPerfSpeed: number; filmPerfGap: number; filmPerfWidth: number; filmPerfHeight: number
  murkAlpha: number; clarityAlpha: number
  ecgDurationMs: number; ecgPeriod: number; ecgLineWidth: number; ecgLineAlpha: number
  ecgTraceCount: number; ecgTraceGap: number; ecgMobileStartRatio: number
  ecgSpikeUp: number; ecgSpikeDown: number; ecgRippleAlpha: number
  ecgRippleRadius: number; ecgRippleWidth: number; ecgRippleCount: number
  rareMinMs: number; rareMaxMs: number; rareAlpha: number; rareFlashMs: number; rareRippleMs: number
  gridParallax: number; pointerRangeX: number; pointerRangeY: number; baseParallax: number
  gridPointerParallax: number; wireParallax: number; dialParallax: number
  grainOpacity: number; dprCap: number
  mobile: boolean; finePointer: boolean; weak: boolean
}

function raw(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}
function number(name: string, fallback: number): number {
  const value = Number.parseFloat(raw(name))
  return Number.isFinite(value) ? value : fallback
}
function duration(name: string, fallbackMs: number): number {
  const value = raw(name)
  if (!value) return fallbackMs
  if (value.endsWith('ms')) return Number.parseFloat(value) || fallbackMs
  if (value.endsWith('s')) return (Number.parseFloat(value) || fallbackMs / 1000) * 1000
  return Number.parseFloat(value) || fallbackMs
}
/** One read of the CSS tuning block. Change values in src/index.css :root. */
export function createBackgroundConfig(weak: boolean): BackgroundConfig {
  const n = number
  const d = duration
  return {
    glowSpeedMs: d('--bg-glow-speed', 36000),
    gridPulseMs: d('--grid-pulse-interval', 3500),
    gridPulseDurationMs: d('--grid-pulse-duration', 1400),
    gridPulseWidth: n('--grid-pulse-width', 2),
    gridPulseTailAlpha: n('--grid-pulse-tail-alpha', 0.42),
    gridPulseHeadAlpha: n('--grid-pulse-head-alpha', 0.9),
    gridPulseMax: n('--grid-pulse-max', 2),
    particleCount: n('--particle-count', 110),
    particleCountMobile: n('--particle-count-mobile', 50),
    brightParticleRatio: n('--bright-particle-ratio', 0.25),
    particleBrightMin: n('--particle-bright-min', 3),
    particleBrightMax: n('--particle-bright-max', 4),
    particleDimMin: n('--particle-dim-min', 1.1),
    particleDimMax: n('--particle-dim-max', 2),
    particleSpeedMin: n('--particle-speed-min', 14),
    particleSpeedMax: n('--particle-speed-max', 40),
    particleDrift: n('--particle-drift', 6),
    particleTwinkleRate: n('--particle-twinkle-rate', 0.0012),
    particleDimAlpha: n('--particle-dim-alpha', 0.55),
    particleHaloScale: n('--particle-halo-scale', 3.6),
    particleHaloAlpha: n('--particle-halo-alpha', 0.3),
    particleConverge: n('--particle-converge', 0.01),
    wireframeRotateMs: d('--wireframe-rotate-speed', 36000),
    wireframeMin: n('--wireframe-min-size', 380),
    wireframeVw: n('--wireframe-vw', 42),
    wireframeMax: n('--wireframe-max-size', 760),
    wireframeMobileVw: n('--wireframe-mobile-vw', 80),
    wireStrokeAlpha: n('--wire-stroke-alpha', 0.75),
    wirePointAlpha: n('--wire-point-alpha', 0.9),
    wireGlowAlpha: n('--wire-glow-alpha', 0.35),
    scanBeamMs: d('--scan-beam-interval', 6000),
    beamHeight: n('--beam-height', 260),
    beamAlpha: n('--beam-alpha', 0.5),
    beamBrighten: n('--beam-brighten', 0.45),
    lensSize: n('--lens-size', 160),
    lensIdleMs: d('--lens-idle-delay', 1500),
    lensWanderMs: d('--lens-wander-duration', 12000),
    moodFadeMs: d('--mood-fade', 1200),
    pulseMs: d('--pulse-speed', 2400),
    aboutBandCount: n('--about-band-count', 9),
    aboutBandAlpha: n('--about-band-alpha', 0.2),
    aboutBandWidth: n('--about-band-width', 140),
    aboutDriftSpeed: n('--about-drift-speed', 14),
    aboutScanAlpha: n('--about-scan-alpha', 0.3),
    aboutScanMs: d('--about-scan-duration', 16000),
    skillCycleMs: d('--skill-cycle', 9000),
    skillOutlineAlpha: n('--skill-outline-alpha', 0.7),
    skillHaloAlpha: n('--skill-halo-alpha', 0.3),
    skillLineWidth: n('--skill-line-width', 5),
    skillLineWidthMobile: n('--skill-line-width-mobile', 7),
    skillSizeRatio: n('--skill-size-ratio', 0.5),
    skillSizeRatioMobile: n('--skill-size-ratio-mobile', 0.7),
    skillSideLeft: n('--skill-side-left', 0.18),
    skillSideLeftMobile: n('--skill-side-left-mobile', 0.36),
    skillSideRight: n('--skill-side-right', 0.82),
    skillSideRightMobile: n('--skill-side-right-mobile', 0.64),
    skillDrawIn: n('--skill-draw-in', 0.14),
    skillFadeOut: n('--skill-fade-out', 0.2),
    skillProgress: n('--skill-progress', 0.32),
    skillRotateRate: n('--skill-rotate-rate', 0.0004),
    skillRotateRateMobile: n('--skill-rotate-rate-mobile', 0.001),
    gantryRotateMs: d('--gantry-rotate-speed', 40000),
    dialRadiusRatio: n('--dial-radius-ratio', 0.42),
    dialStrokeAlpha: n('--dial-stroke-alpha', 0.6),
    dialLayerAlpha: n('--dial-layer-alpha', 1),
    dialRings: n('--dial-rings', 4),
    dialTicks: n('--dial-ticks', 64),
    dialInnerSpeedRatio: n('--dial-inner-speed-ratio', 0.28),
    trefoilAlpha: n('--trefoil-alpha', 0.34),
    trefoilSizeRatio: n('--trefoil-size-ratio', 0.28),
    trefoilHaloAlpha: n('--trefoil-halo-alpha', 0.2),
    safetyRippleAlpha: n('--safety-ripple-alpha', 0.28),
    filmPerfAlpha: n('--film-perf-alpha', 0.28),
    filmPerfSpeed: n('--film-perf-speed', 20),
    filmPerfGap: n('--film-perf-gap', 64),
    filmPerfWidth: n('--film-perf-width', 8),
    filmPerfHeight: n('--film-perf-height', 22),
    murkAlpha: n('--murk-alpha', 0.35),
    clarityAlpha: n('--clarity-alpha', 0.14),
    ecgDurationMs: d('--ecg-duration', 2000),
    ecgPeriod: n('--ecg-period', 200),
    ecgLineWidth: n('--ecg-line-width', 5),
    ecgTraceCount: n('--ecg-trace-count', 4),
    ecgTraceGap: n('--ecg-trace-gap', 95),
    ecgMobileStartRatio: n('--ecg-mobile-start-ratio', 0.18),
    ecgLineAlpha: n('--ecg-line-alpha', 0.85),
    ecgSpikeUp: n('--ecg-spike-up', 60),
    ecgSpikeDown: n('--ecg-spike-down', 48),
    ecgRippleAlpha: n('--ecg-ripple-alpha', 0.9),
    ecgRippleRadius: n('--ecg-ripple-radius', 520),
    ecgRippleWidth: n('--ecg-ripple-width', 6),
    ecgRippleCount: n('--ecg-ripple-count', 2),
    rareMinMs: d('--rare-event-min', 10000),
    rareMaxMs: d('--rare-event-max', 14000),
    rareAlpha: n('--rare-event-alpha', 0.3),
    rareFlashMs: d('--rare-flash-duration', 900),
    rareRippleMs: d('--rare-ripple-duration', 1200),
    gridParallax: n('--grid-parallax', 0.2),
    pointerRangeX: n('--pointer-range-x', 16),
    pointerRangeY: n('--pointer-range-y', 10),
    baseParallax: n('--base-parallax', 1.8),
    gridPointerParallax: n('--grid-pointer-parallax', 0.4),
    wireParallax: n('--wire-parallax', 0.6),
    dialParallax: n('--dial-parallax', 1),
    grainOpacity: n('--grain-opacity', 0.04),
    dprCap: n('--dpr-cap', 2),
    mobile: window.matchMedia('(max-width: 640px)').matches,
    finePointer: window.matchMedia('(hover: hover) and (pointer: fine)').matches,
    weak,
  }
}

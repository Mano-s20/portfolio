# Design Spec — Living Layered Radiology Background

**Skills used:** `brainstorming` (design gate + spec), `designing-frontend-interfaces` (mode/direction), `animate` + `choreograph` (purpose, timing, relationships), `building-accessible-interfaces` (contrast/reduced motion), `animation-performance` (frame budget).

**Status:** design supplied and approved by the owner in the task brief; no new aesthetic decisions were needed. Tokens, fonts, language copy and section content stay unchanged.

## Direction

Mode: marketing surface. Direction: the existing **Diagnostic Console** (`DESIGN.md`) — a DICOM workstation, not sci-fi. The background is instrumentation: sparse, cool, slow. Restraint: no bright fills behind copy, no fast flicker, no decorative motion on high-frequency UI, no more than one rare event at a time.

## Architecture

One fixed layer (`position: fixed; inset: 0; z-index: -1; pointer-events: none`) containing:

1. base gradient + a radial glow travelling a lazy figure-8 over `--bg-glow-speed`;
2. imaging grid at 0.2× scroll parallax, with short signal pulses travelling along grid lines every random 6–10s (`--grid-pulse-interval`);
3. one 2D canvas for drifting X-ray dust/photons (`--particle-count` desktop, mobile count in config), section moods, scan beam and rare events;
4. a section hero layer: lazily initialised WebGL wireframe where capable, 2D canvas fallback otherwise, one turn per `--wireframe-rotate-speed`, horizontal beam every `--scan-beam-interval`, and a cursor lens that reveals a denser bone layer.

Static film grain (3–5%) and a light vignette sit above. A single `requestAnimationFrame` loop drives every canvas layer and all DOM transforms; it pauses when the tab is hidden. The controller switches mood with IntersectionObserver and cross-fades over `--mood-fade` (~1.2s).

## Moods

| Section | Hero / mood visual | Relationship to content |
|---|---|---|
| Hero | wireframe skull/tooth points + lines, slow rotation, top-to-bottom beam that brightens crossed structure, lens reveals inner bone structure | decoration; text stays static |
| About | wireframe fades; vertical CT-slice bands drift across; slow horizontal scan line | fade only, no movement of copy |
| Skills | large faint device outlines (panoramic arc, CBCT ring, cephalometric profile) draw progressively, hold, fade, loop slowly | behind cards, opacity ≤0.06 |
| Experience | film perforations drift on both edges; developing-film wash clears with scroll progress | scroll-linked, no per-frame React state |
| Education | faint drifting concentric CT gantry dial | decoration only |
| Safety | breathing trefoil watermark (3s, amber tint) with slow expanding ripples | matches existing section pace |
| Contact | wide scrolling ECG trace; particles converge toward the contact card | leads the eye to the CTA without moving it |

## Config (single source)

All speeds/counts live in `:root` in `src/index.css` and are read once by `src/background/config.ts`: `--bg-glow-speed`, `--grid-pulse-interval`, `--particle-count`, `--particle-count-mobile`, `--wireframe-rotate-speed`, `--scan-beam-interval`, `--mood-fade`, `--rare-event-min`, `--rare-event-max`, `--grid-parallax`, `--grain-opacity`, `--dpr-cap`.

## Accessibility and performance

- Reduced motion or the footer motion toggle: only static gradients, grid, grain and vignette render; no canvas, particles, rotation, pulses, lens or scan events. The toggle governs the whole system.
- Low-end fallback (`hardwareConcurrency <= 4`, low memory, reduced data, no WebGL): 2D canvas wireframe, fewer particles, no mouse parallax; scroll parallax remains light.
- Pointer parallax 5–15px by depth on fine pointers only; touch gets scroll parallax instead.
- `transform`/`opacity` only for DOM layers; DPR capped at 2; no layout reads after canvas writes; `will-change` limited to the moving layers; visibility pause.
- Text tokens are unchanged; all mood accents stay at very low opacity over the existing `#080d17` base. Contrast is measured against sampled rendered backgrounds in both EN and AR.

## Verification

- `npm run typecheck`, `npm run build`.
- Real browser: 1440 / 768 / 375 in EN and AR (`?lang=ar`), each section mood captured, overlap/overflow/focus checked.
- RAF frame timing sampled on desktop and emulated mobile; reduced-motion/toggle and WebGL fallback confirmed.

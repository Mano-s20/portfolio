# Living Layered Radiology Background Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Replace the near-static dark background with a fixed, layered, section-aware imaging system that stays calm behind unchanged content and is fully accessible.

**Architecture:** CSS owns static layers and tuning tokens; `src/background/engine.ts` owns the only rAF loop, mood state, parallax and rare events; `renderers.ts` draws the 2D mood visuals; `webglWireframe.ts` is lazily imported on capable devices with a 2D fallback. `Background.tsx` hosts the layer DOM and lifecycle.

**Tech Stack:** Vite + React 19 + TypeScript, CSS custom properties, Canvas 2D, raw WebGL (no new dependency), IntersectionObserver.

---

### Task 1 — Tokens and layer scaffold

Files: `src/index.css`, `src/App.tsx`

- [x] Add the tuning variables in one block at the top of `:root`; do not alter existing token values, fonts or copy.
- [x] Make `body` background transparent so a `z-index: -1` fixed layer is visible above `html` background.
- [x] Add `.bg-system`, `.bg-base`, `.bg-glow`, `.bg-grid`, `.bg-wireframe`, `.bg-canvas`, `.bg-grain`, `.bg-vignette`, `.bg-lens` rules using `transform`/`opacity` only; add figure-8 glow keyframes.
- [x] Extend reduced-motion and `html[data-motion='off']` rules to hide all dynamic canvas layers and stop the glow.
- [x] Verify: `npm run typecheck`; browser computed styles show `z-index: -1`, pointer-events none, and no document overflow at 375px.

### Task 2 — Config + engine loop

Files: `src/background/config.ts` (new), `src/background/engine.ts` (new)

- [x] `config.ts` reads CSS durations/counts once and exposes typed values with safe fallbacks.
- [x] `engine.ts` owns one rAF, canvas sizing with DPR ≤2, visibility pause, resize/scroll/pointer listeners, IntersectionObserver mood state, 1.2s cross-fade weights, pointer and scroll parallax, random grid pulses and rare events.
- [x] Verify: typecheck; browser console has no errors; only one `requestAnimationFrame` chain is registered by the background.

### Task 3 — 2D mood renderers

Files: `src/background/renderers.ts` (new)

- [x] Particles drifting upward with a few glowing ones; convergence in contact mood.
- [x] Hero wireframe fallback, beam, about CT bands, skills device outlines, experience film strips + developing wash, education gantry dial, safety trefoil + ripples, contact ECG.
- [x] Verify: typecheck; capture each section visually in a real browser.

### Task 4 — Lazy WebGL wireframe + lens

Files: `src/background/webglWireframe.ts` (new), `src/background/engine.ts`

- [x] Lazily import a small raw-WebGL point/line renderer on capable devices; sparse skull/tooth plus a denser inner layer clipped to the lens circle; beam brightening in shader; fail gracefully to the 2D renderer.
- [x] Lens follows the pointer via direct transform writes; disabled on touch and reduced motion.
- [x] Verify: typecheck; browser confirms WebGL canvas present on desktop and 2D fallback under emulated weak device; lens ring tracks pointer without React re-renders.

### Task 5 — React wiring and environment toggle

Files: `src/components/Background.tsx`, `src/hooks/useEnvironment.ts`, `src/App.tsx`

- [x] Replace `ScanBackground` with the new layer host; keep `LensCursor` behaviour adapted to reveal only background structure (no invert over text).
- [x] Make `reduced` = system preference OR user toggle; keep `weak` as a separate fallback flag so the footer toggle controls the whole system.
- [x] Verify: typecheck + build; toggling footer Motion off removes canvas and stops glow, toggling on restores them; AR RTL layout unchanged.

### Task 6 — Contrast, documentation, browser verification

Files: `ANIMATION.md`, `README.md`, `screenshots/`

- [x] Update docs with the new knobs and fallback rules.
- [x] Sample rendered background colours behind text tokens and compute WCAG ratios (≥4.5:1 body, ≥3:1 large).
- [x] Capture 1440/768/375 EN + AR for each section mood; measure RAF frame timing; report fallback and FPS honestly.
- [x] Verify: full typecheck + build pass, no console errors/overflow, screenshots reviewed.

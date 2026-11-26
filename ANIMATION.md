# Animation Concept & Specification

**Phase 3 deliverable; living background added in Phase 4.** Skills applied: `animate`, `choreograph`, `animation-performance`, `motion`, `motion` React best practices, `designing-frontend-interfaces`, `frontend-design`, `building-accessible-interfaces` (reduced motion + AA contrast) and `verifying-before-completion`.

---

## 1. Gate result — should these animate?

| Motion | Frequency | Purpose | Verdict |
|---|---|---|---|
| Scanner loader + name resolve | Once per visit | **Explanation** + **delight** (rare tier) | Animate |
| Hero scan reveal / dot-grid morph | Once per visit | **Explanation** (imaging metaphor), **spatial consistency** | Animate |
| Cursor X-ray lens | Continuous but opt-in by pointer | **Explanation** (reveals a hidden layer) | Animate, pointer-only, off under reduced motion |
| Section background states | Scroll, occasional | **State indication** | Animate as a slow crossfade only |
| Device SVG diagrams | Once on enter | **Explanation** | Animate |
| Timeline film-strip | Once on enter | **Explanation** (film → digital) | Animate |
| Certificate unfold / apron build / ECG | Once on enter | **Explanation** | Animate |
| Magnetic buttons, hover glow | Tens/day | **Feedback** | Near-imperceptible, ≤160ms |
| Language switch | Tens/day | State change | **No animation** — instant swap, avoids layout jump |
| Nav links, keyboard focus | 100+/day | — | **No animation** beyond the focus ring |

Rejected: a full-screen WebGL/Three.js anatomy scene (too heavy for the value), glitch flicker on every heading (no purpose, flashes), and staggered list items in the navigation (high-frequency UI).

---

## 2. Ingredients (from the token block, no invented values)

- **Curves:** `--ease-out` `cubic-bezier(0.16, 1, 0.3, 1)` for entrances; `--ease` `cubic-bezier(0.2, 0, 0, 1)` for hover/state; `linear` only for the scan line and counters.
- **Durations:** `--dur-fast` 120ms (press/hover), `--dur` 240ms (state), `--dur-slow` 480ms (reveals); hero marketing entrance 520–620ms (documented exception).
- **Tunable speed knobs:** all continuous/slow motion is controlled by five variables at the top of `src/index.css` (`:root`). Edit these, not individual rules:
  - `--rotate-speed: 48s` — hero wireframe / device orbit
  - `--scan-duration: 3.6s` — portrait and background scan sweep, `ease-in-out`
  - `--pulse-speed: 3s` — radiation trefoil breathing
  - `--ecg-duration: 4s` — contact ECG draw
  - `--device-orbit: 24s` — CBCT / panoramic device diagrams
  Continuous rotation is linear; sweeps and pulses use `--ease-in-out`. Reduced motion stops or freezes all of them.
- **Properties:** `transform`, `opacity`, `clip-path` (scan reveal), SVG `stroke-dashoffset` (diagram drawing). No `width`/`height`/`margin`/`top`/`left` animation. No `scale(0)` — entrances start at `scale(0.97)`.
- **Tools:** CSS transitions/keyframes for scan line, flicker, hover, counters; Motion (`motion/react`) for hero orchestration, SVG draw and mode-swap crossfades; GSAP + ScrollTrigger for scroll-linked timeline/background states; Canvas 2D for the particle grid (lazy-loaded); Lenis for smooth scroll. WAAPI/CSS handles anything that must survive main-thread load.

---

## 3. Choreography — hero cast & timeline

**Lead:** the name (`ABDERAHMAN MOSTAFA`) and the "Radiologic Technologist" headline.
**Support:** role line, tagline, two CTAs.
**Decoration:** scan line, dot grid, metadata rail (fade only).
**Static:** the section container and background field.

| Element | Role | Starts | Duration | Motion | Relationship |
|---|---|---|---|---|---|
| Scan line | Decoration | 0ms | `--scan-duration` 3.6s loop | `translateY(-100% → 100%)`, `ease-in-out` | Together with background; starts before text |
| Dot grid → skull/tooth | Decoration | 0ms | 1.6s morph + slow rotation | particle interpolation, opacity | Lead does not wait for it |
| Counter `SCANNING…` | Support | 0ms | 800ms | text 0→100, linear | Ends where the name begins |
| Name + headline | Lead | 800ms | 620ms | opacity + `translateY(12px)` + `scale(0.97)` | Overlaps counter settle by 80ms |
| Role line | Support | 880ms | 520ms | opacity + 8px rise | Overlaps lead |
| Tagline | Support | 960ms | 520ms | opacity + 8px rise | Overlaps role line |
| CTAs | Support | 1040ms | 440ms | opacity + 6px rise | Overlaps tagline; clickable immediately on visibility |
| Metadata rail | Decoration | 800ms | 480ms | opacity only | Together with lead, no movement |

Delays shrink toward the end (80ms steps) so the group reads as a wave, not a queue. Total entrance under 1.6s; the counter is deterministic and skippable by click/key.

**What deliberately does not move:** the nav (one entrance per container), the portrait in the hero (it belongs to About), the section container (carry, not animate), and the footer.

**Feel check (needs a recording, not code):** scrub the 800–1040ms window and confirm the name lands as one gesture with the role line; if the counter-to-name handoff reads as a pause, reduce the overlap gap to 40ms. Re-check at 2× and 5× speed.

---

## 4. Per-section specification

### Background — one fixed, section-aware system
A single `position: fixed; inset: 0; z-index: -1; pointer-events: none` host (`src/components/Background.tsx`) contains, in paint order: base gradient + drifting figure-8 glow, parallax imaging grid with occasional signal pulses, a lazy WebGL wireframe canvas (2D fallback), a shared 2D canvas for particles + section moods, static grain, a readability scrim/vignette, and the pointer reticle. Every animation is driven by **one** `requestAnimationFrame` loop in `src/background/engine.ts`; it pauses on `visibilitychange`, caps DPR at 2, and writes only `transform`/`opacity`/canvas pixels.

- **Always on:** navy base gradient, slow figure-8 glow (`--bg-glow-speed`), grid parallax on scroll/pointer, rare global scan/ripple events (`--rare-event-min/max`) and 76 desktop / 32 mobile drifting photon particles.
- **Hero:** generated skull/tooth wireframe rotates over `--wireframe-rotate-speed`, a soft horizontal beam sweeps every `--scan-beam-interval`, and the reticle reveals denser bone lines in the background only — never an inverted copy of the page, so text contrast is untouched.
- **About:** slow CT bands drifting behind the copy.
- **Skills:** slowly rotating device outlines (CBCT/panoramic/ceph) with travelling signal dashes and one large gantry arc visible between the cards.
- **Experience:** film perforations plus a brief developing wash.
- **Education:** a quiet CT gantry dial.
- **Safety:** breathing trefoil and soft concentric ripples.
- **Contact:** ECG trace and particles converging toward the contact card.

Moods are selected by IntersectionObserver and cross-fade over `--mood-fade` (1.2s). Only the active (plus briefly the outgoing) mood is drawn; the loop stops entirely under `prefers-reduced-motion` or the footer motion toggle, leaving the static gradient, grid and soft glow in place.

### Pointer reticle
- A 160px reticle follows a fine pointer with a light ease, written to `transform`; no React state per frame and no `backdrop-filter` over content.
- It brightens/reveals background bone lines near the pointer (WebGL clip in the lazy renderer, 2D clip in the fallback). Blur stays at 4px, well under the 20px limit.
- Pointer-only (`hover: hover` and `pointer: fine`), off on weak devices, on reduced motion, and when the pointer leaves the window.

### 1. Hero
As specified in §3. Film flicker is a subtle opacity modulation between 0.94 and 1 at 1.5 Hz — below the 3 flashes/second seizure threshold and never a full black-out.

### 2. About
Two stacked portrait images: blue-tinted inverted negative underneath, real photo on top. On section enter (once), a vertical scan line sweeps across over `--scan-duration` (3.6s, `ease-in-out`) while the real photo is revealed with `clip-path`; in RTL the sweep runs right-to-left. On hover/focus of the frame the negative returns briefly; leaving restores the real photo. Under reduced motion the real photo is shown statically with no sweep. `transform` is never used on the photo itself. The frame stays static.

### 3. Skills & Equipment
- **Panoramic:** SVG source rotates around a head silhouette (360° over `--device-orbit` 24s, linear), then a curved path draws itself (`stroke-dashoffset`, 1.2s) to produce the panoramic strip.
- **CBCT:** a clean panoramic X-ray gantry orbits a head outline (360° over `--device-orbit` 24s, linear) with source/detector boxes and a beam line; no broken V-shaped stroke.
- **Cephalometric:** a side-profile path draws from 0 to 1 over 1.1s, then the reference line fades in.
- **Skill meters:** `scaleX(0 → value)` from the left (right in RTL) over `--dur-slow` on enter, with `aria-valuenow` set to the value only if a real value exists; otherwise they are decorative and hidden from assistive tech. No percentages are shown in copy.
- The CBCT orbit is continuous and deliberately slow (24s); other one-shot diagram strokes still pause after one run to avoid distracting reading.

### 4. Experience timeline
- The vertical rail fills with `scaleY(0 → 1)` tied to scroll progress via ScrollTrigger, `scrub: 0.4`, `--ease` family.
- Stop 1 (El-Shamla, manual): a developer-tray rectangle fades up with a 4px blur that resolves over `--dur-slow` — "image appearing slowly in solution".
- Stop 2 (Al-Rahma, conventional): a hard cut of opacity with a 120ms line draw, representing full-shift analog work.
- Stop 3 (Al-Mohammadi, DR): instant clean appearance (120ms opacity only, no blur) — the digital contrast.
- Each stop's content enters once; no re-animation on scroll back.

### 5. Education
The certificate card enters with `rotateX(-8deg → 0)` + opacity over `--dur-slow`, transform-origin at the top edge (a fold, not a flip). CT-slice background is a static repeating gradient translated 40px over 18s linear at 0.06 opacity.

### 6. Radiation Safety
- Trefoil: calm `scale(1 → 1.04)` breathing over `--pulse-speed` 3s (`ease-in-out`), infinite but only while the section is visible.
- Lead apron: SVG path draws over 1.4s on enter; the amber is used only on the trefoil and the ALARA label.
- ALARA cards: on first enter, 100ms / 80ms / 60ms stagger (shrinking gaps), opacity + 10px rise. On hover/focus, a 120ms border-colour transition only. Keyboard focus uses the same visual state as hover.

### 7. Contact
- ECG polyline draws once over `--ecg-duration` 4s (`ease-in-out`), then holds at the bottom of the card.
- Magnetic buttons: pointer-relative `translate` capped at ±4px with a spring (`stiffness 300, damping 24`), pointer-only; the button's layout box never moves. Keyboard focus gets no magnetic motion.
- Hover glow is `--glow-soft`, 120ms.

### Micro-interactions
Scanner-style loader (0–100 counter, 800ms ceiling), hover glow on actionable elements only, language switch as an instant crossfade with no layout shift, and a single `clip-path` reveal on section entry. No scroll-triggered fade on every section.

---

## 5. Performance & interruption rules

- **Frame budget:** 16.7ms at 60fps, designed against 8ms (120Hz). All primary motion uses `transform`/`opacity` or direct canvas pixels; no layout reads per frame.
- **Canvas:** one shared rAF loop, 76 desktop / 32 mobile particles, DPR capped at 2, paused when the tab is hidden and cancelled on unmount. The wireframe is a lazy ~3.8 kB raw-WebGL chunk; no Three.js or external textures.
- **No state per frame:** pointer/scroll values are cached in refs; rAF writes transforms directly, never React state.
- **No inherited CSS variables** in animated transforms; config reads CSS variables once at startup; no animated blur above 20px; no `transition: all`.
- **`will-change`** only on the glow and reticle once active, never on containers or `*`.
- **Interruption:** all hover/click sequences use transitions or springs so they retarget from the current value. The loader can be dismissed mid-flight. Re-entering a section does not replay a completed one-shot animation. Rapid language switching does not stack crossfades (stable keys in `AnimatePresence`).
- **Reduced motion:** `MotionConfig reducedMotion="user"`, the media query and the footer toggle set `html[data-motion='off']`. The background engine is not started; canvases/grain/reticle are hidden, the grid transform is reset and the glow is kept as a static soft accent (opacity 0.55). A visible "Motion off (system setting)" / "الحركة متوقفة (إعداد النظام)" chip is rendered whenever motion is disabled, plus a "Reduce motion" / "تقليل الحركة" toggle in the footer. Static gradient, glow, grid and section content remain.
- **Weak device:** `navigator.hardwareConcurrency <= 4`, `navigator.deviceMemory <= 4`, `prefers-reduced-data: reduce`, or WebGL/canvas failure → 2D canvas fallback instead of the WebGL wireframe, no pointer parallax/reticle, and the same footer toggle still works.

---

## 6. Implementation order (Phase 4)
1. Token-driven CSS keyframes/transitions + reduced-motion base.
2. Scanner loader and hero choreography with Motion.
3. Canvas particle background + scan line + lens, behind feature detection.
4. SVG device diagrams and skill meters.
5. GSAP ScrollTrigger timeline and background states.
6. Safety and contact sequences.
7. Performance pass: frame recording, canvas budget, interruption checks, device fallback.

---

## 7. Skills applied
- **animate** — frequency/purpose gate, property/curve/duration selection, no `scale(0)`, reduced motion shipped with each animation.
- **choreograph** — cast/relationship timeline, shrinking stagger, one entrance per container, interruption rules, feel-check note.
- **animation-performance** — property tiers, frame budget, main-thread/WAAPI split, no per-frame state, blur/variable traps, `will-change` discipline.
- **motion** — `motion/react` imports, `MotionConfig reducedMotion="user"`, stable `AnimatePresence` keys, React MotionValue patterns.

---

## 8. Living-background verification (2026-11-26)

### Diagnosis before the fix (real browser, no code changes)
- The Review-pane tab had `prefers-reduced-motion: reduce` active: `data-motion="off"`, canvases/grain/lens hidden and the glow hidden. `localStorage` was empty, the machine reported 16 cores / 16 GB and `prefers-reduced-data` was false, so the weak-device path was not responsible. **Real root cause: the system reduced-motion setting**, combined with a static fallback that hid every accent and made that view genuinely flat.
- A clean `no-preference` context had `data-motion="on"`, `.bg-system` fixed at full viewport with `z-index:-1`, 495 rAF callbacks in 3s, 88,967 non-zero 2D canvas pixels, and — after forcing `preserveDrawingBuffer` for the test — 774 sampled non-empty WebGL pixels. So the engine itself was alive; the perceived flatness came from the reduced setting and from weak/low-contrast layers.
- Before-fix Hero 0→1s: mean RGB delta **1.741 / 3.247 / 3.687**, **8.21%** of pixels changed by >8 levels. In the reduced tab the same pair was **0.000 / 0.000 / 0.000** and **0.00%** — exactly static.

### Fix and proof
- Single tuning block in `src/index.css :root`, read once by `src/background/config.ts`: glow 36s / 48vw / alpha 0.20 plus counter glow 26vw / 0.10; grid alpha 0.10 with 0.2 scroll parallax and 5s signal pulses; 76 desktop / 32 mobile particles with 15% bright twinkle; wireframe 36s / stroke 0.62; beam 8s / 0.28; 160px lens; 1.2s mood fade; 9s skills cycle; 60s CT dial; rare events 15–20s at 0.16; grain 4%; DPR cap 2.
- Localized radial/solid scrims behind copy only, edge falloff vignette; static glow retained under reduced motion; visible EN/AR footer status chip and motion toggle; corrected Hero gantry SVG, one-line subtitle and title (no doctor title); one shared canvas rAF loop paused when hidden.

### Frame proof after the fix
- 96 frames in `screenshots/proof_{hero,skills,experience,safety}_{en,ar}_{1440,375}_{0..5}s.png`: six frames 1s apart per combination, after a 1.6s settle. AR contexts verified `dir=rtl`.
- Consecutive-frame change (average of five 1s pairs; "% >8" = pixels differing by more than 8 RGB levels; number in parentheses = mean RGB delta):

  | Section | EN 1440 | AR 1440 | EN 375 | AR 375 |
  |---|---|---|---|---|
  | Hero | 11.99% (3.53) | 11.14% (2.89) | 7.71% (2.30) | 7.88% (2.03) |
  | Skills | 0.44% (0.37) | 0.44% (0.39) | 0.74% (0.77) | 0.78% (0.51) |
  | Experience | 3.57% (1.36) | 1.15% (0.83) | 2.30% (1.18) | 1.97% (0.49) |
  | Safety | 0.94% (0.89) | 0.50% (0.46) | 6.43% (2.05) | 1.09% (0.45) |

  Skills/Safety change slowly by design (one device outline per 9s; slow breathing trefoil), but their frames are non-static in every language and viewport; over 0→5s Skills EN 1440 changes 2.40% and Safety EN 1440 changes 6.23%.
- Load-time Hero pair `screenshots/afterfix_load_clean_en_1440_{0,1}s.png`: mean **9.836 / 13.528 / 16.063**, **65.71%** changed >8, versus **8.21%** before. This pair includes the one-time content entrance fade, so the steady-state table above is the fair before/after comparison.
- Reduced-motion pair `screenshots/afterfix_load_reduced_en_1440_{0,1}s.png`: mean **0.000 / 0.000 / 0.000**, **0.00%** changed >8 (correctly frozen), while clean vs reduced at 0s differs by **16.84%** of pixels, confirming the static glow is now visible rather than a blank navy field. `data-motion=off`, 0 rAF callbacks, hidden canvases/grain/lens and visible "Motion off (system setting)" / "الحركة متوقفة (إعداد النظام)" chip were confirmed in browser.
- Luminance ASCII maps were used as a text proxy for the PNGs (Hero: migrating cyan glow + horizontal scan band; Skills: device outline changes from panoramic arc to CBCT ring as the glow drifts; Experience: film-perforation columns + warm-to-cyan wash; Safety: amber trefoil/halo and ripple rings). **Limitation: this model cannot read PNG image input, so no human-equivalent visual inspection was possible in this session.** The frames are saved for direct human review; subjective "clearly visible in every section" is therefore not claimed as verified.

### Other checks
- `npm run typecheck` and `npm run build` pass; a fresh Playwright page produced zero console errors/warnings and 502 rAF callbacks in 1s in a clean context.
- Zero horizontal overflow at 1440 and 375 in EN and AR; `dir=ltr/rtl` and footer indicator/toggle text verified in both languages.
- Token contrast (WCAG): ink on used surfaces 13.8–18.0, ink-2 7.9–10.3, ink-3 4.57–5.26 on the surfaces where it is used, accent 9.2–12.0, amber 8.3–10.8, primary-button ink on accent 12.0 — all meet AA for small text. No colour tokens were changed.
- Unverified: real-device FPS and direct visual judgement of the saved frames (stated above).

---

## 9. Retune + extension pass (2026-11-26)

**Config source of truth:** the “Living background knobs” block in `src/index.css :root`. `src/background/config.ts` reads it once at startup; `engine.ts`, `renderers.ts` and `webglWireframe.ts` contain no tunable literals for these values.

### Before → after (requested tuning values)

| Layer / variable | Before | After | Notes |
|---|---|---|---|
| `--bg-glow-alpha` | `0.2` | `0.32` | size `48vw → 60vw` |
| `--bg-glow-2-alpha` | `0.1` | `0.18` | size unchanged at `26vw` |
| `--grid-alpha` | `0.1` | `0.16` | pulses every `3.5s`, `1400ms`, `2px`/`0.9`, max 2 |
| `--particle-count` / mobile | `76` / `32` | `110` / `50` | bright ratio `0.15 → 0.25`, `3–4px`, `14–40px/s`, twinkle |
| Hero wireframe | `min(w,h)*0.36` | `clamp(380px, 42vw, 760px)`; `80vw` mobile | stroke `0.75`, points `0.9`, cyan glow, `36s` |
| `--beam-height` / `--beam-alpha` | `180px` / `0.28` | `260px` / `0.5` | interval `8s → 6s`, wireframe brightened on crossing |
| Lens | pointer only | idle `1500ms`, then 12s autonomous wander | pointer retakes control; always visible on desktop |
| About bands / scan | `0.09`, `140px`, `6px/s`, `0.12` | `0.2`, `140px`, `14px/s`, `0.3` | |
| Skills outline / halo / line / size | `0.34`, `0.16`, `2.2px`, `0.36` | `1`, `0.6`, `5px` (`7px` mobile), `0.68` | placed in open side; 6s cycle |
| Experience perforation / scroll / murk / clarity | `0.12`, `12px/s`, `0.22`, `0.08` | `0.28`, `20px/s`, `0.35`, `0.14` | |
| Education ring / radius / layer / turn | `0.14`, `0.16`, `0.75`, `60s` | `0.6`, `0.42`, `1`, `40s` | added counter-rotating inner dial |
| Safety trefoil / size / halo / ripple | `0.18`, `0.17`, `0.1`, `0.12` | `0.44`, `0.32`, `0.28`, `0.4` | |
| Contact ECG line / alpha / spikes / ripple / convergence | `2px`, `0.32`, `−14…+18`, `0.14`, `0.0016` | `5px`, `0.85`, `−48…+60`, `0.9`, `0.01` | 4 traces, ripple radius `520px` |
| Rare events | `15–20s`, flash `0.16` | `10–14s`, flash `0.3` | durations `900/1200ms` |
| Card scrim | `0.62`, no blur | `0.45`, `4px` backdrop blur | copy scrims retained for AA |

Values above the requested targets (Skills, Education, Safety, Contact) were raised further where a 1s sample still missed the 3% floor; the CSS block remains the only place to change them.

### 1s pixel-change proof (>8 RGB levels)

| Section | EN 1440 | AR 1440 | EN 375 | AR 375 | Target |
|---|---:|---:|---:|---:|---|
| Hero | 20.62% | 22.02% | 26.86% | 27.53% | ≥15% |
| About | 33.77% | 33.52% | 9.36% | 7.73% | ≥3% |
| Skills | 26.98% | 28.01% | 6.59% | 8.74% | ≥3% |
| Experience | 14.03% | 5.51% | 11.29% | 7.18% | ≥3% |
| Education | 3.12% | 3.65% | 4.52% | 5.56% | ≥3% |
| Safety | 3.60% | 13.52% | 5.62% | 6.11% | ≥3% |
| Contact | 15.54% | 5.87% | 7.96% | 8.26% | ≥3% |

Frames: `screenshots/retune/{lang}-{width}-{section}-{a,b}.png`. A five-frame RTL mobile Skills series was also checked: 9.10%, 13.55%, 17.20%, 4.51% for consecutive 1s pairs after the final tuning.

### Accessibility, frame budget and text fix

- **Text fix:** the `/` separator in `.lang-switch > span` used `var(--line-strong)` (1.83:1). It now uses `var(--ink-2)`. Computed WCAG contrast across all seven moods in EN and AR: minimum **4.94:1**, maximum well above AA.
- **Frame timing (1440, 300 rAF intervals):** EN median **6.10ms**, p95 **6.20ms**, max **6.70ms**, 0 frames >25ms; AR median **6.10ms**, p95 **6.20ms**, max **6.30ms**, 0 frames >25ms.
- Fresh console check: zero errors/warnings; `data-motion="on"`; `prefers-reduced-motion` false; zero horizontal overflow at 1440 and 375 in both languages.
- `npm run typecheck`, `npx tsc -b --pretty false` and `npm run build` pass.

### Human-review recordings

`recordings/hero-10s.webm`, `recordings/skills-10s.webm`, `recordings/safety-10s.webm`, `recordings/contact-10s.webm` — 10-second EN/1440 screen recordings for visual judgement.

### Skills used in this pass

- `animate` — Step 1/2: chose which properties and durations to tune and which motion is functional.
- `frontend-design` — Step 1/2: kept section identity and visual hierarchy while retuning.
- `building-accessible-interfaces` — Step 2/3: scrim/blur, contrast fix, reduced-motion and AA checks.
- `animation-performance` — Step 2/3: single shared rAF, canvas-only work, DPR cap, frame-time measurement.
- `verifying-before-completion` — Step 3: typecheck/build, browser measurements, recordings.

### Remaining limitation

This session cannot visually inspect PNG/WebM frames, so subjective visual quality is **not claimed as verified**. Real-device FPS is also unverified; the frame numbers above are from headless Chromium only. The recordings are provided for direct human review.

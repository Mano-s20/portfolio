# Abderahman Mostafa — Radiology Portfolio

A bilingual (English / Arabic, full RTL), static portfolio site for Abderahman Mostafa Mohamed Fetieh. Content is grounded in the supplied CV; no patient images, invented metrics, dates of birth or marital status are published.

## Run locally

Requires Node.js 20.19+ (Vite 7).

```bash
npm install
npm run dev
```

Open the URL shown by Vite (normally `http://localhost:5173`).

## Scripts

```bash
npm run typecheck   # TypeScript only
npm run lint        # TypeScript only (no ESLint config in this project)
npm run build       # TypeScript + production bundle in dist/
npm run preview     # Serve the production build locally
```

## Stack and why

- **Vite + React + TypeScript** — a small static SPA with typed content and fast iteration; no server runtime needed.
- **Tailwind CSS v4 + CSS tokens** — `@theme` exposes semantic tokens while component CSS keeps the imaging-console visual system consistent and RTL-safe.
- **Motion for React** — hero choreography, loader and interactive feedback with `MotionConfig reducedMotion="user"`.
- **GSAP + ScrollTrigger** — used only for the scroll-linked experience rail, then loaded dynamically.
- **Lenis** — restrained smooth scrolling, disabled when reduced motion is requested. Dynamically imported.
- **Layered background engine** — one fixed layer and one rAF loop drive the base glow, parallax grid, particles and seven section moods. Raw WebGL wireframe is lazy-loaded (~3.8 kB); low-end devices use a 2D fallback. No Three.js dependency, DPR capped at 2, paused when the tab is hidden.
- **Fontsource** — self-hosted Sora, IBM Plex Sans, IBM Plex Sans Arabic and IBM Plex Mono; no external font requests.
- **Code-generated SVG** — all equipment, safety and ECG visuals are vector illustrations, never patient scans.

## Structure

```text
CV_ANALYSIS.md          Source-of-truth CV inventory and privacy rules
CONTENT.md              Full EN/AR copy deck and fact-check table
DESIGN.md               Tokens, contrast, component states, RTL rules
ANIMATION.md            Motion choreography, performance and fallback rules
src/i18n/               Bilingual copy and language/direction state
src/context/            Reduced-motion / weak-device / pointer capabilities
src/background/         Tunable config, shared rAF engine, renderers, geometry, lazy WebGL
src/components/         Loader, header, background host, sections, footer, 404
public/images/profile.jpg  Native-resolution CV portrait crop
public/images/profile@2x.jpg  2x retina derivative
```

Language state is stored in `localStorage` and mirrored in `?lang=ar`. The `<html lang>` and `dir` attributes switch together. Footer contains a user motion toggle in addition to `prefers-reduced-motion`.

### Motion speed knobs

All timing, counts and opacities live in **one block: `src/index.css` → `:root` → “Living background knobs”**. `src/background/config.ts` reads it once at startup; edit the CSS variables, not individual renderers.

| Variable | Controls | Current value |
|---|---|---|
| `--rotate-speed` | Legacy hero/device orbit knob | `48s` |
| `--scan-duration` | Portrait scan sweep | `3.6s` |
| `--pulse-speed` | Trefoil breathing + safety ripples | `2.4s` |
| `--ecg-duration` | Contact ECG pass | `2s` |
| `--device-orbit` | CBCT / panoramic device diagrams | `24s` |
| `--bg-glow-speed` | One figure-8 loop of the large glow | `36s` |
| `--bg-glow-size` / `--bg-glow-alpha` | Large glow diameter / centre alpha | `60vw` / `0.32` |
| `--bg-glow-2-size` / `--bg-glow-2-alpha` | Counter-drifting glow | `26vw` / `0.18` |
| `--grid-alpha` / `--grid-pulse-interval` | Grid alpha / signal pulse gap | `0.16` / `3.5s` |
| `--grid-pulse-duration` / `--grid-pulse-width` / `--grid-pulse-max` | Pulse length, head width, concurrency | `1400ms` / `2px` / `2` |
| `--particle-count` / `--particle-count-mobile` | Photon particles | `110` / `50` |
| `--bright-particle-ratio` | Share of larger twinkling photons | `0.25` |
| `--particle-speed-min` / `--particle-speed-max` | Upward photon speed (px/s) | `14` / `40` |
| `--wireframe-min-size` / `--wireframe-vw` / `--wireframe-max-size` | Hero wireframe size | `380px` / `42vw` / `760px` |
| `--wireframe-mobile-vw` | Hero wireframe size on phones | `80` |
| `--wire-stroke-alpha` / `--wire-point-alpha` | Hero wireframe line / point alpha | `0.75` / `0.9` |
| `--wireframe-rotate-speed` | Skull turn | `36s` |
| `--scan-beam-interval` / `--beam-height` / `--beam-alpha` | Hero scan beam | `6s` / `260px` / `0.5` |
| `--lens-idle-delay` / `--lens-wander-duration` | Autonomous lens takeover | `1500ms` / `12000ms` |
| `--about-band-alpha` / `--about-band-width` / `--about-drift-speed` | About CT bands | `0.2` / `140px` / `14` |
| `--skill-cycle` / `--skill-size-ratio` | Time on each Skills device / size | `6s` / `0.68` |
| `--skill-outline-alpha` / `--skill-line-width` | Device outline weight | `1` / `5px` |
| `--gantry-rotate-speed` / `--dial-radius-ratio` / `--dial-stroke-alpha` | Education CT dial | `40s` / `0.42` / `0.6` |
| `--trefoil-alpha` / `--trefoil-size-ratio` / `--safety-ripple-alpha` | Safety accents | `0.44` / `0.32` / `0.4` |
| `--film-perf-alpha` / `--film-perf-speed` / `--murk-alpha` | Experience film wash | `0.28` / `20` / `0.35` |
| `--ecg-line-width` / `--ecg-line-alpha` / `--ecg-spike-up` | Contact ECG | `5px` / `0.85` / `60px` |
| `--ecg-ripple-alpha` / `--ecg-ripple-radius` | Contact ripple | `0.9` / `520px` |
| `--rare-event-min` / `--rare-event-max` / `--rare-event-alpha` | Rare global flash/ripple | `10s` / `14s` / `0.3` |
| `--card-scrim-alpha` / `--card-scrim-blur` | Card readability scrim | `0.45` / `4px` |
| `--grid-parallax` | Grid scroll parallax factor | `0.2` |
| `--grain-opacity` | Static film grain | `0.04` |
| `--dpr-cap` | Canvas pixel-ratio ceiling | `2` |

Continuous rotation stays linear; sweeps and pulses use `--ease-in-out`.

A real `prefers-reduced-motion: reduce` or the footer toggle stops the whole background engine and shows a small "Motion off (system setting)" / "الحركة متوقفة (إعداد النظام)" status in the footer; the static gradient, grid and non-animated glow remain so the page is not flat. Weak devices only skip WebGL and keep the 2D canvas path — they do not switch motion off.

## Deployment

Build output is `dist/`.

### Vercel

1. Import the repository.
2. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
3. `vercel.json` handles SPA fallback for unknown routes.
4. The canonical URL is generated at runtime from the live path. Replace the relative OG image URLs in `index.html` with absolute production URLs before going live.

### Netlify

1. Build command: `npm run build`. Publish directory: `dist`.
2. `public/_redirects` is copied to `dist/_redirects` and handles SPA fallback.
3. The canonical URL is generated at runtime from the live path. Replace the relative OG image URLs in `index.html` with absolute production URLs before going live.

### After deployment

- Confirm `/anything` renders the 404 state rather than a host 404 page.
- Run Lighthouse in mobile and desktop modes; target 90+ in Performance, Accessibility, Best Practices and SEO.
- Check the live Arabic URL (`/?lang=ar`) for full RTL layout and correct `dir="rtl"`.
- Test WhatsApp, `tel:` and `mailto:` links on a real phone.

## Privacy and content rules

- Never publish date of birth or marital status.
- Do not add certificates, licences, awards, patient counts, results, availability promises or physician credentials.
- Headline uses **“Radiologic Technologist”** / **فني أشعة تشخيصية** — an accurate technician title, never a medical-doctor title. The role line is the single clean **“X-ray & Dental Imaging Technician”**, with **“Dental & Digital Imaging”** as a smaller tag. Never use «طبيب أشعة».
- Education wording remains **“Bachelor's Degree / Diploma”** in both languages.
- The supplied portrait is a small crop from the CV and is only used as a circular avatar. A higher-resolution original would improve the About section.

## Owner inputs still needed

1. A higher-resolution portrait if the photo should be displayed larger than a small avatar.
2. Confirmation of the Arabic family-name spelling **فتية**.
3. The final production domain, so the OG image URLs can be absolute (canonical is already runtime-generated).
4. Confirmation that the CV email and Facebook profile should remain public (they are currently included because they appear in the CV contact block).

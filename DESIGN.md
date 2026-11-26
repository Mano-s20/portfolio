# Design System — Radiology Portfolio

**Phase 2 deliverable.** Skills applied: `designing-frontend-interfaces`, `ui-ux-pro-max`, `design-system`, `building-accessible-interfaces`, `applying-themes` (contrast checker).

**Mode: marketing surface** (a portfolio). Art direction is allowed and expected; the page is not an app dashboard.

---

## 1. Design brief (8 lines, written before any component)

```
Purpose:    Present an early-career radiologic imaging technician to hiring decision-makers and make contact effortless.
Audience:   Radiology centre owners, hospital HR, dental clinic owners, recruiters; phone and desktop; often skimming.
Tone:       "Diagnostic Console" — a medical imaging workstation: precise, calm, instrument-like, never sci-fi decoration.
Reference:  A DICOM viewing station and a dark radiology reporting room; not a startup landing page.
Palette:    Midnight blue-black base, ice-cyan signal, near-white ink, one restrained amber for radiation warnings.
Type:       Sora (display) + IBM Plex Sans (body) + IBM Plex Mono (metadata) + IBM Plex Sans Arabic (Arabic). Chosen for geometric clarity and a single systematic family across scripts.
Memorable:  A moving scan line and a cursor "X-ray lens" that reveals hidden anatomy under the page surface.
Restraint:  No neon green, no glitch spam, no glass panels, no emoji icons, no identical card grid, no glow on text by default.
```

### Plan critique (Step 3 of the skill)
The obvious default for this brief was **dark slate + one neon accent + three identical cards + gradient hero**. That was rejected: the accent is ice-cyan derived from X-ray film rather than neon, the surface is a layered navy ramp rather than `#111`, and the equipment section uses an asymmetric **one feature + two secondary rows** with SVG diagrams instead of a card grid. The "memorable" element is structural (the lens reveals a real second layer), not a floating ornament.

---

## 2. Token architecture (primitive → semantic → component)

```css
:root {
  /* ── PRIMITIVE COLOR ─────────────────────────────── */
  --navy-950: #05080f;
  --navy-900: #080d17;
  --navy-850: #0a111e;
  --navy-800: #0d1524;
  --navy-750: #121d30;
  --navy-700: #18253c;
  --line-1:   #1f2c42;
  --line-2:   #2b3d59;
  --ice-100:  #eaf4ff;
  --ice-200:  #c8e4f6;
  --ice-300:  #a8bcd4;
  --ice-400:  #72879f;
  --cyan-300: #6bd5ff;
  --cyan-400: #38b8e8;
  --cyan-600: #1b7fa8;
  --amber-300:#f0b35b;
  --amber-600:#9a651e;

  /* ── SEMANTIC COLOR ──────────────────────────────── */
  --bg-void:      var(--navy-950);
  --bg-base:      var(--navy-900);
  --surface-1:    var(--navy-800);
  --surface-2:    var(--navy-750);
  --surface-3:    var(--navy-700);
  --line:         var(--line-1);
  --line-strong:  var(--line-2);
  --ink:          var(--ice-100);
  --ink-2:        var(--ice-300);
  --ink-3:        var(--ice-400);
  --accent:       var(--cyan-300);
  --accent-deep:  var(--cyan-600);
  --accent-ink:   var(--navy-950);
  --warning:      var(--amber-300);
  --focus:        #8fe3ff;

  /* ── TYPE — one ratio: 1.250 major third ─────────── */
  --font-display: "Sora", "IBM Plex Sans Arabic", sans-serif;
  --font-body:    "IBM Plex Sans", "IBM Plex Sans Arabic", sans-serif;
  --font-arabic:  "IBM Plex Sans Arabic", "IBM Plex Sans", sans-serif;
  --font-mono:    "IBM Plex Mono", ui-monospace, monospace;
  --step--2: 0.64rem;
  --step--1: 0.8rem;
  --step-0:  1rem;
  --step-1:  1.25rem;
  --step-2:  1.563rem;
  --step-3:  1.953rem;
  --step-4:  2.441rem;
  --step-5:  3.052rem;
  --step-6:  3.815rem;
  --step-7:  4.768rem;
  --leading-tight: 1.08;
  --leading-body:  1.65;

  /* ── SPACE — 4px base, one scale ─────────────────── */
  --space-3xs: 0.25rem;
  --space-2xs: 0.5rem;
  --space-xs:  0.75rem;
  --space-s:   1rem;
  --space-m:   1.5rem;
  --space-l:   2rem;
  --space-xl:  3rem;
  --space-2xl: 4.5rem;
  --space-3xl: 7rem;

  /* ── FORM ────────────────────────────────────────── */
  --radius-panel:   4px;   /* layout & panels */
  --radius-control: 2px;   /* buttons, inputs */
  --radius-pill:    999px; /* badges only */
  --border:         1px solid var(--line);
  --border-strong:  1px solid var(--line-strong);
  --shadow-contact: 0 1px 0 rgba(107, 213, 255, 0.06);
  --shadow-lift:    0 12px 40px rgba(0, 0, 0, 0.45);
  --glow-soft:      0 0 24px rgba(107, 213, 255, 0.18);
  --glow-strong:    0 0 48px rgba(107, 213, 255, 0.32);
  --blur-lens:      6px;

  /* ── MOTION — three durations, two easings ───────── */
  --dur-fast: 120ms;
  --dur:      240ms;
  --dur-slow: 480ms;
  --ease:     cubic-bezier(0.2, 0, 0, 1);
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);

  /* ── COMPONENT ───────────────────────────────────── */
  --btn-bg: var(--accent);
  --btn-ink: var(--accent-ink);
  --btn-bg-hover: #8de2ff;
  --btn-bg-active: #4cbde8;
  --btn-bg-disabled: var(--surface-2);
  --card-bg: var(--surface-1);
  --card-border: var(--line);
  --meter-track: var(--surface-2);
  --meter-fill: var(--accent);
  --scan-line: rgba(107, 213, 255, 0.55);
  --focus-ring: 2px solid var(--focus);
}

[dir="rtl"] {
  --font-display: "IBM Plex Sans Arabic", "Sora", sans-serif;
  --font-body:    "IBM Plex Sans Arabic", "IBM Plex Sans", sans-serif;
}
```

**Rule:** no literal hex, px spacing or `rem` size in components unless it comes from this block. Motion values in JS (GSAP/Framer) are read from the same constants where practical.

---

## 3. Contrast verification (measured, not estimated)

Run with `applying-themes/scripts/check_contrast.py --pair fg bg`:

| Pair | Ratio | Requirement | Result |
|---|---|---|---|
| `#EAF4FF` on `#080D17` | 17.48:1 | body 4.5:1 | AAA |
| `#A8BCD4` on `#080D17` | 10.01:1 | body 4.5:1 | AAA |
| `#72879F` on `#080D17` | 5.26:1 | meta 4.5:1 | AA |
| `#6BD5FF` on `#080D17` | 11.65:1 | accent text/UI | AAA |
| `#F0B35B` on `#080D17` | 10.46:1 | warning text | AAA |
| `#05080F` on `#6BD5FF` | 12.01:1 | button label | AAA |
| `#EAF4FF` on `#121D30` | 15.18:1 | body on surface | AAA |
| `#72879F` on `#121D30` | 4.57:1 | meta on surface | AA |

Focus ring `#8FE3FF` vs adjacent navy is > 7:1. Amber is never used for body text or as a background behind small type.

---

## 4. Hierarchy & layout rules

- Vary **one dimension at a time**: section headings change size, not weight/colour/spacing all at once. Emphasis uses weight only. Metadata uses `--ink-3` only.
- **12-column asymmetric grid** with editorial offsets: hero text spans cols 1–7 with the portrait/visual breaking into cols 8–12; section labels sit in a narrow left rail on desktop and stack inline on mobile. This avoids the centred-hero → three-cards default.
- Section rhythm is intentional: hero `--space-3xl`, content `--space-2xl`, compact metadata `--space-l`.
- Space groups before borders are added. A border only appears where it carries meaning (a scan frame, a timeline rail, a divider between metadata).
- Cards are used only for the ALARA trio and device diagrams; each has a distinct internal composition, not the same shell with different icons.

### Breakpoints (mobile-first)
| Name | Min width | Behaviour |
|---|---|---|
| base | 0 | single column, metadata stacked, nav collapses to a compact bar |
| `sm` | 640px | two-column metadata, larger type step |
| `lg` | 1024px | asymmetric 12-col grid, sticky section rail, full header nav |
| `xl` | 1280px | wider measure, larger scan visual |

Use `@media (width >= …)`, `clamp()` for fluid heading sizes, and `100dvh` (not `100vh`). Minimum touch target 44×44 px with 8 px separation.

---

## 5. Component states (all five defined)

| Component | Rest | Hover | Active | Focus-visible | Disabled/Loading |
|---|---|---|---|---|---|
| Primary button | cyan bg, navy ink | lighter cyan, soft glow | darker cyan, translateY(1px) | 2px focus ring, 2px offset | muted surface, `aria-busy`, space reserved |
| Secondary button | transparent, line border | cyan border + ink | filled line tint | focus ring | muted, 60% opacity |
| Nav link | `--ink-2` | `--ink` + underline sweep | `--accent`, current-section marker | focus ring | n/a |
| Language toggle | mono label, active underlined | inactive label brightens | active gets cyan dot | focus ring | n/a |
| Device card | surface-1, hairline | border + subtle glow | expanded diagram state | focus ring on interactive control | diagram skeleton while SVG mounts |
| Exposure meter | track only | — | fills on enter with `aria-valuenow` where semantic | n/a | static at 0 under reduced motion |
| Portrait frame | real photo | crossfade to inverted negative | held on touch | n/a | low-res placeholder if image fails |

No hover-only affordance: every hover state duplicates a focus or touch equivalent.

---

## 6. RTL, accessibility & motion foundations

- `<html lang>` and `dir` switch together with the language state; `lang="ar" dir="rtl"`.
- Use logical properties exclusively: `margin-inline`, `padding-inline`, `inset-inline-start`, `text-align: start`. Directional animations (scan line, lens sweep, timeline rail) flip their transform sign under `[dir="rtl"]`.
- Arabic uses `--font-arabic`, `line-height: 1.9`, and slightly looser letter spacing. Numbers and device names stay Latin where that is how they are written in the CV (CBCT, Romexis, SIDEXIS).
- Exactly one `<h1>`; sections use `<h2>` with `aria-labelledby`; landmarks `header`, `nav`, `main`, `footer`; skip link.
- `:focus-visible` ring is never removed. All icon-only controls have accessible names. Decorative SVGs are `aria-hidden="true"`.
- `prefers-reduced-motion: reduce` disables the particle field, lens, scan sweep, scroll-linked background changes and reveals; content is immediately visible. A user toggle in the footer offers the same choice.
- Weak-device check: `navigator.hardwareConcurrency <= 4`, `prefers-reduced-data`, or no WebGL → static CSS/SVG background.
- Nothing flashes more than 3×/s; loader progress is deterministic and under 1 s typical.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 7. Accumulation audit target
After the first render, count generic signals (all-caps eyebrows, mid-dot meta, `→` on every link, pulse dots, redundant badges, hover-lift on non-clickable cards). Target: **near zero**. The one permitted all-caps mono label is the scan/readout metadata, because it is instrument chrome rather than decoration.

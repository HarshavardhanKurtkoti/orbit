# HK Design System — Master Engineering Foundation

The unified design system for Harsha Kurtkoti's software ecosystem, derived directly from the master design authority at [harshakurtkoti.in](https://www.harshakurtkoti.in).

---

## 1. Design Philosophy & Authority

- **Master Authority:** `harshakurtkoti.in` is the single source of truth for all visual tokens, typography, surfaces, borders, motion, and identity across all projects (Mnemora, Orbit, VisionBoard, etc.).
- **Product Independence:** Orbit inherits the brand's visual DNA while preserving its unique purpose as a spatial productivity, project management, and knowledge intelligence workspace.
- **Engineering Minimalism:** Deep charcoal-slate canvas with crisp 1px borders, paired with a restrained mint accent (`#a7f3d0`) and secondary signal accents (`#34d399`, `#38bdf8`, `#fbbf24`).
- **No Cyberpunk Gimmicks:** Saturated violet-blue gradients, glowing neon buttons, gamified "Commander" sci-fi jargon, and decorative glassmorphism are completely eliminated.

---

## 2. Core Color Palette & Design Tokens

### Canvas & Surfaces
| Token | Hex / Value | Semantic Usage |
|---|---|---|
| `--canvas` / `--background` | `#080d10` | Root background canvas |
| `--surface` / `--card` | `#101918` | Primary surface containers, cards, panels |
| `--surface-subtle` | `#0b1312` | Recessed input fields, code containers, table rows |
| `--raised` / `--secondary` | `#15221e` | Hover states, active buttons, tab selections |
| `--raised-hover` | `#1c2e29` | Elevated button hover, item hover |

### Borders & Dividers
| Token | Hex / Value | Semantic Usage |
|---|---|---|
| `--line` / `--border` | `#202e2b` | Structural card borders, dividers, headers |
| `--hairline` | `#16221f` | Subtle internal section separators, nested cards |
| `--line-subtle` | `rgba(32, 46, 43, 0.6)` | Grid lines, table rows |
| `--mint-border` | `rgba(167, 243, 208, 0.22)` | Active or focused border highlight |

### Typography & Ink
| Token | Hex / Value | Semantic Usage |
|---|---|---|
| `--ink` / `--foreground` | `#f1f5f4` | High-contrast primary headings and text |
| `--ink-secondary` | `#d6dedc` | Readable secondary text, descriptions |
| `--muted` / `--muted-foreground` | `#9aaba8` | Captions, metadata, column headers |
| `--quiet` | `#6e807d` | Subtle hints, shortcut badges, timestamps |

### Semantic & Accents
| Token | Hex / Value | Semantic Usage |
|---|---|---|
| `--mint` / `--accent` / `--primary` | `#a7f3d0` | Primary brand accent, primary CTA, active state |
| `--signal` | `#34d399` | Operational status, completion state, goals |
| `--sky` | `#38bdf8` | Relational links, tasks, in-flight state |
| `--amber` / `--warning` | `#fbbf24` | Notes, specs, warning states |
| `--rose` / `--destructive` | `#f87171` | Deletions, urgent priority, error states |

---

## 3. Typography & Editorial Hierarchy

- **Editorial Display Headings:** Clean sans-serif paired with a signature italic serif accent word (e.g. `Ideas, *connected.*`, `Projects, *aligned.*`).
  ```tsx
  <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-foreground font-sans">
    Ideas, <span className="font-serif italic text-accent">connected.</span>
  </h1>
  ```
- **Kickers / Eyebrows:** Monospace uppercase with tracking `0.12em` and optional signal rule:
  ```tsx
  <div className="flex items-center gap-2">
    <span className="w-5 h-[2px] bg-accent" />
    <span className="text-[10px] font-mono uppercase tracking-widest text-accent">
      01 / Workspace Overview
    </span>
  </div>
  ```
- **Tabular Data:** `font-mono tabular-nums` for counters, latencies, dates, coordinates.
- **Font Stack:**
  - Sans: `Geist`, system-ui, -apple-system, sans-serif
  - Mono: `JetBrains Mono`, `Geist Mono`, monospace
  - Serif: `Georgia`, `Cambria`, serif

---

## 4. Terminology Transformation

Orbit has transitioned from gamified sci-fi tropes into professional, engineering-focused terminology:

| Legacy Terminology | Portfolio-Aligned Terminology |
|---|---|
| Welcome back, Commander ✦ | Ideas, *connected.* (Workspace Overview) |
| Cosmos Prime | Personal workspace / Workspace name |
| Synthesize Blueprint | Plan project |
| Interactive Universe / Spatial Mesh | Knowledge universe / Knowledge graph |
| Throughput Velocity | Productivity overview |
| Spatial Productivity Analytics | Workspace analytics |
| Synchronizing Spatial Mesh | Loading workspace |
| Timeline & Spatial Roadmap | Project roadmap |
| Commander profile | User profile |

---

## 5. Motion Principles (ux-motion)

Orbit strictly follows the 20 UX motion principles:
1. **Snappy Timing (Principle 8):** Small feedback (90-120ms), transitions (180-250ms), fast closing (130ms).
2. **Slow In, Slow Out (Principle 5):** `cubic-bezier(0.16, 1, 0.3, 1)` for entrances; `cubic-bezier(0.7, 0, 0.84, 0)` for exits.
3. **Stagger (Principle 3):** 30-40ms cascades capped under 280ms total.
4. **Squash and Stretch (Principle 1):** Subtle physical press feedback on buttons and cards without distorting text.
5. **Fast Closing (Principle 18):** Exits are twice as fast as entries.
6. **Interruptible Transitions (Principle 17):** Spring-driven or fluid CSS transitions.
7. **Accessibility (Principle 20):** Full support for `prefers-reduced-motion`.

---

## 6. Flagship Spatial Universe Experience

Inspired by the **Systems in Motion** exhibit from `harshakurtkoti.in`:
- **Nodes as Architectural Modules:** Distinct semantic shapes, clean borders, and restrained accents:
  - Project Node: Mint (`#a7f3d0`)
  - Task Node: Sky (`#38bdf8`)
  - Note Node: Amber (`#fbbf24`)
  - Goal Node: Signal (`#34d399`)
- **Relational Edges:** Subtle slate lines (`#202e2b` / `#33413e`), lighting up upon hover or node selection.
- **Backdrop:** Delicate architectural grid (`pattern id="grid"`) rather than psychedelic nebulas.
- **Docked Inspector:** Collapsible side sheet providing deep inspection of properties, relationships, and metadata.

---

## 7. Migration Guide for Future Projects

To apply this design system to another project in the ecosystem:

1. **Tokens Configuration:**
   Install or reference `@orbit/design-tokens` (or copy the token values into `tailwind.config.ts` and CSS `:root`).
2. **Typography Setup:**
   Ensure `Geist` (sans), `JetBrains Mono` (mono), and `Georgia` (serif italic) are accessible.
3. **Core Colors:**
   Replace any hardcoded purples/cyans with `--canvas: #080d10`, `--surface: #101918`, and `--mint: #a7f3d0`.
4. **Buttons & Controls:**
   Use solid mint for primary CTAs (`bg-accent text-[#080d10] font-medium`), charcoal for secondary (`bg-raised border-line text-foreground`).
5. **No Decorative Slop:**
   Eliminate background radial gradients with saturated neon colors, spinning gradient borders, and cartoonish status badges.

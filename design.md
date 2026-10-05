# Design

The bridge between design intent and code: what the system should look and
feel like, and why — as distinct from [.context/DESIGN_TOKENS.md](.context/DESIGN_TOKENS.md),
which is the technical schema (CSS custom property names, the `sys.*`/`comp.*`
taxonomy, Tailwind mapping) for the same values. Read this for the *why*
behind a value; read `DESIGN_TOKENS.md` for the *how to consume it in code*.

**Status:** the color, spacing, radius, and typography values below are real
brand values sourced from Figma on 2026-09-15 (see the "Status" note in
[DESIGN_TOKENS.md](.context/DESIGN_TOKENS.md)) — not placeholders. Sections
marked **(proposed)** describe scales that still don't exist as sourced
tokens yet (motion, breakpoints/touch-targets) — don't invent values for
those ad hoc in a component; add the token to `tokens.css` first (per the
"No arbitrary values" rule in [CLAUDE.md](CLAUDE.md)) once the real spec for
that scale is sourced, then update this doc to match.

## 1. Design intent & philosophy

The product this system serves is research-and-analysis-heavy: long-form AI
responses, session transcripts, sentiment/data cards, multi-panel research
workspaces. The design language optimizes for that, not for a marketing site
or a sparse consumer app:

- **Data-dense over spacious.** Density defaults toward showing more
  structured information per screen (tables, cards, tags) rather than
  editorial whitespace-heavy layouts — but never at the cost of the WCAG 2.2
  AA bar in [ACCESSIBILITY_GUIDELINES.md](.context/ACCESSIBILITY_GUIDELINES.md).
  Density is a spacing-scale choice (see §2), not a license to shrink touch
  targets or text below the accessible minimum.
- **A three-tier brand hierarchy, color reserved for meaning.** Plum (near-
  black purple, `plum/950` is the `primary` token) carries authority —
  headings, primary buttons, high-impact elements only. Orchid is the
  interactive accent — it powers `ring`, `accent`, and every selected/focus
  state, never `primary`/`accent-default` (see the "ring, not primary" brand
  override in [DESIGN_TOKENS.md](.context/DESIGN_TOKENS.md)). Oat is the warm
  neutral base — page backgrounds, zebra rows, subtle fills. Plum Muted is
  the cool structural neutral — borders, cards, disabled states. Coral
  (destructive), Dandelion (warning-soft/chart), and Success (green) are the
  only other saturated colors, and only ever mean what their name says.
  Never reach for a feedback color decoratively.
- **Legible over decorative.** Typography is `Inter` for all UI/body text at
  a modest size scale (`xs` 12px → `5xl` 48px, default UI 14px/`sm`, input
  fields 16px/`base`) — plus two brand extensions reserved for specific
  contexts: `font-display` (Bricolage Grotesque) for hero/marketing headings
  only, and `font-mono` (JetBrains Mono) for code/technical values. Long-form
  AI response text and research notes are a primary reading surface, which is
  why
  [ACCESSIBILITY_GUIDELINES.md](.context/ACCESSIBILITY_GUIDELINES.md) asks
  for AAA contrast (7:1) as a reach goal on body-copy-heavy components, not
  just the AA hard gate.

## 2. Layout, grid & spatial harmony

- **Base unit: 4px.** Every spacing step (`sys-space-0` … `sys-space-24`) is a
  multiple of 4px (Tailwind's own multiplier, `--sys-space-unit: 0.25rem`,
  drives this — see the comment on it in `tokens.css`), expressed in `rem`.
  "No half-step spacing value outside this scale" means outside the 4px
  grid, not outside the specific named steps — see the "No arbitrary values"
  rule in [CLAUDE.md](CLAUDE.md).
- **Radius scale communicates surface weight, not decoration.** `sm` (6px —
  a brand override; shadcn derives 4px — tight controls, table cells, small
  chips), the base `radius`/`md` (8px, dropdowns/badges), `lg` (12px, the
  most-used step: buttons, cards, form controls), `xl`/`2xl` (16px/24px,
  large cards and hero sections) — plus `full` for
  pills/avatars. A component picks the step that matches its role in this
  list, not an arbitrary in-between value.
- **Elevation via shadow tier, not z-index alone.** Three shadow steps
  (`sm`/`md`/`lg`) map to surface layering: `sm` for a resting `Card`, `md`
  for a `Hover Card`/`Popover`, `lg` for a `Dialog`/`Sheet` floating above
  the whole page. See [ACCESSIBILITY_GUIDELINES.md](.context/ACCESSIBILITY_GUIDELINES.md)
  for the accompanying focus/portal rules for anything at the `lg` tier.
- **Breakpoints/container widths (proposed):** not yet defined as tokens.
  This system is being built primitive-first (Navigation, Buttons, Forms
  sections in [COMPONENT_STATUS.md](.context/COMPONENT_STATUS.md)) before any
  page-level layout components exist — add a breakpoint/container scale to
  `tokens.css` when the first layout component that needs one
  (`Resizable`, a future page shell) is actually built, not before.

## 3. Visual foundation & theming

- **Color roles**, not raw palette names, are what a component should reason
  about — shadcn's own `X`/`X-foreground` naming: `background` (page) →
  `card`/`popover` (elevated panel/dropdown surface) → `muted` (disabled/
  subtle chrome). Text mirrors this: `foreground`/`muted-foreground`, plus
  each surface's own `-foreground` pair (`card-foreground`, `primary-
  foreground`, …). A component should never reason about `plum-950` directly
  — it reasons about `foreground`, which happens to resolve to `plum-950`
  today. `ring` (not `primary`/`accent`) is the one role reserved specifically
  for focus rings and selected-control fills — see "How to Choose Color
  Tokens" in [DESIGN_TOKENS.md](.context/DESIGN_TOKENS.md).
- **Light/dark is a `sys.*` swap, never a `comp.*` override.** Only the
  `sys-color-*` semantic aliases are redefined under `[data-theme='dark']`
  (`bg-canvas`, `bg-surface`, text/border roles, `accent-subtle`); every
  `comp.*` token inherits automatically through the `var()` chain. If a
  component looks wrong in dark mode, the fix is almost always a component
  that hardcoded a `sys.*` value instead of consuming its `comp.*` alias —
  never "add a dark-mode branch to the component."
- **Focus is a system-level guarantee, not a per-component choice.** One
  focus-ring token trio (`sys-focus-ring-width/offset/color`, 2px solid,
  2px offset, accent-colored) applies globally via `:focus-visible` in
  `packages/ui/src/styles/globals.css`. No component may suppress or
  reimplement this — see
  ["Focus rings — never suppressed"](.context/ACCESSIBILITY_GUIDELINES.md).

## 4. Motion & micro-interactions **(proposed)**

No motion tokens exist in `tokens.css` yet — nothing in `packages/ui` animates
today. When the first component that needs motion is built (a `Dialog`
entrance, a `Toast` slide-in, an `Accordion` expand), add a small token scale
rather than hardcoding a duration/easing in that component:

- **Durations:** a short scale is enough for UI-scale motion — roughly
  100ms (micro state changes: hover/press), 200ms (default: open/close,
  expand/collapse), 300ms (larger surfaces: `Sheet`/`Dialog` entrance). These
  are proposed starting values, not settled tokens — confirm against the
  actual Figma motion spec before adding them to `tokens.css`.
- **Easing:** standard (ease-in-out) for most transitions; a decelerate
  curve for things entering the screen (a toast, a dialog) reads as more
  natural than a linear or bounce curve for this product's tone — avoid
  bounce/spring easings, which read as playful/consumer-app rather than
  calm/data-dense (see §1).
- **What must use Radix, not custom motion:** any open/close transition on a
  primitive-wrapped component (`Dialog`, `Popover`, `Dropdown Menu`,
  `Accordion`, `Tooltip`, `Sheet`) drives its animation off Radix's own
  data-state attributes (`data-[state=open]`/`data-[state=closed]`), not a
  separately-managed animation library or manual class toggling — see
  "Primitive-first composition" in [CLAUDE.md](CLAUDE.md).

## 5. Component topology & anatomy

- **Atom → slot → compound.** A simple component (`Button`, `Badge`) is one
  file, one root element. A compound component (`Card`, `Dialog`,
  `Accordion`) decomposes into named slots via the `<Component>.<Slot>`
  dot-notation pattern (`Card.Header`, `Card.Content`, `Card.Footer`) — see
  the "Slot naming" section of
  [COMPONENT_CONTRACTS.md](.context/COMPONENT_CONTRACTS.md) for the full
  contract (each slot is also its own named export, not only sugar on the
  parent).
- **Icons are a dependency, not hand-drawn per component.** An icon-bearing
  component (`Icon Button`, `Chevron`, `Tag`) takes an icon as a prop/child,
  it does not own icon artwork itself — keeps icon swaps a call-site change,
  never a component-internal edit.
- **variant/size are the only two axes of visual difference** a component
  exposes (see [COMPONENT_CONTRACTS.md](.context/COMPONENT_CONTRACTS.md)) —
  anatomy diagrams for a new component should describe which parts change
  under `variant` (color/emphasis) vs. under `size` (physical dimensions,
  padding, font-size), never both conflated into one prop.

## 6. Behavioral & state matrix

Every interactive component is expected to define, and visually distinguish,
these states — a component missing one of these (other than ones that
genuinely don't apply, e.g. a `Badge` has no `loading` state) is incomplete:

| State | Visual signal | Token(s) involved |
|---|---|---|
| Default | resting `comp.*` bg/fg/border | `comp-<component>-*` |
| Hover | `comp.*` `-hover` alias, pointer only | e.g. `comp-button-primary-bg-hover` |
| Active/pressed | a further step down from hover (proposed — no dedicated `-active` token yet; add one per component family when first needed, don't reuse `-hover` for both) | — |
| Focused | global focus ring, never component-specific | `sys-focus-ring-*` |
| Disabled | `text-disabled` and/or reduced opacity, `aria-disabled`/`disabled`, no hover/active response | `sys-color-text-disabled` |
| Loading | skeleton or spinner replaces content, `aria-busy="true"` on the live region | see `Skeleton`/`Skeleton Line` in [COMPONENT_STATUS.md](.context/COMPONENT_STATUS.md) |
| Error/invalid | `danger` role color + `aria-invalid` + `aria-describedby` message, never color alone | `sys-color-danger-default` |

See [ACCESSIBILITY_GUIDELINES.md](.context/ACCESSIBILITY_GUIDELINES.md) for
the full ARIA/keyboard requirement behind each state, not just the visual
treatment.

## 7. Cross-platform / responsive strategy **(proposed)**

Nothing in `packages/ui` has a mobile-specific layout yet — every component
in [COMPONENT_STATUS.md](.context/COMPONENT_STATUS.md) is being built
desktop-first, matching the research-platform product's current surfaces.
When responsive/touch work starts:

- **Touch targets:** minimum 44×44px hit area on any touch-operable control,
  even where the visual size is smaller (e.g. a small `Icon Button` needs
  invisible hit-area padding, not a physically enlarged icon) — tighter than
  WCAG 2.2's own 24×24px minimum, because this product's density (see §1)
  means controls sit close together and a tighter target increases mis-taps.
- **Desktop-modal → mobile-sheet is the expected pattern**, not a separate
  mobile-only component: a `Dialog` on desktop should be able to render as a
  `Sheet` (bottom-anchored) on narrow viewports without the consumer having
  to swap which component they render — this is a composition question for
  whichever component owns that behavior when it's built, not something to
  solve preemptively today.
- **Dense table → card-stack on narrow viewports** for `Table`/`Table Row`:
  same underlying data and props, different rendered structure — track as
  part of that component's own contract when it moves off `Planned`, not as
  a system-wide layout primitive yet.

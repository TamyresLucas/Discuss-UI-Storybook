# Design Tokens

Source of truth for every visual value in the system. If a value isn't a token, it
doesn't ship — see the negative constraints in [CLAUDE.md](../CLAUDE.md).

## Where tokens live

`packages/tokens/src/tokens.css` — plain CSS custom properties, published as
`@discuss-ds/tokens`. Nothing else defines a color, space, radius, shadow, or
font value. Components import the layer transitively via
`@discuss-ds/ui/styles.css` (which does `@import '@discuss-ds/tokens/css'`),
never by re-declaring values themselves.

There is no JS token object (`theme.colors.blue500`-style). Tokens are consumed
two ways only:

1. **Tailwind utility classes** — `packages/ui/src/styles/globals.css` maps each
   Tailwind theme key to a token via `@theme { --color-x: var(--sys-color-x); }`.
   This is how components should consume tokens 95% of the time: `className="bg-background text-foreground rounded-lg"`.
2. **Raw `var(--sys-...)` / `var(--comp-...)`** — for the rare case Tailwind's
   utility set doesn't cover (an inline SVG stroke, a canvas draw call, a
   z-index or Radix layout variable — Tailwind has no themeable namespace for
   either). Always the token variable, never the literal it resolves to.

## Two-layer taxonomy — `sys.*` and `comp.*`

**`sys.*`** (system layer) — raw primitives and semantic values with no
knowledge of any specific component: `--sys-color-plum-500`,
`--sys-color-primary`, `--sys-color-ring`, `--sys-space-4`, `--sys-radius-lg`,
`--sys-font-size-sm`, `--sys-shadow-md`, `--sys-focus-ring-color`. This is the
only layer that changes between light and dark mode (see below). The semantic
names follow shadcn's `X`/`X-foreground` convention exactly (`background`,
`foreground`, `primary`, `secondary`, `muted`, `accent`, `destructive`,
`border`, `input`, `ring`, `card`, `popover`), plus this system's own
extensions (`success`/`warning`/`info`, the `X-soft`/`X-soft-foreground`/
`X-soft-border` triplets, `chart-1..5`, `sidebar-*`) — see
[design.md](../design.md) for what each one means and when to reach for it.

**`comp.*`** (component layer) — aliases scoped to one component family, for
the rare case a component needs a value distinct from any `sys.*` semantic
token (there are currently none in use: every shipped component consumes
`sys.*` semantic tokens directly, per the Figma "Component Token Patterns"
spec — e.g. a Button is `bg-primary`/`bg-secondary`/`bg-destructive`, not a
`comp-button-*` alias). Add a `comp.*` token only when a component's needs
genuinely diverge from the semantic layer, not by default.

**Rule of consumption:** components never invent a new raw value. If neither
`sys.*` nor `comp.*` has what a component needs, add the token to
`tokens.css` first (as a real PR to the design system, not an inline
workaround), then consume it.

## Naming convention

CSS custom properties can't contain dots, so the `sys.color.*` dot notation
from design tooling (Figma variables) maps to kebab-case:
`sys.color.primary` → `--sys-color-primary`. When talking about tokens in
docs/PRs/Figma, the dot form is fine and expected — it's only the CSS custom
property name that's kebab-case. Fractional values (`spacing/0.5`) are the one
exception: CSS custom property names can't contain a literal `.`, so those
exist only as reference values (`--sys-space-0-5`) — see the comment on
`--sys-space-unit` in `tokens.css` for how Tailwind actually generates the
fractional utility classes.

Current groups: `sys-color-*` (primitive scales — `plum`, `orchid`, `oat`,
`plum-muted`, `black`, `dandelion`, `coral`, `success` — plus the semantic
layer aliasing them), `sys-space-*`, `sys-radius-*`, `sys-font-*`,
`sys-line-height-*`, `sys-tracking-*`, `sys-text-*` (composite type styles: `heading-h1`…`ui-input-value`, exposed as `text-<name>` utilities), `sys-opacity-*`, `sys-shadow-*`,
`sys-focus-ring-*`, `sys-motion-*`, `sys-z-*`. New component families add
their own `comp-<component>-*` group only if/when they actually need one —
don't overload an existing component's namespace for an unrelated one.

## Scale units

- **Spacing, radius, font-size, line-height:** `rem`, on a 4px (`0.25rem`) base
  step for spacing (`--sys-space-1` = 4px … `--sys-space-16` = 64px). Never `px`
  in a token value — `rem` respects user font-size preferences, `px` doesn't.
- **Borders / hairlines:** `px` is acceptable only for 1px hairline borders,
  since a 1px line shouldn't scale with root font size.
- **Shadows:** composed directly as token values (`--sys-shadow-sm/md/lg`)
  rather than built from separate x/y/blur/color primitives — shadows are
  rarely mixed-and-matched across scales in practice, so a single alias per
  elevation step is simpler to consume correctly.

## Dark mode mapping

Dark mode is a `[data-theme='dark']` attribute selector on any ancestor
element (Storybook's preview applies it via the theme toolbar — see
`apps/storybook/.storybook/preview.tsx`). Only `sys.*` values are redefined
under that selector; `comp.*` aliases automatically follow because they
reference `sys.*` through `var()` chains — **never redefine a `comp.*` token
directly inside a `[data-theme='dark']` block.** If a component looks wrong in
dark mode, the fix is almost always "this component hardcoded a `sys.*`/color
literal instead of using its `comp.*` alias," not "add a dark-mode override to
the component."

The `[data-theme='dark']` block in `tokens.css` is sourced from the Figma
"Semantic" collection's Dark mode (2026-10-05).

## CSS variable syntax rules

- Always resolve through `var(--token-name)`, never string-interpolate a token
  name.
- A fallback value on `var()` (`var(--sys-color-accent-default, #3468e0)`) is
  only acceptable in code that must render before `@discuss-ds/tokens` has
  loaded (extremely rare — e.g. a loading-shell inline style in an HTML
  `<head>`). Components never need this; if you find yourself adding a
  fallback in a component, the real bug is a missing CSS import somewhere.
- Component-level CSS (Tailwind `@theme` block, any future CSS Modules file)
  may only alias an existing `sys.*`/`comp.*` custom property — it may not
  introduce a new literal value under a different name.

## Status

Re-synced against the Figma file's local variables and effect styles on
2026-10-05. Primitives, spacing, typography and z-index were unchanged; radius
(`xs`, `xxs`), opacity (30–95), shadows (`xs`…`2xl`, `none`), dark mode and the
Figma-only semantic tokens (`surface`, `accent-muted`, `input-accent`,
`secondary-muted-foreground`, `info-border`) were added; card/popover,
`muted-foreground`, `info`, and the `accent-soft`/`primary-soft` triplets were
re-pointed to match Figma.

**Figma is the source of truth.** Code keeps shadcn-style names but takes
Figma's values literally: `accent` = orchid/500 (text `accent-foreground` =
orchid/600), solid `success`/`warning` = 500 fills with 800 text,
`destructive-foreground` = coral/600, and `muted-foreground` = the literal
`#806a98` (a detached value in Figma — alias it to a primitive in Figma first,
then mirror here). Figma text styles (`heading/h1`…) are mirrored as `sys-text-*`
tokens + `text-<name>` utilities (the auto-line-height `p` and `table-head`
styles are intentionally skipped).

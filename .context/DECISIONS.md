# Decisions

A log of settled tradeoffs, so this isn't re-litigated in a future task or
"fixed" by refactoring toward an approach that was already considered and
rejected. If a task seems to require reversing one of these, that's a signal
to raise it explicitly, not to quietly work around it.

Newest first. Add an entry here whenever a real architectural or tooling
tradeoff gets decided — not for routine implementation choices already
covered by [COMPONENT_CONTRACTS.md](./COMPONENT_CONTRACTS.md) or
[DESIGN_TOKENS.md](./DESIGN_TOKENS.md).

---

## Real design tokens sourced from Figma, replacing the starter placeholders

**Decision:** The full color palette (8 primitive scales, 55 semantic
tokens), spacing, radius, and typography scales in `packages/tokens/src/tokens.css`
were replaced with real values pulled from Figma (`Discuss-Design-System`,
via the Figma Dev Mode MCP connection — `get_design_context`/`get_metadata`
against the "Design Tokens Reference" and "DESIGN.md" pages) on 2026-09-15.
Semantic token names were changed to match shadcn's own `X`/`X-foreground`
convention exactly (`background`, `primary`, `secondary`, `muted`, `accent`,
`destructive`, `border`, `input`, `ring`, `card`, `popover`, plus this
system's `success`/`warning`/`info` and `X-soft` extensions) rather than the
placeholder names invented earlier in this project (`bg-canvas`, `text-
primary`, `accent-default`, etc.). `comp-button-*`/`comp-badge-*`/`comp-card-*`
were retired — the real spec's "Component Token Patterns" has every
component consume `sys.*` semantic tokens directly, no component-scoped
alias layer.

**Brand override surfaced by this pass:** selected controls (Checkbox,
Radio, Switch, Toggle) and focus rings use `ring` (a distinct token,
Orchid/500), never `primary`/`accent` — this is an explicit, intentional
deviation from shadcn's own default (`data-[state=checked]:bg-primary`).
Every component built before this token pass used the placeholder
`accent-default` for these states, which is visually similar to `ring` by
coincidence but was not consuming the real, dedicated token — Button,
Switch, Checkbox, RadioGroup, Select, Slider, Form, and the two globals.css
guardrail fixes from this session were retrofitted to the real tokens as
part of this change; anything built after should already only see the real
names and does not need retrofitting.

**Why:** The previous placeholder values were an invented stand-in (see the
now-superseded "Status" note in [DESIGN_TOKENS.md](.context/DESIGN_TOKENS.md))
built before this system's actual Figma spec was available. Once available,
using anything else — including a plausible-but-invented name like
`accent-default` — means every component would need a second retrofit pass
later; doing it now, while few components exist, is far cheaper than doing
it after all 76 are built.

**Two follow-on infra fixes this surfaced** (both now fixed in `globals.css`):
Tailwind's `--theme` reset block cannot contain a literal `.` in a custom
property name (`--spacing-0.5` is invalid CSS), so fractional spacing steps
are generated via Tailwind's own `--spacing` multiplier instead of named
overrides — see the comment on `--sys-space-unit` in `tokens.css`. And a
CSS comment containing a literal `*/` mid-sentence (e.g. describing `p-*/gap-*`
utilities) closes the comment early and corrupts the rest of the `@theme`
block — avoid writing `*/` inside a comment body, not just at its end.

**Status:** Settled for light mode. Dark mode, shadow/elevation, and motion
values are not yet in the Figma source — see the "Status" section of
[DESIGN_TOKENS.md](.context/DESIGN_TOKENS.md).

---

## `react-hook-form` added for `Form`, breaking the "radix-ui only" primitive pattern

**Decision:** `packages/ui` now depends on `react-hook-form` (^7.88.0),
consumed only by `Form`/`FormField`/`FormItem`/`FormLabel`/`FormControl`/
`FormDescription`/`FormMessage` (see [COMPONENT_STATUS.md](./COMPONENT_STATUS.md)).
No other component may reach for it — a component that just needs local
open/closed or hover-flag state still uses plain React state, per the
"zero business logic" / "own only pure UI state" rule.

**Why:** shadcn's own `Form` isn't a Radix wrapper — it's a context/
accessibility layer (`aria-invalid`, `aria-describedby` wiring) over
`react-hook-form`'s `Controller`, and that's the actual value the component
provides (correct ARIA wiring driven by validation state), not something
worth reinventing with a bespoke form-state hook. Every other primitive in
this system wraps `radix-ui` for exactly this reason: don't hand-roll
behavior a well-tested library already owns.

**Alternatives considered:** A lighter primitive with no external
dependency — just a context tracking an error string, wiring
`aria-invalid`/`aria-describedby` without owning form state (rejected for
now — every consumer would still reach for some form-state library
themselves, so the design system would either duplicate that integration
per-consumer or under-deliver on what a "Form" component is expected to do).

**Status:** Settled for `Form` specifically. Not a precedent for pulling in
other state-management libraries elsewhere in `packages/ui`.

---

## Changesets for changelog/version management, scoped to `tokens` + `ui`

**Decision:** `@changesets/cli` (config in [`.changeset/config.json`](../.changeset/config.json))
manages `CHANGELOG.md` generation and version bumps for `@discuss-ds/tokens`
and `@discuss-ds/ui` only. `apps/storybook` and `apps/playground` are excluded
via `ignore` — they're not published packages and have no consumers outside
this repo. `tokens` and `ui` version independently (not `fixed` together):
a tokens-only change shouldn't force a `ui` version bump when nothing in
`ui`'s public API changed.

**Why:** These are the two packages this repo says (see
[ARCHITECTURE.md](./ARCHITECTURE.md)) are meant to be "versioned and
eventually published independently." A changelog needs to exist before that
publish moment, not get bolted on after — and Changesets is the standard
choice for a pnpm/Turborepo workspace, with per-change descriptions written
at PR time (by whoever made the change, when the context is freshest) rather
than reconstructed from commit history later.

**Alternatives considered:** Hand-maintained `CHANGELOG.md` per package
(rejected — drifts the moment someone forgets to update it, and produces
worse entries than one written by the author of the change); `conventional-changelog`/commit-message-driven
generation (rejected — this repo doesn't enforce a commit message convention,
and a changeset's consumer-facing description is more useful than a
mechanically derived one from a commit subject line).

**Status:** Settled. Both packages currently sit at `0.0.0`; `changeset
publish` will skip them (they're `private: true`) until that changes.

---

## MCP exposure starts from `@storybook/addon-mcp`, not a bespoke server

**Decision:** When this library needs to be consumable by external MCP
clients, the first move is to lean on Storybook's own `@storybook/addon-mcp`
(already installed and registered — see
[ARCHITECTURE.md](./ARCHITECTURE.md#mcp-readiness)), not to stand up a
separate MCP server or hand-roll a component-metadata export.

**Why:** Storybook already has the richest structured metadata about every
component (props, controls, args, docs) because that data is required for
autodocs anyway. Building a second, parallel metadata surface would mean two
sources of truth about the same components — exactly the drift this system's
other docs exist to prevent.

**Alternatives considered:** A standalone MCP server reading component source
directly (rejected — duplicates what Storybook already computes, and would
need its own parser for props/JSDoc); a generated JSON/registry file checked
into the repo (rejected for now — nothing consumes it yet, and it would go
stale the moment a prop changes without a build step regenerating it).

**Status:** Not yet built. This entry exists so the eventual work starts from
the addon and its gaps, rather than from a blank page.

---

## Two-layer token taxonomy: `sys.*` and `comp.*`, no third layer

**Decision:** Tokens are exactly two layers — raw/semantic system values
(`sys.*`) and component-scoped aliases (`comp.*`). No per-app or per-brand
override layer exists yet.

**Update (2026-09-15):** since the real Figma spec was sourced, `comp.*` is
no longer the default for a new component — its own "Component Token
Patterns" has every component consume `sys.*` semantic tokens (`primary`,
`secondary`, `background`, `border`, `input`, `ring`, …) directly. `comp.*`
still exists as a pattern for the rare case a component's needs genuinely
diverge from the semantic layer, not as a per-component alias every
component is expected to grow. See the "Real design tokens sourced from
Figma" entry above.

**Why:** Two layers is the minimum that separates "what a value is" from
"what uses it," which is what makes a global re-theme (e.g. "primary buttons
get a notch darker") a one-line edit in `tokens.css` instead of a hunt through
every component. A third layer (e.g. per-consuming-app theme overrides) adds
real complexity that nothing in this repo currently needs.

**Alternatives considered:** A single flat token layer (rejected — couples
every component directly to raw values, so a palette change means editing
every component that used that color). A per-brand theming layer on top of
`comp.*` (deferred, not rejected — revisit if/when a second brand or
white-label consumer actually exists).

**Status:** Settled. See [DESIGN_TOKENS.md](./DESIGN_TOKENS.md).

---

## All 76 components scaffolded as placeholders before any real implementation

**Decision:** Every component in the taxonomy gets a story + `Placeholder`
render up front (see [COMPONENT_STATUS.md](./COMPONENT_STATUS.md) and the
placeholder convention in [STORYBOOK_RULES.md](./STORYBOOK_RULES.md)) before
real implementation work starts on any of them.

**Why:** It fixes the full taxonomy, naming, and section structure (title,
`Overview.mdx`, sort order) before real code exists, so a component's
implementation never has to fight over "which section does this belong in"
or "is this a duplicate of something that already exists under a different
name" — that question gets settled once, at scaffold time.

**Alternatives considered:** Implementing components one at a time with no
upfront scaffold (rejected — leads to inconsistent section/naming decisions
made ad hoc, and no visibility into total scope or progress).

**Status:** Settled, currently in effect — 76/76 at `Planned`.

---

## `radix-ui` (unified package) over per-primitive `@radix-ui/react-*` packages

**Decision:** Use the single `radix-ui` package as the one primitive
dependency, not individual `@radix-ui/react-dialog`, `@radix-ui/react-popover`,
etc.

**Why:** One dependency to track/update instead of a dozen, and it's Radix's
own current recommended entry point superseding the older per-primitive
packages.

**Alternatives considered:** Per-primitive packages, installed only as each
component needs them (rejected — marginal bundle-size benefit at build time
since tree-shaking already drops unused primitives from the final output;
not worth a dozen separate dependency entries to manage).

**Status:** Settled. See
[TECH_STACK_DS.md](./TECH_STACK_DS.md).

---

## Tailwind v4, CSS-first config — no `tailwind.config.ts`

**Decision:** Tailwind is configured entirely in CSS via the `@theme` block
in `packages/ui/src/styles/globals.css`; there is no JS/TS Tailwind config
file anywhere in the repo.

**Why:** Tailwind v4 doesn't require a JS config for this setup, and a
CSS-first `@theme` block keeps the Tailwind→token mapping physically next to
the token import (`@import '@discuss-ds/tokens/css'`) in the same file,
instead of split across a CSS file and a separate `tailwind.config.ts` that
could drift out of sync.

**Alternatives considered:** A `tailwind.config.ts` with a `theme.extend`
block mapping to CSS vars (rejected — v4 makes this unnecessary, and it would
be a second place a token mapping could go stale).

**Status:** Settled. See [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) and
[TECH_STACK_DS.md](./TECH_STACK_DS.md).

---

## `tsup` for package builds; `dist/` is not on the hot path for local dev

**Decision:** `packages/tokens` and `packages/ui` each build with `tsup`, but
`package.json#exports` points at `./src/*` directly — Storybook and the
playground app compile from source via Vite, never from `dist/`.

**Why:** Keeps local dev fast (no build step between editing a component and
seeing it in Storybook) while still keeping a real, working `build` script
for the day something needs to consume compiled output (external tooling, a
future publish).

**Alternatives considered:** Requiring a build step before Storybook/
playground can pick up changes (rejected — adds a rebuild-and-wait loop to
every single edit, for no benefit while nothing consumes compiled output
yet).

**Status:** Settled. Revisit when the packages are actually published — see
[TECH_STACK_DS.md](./TECH_STACK_DS.md).

---

## Motion tokens stay placeholders until Figma defines them

**Decision:** `--sys-motion-*` (150/200/300ms + three cubic-bezier curves) in
`tokens.css` remain starter values. As of the 2026-10-05 Figma sync the file
has no motion variables (collections: Primitives, Semantic, Typography, Border
Radius, Spacing, Opacity, Z-Index), so there is nothing to mirror.

**Why:** Figma is the source of truth; inventing durations/easings in code
would create exactly the drift the sync process exists to prevent.

**How to apply:** Components may consume `--sys-motion-*`, but treat the
values as provisional. When design adds a Motion collection, replace these
values and delete this entry's "placeholder" status in `tokens.css` and
`DESIGN_TOKENS.md`.

**Status:** Deferred — blocked on a Figma motion spec.

# Accessibility Guidelines

Non-negotiable. A component that fails these rules is not "done," regardless of
how it looks — accessibility is not a follow-up pass.

## Target: WCAG 2.2 AA, everywhere

Every component ships meeting WCAG 2.2 Level AA at minimum. A handful of
components (anything carrying body copy at length — e.g. `AI Response
Container`, `Research Plan Panel` text areas) should additionally hit AAA
contrast (7:1) where it doesn't conflict with the token palette, since research
participants and long-form reading are a core use case of this product — but
AA is the hard gate, AAA is the reach goal.

Storybook's `@storybook/addon-a11y` runs on every story via the `a11y`
parameter in `apps/storybook/.storybook/preview.tsx` (currently `test: 'todo'`
— violations surface in the Accessibility panel without failing CI yet). Move
that to `test: 'error'` once the first batch of real components lands, so a11y
regressions fail the build instead of just warning.

## Primitive-first — this is an accessibility rule, not just a DX one

The single biggest source of accessibility bugs in component libraries is
hand-rolled interactive widgets. Any component with:

- focus trapping or restoration (dialogs, sheets, popovers),
- roving tabindex / arrow-key navigation (menus, tabs, radio groups, comboboxes),
- portal rendering with correct `aria-*` wiring back to the trigger,

is built by wrapping the matching `radix-ui` primitive (`Dialog`, `Popover`,
`DropdownMenu`, `Tooltip`, `AlertDialog`, `Tabs`, `Accordion`, `RadioGroup`,
`ContextMenu`, …), never reimplemented with a plain `<div>` and custom
`onKeyDown`/state. Radix ships the correct WAI-ARIA APG pattern and has already
solved the edge cases (focus return on close, `Escape` handling, screen-reader
announcement timing) that a first-pass custom implementation reliably gets
wrong. See [TECH_STACK_DS.md](./TECH_STACK_DS.md) and
[COMPONENT_CONTRACTS.md](./COMPONENT_CONTRACTS.md).

## Mandatory ARIA patterns by component shape

- **Buttons / icon-only buttons** (`Icon Button`, `More Menu (…)`, `Chevron
  (Expand Icon)` when interactive): every icon-only control has an accessible
  name via `aria-label` (never relies on a visual tooltip alone to convey
  purpose) and a `Tooltip` for sighted users who still benefit from the label.
- **Toggles / switches**: `role="switch"` + `aria-checked`, not a checkbox
  styled to look like a switch without the matching role.
- **Tabs**: `role="tablist"/"tab"/"tabpanel"`, `aria-selected`, and roving
  `tabindex` — arrow keys move between tabs, `Tab` key leaves the tablist.
- **Dialogs / Alert Dialogs / Sheets**: `role="dialog"`/`"alertdialog"`,
  `aria-modal="true"`, labelled via `aria-labelledby` pointing at the visible
  title, focus moves into the dialog on open and returns to the trigger on
  close, `Escape` closes (unless it's a destructive confirmation requiring
  explicit choice — then say so via a non-dismissable a11y-friendly pattern,
  don't just silently disable `Escape` with no explanation in the UI).
- **Menus / Dropdown Menu / Context Menu / Command Palette**: `role="menu"`/
  `"menuitem"`, arrow-key navigation, typeahead, `Escape` closes and returns
  focus to the trigger.
- **Tooltips**: appear on both hover *and* keyboard focus, dismiss on `Escape`,
  never contain interactive content (a tooltip with a button inside is a
  Popover, not a Tooltip).
- **Toast / Sonner**: `role="status"` or `"alert"` depending on urgency,
  `aria-live` region, auto-dismiss timing is pausable on hover/focus.
- **Form fields** (`Text Input`, `Textarea`, `Select`, `Checkbox`, `Radio
  Group`, `Slider`): every field has a programmatically associated `Label`
  (`htmlFor`/`id`, or Radix's built-in association) — a placeholder is never
  the only label. Validation errors are announced via `aria-describedby` +
  `aria-invalid`, not color alone.
- **Loading states** (`Skeleton`, `Skeleton Line`): `aria-hidden="true"` on the
  skeleton itself (it's decorative), with the real content region carrying
  `aria-busy="true"` until it resolves.

## Keyboard navigation — the baseline for anything interactive

- Every interactive element is reachable and operable via keyboard alone —
  `Tab`/`Shift+Tab` to move focus, `Enter`/`Space` to activate, arrow keys
  within composite widgets (menus, tabs, radio groups), `Escape` to dismiss
  layered UI.
- Tab order follows visual/DOM order. Don't reorder focus with `tabindex`
  values other than `0` and `-1`.
- No keyboard trap: focus can always move away from any component, including
  by closing it with `Escape`.

## Focus rings — never suppressed

`:focus-visible` gets a visible ring on every interactive element, sourced
from `--sys-focus-ring-color`/`--sys-focus-ring-width`/`--sys-focus-ring-offset`
(defined globally in `packages/ui/src/styles/globals.css`). A component must
never ship `outline: none` (or Tailwind's `outline-none`) without providing an
equivalent, equally visible custom focus style in its place — and "equivalent"
means checked against real keyboard navigation in Storybook, not assumed.

## Screen-reader testing requirement

Before a component is marked "Stable" in [COMPONENT_STATUS.md](./COMPONENT_STATUS.md):

1. The addon-a11y panel shows zero violations for every story/variant.
2. It's been tab-navigated with a keyboard only (no mouse) end to end.
3. It's been checked with at least one screen reader (VoiceOver on macOS is
   the baseline for this team) to confirm the accessible name, role, and state
   changes announce sensibly — automated tooling catches missing attributes,
   not confusing announcements.
4. Any component that manages focus (dialogs, menus, popovers) has been
   verified to both trap focus correctly while open and restore it to the
   trigger on close.

Components that skip step 3/4 stay at "Review," not "Stable," even if
automated a11y checks pass — automated tools cannot verify announcement
quality.

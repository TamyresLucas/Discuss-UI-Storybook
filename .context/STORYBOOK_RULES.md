# Storybook Rules

## Format: CSF3, always

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const meta = {
  title: 'Buttons & Actions/Button (Primary)',
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs', 'source-shadcn'],
  argTypes: {
    variant: { control: 'select' },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { label: 'New activity' } };
export const Loading: Story = { args: { label: 'New activity', isLoading: true } };
```

No `storiesOf` legacy API, no CSF2 (`export default { title }; export const X = () => <Foo/>`)
— object-based `meta` + `satisfies Meta<typeof Component>` + `StoryObj` typing
throughout, so args are type-checked against the component's real props.

## File location and `title`

Stories live next to their component:
`packages/ui/src/components/<Section>/<Component>/<Component>.stories.tsx`
(see [COMPONENT_CONTRACTS.md](./COMPONENT_CONTRACTS.md) for the full folder
shape). `title` is always `'<Section>/<Component display name>'` — the section
must exactly match one of the 12 top-level sections below (Storybook treats
`/` as a folder separator, so a component's *display name* itself must never
contain a literal `/`; use parentheses instead — e.g. `'Toggle (Switch)'`, not
`'Toggle / Switch'`).

The 12 sections, fixed, in this order (enforced by `storySort` in
`apps/storybook/.storybook/preview.tsx` — update that array's nested
per-section arrays whenever a component is added, renamed, or reordered):

`Navigation`, `Buttons & Actions`, `Forms & Data Entry`, `Data Display`,
`Tags & Badges`, `Identity & People`, `Overlays & Feedback`,
`Conversation & AI Chat`, `Files & Documents`, `Layout & Structure`, `Utility`,
`Research-Specific`.

Each section folder carries one `Overview.mdx` (title `'<Section>/Overview'`)
that always sorts first in that section — a one-paragraph description of what
belongs there, not a full doc page. Don't turn it into a kitchen-sink guide;
if a section needs real documentation, that's a separate Storybook Docs page,
still filed under that section.

## Tags — the source/status vocabulary

Every story's `meta.tags` carries exactly one status tag and, once the
component is implemented, one source tag:

- **Status:** `status:todo` (not implemented — currently every non-Example
  component), `status:in-progress`, `status:review`, `status:stable`,
  `status:deprecated`. Keep this in sync with
  [COMPONENT_STATUS.md](./COMPONENT_STATUS.md) — the tag and the tracker
  should never disagree about a component's stage.
- **Source:** `source-shadcn` (adapted from a shadcn/ui primitive) or
  `source-custom` (built for this product, no shadcn equivalent). Pick
  whichever matches [COMPONENT_STATUS.md](./COMPONENT_STATUS.md)'s Source
  column for that component.

Tags are filterable from the sidebar's funnel icon — this is deliberate, so
"show me everything still `status:todo`" or "show me only `source-shadcn`
components" is a one-click filter, not a search through this doc.

## Default `argTypes` and controls

- Every `variant`/`size` prop gets an explicit `argTypes` entry with
  `control: 'select'` (or `'radio'` for ≤3 options) and the literal option list
  spelled out — never leave Storybook to infer it from the TS union, since
  inferred controls silently go stale if the type's options change without a
  corresponding argType update being noticed.
- Boolean props default to `control: 'boolean'` (Storybook's default —  don't
  override unless there's a reason).
- Color-like or date-like props follow the `matchers` already configured in
  `apps/storybook/.storybook/preview.tsx` (`/(background|color)$/i`,
  `/Date$/i`) — name new props consistently with those suffixes to pick up the
  matching control automatically instead of hand-configuring it.
- Callback props (`onClick`, `onOpenChange`, …) are wired with `fn()` from
  `storybook/test` in `args`, so invocations show up in the Actions panel.

## Autodocs

`tags: ['autodocs']` on every component's `meta` once it's implemented (not on
placeholder-only stories — an autodocs page for a component that's just a
"coming soon" box is noise). Autodocs pulls the component's TSDoc comments
(see the `/** Is this the principal call to action? */`-style comments in the
Example `Button.tsx` for the expected density) — write real prop comments,
not restating the prop name.

## Interaction tests (`play` functions)

Any component with meaningful interactive behavior (opens/closes, toggles,
validates, navigates via keyboard) gets at least one story with a `play`
function driving it via `@storybook/test`'s `userEvent`/`within`, asserting the
resulting DOM state — this is what `@storybook/addon-vitest` runs as part of
`apps/storybook`'s component tests. A component with zero interactive
behavior (a static `Badge`, a `Divider`) doesn't need one.

## The placeholder convention (today's state)

Every one of the 76 tracked components currently renders
`packages/ui/src/components/shared/Placeholder.tsx` instead of a real
implementation — this is intentional scaffolding, not a mistake to "fix" by
deleting the story. When a component's real implementation lands:

1. Add `<Component>.tsx` (and `.test.tsx`, and `index.ts`) next to the
   existing `.stories.tsx`.
2. Rewrite the story to import and render the real component instead of
   `Placeholder`, with real `argTypes`/variants per the rules above.
3. Swap `status:todo` → the appropriate status tag, add `tags: ['autodocs']`.
4. Update its row in [COMPONENT_STATUS.md](./COMPONENT_STATUS.md).

Don't leave a mix of "real component, still tagged status:todo" or vice versa
— the tag, the story content, and the tracker move together.

# Architecture

## Package dependency graph

```
@discuss-ds/tokens  (CSS custom properties only, no React, no components)
        │
        ▼
@discuss-ds/ui      (components + stories; imports tokens' CSS, never redeclares values)
        │
        ├──────────────┐
        ▼              ▼
@discuss-ds/storybook  @discuss-ds/playground
(docs/dev surface)     (throwaway smoke-test app)
```

This is strictly unidirectional. Enforced by convention (`pnpm-workspace.yaml`
+ each package's own `dependencies`), not by a lint rule yet:

- `packages/tokens` depends on nothing in this repo. It has no React, no
  component code, no knowledge that `@discuss-ds/ui` exists.
- `packages/ui` depends on `@discuss-ds/tokens` (`workspace:*`) and nothing
  else in this repo. It never imports from `apps/storybook` or
  `apps/playground`.
- `apps/storybook` and `apps/playground` depend on both packages, never the
  reverse. Neither app is imported by anything.
- **No circular dependencies, ever.** If a change to `packages/ui` seems to
  require importing something from `apps/storybook` (e.g. a Storybook-only
  helper that "would be useful in the component too"), that helper belongs in
  `packages/ui` itself, not in the app.

## Why this shape

- Tokens sit at the bottom so they can be consumed by tooling that has
  nothing to do with React (a future Figma sync script, a design-tooling
  export, an MCP resource — see below) without dragging in component code.
- Components sit above tokens so `@discuss-ds/ui` can be versioned and
  eventually published independently of the apps that render it.
- The two apps are peers, not a pipeline: Storybook is the docs/dev surface,
  the playground is a disposable integration smoke test. Neither depends on
  the other, and a change to one is never required by a change to the other.

## Data flow inside a component

Props and callbacks flow down; nothing flows back up except through a
callback prop the consumer supplied. See "Zero business logic in components"
in [../CLAUDE.md](../CLAUDE.md) and
[COMPONENT_CONTRACTS.md](./COMPONENT_CONTRACTS.md) — there is no store, no
context provider carrying application state, and no implicit global mutable
state inside `packages/ui` beyond a component's own local UI state (open/
closed, hover, controlled-vs-uncontrolled).

## MCP readiness

The goal (not yet built) is for people outside this repo to consume
`@discuss-ds/ui` programmatically through MCP — e.g. an agent asking "what
components exist for displaying a status" and getting back real component
names, props, and usage examples, not a person reading Storybook by hand.

**What's already in place:** `apps/storybook` has `@storybook/addon-mcp`
installed and registered (`apps/storybook/.storybook/main.ts`), which exposes
story metadata (component, args, controls, docs) to MCP-compatible clients
today, for free, with zero extra architecture. This is the starting point for
"become an MCP" — not a new server built from scratch.

**What this means for how components are built now** (so nothing has to be
retrofitted later):

- Every component's public prop surface must be genuinely self-describing —
  real TSDoc comments on every prop (already required for autodocs, see
  [STORYBOOK_RULES.md](./STORYBOOK_RULES.md)), not just the prop name. An MCP
  client's only signal for "what does this prop do" is what's written down.
  the type and control shape are enforced structure.
- Stories are the API examples an MCP client would eventually surface as
  "how do I use this." A component with no stories beyond `Default` gives an
  MCP consumer nothing to go on — this is another reason the
  component-first-documentation rule in [../CLAUDE.md](../CLAUDE.md) is a
  hard stop, not a nice-to-have.
- Zero business logic (see above) is a prerequisite, not a coincidence: a
  component an external MCP consumer renders in their own app cannot secretly
  depend on this product's routing or data layer.
- Don't build a bespoke MCP server, a component registry JSON export, or any
  other new "MCP-facing" surface speculatively. When this becomes an active
  task, it starts from `@storybook/addon-mcp`'s existing capabilities and
  what's missing from there — see [DECISIONS.md](./DECISIONS.md) for the
  decision record once that work starts.

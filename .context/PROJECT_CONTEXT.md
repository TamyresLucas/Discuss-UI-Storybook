# Project Context

## What this is

`@discuss-ds/*` is Discuss's shared component library and design token
system, built as a pnpm/Turborepo monorepo. It exists so every internal
surface at Discuss (the research platform's own product apps today, and any
future internal or partner-facing React app) renders the same buttons, cards,
tables, dialogs, and chat/conversation primitives from one source, instead of
each app re-implementing them.

## Who consumes it

- **Internal React apps at Discuss** — the primary consumer today is
  the research platform product itself (see the "Conversation & AI Chat" and
  "Research-Specific" sections in
  [COMPONENT_STATUS.md](./COMPONENT_STATUS.md) — `Session Card`, `Sentiment
  Card`, `Research Plan Panel`, `AI Response Container`, etc. are named for
  that product's domain, even though the components themselves stay
  domain-ignorant; see "What this is not" below).
- **`apps/storybook`** — the docs/dev surface every consumer and contributor
  browses components through; not itself a consumer of the *design*, just the
  delivery mechanism.
- **`apps/playground`** — a throwaway internal Vite app for manually
  smoke-testing `@discuss-ds/ui` outside Storybook. Not a product, not a
  consumer to design around.
- **Future: external/partner consumers via MCP.** The long-term goal is for
  people outside this repo to consume the component library programmatically
  — starting from Storybook's already-installed `@storybook/addon-mcp` (see
  `apps/storybook/.storybook/main.ts`), which exposes story/component
  metadata to MCP clients today. See
  [ARCHITECTURE.md](./ARCHITECTURE.md#mcp-readiness) and
  [DECISIONS.md](./DECISIONS.md) for what that implies for how components
  must be built *now* so nothing has to be re-architected later.

## What this is not

- **Not an application.** It contains zero domain logic, zero data fetching,
  zero routing knowledge, and zero app-specific business rules. See the
  "Zero business logic in components" rule in
  [../CLAUDE.md](../CLAUDE.md) and
  [COMPONENT_CONTRACTS.md](./COMPONENT_CONTRACTS.md). A `Session Card`
  component takes `{ title, status, date, onOpen }` as props — it has no idea
  what a "session" is in the product's data model, and never will.
- **Not a place for one-off, single-consumer components.** Every component
  tracked in [COMPONENT_STATUS.md](./COMPONENT_STATUS.md) is meant to be
  reused across surfaces. A component only one screen will ever use belongs
  in that app's own codebase, not here.
- **Not a visual design tool.** Token values, layout rhythm, and visual
  language are authored in Figma (or by design leadership) and *synced into*
  `packages/tokens`; this repo doesn't originate brand decisions — see the
  "Status" note in [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) and
  [../design.md](../design.md) for the design language itself.
- **Not (yet) a published package.** Nothing here is published to a registry
  or versioned for external semver consumption today — see
  [TECH_STACK_DS.md](./TECH_STACK_DS.md).

## How to route a task in this repo

Don't load every `.context/` doc for every task — read what the task actually
touches:

| Task | Read |
|---|---|
| Building/editing a component | [COMPONENT_CONTRACTS.md](./COMPONENT_CONTRACTS.md), [DESIGN_TOKENS.md](./DESIGN_TOKENS.md), [ACCESSIBILITY_GUIDELINES.md](./ACCESSIBILITY_GUIDELINES.md) |
| Adding/changing a token | [DESIGN_TOKENS.md](./DESIGN_TOKENS.md), [ARCHITECTURE.md](./ARCHITECTURE.md) |
| Writing/updating a story | [STORYBOOK_RULES.md](./STORYBOOK_RULES.md) |
| Finishing a component | Update [COMPONENT_STATUS.md](./COMPONENT_STATUS.md); log any real architectural tradeoff in [DECISIONS.md](./DECISIONS.md) |
| Monorepo/build/tooling question | [TECH_STACK_DS.md](./TECH_STACK_DS.md) |
| "Why did we choose X over Y" | [DECISIONS.md](./DECISIONS.md) — check before re-litigating |
| Visual language / spacing / motion rationale | [../design.md](../design.md) |

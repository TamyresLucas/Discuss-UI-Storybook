# Discuss Design System

A pnpm/Turborepo monorepo for Discuss's component library.

```
packages/tokens      @discuss-ds/tokens  — design tokens (CSS custom properties)
packages/ui          @discuss-ds/ui      — components + Storybook stories
apps/storybook       @discuss-ds/storybook — the docs/dev surface
apps/playground      @discuss-ds/playground — throwaway app for manual smoke tests
```

See [CLAUDE.md](CLAUDE.md) and [.context/](.context/) for the full contribution
rules (tokens, component contracts, accessibility bar, Storybook conventions,
component build queue) before adding or changing a component. See
[design.md](design.md) for the design language/rationale, and
[.context/PROJECT_CONTEXT.md](.context/PROJECT_CONTEXT.md) for who this
system is built for.

## Getting started

```bash
pnpm install
pnpm storybook   # http://localhost:6006
```

## Other commands

```bash
pnpm playground        # dev server for apps/playground, http://localhost:5173
pnpm build              # turbo: build every package/app
pnpm lint                # turbo: oxlint every package/app
pnpm build-storybook    # static Storybook build (apps/storybook/storybook-static)
pnpm changeset          # record a change to tokens/ui for the changelog
pnpm version-packages   # apply pending changesets: bump versions + write CHANGELOGs
```

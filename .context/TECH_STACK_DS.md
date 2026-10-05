# Tech Stack

## Monorepo layout

```
discuss-design-system/
├── .context/              this folder — AI/human context docs
├── CLAUDE.md               negative constraints + pointers into .context/
├── turbo.json              task pipeline (build/dev/storybook/lint)
├── pnpm-workspace.yaml      packages/* + apps/*
├── tsconfig.base.json       shared compiler options
├── packages/
│   ├── tokens/              @discuss-ds/tokens — CSS custom properties only
│   └── ui/                  @discuss-ds/ui — the component library + stories
└── apps/
    ├── storybook/            @discuss-ds/storybook — the doc/dev surface
    └── playground/           @discuss-ds/playground — throwaway Vite app for
                               manually smoke-testing @discuss-ds/ui outside Storybook
```

- **Manager:** pnpm workspaces (`pnpm-workspace.yaml`), pinned via
  `"packageManager": "pnpm@9.15.0"` in the root `package.json` so `corepack`
  resolves the same version for everyone. Use `pnpm --filter <pkg> <script>`
  to target one workspace, or the root scripts (`pnpm dev`, `pnpm build`,
  `pnpm storybook`) which fan out through Turborepo.
- **Task runner:** Turborepo (`turbo.json`). `build` depends on `^build` (a
  package builds after its own workspace dependencies do); `dev` and
  `storybook` are uncached, persistent (long-running dev servers).
- **Bundler (packages):** `tsup` (esbuild-based) — `packages/tokens` and
  `packages/ui` each have a `tsup.config.ts` and a `"build"` script. In day-to-
  day development, nothing depends on the `dist/` output: both packages'
  `package.json#exports` point straight at `src/*`, and Storybook/Vite compile
  TypeScript/CSS from source directly. Running `build` matters when a package
  needs to be consumed by tooling that isn't Vite-based, or eventually
  published outside this monorepo — keep it green, but don't block local dev
  on it.
- **Bundler (apps):** Vite 8, via `@storybook/react-vite` for the Storybook
  app and directly for the playground app.
- **Styling engine:** Tailwind CSS v4, CSS-first config (`@theme` block in
  `packages/ui/src/styles/globals.css` — there is no `tailwind.config.ts`;
  v4 doesn't need one for this setup). Wired into Vite via the `@tailwindcss/vite`
  plugin in both `apps/storybook/.storybook/main.ts` (`viteFinal`) and
  `apps/playground/vite.config.ts`.
- **Headless primitives:** the unified `radix-ui` package (Radix's single-
  import entry point, superseding the older per-primitive `@radix-ui/react-*`
  packages) — a dependency of `packages/ui`. Reach for it for anything with
  focus management or ARIA-pattern keyboard nav; see
  [ACCESSIBILITY_GUIDELINES.md](./ACCESSIBILITY_GUIDELINES.md).
- **Variant/class utilities:** `class-variance-authority` (variant/size →
  class list), `clsx` + `tailwind-merge` (safe class merging so a consumer's
  `className` always wins) — dependencies of `packages/ui`. See
  [COMPONENT_CONTRACTS.md](./COMPONENT_CONTRACTS.md).
- **Docs/dev surface:** Storybook 10 (`@storybook/react-vite` framework) in
  `apps/storybook`, reading stories straight out of `packages/ui/src/**`
  (see [STORYBOOK_RULES.md](./STORYBOOK_RULES.md)).
- **Linting:** `oxlint`, one shared root config (`.oxlintrc.json`); each
  package/app has its own `"lint"` script pointed at its own `src`/`.storybook`.
- **TypeScript:** `tsconfig.base.json` at the root (strict mode on) is
  extended by each package's own `tsconfig.json`. Apps that predate the
  monorepo split (`apps/playground`) keep their original standalone
  Vite-scaffold tsconfig rather than being forced onto the base — don't
  "fix" that mismatch without a reason tied to an actual bug.

## Known toolchain gotcha

`packages/ui` depends on `@storybook/addon-docs` (devDependency) purely so its
`Overview.mdx` files' `import { Meta } from '@storybook/addon-docs/blocks'` can
resolve during `storybook build`'s production bundling step (Vite/Rolldown, in
this Vite 8 + Storybook 10 combination, resolves package imports relative to
the *file's own package* on disk, not just the app that ultimately serves it —
`storybook dev` is more lenient about this than the static `build`). If a new
`.mdx` file in `packages/ui` ever needs another Storybook-provided import,
check `storybook build` (not just `storybook dev`) before assuming it works.

## Peer dependency matrix

`packages/ui`'s `package.json#peerDependencies` is the contract a consumer
must satisfy — keep this table in sync with that file whenever a peer
dependency is added or its range changes:

| Package | Range | Notes |
|---|---|---|
| `react` | `^19.0.0` | Peer, not a dependency — the consuming app supplies its own React. |
| `react-dom` | `^19.0.0` | Same. |
| `tailwindcss` | v4, consumer-supplied | Only required if the consumer wants to author their own Tailwind utilities against the same `@theme` tokens. A consumer that only renders `@discuss-ds/ui` components and imports `@discuss-ds/ui/styles.css` as a plain stylesheet does **not** need Tailwind installed themselves — the compiled CSS already contains the resolved classes. |

`react`/`react-dom` are pinned as devDependencies at `^19.2.8` inside
`packages/ui` (for building/testing against a real version) while the peer
range stays looser (`^19.0.0`) — don't tighten the peer range to match the
dev pin; that would force every consumer onto the exact patch version this
repo happens to develop against.

## Packaging & consumption today

- **Not published.** Every package is `"private": true` with
  `"version": "0.0.0"`. Nothing is published to an npm registry (internal or
  public) yet — see [DECISIONS.md](./DECISIONS.md).
- **Two ways to consume `@discuss-ds/ui` today**, both workspace-internal
  (`apps/storybook`, `apps/playground`):
  1. Import components: `import { Button } from '@discuss-ds/ui'`.
  2. Import the compiled stylesheet once, at the app root:
     `import '@discuss-ds/ui/styles.css'` (which itself does
     `@import 'tailwindcss'; @import '@discuss-ds/tokens/css';` plus the
     `@theme` mapping — see [DESIGN_TOKENS.md](./DESIGN_TOKENS.md)).
- **Before this can be consumed outside the monorepo** (a separate repo, or
  an external MCP client per [ARCHITECTURE.md](./ARCHITECTURE.md#mcp-readiness)),
  it needs: real semver versioning, a registry to publish to (internal npm
  registry, GitHub Packages, or public npm — not yet decided), and CI running
  `pnpm build` + `pnpm lint` on every change (see "What's deliberately not
  here yet" below). Don't stand any of that up speculatively — it's listed
  here so a future "let's publish this" task knows the actual checklist
  instead of guessing.

## What's deliberately not here yet

- No component is implemented — every story in `packages/ui/src/components/**`
  (besides the `Example/` folder, the original Storybook scaffold) renders the
  shared `Placeholder` component. See
  [COMPONENT_STATUS.md](./COMPONENT_STATUS.md).
- No per-component Radix packages are installed preemptively — `radix-ui` is
  there, used component-by-component as each one is actually built.
- No CI config, no Chromatic wiring, no published npm registry target. Add
  those when the library has enough real components to be worth gating.
- No bespoke MCP server. `@storybook/addon-mcp` is already installed and
  registered in `apps/storybook/.storybook/main.ts` — see
  [ARCHITECTURE.md](./ARCHITECTURE.md#mcp-readiness) and
  [DECISIONS.md](./DECISIONS.md) for what "becoming an MCP" builds on and why
  nothing more is built here yet.

# Changesets

This directory manages changelogs and version bumps for `@discuss-ds/tokens`
and `@discuss-ds/ui` via [Changesets](https://github.com/changesets/changesets).
`apps/storybook` and `apps/playground` are excluded (see `config.json`
`ignore`) since they're not published packages.

Run `pnpm changeset` when a PR changes `packages/tokens` or `packages/ui` and
describe the change from a consumer's point of view — that description
becomes the changelog entry. See the [Everyday commands](../CLAUDE.md#everyday-commands)
section in the root `CLAUDE.md` for the full workflow.

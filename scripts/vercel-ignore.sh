#!/usr/bin/env bash
# Vercel "Ignored Build Step": exit 0 = skip the build, exit 1 = build.
# Keeps deploys to changes that can alter the published Storybook.

# Only deploy main (production) and pull requests (previews). Plain branch
# pushes with no PR open never deploy.
if [ "$VERCEL_GIT_COMMIT_REF" != "main" ] && [ -z "$VERCEL_GIT_PULL_REQUEST_ID" ]; then
  echo "Skipping: not main and no pull request."
  exit 0
fi

# Skip when the last commit only touched things that don't affect the site:
# tests, changesets, changelogs, version bumps, docs, workflows.
# If the diff can't be computed (shallow clone), build to be safe.
if git diff --quiet HEAD^ HEAD -- \
  packages/ui/src packages/tokens/src \
  apps/storybook/.storybook apps/storybook/package.json \
  vercel.json pnpm-lock.yaml scripts/vercel-ignore.sh \
  ':(exclude)*.test.ts' ':(exclude)*.test.tsx' 2>/dev/null; then
  echo "Skipping: no changes that affect Storybook."
  exit 0
fi

echo "Building."
exit 1

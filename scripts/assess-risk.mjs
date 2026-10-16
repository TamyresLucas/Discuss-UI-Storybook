#!/usr/bin/env node
// Classifies a pull request as low / medium / high risk from what it changes.
// High risk needs a human to add the `risk-approved` label before it can merge
// (enforced by .github/workflows/risk.yml). Pure Node, no dependencies.
//
//   BASE_REF=origin/main node scripts/assess-risk.mjs
//
// Writes a markdown report to stdout, $GITHUB_STEP_SUMMARY and $GITHUB_OUTPUT.
import { execSync } from 'node:child_process';
import { appendFileSync } from 'node:fs';

const base = process.env.BASE_REF ?? 'origin/main';
const sh = (cmd) => execSync(cmd, { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });

const files = sh(`git diff --name-status ${base}...HEAD`)
  .split('\n')
  .filter(Boolean)
  .map((line) => {
    const [status, ...paths] = line.split('\t');
    return { status: status[0], path: paths[paths.length - 1] };
  });
const changedLines = sh(`git diff --numstat ${base}...HEAD`)
  .split('\n')
  .filter(Boolean)
  .reduce((n, l) => n + (Number(l.split('\t')[0]) || 0) + (Number(l.split('\t')[1]) || 0), 0);

const diffOf = (path) => sh(`git diff -U0 ${base}...HEAD -- "${path}"`).split('\n');
const removed = (lines) => lines.filter((l) => l.startsWith('-') && !l.startsWith('---')).map((l) => l.slice(1));
const added = (lines) => lines.filter((l) => l.startsWith('+') && !l.startsWith('+++')).map((l) => l.slice(1));

const isTestOrStory = (p) => /\.(test|stories)\.(ts|tsx|mdx)$/.test(p) || p.endsWith('.mdx');
const findings = []; // { level: 'high' | 'medium', reason }
const high = (reason) => findings.push({ level: 'high', reason });
const medium = (reason) => findings.push({ level: 'medium', reason });

// 1. The pipeline itself: CI, deploy, release and lint config, and this script.
const pipeline = files.filter((f) =>
  /^(\.github\/|scripts\/|vercel\.json$|turbo\.json$|\.oxlintrc\.json$|\.changeset\/config\.json$)/.test(f.path),
);
if (pipeline.length) high(`Pipeline, deploy or release config changed: ${pipeline.map((f) => `\`${f.path}\``).join(', ')}`);

// 2. Dependencies: lockfile, or any package.json change other than a version bump.
if (files.some((f) => f.path === 'pnpm-lock.yaml')) high('Dependency lockfile changed (`pnpm-lock.yaml`).');
for (const f of files.filter((x) => x.path.endsWith('package.json'))) {
  const d = diffOf(f.path);
  const meaningful = [...removed(d), ...added(d)].filter((l) => l.trim() && !/^\s*"version":/.test(l));
  if (meaningful.length) high(`\`${f.path}\` changed beyond a version bump (dependencies, scripts or exports).`);
}

// 3. Tokens: removing or renaming a CSS variable breaks every consumer.
for (const f of files.filter((x) => x.path.startsWith('packages/tokens/src/'))) {
  const d = diffOf(f.path);
  const name = (l) => l.match(/^\s*(--[\w-]+)\s*:/)?.[1];
  const addedNames = new Set(added(d).map(name).filter(Boolean));
  const gone = removed(d).map(name).filter((n) => n && !addedNames.has(n));
  if (f.status === 'D') high(`Token file deleted: \`${f.path}\`.`);
  else if (gone.length) high(`Tokens removed or renamed in \`${f.path}\`: ${gone.map((n) => `\`${n}\``).join(', ')}.`);
  else if (removed(d).some(name)) medium(`Token values changed in \`${f.path}\` (affects every consumer).`);
  else medium(`Tokens added or edited in \`${f.path}\`.`);
}

// 4. Public API: removed exports from barrels, deleted component files.
for (const f of files.filter((x) => /^packages\/ui\/src\/(.*\/)?index\.ts$/.test(x.path))) {
  const d = diffOf(f.path);
  const addedLines = new Set(added(d).map((l) => l.trim()));
  const gone = removed(d).filter((l) => /^\s*export\b/.test(l) && !addedLines.has(l.trim()));
  if (gone.length) high(`Public exports removed from \`${f.path}\` (breaking for consumers).`);
}
const deleted = files.filter((f) => f.status === 'D' && f.path.startsWith('packages/ui/src/') && !isTestOrStory(f.path));
if (deleted.length) high(`Component files deleted: ${deleted.map((f) => `\`${f.path}\``).join(', ')}.`);

// 5. A major version bump in a changeset.
for (const f of files.filter((x) => /^\.changeset\/.+\.md$/.test(x.path) && x.status !== 'D' && !x.path.endsWith('README.md'))) {
  if (added(diffOf(f.path)).some((l) => /:\s*["']?major["']?\s*$/.test(l))) high(`Major version bump in \`${f.path}\`.`);
}

// 6. Size: big diffs are hard to review.
if (files.length > 60 || changedLines > 2000) high(`Large change: ${files.length} files, ${changedLines} changed lines.`);

// Medium: shipped component code or Storybook config.
const source = files.filter((f) => f.path.startsWith('packages/ui/src/') && !isTestOrStory(f.path));
if (source.length) medium(`Component source changed (${source.length} file${source.length > 1 ? 's' : ''} in \`packages/ui/src\`).`);
if (files.some((f) => f.path.startsWith('apps/storybook/.storybook/'))) medium('Storybook configuration changed.');
if (files.some((f) => f.path.startsWith('apps/playground/'))) medium('Playground app changed.');

const level = findings.some((f) => f.level === 'high') ? 'high' : findings.length ? 'medium' : 'low';
const lines = [
  `## Risk assessment: ${level.toUpperCase()}`,
  '',
  `${files.length} file${files.length === 1 ? '' : 's'} changed, ${changedLines} lines.`,
  '',
  ...(findings.length ? findings.map((f) => `- **${f.level}**: ${f.reason}`) : ['- Only stories, tests, docs or changesets changed.']),
  '',
  level === 'high'
    ? 'A human must add the `risk-approved` label before this can merge.'
    : 'Merges automatically once the required checks pass.',
];
const report = lines.join('\n');
console.log(report);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, report + '\n');
if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `level=${level}\n`);

#!/usr/bin/env node
/**
 * Compares packages/tokens/src/tokens.css against packages/tokens/figma-snapshot.json
 * (an alias-resolved export of the Figma variables). Figma is the source of truth:
 * any mismatch is reported and the script exits 1.
 *
 * Refresh the snapshot with a read-only `use_figma` export, then re-run:
 *   pnpm tokens:check
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const css = readFileSync(path.join(root, 'packages/tokens/src/tokens.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const snap = JSON.parse(readFileSync(path.join(root, 'packages/tokens/figma-snapshot.json'), 'utf8'));

// --- parse custom properties from :root and [data-theme='dark'] ---
function parseBlock(selector) {
  const start = css.indexOf(selector);
  if (start < 0) return {};
  const open = css.indexOf('{', start);
  const close = css.indexOf('\n}', open);
  const vars = {};
  for (const m of css.slice(open + 1, close).matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) vars[m[1]] = m[2].trim();
  return vars;
}
const rootVars = parseBlock(':root');
const darkVars = { ...rootVars, ...parseBlock("[data-theme='dark']") };

function resolve(vars, name, depth = 0) {
  let v = vars[name];
  if (v === undefined || depth > 10) return undefined;
  const ref = v.match(/^var\((--[\w-]+)\)$/);
  return ref ? resolve(vars, ref[1], depth + 1) : v.toLowerCase();
}
const toPx = (v) => (v === undefined ? undefined : v.endsWith('rem') ? parseFloat(v) * 16 : v.endsWith('px') ? parseFloat(v) : v);

const problems = [];
const check = (label, expected, actual) => {
  if (String(expected) !== String(actual)) problems.push(`${label}: figma=${expected} code=${actual ?? '(missing)'}`);
};

// --- primitives ---
for (const [name, hex] of Object.entries(snap.Primitives)) {
  const code = name === 'White' ? '--sys-color-white' : `--sys-color-${name.replace('/', '-')}`;
  check(code, hex, resolve(rootVars, code));
}

// --- semantic (Figma name -> code token(s)); [light, dark] ---
const semanticMap = {
  'page-background': ['background'],
  'foreground-primary': ['foreground'],
  'background-primary': ['primary'],
  'foreground-label': ['primary-foreground'],
  'background-secondary': ['secondary'],
  foreground: ['foreground-text', 'secondary-foreground'],
  'background-muted': ['muted'],
  'foreground-muted': ['muted-foreground'],
  'background-accent': ['accent'],
  'foreground-accent': ['accent-foreground'],
  'background-destructive': ['destructive'],
  'foreground-destructive': ['destructive-foreground'],
  'foreground-border': ['border'],
  'foreground-input-muted': ['input'],
  'foreground-ring': ['ring'],
  'chart-1': ['chart-1'], 'chart-2': ['chart-2'], 'chart-3': ['chart-3'], 'chart-4': ['chart-4'], 'chart-5': ['chart-5'],
  'background-success': ['success'],
  'foreground-success': ['success-foreground'],
  'background-warning': ['warning'],
  'foreground-warning': ['warning-foreground'],
  'background-info': ['info'],
  'foreground-info': ['info-foreground'],
  'foreground-info-border': ['info-border'],
  'background-destructive-soft': ['destructive-soft'],
  'foreground-destructive-soft': ['destructive-soft-foreground'],
  'foreground-destructive-soft-border': ['destructive-soft-border'],
  'background-warning-soft': ['warning-soft'],
  'foreground-warning-soft': ['warning-soft-foreground'],
  'foreground-warning-soft-border': ['warning-soft-border'],
  'background-success-soft': ['success-soft'],
  'foreground-success-soft': ['success-soft-foreground'],
  'foreground-success-soft-border': ['success-soft-border'],
  'background-accent-soft': ['accent-soft'],
  'foreground-accent-soft': ['accent-soft-foreground'],
  'border-accent-soft': ['accent-soft-border'],
  'background-primary-soft': ['primary-soft'],
  'foreground-primary-soft': ['primary-soft-foreground'],
  'foreground-primary-soft-border': ['primary-soft-border'],
  'foreground-secondary-muted': ['secondary-muted-foreground'],
  'foreground-input-accent': ['input-accent'],
  'surface-background': ['surface-background'],
  'surface-foreground': ['surface-foreground'],
  'background-accent-muted': ['accent-muted'],
};
for (const [figmaName, [light, dark]] of Object.entries(snap.Semantic)) {
  const targets = semanticMap[figmaName];
  if (!targets) { problems.push(`Semantic "${figmaName}": no code mapping in check-figma-drift.mjs`); continue; }
  for (const t of targets) {
    check(`--sys-color-${t} (light)`, light, resolve(rootVars, `--sys-color-${t}`));
    check(`--sys-color-${t} (dark)`, dark, resolve(darkVars, `--sys-color-${t}`));
  }
}

// --- radius (px), spacing (px), opacity (%), z-index ---
for (const [name, px] of Object.entries(snap['Border Radius'])) {
  const code = name === 'radius' ? '--sys-radius' : `--sys-${name}`;
  check(code, px, toPx(resolve(rootVars, code)));
}
for (const [name, px] of Object.entries(snap.Spacing)) {
  check(`--sys-space-${name.split('/')[1]}`, px, toPx(resolve(rootVars, `--sys-space-${name.split('/')[1]}`)));
}
for (const [name, pct] of Object.entries(snap.Opacity)) {
  const code = `--sys-opacity-${name.split('/')[1]}`;
  check(code, pct, Number(resolve(rootVars, code)) * 100);
}
for (const [name, z] of Object.entries(snap['Z-Index'])) {
  const code = `--sys-z-${name.split('/')[1]}`;
  check(code, z, Number(resolve(rootVars, code)));
}

// --- typography scales ---
for (const [name, val] of Object.entries(snap.Typography)) {
  if (name.startsWith('font-size/')) check(`--sys-font-size-${name.split('/')[1]}`, val, toPx(resolve(rootVars, `--sys-font-size-${name.split('/')[1]}`)));
  else if (/^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/.test(name))
    check(`--sys-${name.replace('font-', 'font-weight-')}`, val, Number(resolve(rootVars, `--sys-${name.replace('font-', 'font-weight-')}`)));
}

if (problems.length) {
  console.error(`Token drift vs Figma snapshot (${snap._meta.syncedAt}): ${problems.length} issue(s)\n`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(`tokens.css matches the Figma snapshot (${snap._meta.syncedAt}).`);

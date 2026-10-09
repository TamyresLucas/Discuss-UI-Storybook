# @discuss-ds/tokens

## 0.2.0

### Minor Changes

- [#78](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/78) [`0357b54`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/0357b54c812a044c0b7ad6f6aafa53ff4fdf7922) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - New `input-muted` colour token (`--sys-color-input-muted`, Tailwind `border-input-muted`): `plum-muted-300` in light mode and `plum-muted-500` in dark mode. It is now the border of every input field: input, textarea, select, date and time pickers, search, inline edit, the option editor row and the outline button's hover and disabled border. The `input` token (Figma `foreground-input`) stays `plum-muted-500` in light mode and is now `plum-muted-600` in dark mode, and is only used by checkbox and radio controls. Input field borders are visibly lighter than before; the `input` token keeps its name and its light value, so checkbox and radio are unchanged in light mode.

## 0.1.0

### Minor Changes

- [#1](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/1) [`9906195`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/9906195d481c556940aca6eaedee719a0a6fb0ea) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - Align component colour pairings with Figma for WCAG AA: add the neutral `label` token (text on dark fills), primary/destructive hover tokens and documented dark-overlay tokens; fields use `surface-background`; Button/Form/Select re-paired; Tailwind theme now `inline` so dark mode reaches utilities.

- [#4](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/4) [`32eefca`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/32eefcad344f0880813c88febc7ef1ea693b6de9) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - Publish `@discuss-ds/tokens` and `@discuss-ds/ui` to npm as compiled packages (`dist` + `styles.css`) so other projects can install them.

- [#1](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/1) [`20b1530`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/20b1530d016280d5b20ff3a81d6b1f473749389d) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - Re-sync tokens with Figma: add dark mode, shadow scale (xs–2xl), radius xs/xxs, opacity steps, surface/accent-muted/input-accent tokens; card/popover, info, muted-foreground and soft variants updated to Figma values.

- [#1](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/1) [`48c5f8f`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/48c5f8f20fb4028097ba5dcdd1c0c2a48bec4a61) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - Add `sys-text-*` composite type-style tokens mirroring the Figma text styles, exposed as `text-heading-h1` … `text-ui-input-value` utilities.

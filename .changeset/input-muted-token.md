---
"@discuss-ds/tokens": minor
"@discuss-ds/ui": minor
---

New `input-muted` colour token (`--sys-color-input-muted`, Tailwind `border-input-muted`): `plum-muted-300` in light mode and `plum-muted-500` in dark mode. It is now the border of every input field: input, textarea, select, date and time pickers, search, inline edit, the option editor row and the outline button's hover and disabled border. The `input` token (Figma `foreground-input`) stays `plum-muted-500` in light mode and is now `plum-muted-600` in dark mode, and is only used by checkbox and radio controls. Input field borders are visibly lighter than before; the `input` token keeps its name and its light value, so checkbox and radio are unchanged in light mode.

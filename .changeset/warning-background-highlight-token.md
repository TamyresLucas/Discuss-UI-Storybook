---
"@discuss-ds/tokens": minor
"@discuss-ds/ui": patch
---

New color token `--sys-color-warning-background-highlight` (Tailwind: `bg-warning-background-highlight`): the highlight behind words that carry a warning. It is dandelion 100 in light mode and dandelion 800 in dark mode. A `warning` mark in `InlineEdit` (and the other text fields that mark words) uses it instead of a fixed dandelion shade, so the highlight follows the theme.

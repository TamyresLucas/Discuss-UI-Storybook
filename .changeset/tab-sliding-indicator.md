---
"@discuss-ds/ui": minor
---

`TabNavigation` / `TabItem`: in the `filter` and `toggle` variants the selected tab's background is now a single indicator that slides to the newly selected tab (200ms; it jumps with reduced motion), instead of each tab painting its own. The tabs themselves keep their size, hover and disabled looks; the `underline` variant is unchanged. A tab that overrides its own background with a class still does.

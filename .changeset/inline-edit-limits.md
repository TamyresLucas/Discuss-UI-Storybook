---
"@discuss-ds/ui": minor
---

`InlineEdit`: new optional `showLimits` prop. While editing it shows the allowed length under the field (for example "150–500 characters", from `minLength` and `maxLength`) with a live character counter. After a refused save that same line turns into the error state (error colour and icon). Off by default, so nothing changes unless it is set.

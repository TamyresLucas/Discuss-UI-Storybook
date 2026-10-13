---
"@discuss-ds/ui": minor
---

`InlineEdit`: new optional `submitOnEnter` prop for `multiline` fields. Enter saves the edit (a refused edit stays open and focused with its message) and Shift+Enter inserts a line break; Cmd/Ctrl+Enter keeps saving. Off by default, so multiline fields behave as before unless it is set.

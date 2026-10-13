---
"@discuss-ds/ui": minor
---

`InlineEdit`: new optional `minLength` and `validate` props. An edit that is too short, or that `validate` rejects (by returning a message), is not saved on Enter or blur: the field stays open with an error border and message, `onValueChange` is not called, and the message follows what is typed. Escape still reverts. Without the props nothing changes.

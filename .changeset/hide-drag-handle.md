---
"@discuss-ds/ui": minor
---

QuestionHeader, QuestionEditorCard and QuestionNavItem: new optional `showDragHandle` prop (default true). Set it to false when the question or row can't be moved, so the grip icon is not shown on hover and the tag or row doesn't shift to make room for it. Nothing changes for existing callers.

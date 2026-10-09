---
"@discuss-ds/ui": minor
---

QuestionOptionEditor: new optional `dragHandleProps` makes the row's grip a drag handle for reordering options (grab cursor, focusable, labelled "Reorder option N"), and a new optional `lifted` prop gives the copy that follows the pointer its lifted look (shadow, grip showing). Nothing changes for existing callers: without the props the grip stays decorative.

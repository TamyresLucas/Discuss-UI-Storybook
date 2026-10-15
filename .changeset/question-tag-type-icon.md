---
"@discuss-ds/ui": minor
---

`QuestionHeader` and `QuestionEditorCard` take an optional `questionType`: the "Question N" tag then shows that question type's icon (16px) in its default and selected states. On hover or focus the drag grip replaces it, and a tag that can't be dragged (`showDragHandle={false}`) keeps the icon. Without `questionType` nothing changes.

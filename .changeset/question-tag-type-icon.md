---
"@discuss-ds/ui": minor
---

`QuestionHeader` and `QuestionEditorCard` take an optional `questionType`: the "Question N" tag then shows that question type's icon (16px) in its default and selected states. On hover or focus the drag grip replaces it, and a tag that can't be dragged (`showDragHandle={false}`) keeps the icon. Without `questionType` nothing changes.

With a type icon the tag keeps the same width on hover: the grip replaces the icon in place instead of the tag trimming its left padding.

`InlineEdit`, `QuestionHeader` (`titleMarks`) and `QuestionEditorCard` (`titleMarks`) also take optional ranges (`marks`) of the saved text to underline in the destructive colour, for example misspelled words found by a spell checker. Read mode only; without them nothing changes.

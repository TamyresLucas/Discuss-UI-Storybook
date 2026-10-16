---
"@discuss-ds/ui": minor
---

`QuestionHeader` and `QuestionEditorCard` take an optional `questionType`: the "Question N" tag then shows that question type's icon (16px) in its default and selected states. On hover or focus the drag grip replaces it, and a tag that can't be dragged (`showDragHandle={false}`) keeps the icon. Without `questionType` nothing changes.

With a type icon the tag keeps the same width on hover: the grip replaces the icon in place instead of the tag trimming its left padding.

`InlineEdit`, `QuestionHeader` (`titleMarks`) and `QuestionEditorCard` (`titleMarks`) also take optional ranges (`marks`) of the saved text to underline in the destructive colour, for example misspelled words found by a spell checker. Read mode only; without them nothing changes.

`QuestionOptionEditor` takes the same `marks`, `onMarkApply` and `onMarkDismiss`: an answer option's label shows its marked words underlined (with the same card) while it is not being edited. Without them nothing changes.

Smaller behaviour changes in the same release: a click inside a `QuestionEditorCard` but outside its text field (its padding, labels, empty space) no longer ends a title edit in progress, and the title field's line while it is being edited uses the same muted accent as the selected state, so there is no colour change between the two. A mark's card opens only when its own word is clicked: the mark that replaces a just-fixed one no longer opens by itself.

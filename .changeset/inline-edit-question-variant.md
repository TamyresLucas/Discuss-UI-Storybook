---
"@discuss-ds/ui": minor
---

`InlineEdit` gets a second style for question text and clearer rules for long text. A short single-line label keeps the pencil and hugs its text; `multiline` (longer text) now hides the pencil and fills the full width. New `variant="question"`: full width, no pencil, square corners, and a bottom border on hover and focus. New `selected` keeps that bottom border while the owning question is selected. In the question variant Enter saves and Shift+Enter adds a line break. New `onDraftChange` reports the text on every keystroke.

`QuestionHeader` (and so `QuestionEditorCard`) editor mode now edits the title with the question-variant `InlineEdit`: click the title to edit, Enter or blur saves, and the underline stays while the card is `active`. `onTitleChange` now fires when an edit is saved instead of on every keystroke; the character counter still updates live.

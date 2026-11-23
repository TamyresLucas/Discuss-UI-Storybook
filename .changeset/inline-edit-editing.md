---
"@discuss-ds/ui": minor
---

InlineEdit takes an optional `editing` prop that opens the field from outside when it turns true (for example when the row or card it belongs to is selected), focused without scrolling the page. QuestionEditorCard and QuestionHeader pass it through as `titleEditing`, so selecting a question can put its text in edit mode. Existing callers are unchanged.

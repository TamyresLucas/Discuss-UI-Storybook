---
"@discuss-ds/ui": minor
---

`QuestionHeader` and `QuestionEditorCard` get an optional `dragHandleProps` that turns the "Question N" tag into a drag handle. It is spread onto the tag, so it accepts what a drag-and-drop library provides (`ref`, `role`, `tabIndex`, pointer and keyboard listeners, aria attributes). With it the tag shows a grab cursor, is keyboard focusable, shows the grip icon on focus and is labelled "Reorder question N". Without it nothing changes.

`ActivityStructure`: the card corner radius is now 16px (was 24px) to match the question cards, and the title uses the primary foreground colour.

---
"@discuss-ds/ui": minor
---

Guardrails for question and option text. `QuestionEditorCard` and `QuestionHeader` take `titleMinLength` (with `maxLength`): while the title is edited a line shows the allowed range and live count, a title that is too short is not saved, and the always-on counter gives way to that line. `QuestionOptionEditor` takes `minLength` and `maxLength` with the same behaviour (draft, helper line while editing, refusal, Escape to revert). `InlineEdit`, `QuestionHeader` (`titlePlaceholderTone`), `QuestionEditorCard` and `QuestionOptionEditor` (`placeholderTone`) can show their placeholder in the regular text colour. Everything is opt-in; without the new props nothing changes.

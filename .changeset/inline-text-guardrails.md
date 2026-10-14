---
"@discuss-ds/ui": minor
---

Guardrails for question and option text. `QuestionEditorCard` and `QuestionHeader` take `titleMinLength` (with `maxLength`): while the title is edited a line shows "N characters required" with the live count out of the maximum, a title that is too short is not saved, and the always-on counter gives way to that line. `QuestionOptionEditor` takes `minLength` and `maxLength` with the same behaviour (draft, helper line inside the option's box while editing, refusal, Escape to revert). The same line now reads "N characters required" in `InlineEdit`'s `showLimits` (it used to read "MIN–MAX characters"). `InlineEdit`, `QuestionHeader` (`titlePlaceholderTone`), `QuestionEditorCard` and `QuestionOptionEditor` (`placeholderTone`) can show their placeholder in the regular text colour. Apart from that wording, everything is opt-in: without the new props nothing changes.

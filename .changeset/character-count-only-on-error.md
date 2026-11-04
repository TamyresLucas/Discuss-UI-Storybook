---
"@discuss-ds/ui": minor
---

A character count now shows only when it is an error. `InlineEdit` (`showLimits`), `QuestionOptionEditor` (`minLength` / `maxLength`), `QuestionHeader` and `QuestionEditorCard` (the title's "n/2000 characters"), and `StimulusCard` (the caption's) show the allowed length and the count only while the text is shorter than the minimum or longer than the maximum, or after a save was refused; within the limits they show nothing. The props are unchanged, but a screen that relied on the always-on count now sees it only out of range.

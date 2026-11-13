---
"@discuss-ds/ui": minor
---

New `QuestionNumberTag`: the "Question N" tag that `QuestionHeader` and `QuestionEditorCard` draw in editor mode, exported on its own so a list that is not an editor (a study plan, a summary) can number its questions the same way. Props: `number`, `active`, `questionType`, `showDragHandle` (default true) and `dragHandleProps`. `QuestionHeader` now uses it; its tag looks and behaves exactly as before.

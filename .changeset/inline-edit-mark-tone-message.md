---
"@discuss-ds/ui": minor
---

`InlineEdit` marks (and the marks in `QuestionOptionEditor` and the question header) take two new optional properties. `tone: 'warning'` underlines the words in the warning colour instead of the destructive one, for a recommendation rather than a mistake. `message` adds a short rationale to the mark's card, above the suggestions. Without them nothing changes: a mark is still a destructive underline with a card that has the marked text, its corrections and Dismiss.

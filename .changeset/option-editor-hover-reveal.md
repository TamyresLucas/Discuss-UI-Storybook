---
"@discuss-ds/ui": minor
---

`QuestionOptionEditor` gets an optional `kind` (`radio` | `checkbox`). With it the row is quiet at rest (no border, the radio or checkbox indicator in front of the label) and turns into the editor on hover or keyboard focus: border and shadow, the drag handle replaces the indicator, and the remove and add buttons appear. The buttons keep their space while hidden, so the row is the same width in every state. Without `kind` the row is the same always-on editor as before.

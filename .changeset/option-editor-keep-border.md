---
"@discuss-ds/ui": patch
---

`QuestionOptionEditor` with `kind`: the row now keeps its normal border at rest (0.4.0 removed it). Hovering or focusing the row still swaps the indicator for the drag handle and reveals the remove and add buttons, and lifts the row with a shadow, but the border colour does not change. The row is the same width in every state.

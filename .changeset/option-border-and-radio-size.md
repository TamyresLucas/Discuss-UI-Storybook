---
"@discuss-ds/ui": patch
---

`QuestionOption` (radio and checkbox answer cards): hovering now changes only the fill and shadow. The border changes only when the option is selected (accent). `RadioGroupItem` is now 16px (was 20px, matching the checkbox) with a proportionally smaller centre dot.

`ActivityStructure`: section text is rendered in a `div` instead of a `p`, so it can hold block-level content such as an `InlineEdit` without invalid HTML nesting.

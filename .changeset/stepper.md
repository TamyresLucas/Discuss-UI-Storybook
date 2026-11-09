---
"@discuss-ds/ui": minor
---

New `Stepper`, `Step` and `StepPath` (Figma: Stepper). `Stepper` shows the steps of a flow joined by paths from `steps` and the 0-based `current` step: earlier steps are completed (a check), the current one is selected (a filled radio and a bolder label) and later ones not completed; a step with `error` shows a warning, and a path between two completed steps is green. `orientation="vertical"` puts each label before its indicator. It renders an ordered list with `aria-current="step"` and reads each step's status after its label. Nothing changes for existing components.

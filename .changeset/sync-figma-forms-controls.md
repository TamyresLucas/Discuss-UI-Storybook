---
'@discuss-ds/ui': minor
---

Align the form controls with Figma and add the missing ones. Restyled: Switch (44×24), Text Input and Textarea (label / helper / success / error via the new `Field`, or the `label`/`description`/`message`/`status` props), Search Bar (clear button, accent focus), Checkbox (indeterminate + `CheckboxField`), Radio Group (`RadioGroupFieldItem`), Slider (label, range and value bubble), Select (`icon`, accent open state) and Label. New: `Toggle`, `NumberInput`, `InputWithAction`, `Calendar`, `TimePicker`, `DateTimePicker`, `DatePicker`. `Input` no longer has a `size` prop (single 40px size per Figma). Adds `react-day-picker`.

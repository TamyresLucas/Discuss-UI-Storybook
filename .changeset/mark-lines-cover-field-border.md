---
"@discuss-ds/ui": patch
---

The highlight and underline of a mark are now drawn per line of the marked words instead of with one padding for the whole word. On a title that wraps, the first line reaches the top of the field and the last line's underline lands exactly on the field's own bottom border (covering it), as a single-line word already did; before, the last line stopped a few pixels short. Visually unchanged for a word on one line. The marked word keeps its place in the text and its click; `data-tone` on it tells the tone of the mark.

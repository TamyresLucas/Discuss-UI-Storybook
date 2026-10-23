---
"@discuss-ds/ui": patch
---

While a field with marks is edited, the highlight and underline of a mark now have the same geometry as when it is not edited: the first line reaches the top of the field and the last line's underline lands on the field's own bottom border (covering it). The highlight is drawn behind the field (the text selection still shows over it) and the underline in a layer over the field. Before, while editing they stopped about 4px short of the field's top and bottom edges.

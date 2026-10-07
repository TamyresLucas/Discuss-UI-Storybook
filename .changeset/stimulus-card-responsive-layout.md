---
"@discuss-ds/ui": minor
---

`StimulusCard`: follows the updated Figma for responsiveness. The card has a minimum height of 86px, the thumbnail is square and as tall as the text beside it (so it grows when the caption wraps onto more lines, from 80px up to 240px), and the text column is centred with 8px of vertical padding. New `maxLength` and `showCounter` props add the same live "n/2000 characters" counter the question text has, under an editable caption. A one-line caption looks the same as before. The thumbnail is sized from the measured text height because that is circular in plain CSS.

---
"@discuss-ds/ui": patch
---

AIMiniAvatar: the busy animation now draws the mark along its own curve (from its first end through its loops to the last), holds, then clears the same way, instead of wiping it in from the left. Nothing changes for callers; reduced-motion users still see the still mark.

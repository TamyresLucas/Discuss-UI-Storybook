---
"@discuss-ds/ui": minor
---

On hover, an unselected tab in the default (filter) `TabNavigation` turns its text accent-foreground (was the lighter accent). A `ghost` `Button` on hover now only turns its text accent-foreground (no accent-soft background any more) and switches its Phosphor icons from line to fill (an icon with an explicit `weight` keeps it); `fillIconOnHover={false}` keeps the icons as they are.

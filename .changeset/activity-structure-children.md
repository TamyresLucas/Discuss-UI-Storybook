---
"@discuss-ds/ui": minor
---

`ActivityStructure` can now be a single-purpose widget: it renders `children` under its title, stats and sections, and no longer renders an empty stats grid when `stats` is empty. `<ActivityStructure title="Research Goal" stats={[]}>…</ActivityStructure>` has the same card, title style and colour as the full Activity Summary. Existing usage is unchanged.

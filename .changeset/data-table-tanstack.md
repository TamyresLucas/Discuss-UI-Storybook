---
"@discuss-ds/ui": minor
---

New `DataTable` in Data Display: pass `columns` and `data` and get a `Table` with sorting, a select-all checkbox column, pagination, a column-visibility menu, loading and empty states. It is built on TanStack Table (`@tanstack/react-table`), and any of its state can be controlled from outside. Optional features, each switched on by a prop: column pinning, sizing, resizing and ordering, column and global filtering with counts, grouping with aggregation and a footer, expandable rows and detail panels, row pinning, cell selection and spanning, grouped headers, inline editing, server-side data, virtualized rows (`@tanstack/react-virtual`), infinite scrolling and a compact density. `Table` gains a `TableFooter`, a `containerRef` and a `resizer` slot on `TableHead`.

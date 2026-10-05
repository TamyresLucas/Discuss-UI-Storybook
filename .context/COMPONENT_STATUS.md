# Component Status

The tracking source of truth for every component in `packages/ui`. Keep this in
sync with each component's `.stories.tsx` tags (see
[STORYBOOK_RULES.md](./STORYBOOK_RULES.md)) — the tag and this table should
never disagree.

**Lifecycle stages:** `Planned` → `In Progress` → `Review` → `Stable` →
`Deprecated`. A component reaches `Stable` only once it also clears the
screen-reader testing requirement in
[ACCESSIBILITY_GUIDELINES.md](./ACCESSIBILITY_GUIDELINES.md), not just
automated a11y checks.

**Current summary:** 43 / 76 components at `Planned` (story scaffolded with
the shared `Placeholder`, no implementation yet). 0 `In Progress`, 33
`Review` (the Button family, Toggle (Switch), Label, Text Input, Checkbox,
Radio Group, Search Bar, Textarea, Select (Dropdown), Slider, Form, Tab
Navigation, Tab Item, Progress, Tag (Status Badge), Removable Tag (Chip), Table, Table Header Row, Table Row, Pagination, Dialog (Modal), Dropdown Menu, Tooltip, Toast (Sonner), User Message Bubble, AI Response Container, Chat Input, AI Mini Avatar, Timestamp —
implemented, passes automated a11y checks, not yet screen-reader tested), 0
`Stable`, 0 `Deprecated`. The original Storybook scaffold (`Example/Button`,
`Header`, `Page`) has been removed — it predated this taxonomy and was
never part of it.

**New dependency:** `@phosphor-icons/react` (Figma's icon set) and `react-day-picker` (Calendar — there is no Radix calendar primitive) were added to `packages/ui`.

**Also added** (Figma components outside the original 76-row queue, all at `Review`): `Role Tag` (in `Tags & Badges`); `Toggle (Menu)` (Buttons & Actions); `Numerical Input`, `Input with Action`, `Calendar`, `Date & Time Picker` and the shared `Field` wrapper (Forms & Data Entry); `Table Column` (cell-type story for Table, Data Display); `Toast Inline` (in Overlays & Feedback); `Question Types` — `Question Card`, `Question Header`, `Question Option` (+ Other / editor row), `Open End Answer`, `Rating Scale`, `Rank List`, `File Upload`, `Media` (video player, image preview, thumbnails), `Question Type Icons`; `File Attachment`, `Ask AI Toggle`, `Topic Card`, `Project Selector`, `Chat Choices` and `Ask AI Input` (Conversation & AI Chat). Toast is built on Radix Toast, not the `sonner` package the name suggests.

**Earlier dependency:** `react-hook-form` (^7.88.0) was added to `packages/ui`
to build `Form` — the first component whose upstream shadcn source isn't a
pure `radix-ui` wrapper. See [DECISIONS.md](./DECISIONS.md) if this needs a
recorded rationale.

---

## Navigation (12)

| # | Component | Source | Stage |
|---|---|---|---|
| 1 | Org Rail (App Sidebar) | Custom | Planned |
| 2 | Icon Button | shadcn | Planned |
| 3 | Project Sidebar | Custom | Planned |
| 4 | Sidebar Nav Item | Custom | Planned |
| 5 | Project Switcher | Custom | Planned |
| 6 | Breadcrumb | shadcn | Planned |
| 7 | Tab Navigation | shadcn | Review |
| 8 | Tab Item | shadcn | Review |
| 9 | Collapsible | shadcn | Planned |
| 10 | Command Palette | shadcn | Planned |
| 11 | Sheet | shadcn | Planned |
| 12 | Scroll Area | shadcn | Planned |

## Buttons & Actions (5)

| # | Component | Source | Stage |
|---|---|---|---|
| 13 | Button (Primary) | shadcn | Review |
| 14 | Button (Secondary) | shadcn | Review |
| 15 | Button (Icon-only) | shadcn | Review |
| 16 | Button (Small – Reaction) | shadcn | Review |
| 17 | Toggle (Switch) | shadcn | Review |

## Forms & Data Entry (9)

| # | Component | Source | Stage |
|---|---|---|---|
| 18 | Search Bar | Custom | Review |
| 19 | Text Input | shadcn | Review |
| 20 | Textarea | shadcn | Review |
| 21 | Checkbox | shadcn | Review |
| 22 | Select (Dropdown) | shadcn | Review |
| 23 | Label | shadcn | Review |
| 24 | Radio Group | shadcn | Review |
| 25 | Form | shadcn | Review |
| 26 | Slider | shadcn | Review |

## Data Display (13)

| # | Component | Source | Stage |
|---|---|---|---|
| 27 | Table | shadcn | Review |
| 28 | Table Header Row | shadcn | Review |
| 29 | Table Row | shadcn | Review |
| 30 | Card | shadcn | Planned |
| 31 | Session Card | Custom | Planned |
| 32 | Sentiment Card | Custom | Planned |
| 33 | Method Card | Custom | Planned |
| 34 | Suggestion Card | Custom | Planned |
| 35 | Video Player Card | Custom | Planned |
| 36 | Progress | shadcn | Review |
| 37 | Hover Card | shadcn | Planned |
| 38 | Skeleton | shadcn | Planned |
| 39 | Aspect Ratio | shadcn | Planned |

## Tags & Badges (5)

| # | Component | Source | Stage |
|---|---|---|---|
| 40 | Badge | shadcn | Planned |
| 41 | Tag (Status Badge) | Custom | Review |
| 42 | ID Badge | Custom | Planned |
| 43 | Count Badge | Custom | Planned |
| 44 | Removable Tag (Chip) | Custom | Review |

## Identity & People (3)

| # | Component | Source | Stage |
|---|---|---|---|
| 45 | Avatar | shadcn | Planned |
| 46 | Avatar Group | Custom | Planned |
| 47 | Org Monogram | Custom | Planned |

## Overlays & Feedback (6)

| # | Component | Source | Stage |
|---|---|---|---|
| 48 | Dialog (Modal) | shadcn | Review |
| 49 | Popover | shadcn | Planned |
| 50 | Dropdown Menu | shadcn | Review |
| 51 | Tooltip | shadcn | Review |
| 52 | Toast (Sonner) | shadcn | Review |
| 53 | Alert Dialog | shadcn | Planned |

## Conversation & AI Chat (5)

| # | Component | Source | Stage |
|---|---|---|---|
| 54 | User Message Bubble | Custom | Review |
| 55 | AI Response Container | Custom | Review |
| 56 | Chat Input | Custom | Review |
| 57 | AI Mini Avatar | Custom | Review |
| 58 | Timestamp | Custom | Review |

## Files & Documents (2)

| # | Component | Source | Stage |
|---|---|---|---|
| 59 | File List Item | Custom | Planned |
| 60 | Storage Info | Custom | Planned |

## Layout & Structure (6)

| # | Component | Source | Stage |
|---|---|---|---|
| 61 | Page Header | Custom | Planned |
| 62 | Section Header | Custom | Planned |
| 63 | Card Container | shadcn | Planned |
| 64 | Divider (Separator) | shadcn | Planned |
| 65 | Accordion | shadcn | Planned |
| 66 | Resizable | shadcn | Planned |

## Utility (6)

| # | Component | Source | Stage |
|---|---|---|---|
| 67 | Chevron (Expand Icon) | Custom | Planned |
| 68 | More Menu (…) | Custom | Planned |
| 69 | Link Action | Custom | Planned |
| 70 | Context Menu | shadcn | Planned |
| 71 | Pagination | shadcn | Review |
| 72 | Skeleton Line | Custom | Planned |

## Research-Specific (4)

| # | Component | Source | Stage |
|---|---|---|---|
| 73 | Research Plan Panel | Custom | Planned |
| 74 | Activity Card | Custom | Planned |
| 75 | Market & Language Table | Custom | Planned |
| 76 | Project Tags Section | Custom | Planned |

---

## Updating this file

When a component moves stage:

1. Update its row here.
2. Update its story's `status:*` tag to match (see
   [STORYBOOK_RULES.md](./STORYBOOK_RULES.md)).
3. If it just became `Stable`, confirm it's re-exported from
   `packages/ui/src/index.ts` (see
   [COMPONENT_CONTRACTS.md](./COMPONENT_CONTRACTS.md)) — a component isn't
   really "Stable" if consumers can't import it from the package root yet.

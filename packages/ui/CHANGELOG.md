# @discuss-ds/ui

## 0.3.4

### Patch Changes

- [#17](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/17) [`3b68a03`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/3b68a0345b7b6b8289d62c2a59f2a35a873f46ec) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - `QuestionNavItem`: hovering a row that is not selected now only changes its fill; the border keeps the default colour. A selected row keeps its accent border.

## 0.3.3

### Patch Changes

- [#15](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/15) [`c5e67f1`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/c5e67f1f792232783903f2b6b0ba2a79fba1b4a1) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - `QuestionNavItem`: the question-type icon is now the muted foreground colour by default and takes the accent foreground colour only when the row is `selected`. The warning icon on `error` is unchanged.

## 0.3.2

### Patch Changes

- [#13](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/13) [`ca22046`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/ca22046f7e2616ef952f1252183bfe25f734ce03) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - `InlineEdit` question variant: the bottom border is now 1px on hover and focus. Only a `selected` question gets the bolder 2px accent border. Bottom padding compensates so the text and the card height do not move between states.

## 0.3.1

### Patch Changes

- [#11](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/11) [`515842c`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/515842c8cb05412776f3fe76bc60623230aaec22) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - `InlineEdit` question variant: on hover or focus the bottom border now uses the input border colour. Only a `selected` question (and the field while editing) takes the accent foreground colour.

## 0.3.0

### Minor Changes

- [#9](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/9) [`db43142`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/db4314275efe9be5428b446ea3f170b1ab5d3829) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - `InlineEdit` gets a second style for question text and clearer rules for long text. A short single-line label keeps the pencil and hugs its text; `multiline` (longer text) now hides the pencil and fills the full width. New `variant="question"`: full width, no pencil, square corners, and a bottom border on hover and focus. New `selected` keeps that bottom border while the owning question is selected. In the question variant Enter saves and Shift+Enter adds a line break. New `onDraftChange` reports the text on every keystroke.
  
  `QuestionHeader` (and so `QuestionEditorCard`) editor mode now edits the title with the question-variant `InlineEdit`: click the title to edit, Enter or blur saves, and the underline stays while the card is `active`. `onTitleChange` now fires when an edit is saved instead of on every keystroke; the character counter still updates live.

## 0.2.0

### Minor Changes

- [#7](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/7) [`d108153`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/d1081532e7a1342d5282bb6c6e0ecc0572a34000) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - Rename `RoleTag` to `Badge` (types: `primary`, `secondary`, `question`, `interactable`, plus new `id` and `count` types covering ID Badge and Count Badge). `RoleTag` and `RoleTagProps` are no longer exported — import `Badge` and `BadgeProps` instead.

- [#7](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/7) [`d108153`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/d1081532e7a1342d5282bb6c6e0ecc0572a34000) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - Add `InlineEdit`: text that becomes a field on click (Enter/blur saves, Escape cancels), with `multiline`, controlled and uncontrolled modes.

## 0.1.0

### Minor Changes

- [#3](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/3) [`2e17dfe`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/2e17dfe079f427e1360b9dabc8ce1cbf699c7745) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - Add the activity builder components from Figma (error rows use a destructive border and soft red hover fill, 14px labels): `QuestionEditorCard` (idle, hover and active authoring card for select one / multiple, ranking, rate and open end, with optional note strip), `QuestionNavItem` (question list row with selected, error and hover-drag states), `StatCard` and `ActivityStructure`. `QuestionHeader` editor mode gains `active` and `showCounter`.

- [#4](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/4) [`32eefca`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/32eefcad344f0880813c88febc7ef1ea693b6de9) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - Activity Structure now shows text sections (Research Goal, Target Audience) with removable tags in place of the settings button (`sections`, `onRemoveTag`, `onAddTag`; `onOpenSettings` removed). Question Editor Card moves the Ask AI sparkle button outside the card, revealed on hover/focus.

- [#2](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/2) [`c9295f2`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/c9295f273dcbc2c9315a575bcdf427bf8cca2e61) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - Add the AI chat components from Figma: `UserMessageBubble` (+ `FileAttachment`, `AskAiToggle`), `Timestamp` (message actions), `AIMiniAvatar` (idle / thinking / executing / working states), `AIResponseContainer` (+ `TopicCard`, `TopicActivityRow`) and `ChatInput` (+ `AskAiInput`, `ProjectSelector`, `ChatChoices` / `ChatOption`).

- [#2](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/2) [`c9295f2`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/c9295f273dcbc2c9315a575bcdf427bf8cca2e61) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - Add the overlay components from Figma, all on Radix primitives: `Dialog` (header / body / footer sections, scrim, close button), `DropdownMenu` (items with descriptions, destructive, selected check, submenus), `Tooltip` (simple, descriptive and rich content with an arrow) and `Toast` + `ToastInline` (info / success / warning / destructive). The Textarea now grows with its content.

- [#1](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/1) [`9906195`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/9906195d481c556940aca6eaedee719a0a6fb0ea) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - Align component colour pairings with Figma for WCAG AA: add the neutral `label` token (text on dark fills), primary/destructive hover tokens and documented dark-overlay tokens; fields use `surface-background`; Button/Form/Select re-paired; Tailwind theme now `inline` so dark mode reaches utilities.

- [#2](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/2) [`c9295f2`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/c9295f273dcbc2c9315a575bcdf427bf8cca2e61) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - Add the Question Types set from Figma: `QuestionCard`, `QuestionHeader` (default, error and editor modes), `QuestionOption` (radio / checkbox, `QuestionOtherOption`, `QuestionOptionEditor`), `OpenEndAnswer`, `RatingScale`, `RankList` (drag or arrow-key reordering), `FileUploadZone` / `FileUploadItem`, `ImagePreview`, `ImageThumbnails`, `VideoPlayer` and `QuestionTypeIcon`.

- [#2](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/2) [`c9295f2`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/c9295f273dcbc2c9315a575bcdf427bf8cca2e61) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - Add `Table` (`TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`, `TableCellTwoLines`) with sortable headers, selected / striped rows and checkbox, tag, two-line, actions, select and radio cell types, and `Pagination` (full and compact) with the `getPaginationItems` helper, per the Figma Tables, Table Header Row, Table Row, Table Column and Pagination frames.

- [#4](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/4) [`32eefca`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/32eefcad344f0880813c88febc7ef1ea693b6de9) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - Publish `@discuss-ds/tokens` and `@discuss-ds/ui` to npm as compiled packages (`dist` + `styles.css`) so other projects can install them.

- [#2](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/2) [`c9295f2`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/c9295f273dcbc2c9315a575bcdf427bf8cca2e61) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - Align Button, Tab Navigation/Tab Item, Progress and the Tag family with Figma. Button gains `subtle` (alias `secondary`) and `link` variants and `icon`/`icon-sm` sizes, and `md`/`sm` now match the 40px/32px specs. New: `TabNavigation`/`TabItem`/`Tabs` (Radix Tabs), `Progress`, `Tag`, `StatusTag`, `EditableTag`, `RoleTag`. `cn()` now teaches tailwind-merge the `text-ui-*` type styles and `bg-linear-to-*` so they are no longer dropped. Adds `@phosphor-icons/react`.

- [#2](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/2) [`c9295f2`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/c9295f273dcbc2c9315a575bcdf427bf8cca2e61) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - Align the form controls with Figma and add the missing ones. Restyled: Switch (44×24), Text Input and Textarea (label / helper / success / error via the new `Field`, or the `label`/`description`/`message`/`status` props), Search Bar (clear button, accent focus), Checkbox (indeterminate + `CheckboxField`), Radio Group (`RadioGroupFieldItem`), Slider (label, range and value bubble), Select (`icon`, accent open state) and Label. New: `Toggle`, `NumberInput`, `InputWithAction`, `Calendar`, `TimePicker`, `DateTimePicker`, `DatePicker`. `Input` no longer has a `size` prop (single 40px size per Figma). Adds `react-day-picker`.

- [#1](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/1) [`20b1530`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/20b1530d016280d5b20ff3a81d6b1f473749389d) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - Re-sync tokens with Figma: add dark mode, shadow scale (xs–2xl), radius xs/xxs, opacity steps, surface/accent-muted/input-accent tokens; card/popover, info, muted-foreground and soft variants updated to Figma values.

- [#1](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/1) [`48c5f8f`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/48c5f8f20fb4028097ba5dcdd1c0c2a48bec4a61) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - Add `sys-text-*` composite type-style tokens mirroring the Figma text styles, exposed as `text-heading-h1` … `text-ui-input-value` utilities.

### Patch Changes

- [#3](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/3) [`2e17dfe`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/2e17dfe079f427e1360b9dabc8ce1cbf699c7745) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - `FileUploadZone` now matches the Figma Upload_Zone: 143px minimum height, tighter spacing and a page-background fill on hover.
- Updated dependencies [[`9906195`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/9906195d481c556940aca6eaedee719a0a6fb0ea), [`32eefca`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/32eefcad344f0880813c88febc7ef1ea693b6de9), [`20b1530`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/20b1530d016280d5b20ff3a81d6b1f473749389d), [`48c5f8f`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/48c5f8f20fb4028097ba5dcdd1c0c2a48bec4a61)]:
  - @discuss-ds/tokens@0.1.0

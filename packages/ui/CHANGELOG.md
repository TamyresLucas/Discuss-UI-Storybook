# @discuss-ds/ui

## 0.14.0

### Minor Changes

- [#64](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/64) [`9232bf1`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/9232bf131ac2792412d943307d75a52a892d67b1) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - AIMiniAvatar: while the AI is busy (thinking, executing, working) the orchid mark now draws itself on from left to right, holds, clears and repeats, instead of pulsing. Nothing changes for callers; users who prefer reduced motion still see the static mark. Adds the `animate-ai-draw-on` utility.

## 0.13.0

### Minor Changes

- [#62](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/62) [`19d61b8`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/19d61b844cb1e3d8fb7c8e4c9ffebad3ad6fb823) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - `QuestionEditorCard` and `QuestionHeader` (editor mode): new optional `meta` prop shows content right beside the "Question N" tag, for example the time allowed for the question. No change unless `meta` is passed.

## 0.12.0

### Minor Changes

- [#60](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/60) [`503586f`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/503586f5c36ed1379939234e45a83ea4c4b5409a) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - `QuestionEditorCard`: new optional `error` prop shows a short inline message at the bottom of the card (warning icon, destructive foreground). `QuestionNavItem`'s error warning icon now uses the destructive foreground token (same colour, correct token).

## 0.11.0

### Minor Changes

- [#58](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/58) [`d73d2ac`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/d73d2ac0ef56d834871562c243edcf420ceef57a) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - `ActivityStructure`: the title now uses the section text style (`text-body-section`, semibold 16px) in the default foreground colour (`text-surface-foreground`) instead of the purple h3 heading style, and a new optional `action` prop shows a control (e.g. a Settings button) at the right of the title. Without `action` the layout is unchanged apart from the title text style.

## 0.10.1

### Patch Changes

- [#55](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/55) [`0e11633`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/0e116337894118c90dfe7924e72c7feee31fca69) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - The `screen-recording` question type now uses a duotone camera icon instead of the monitor-play glyph.

- [#57](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/57) [`610bc88`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/610bc888388654b2a5337d50072a08782b0680c2) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - The `screen-recording` question type now uses a duotone video camera icon.

## 0.10.0

### Minor Changes

- [#53](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/53) [`45ffca4`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/45ffca41d4dc75a71b27c37548f7207ba8543774) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - Add the `screen-recording` question type: `QuestionType` now includes `'screen-recording'`, and `QuestionTypeIcon` / `QuestionNavItem` render a monitor-play glyph for it. Additive; existing types are unchanged.

## 0.9.2

### Patch Changes

- [#51](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/51) [`6f9df5b`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/6f9df5bcb1f8e84d1b76efcc416744889928d86b) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - `StimulusCard`: the minimum height is now 98px (was 86px) and the thumbnail is at least 92px, per the updated Figma. A one-line caption with the character counter showing is exactly that tall, so the card no longer changes height between its default and selected states.

## 0.9.1

### Patch Changes

- [#49](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/49) [`1931730`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/19317303f60cfe751925bdb7e84747f8a68b78b3) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - `ImagePreview`: with an image, the preview area now hugs it (full width, the image's own height, at most 336px) instead of a fixed 336px area with bars above and below. The empty placeholder keeps the fixed height.

## 0.9.0

### Minor Changes

- [#47](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/47) [`d3b3a44`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/d3b3a442602a7c398972449ebb23db7229b92573) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - `StimulusCard`: follows the updated Figma for responsiveness. The card has a minimum height of 86px, the thumbnail is square and as tall as the text beside it (so it grows when the caption wraps onto more lines, from 80px up to 240px), and the text column is centred with 8px of vertical padding. New `maxLength` and `showCounter` props add the same live "n/2000 characters" counter the question text has, under an editable caption. A one-line caption looks the same as before. The thumbnail is sized from the measured text height because that is circular in plain CSS.

## 0.8.2

### Patch Changes

- [#45](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/45) [`9813016`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/98130163e4f7c0ea7ebd54a253a2bff60f975126) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - `StimulusCard`: with an editable caption the card is no longer about 10px taller than its content. The caption editor's own top and bottom padding is cancelled, so the card is as tall as the label plus the caption lines (never shorter than the 80px thumbnail).

## 0.8.1

### Patch Changes

- [#43](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/43) [`1f674dd`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/1f674ddc5f1d5d9cbcadb7bca561cb480cea74bf) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - `StimulusCard`: the editable caption now fills the width of the card, so its hover and focus underline spans the full line instead of only the text.

## 0.8.0

### Minor Changes

- [#41](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/41) [`b4d5774`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/b4d5774ec8d2a3acae16dd10ee977d204f11e3e7) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - New `StimulusCard` (Question Types): the image or video attached to a question, as it appears in the question card. An 80px thumbnail (image, custom icon, or a neutral placeholder), the "AI Moderator" label over a caption (what the moderator says about the stimulus), and a trash button. `onCaptionChange` makes the caption editable in place; `status="error"`, or a thumbnail that fails to load, shows the broken-image state. Additive; nothing existing changes.

## 0.7.1

### Patch Changes

- [#39](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/39) [`2bc5789`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/2bc5789c1a0b9d55686664ac93cc9a313fc5f6fb) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - `FileUploadItem`: the "Complete" / "Error" status tag now sits to the right of the file size on the second line instead of beside the file name, so a long name can use the full first line. No API change.

## 0.7.0

### Minor Changes

- [#37](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/37) [`2eae2f2`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/2eae2f2ec0cfe3d2a3ea9a8e6256158b69a0b9dd) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - `QuestionOptionEditor`: new `kind="rank"` (with a `rank` position prop) for ranking questions. The row keeps its drag handle and round position number at rest and, like the radio and checkbox kinds, becomes the editor on hover or keyboard focus (shadow lifts, remove and add buttons appear). Existing kinds and the always-on editor row are unchanged.

## 0.6.3

### Patch Changes

- [#35](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/35) [`323ace1`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/323ace193c8a545fb6b659ed7cd524bc953f2215) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - `QuestionEditorCard`: hovering anywhere on the card now gives the "Question N" tag its hover look (grip icon shown, tighter left padding), not only when the tag itself is hovered. `QuestionHeader` used on its own is unchanged.

## 0.6.2

### Patch Changes

- [#33](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/33) [`3c155e2`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/3c155e273ff0f7b46e99a682b0ea70a0cd03a3d8) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - `QuestionEditorCard`: the header actions (duplicate, delete, preview) now appear when you hover or focus anywhere on the card, not only when the header row is hovered. `QuestionHeader` used on its own is unchanged.

## 0.6.1

### Patch Changes

- [#31](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/31) [`4dc82b8`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/4dc82b890fb61f151efbb191793b733f45554913) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - `QuestionEditorCard`: the footer "Add choice" action is now an outline button with a plus icon and the visible label "Add choice" (it was an icon-only ghost button). Its accessible name and `onAdd` behaviour are unchanged; the paste button is untouched.

## 0.6.0

### Minor Changes

- [#29](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/29) [`1dd39c5`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/1dd39c577a5fa4b96effedd38f1eb5003529c544) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - `ActivityStructure` can now be a single-purpose widget: it renders `children` under its title, stats and sections, and no longer renders an empty stats grid when `stats` is empty. `<ActivityStructure title="Research Goal" stats={[]}>…</ActivityStructure>` has the same card, title style and colour as the full Activity Summary. Existing usage is unchanged.

## 0.5.0

### Minor Changes

- [#27](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/27) [`1a4ff8c`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/1a4ff8c0c8b485a7edaf27bd0d327a9005f902e7) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - `QuestionHeader` and `QuestionEditorCard` get an optional `dragHandleProps` that turns the "Question N" tag into a drag handle. It is spread onto the tag, so it accepts what a drag-and-drop library provides (`ref`, `role`, `tabIndex`, pointer and keyboard listeners, aria attributes). With it the tag shows a grab cursor, is keyboard focusable, shows the grip icon on focus and is labelled "Reorder question N". Without it nothing changes.
  
  `ActivityStructure`: the card corner radius is now 16px (was 24px) to match the question cards, and the title uses the primary foreground colour.

## 0.4.2

### Patch Changes

- [#25](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/25) [`457bb65`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/457bb65f54ca262e0338b0b271b5535926bb7b66) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - `ActivityStructure`: the summary card no longer has a border (it keeps its white surface and rounded corners).

## 0.4.1

### Patch Changes

- [#23](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/23) [`36eb4b6`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/36eb4b6aada7d998f5715cd1b9a79aa873365823) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - `QuestionOptionEditor` with `kind`: the row now keeps its normal border at rest (0.4.0 removed it). Hovering or focusing the row still swaps the indicator for the drag handle and reveals the remove and add buttons, and lifts the row with a shadow, but the border colour does not change. The row is the same width in every state.

## 0.4.0

### Minor Changes

- [#21](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/21) [`a7ebe02`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/a7ebe02f16a57fd1e40115e9a949484f23e1103a) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - `QuestionOptionEditor` gets an optional `kind` (`radio` | `checkbox`). With it the row is quiet at rest (no border, the radio or checkbox indicator in front of the label) and turns into the editor on hover or keyboard focus: border and shadow, the drag handle replaces the indicator, and the remove and add buttons appear. The buttons keep their space while hidden, so the row is the same width in every state. Without `kind` the row is the same always-on editor as before.

## 0.3.5

### Patch Changes

- [#19](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/19) [`1c64708`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/1c647085c1f97bce822f81975a7e5a100b6250e1) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - `QuestionOption` (radio and checkbox answer cards): hovering now changes only the fill and shadow. The border changes only when the option is selected (accent). `RadioGroupItem` is now 16px (was 20px, matching the checkbox) with a proportionally smaller centre dot.
  
  `ActivityStructure`: section text is rendered in a `div` instead of a `p`, so it can hold block-level content such as an `InlineEdit` without invalid HTML nesting.

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

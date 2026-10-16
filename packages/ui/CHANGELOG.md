# @discuss-ds/ui

## 0.31.0

### Minor Changes

- [#113](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/113) [`855ba30`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/855ba302c93837bb9f729222c3758260a8f60441) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - `QuestionHeader` and `QuestionEditorCard` take an optional `questionType`: the "Question N" tag then shows that question type's icon (16px) in its default and selected states. On hover or focus the drag grip replaces it, and a tag that can't be dragged (`showDragHandle={false}`) keeps the icon. Without `questionType` nothing changes.
  
  With a type icon the tag keeps the same width on hover: the grip replaces the icon in place instead of the tag trimming its left padding.
  
  `InlineEdit`, `QuestionHeader` (`titleMarks`) and `QuestionEditorCard` (`titleMarks`) also take optional ranges (`marks`) of the saved text to underline in the destructive colour, for example misspelled words found by a spell checker. Read mode only; without them nothing changes.
  
  `QuestionOptionEditor` takes the same `marks`, `onMarkApply` and `onMarkDismiss`: an answer option's label shows its marked words underlined (with the same card) while it is not being edited. Without them nothing changes.
  
  Smaller behaviour changes in the same release: a click inside a `QuestionEditorCard` but outside its text field (its padding, labels, empty space) no longer ends a title edit in progress, and the title field's line while it is being edited uses the same muted accent as the selected state, so there is no colour change between the two. A mark's card opens only when its own word is clicked: the mark that replaces a just-fixed one no longer opens by itself.

### Patch Changes

- [#112](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/112) [`a802249`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/a802249d19e520bd8dd1cc86fdeb8ab1c80d4db6) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - Fix the InlineEdit "Controlled" story calling a hook outside a component, so `pnpm lint` passes. Docs-only; no component change.

## 0.30.1

### Patch Changes

- [#109](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/109) [`09b0261`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/09b026152cd200df34744f7bd964352c17aa5d54) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - `QuestionEditorCard` / `QuestionHeader`: `titleRecommendedMax` now switches a long title to the 16px body style on its own; `titleRecommendedNote` is optional and only adds the text under it.

## 0.30.0

### Minor Changes

- [#107](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/107) [`43f364a`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/43f364a042167fd14b8cd4748e15829f81a90be8) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - `QuestionEditorCard` and `QuestionHeader` take `titleRecommendedMax` and `titleRecommendedNote`: a title longer than that many characters (counted live while typing) switches from the heading style to the regular 16px body style and shows the note under it. Opt-in; without the props nothing changes.

## 0.29.1

### Patch Changes

- [#104](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/104) [`1918d72`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/1918d72cab1c11e67c889abd7158e3b07aabe365) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - `QuestionOptionEditor`: the helper line shown while a guarded option is edited lines up with the option text instead of the drag grip.

- [#106](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/106) [`3b04f34`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/3b04f34cedb63b5ae41edefedb0ed13de28fc3b8) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - `QuestionOptionEditor`: the grip, indicator or number stays vertically centred with the option text in the default state.

## 0.29.0

### Minor Changes

- [#102](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/102) [`036f9fc`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/036f9fc0c1ed044ee9a1706f5869fb27bd2e3705) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - Guardrails for question and option text. `QuestionEditorCard` and `QuestionHeader` take `titleMinLength` (with `maxLength`): while the title is edited a line shows "N characters required" with the live count out of the maximum, a title that is too short is not saved, and the always-on counter gives way to that line. `QuestionOptionEditor` takes `minLength` and `maxLength` with the same behaviour (draft, helper line inside the option's box while editing, refusal, Escape to revert). The same line now reads "N characters required" in `InlineEdit`'s `showLimits` (it used to read "MIN–MAX characters"). `InlineEdit`, `QuestionHeader` (`titlePlaceholderTone`), `QuestionEditorCard` and `QuestionOptionEditor` (`placeholderTone`) can show their placeholder in the regular text colour. Apart from that wording, everything is opt-in: without the new props nothing changes.

## 0.28.0

### Minor Changes

- [#100](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/100) [`0fc18de`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/0fc18ded23abc77fedb0af83fe7a23fe55816e22) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - `QuestionEditorCard` and `QuestionHeader` take an optional `titlePlaceholder` (default unchanged: "Click to write the question text"), and `QuestionOptionEditor` takes an optional `placeholder` for its empty option text.

## 0.27.0

### Minor Changes

- [#98](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/98) [`9c29e17`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/9c29e17ecae358617451931fd003d6406c894c74) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - `QuestionOptionEditor` takes optional `removeDisabled` and `addDisabled` props that disable its trash and add (+) buttons, for example at a question's minimum or maximum number of options. Without them nothing changes.

## 0.26.0

### Minor Changes

- [#96](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/96) [`b7cb516`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/b7cb516418206054de5f26c4c10d2fb3e7e9edb5) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - `ToastInline` takes an optional `actions` slot (for example a ghost "Dismiss" and an outline "Fix" `Button size="sm"`) shown after the message, and a new quiet `variant="neutral"` (secondary background, standard border) for suggestions. Existing variants and the `onClose` button are unchanged.

## 0.25.0

### Minor Changes

- [#94](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/94) [`bc9d1fb`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/bc9d1fbe954c7bfbb419b46317f800ffcb1b8d13) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - `TabNavigation` / `TabItem`: in the `filter` and `toggle` variants the selected tab's background is now a single indicator that slides to the newly selected tab (200ms; it jumps with reduced motion), instead of each tab painting its own. The tabs themselves keep their size, hover and disabled looks; the `underline` variant is unchanged. A tab that overrides its own background with a class still does.

## 0.24.1

### Patch Changes

- [#92](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/92) [`6477868`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/6477868c4a29e522791868b1a91f637be6c6306e) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - `InlineEdit`: the read text now shows the text cursor on hover (it showed the default arrow), as editable text should. A disabled field keeps the not-allowed cursor.

## 0.24.0

### Minor Changes

- [#90](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/90) [`e939c7a`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/e939c7a960bbb9a18ef12cf1775004b63ccdc533) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - `StatCard`: new `success` (green) and `destructive` (red) variants next to `warning`, for stats that report a good or bad state, such as an issue count. Existing variants are unchanged.

## 0.23.0

### Minor Changes

- [#88](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/88) [`cfc8630`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/cfc86301c4dec947b5201d340e681292a4155dac) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - `QuestionNavItem` and `QuestionEditorCard`: new optional `hovered` prop that shows the hover look without the pointer (the nav row's soft fill and drag grip; the card's lift, revealed actions and grip), for mirroring a hover that happens elsewhere, such as over the same question's row or card. Off by default; nothing changes unless it is set.

## 0.22.0

### Minor Changes

- [#86](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/86) [`33207c1`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/33207c1d978d213ad8c430ecc70be4583996df24) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - `InlineEdit`: new optional `submitOnEnter` prop for `multiline` fields. Enter saves the edit (a refused edit stays open and focused with its message) and Shift+Enter inserts a line break; Cmd/Ctrl+Enter keeps saving. Off by default, so multiline fields behave as before unless it is set.

## 0.21.0

### Minor Changes

- [#84](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/84) [`da5c71d`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/da5c71d53726b8ba0f5836fadc8bb4f77dd18b47) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - `InlineEdit`: new optional `showLimits` prop. While editing it shows the allowed length under the field (for example "150–500 characters", from `minLength` and `maxLength`) with a live character counter. After a refused save that same line turns into the error state (error colour and icon). Off by default, so nothing changes unless it is set.

## 0.20.0

### Minor Changes

- [#82](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/82) [`3a419e5`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/3a419e592a9831322bd08df205a9edb01156d61c) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - `InlineEdit`: new optional `minLength` and `validate` props. An edit that is too short, or that `validate` rejects (by returning a message), is not saved on Enter or blur: the field stays open with an error border and message, `onValueChange` is not called, and the message follows what is typed. Escape still reverts. Without the props nothing changes.

## 0.19.1

### Patch Changes

- [#80](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/80) [`d84a221`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/d84a221292b9b197c2eaf8d3ee671ed1896866f8) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - `ChatInput`: the send button is now round (it was a rounded square), matching the Figma chat input.

## 0.19.0

### Minor Changes

- [#78](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/78) [`0357b54`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/0357b54c812a044c0b7ad6f6aafa53ff4fdf7922) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - New `input-muted` colour token (`--sys-color-input-muted`, Tailwind `border-input-muted`): `plum-muted-300` in light mode and `plum-muted-500` in dark mode. It is now the border of every input field: input, textarea, select, date and time pickers, search, inline edit, the option editor row and the outline button's hover and disabled border. The `input` token (Figma `foreground-input`) stays `plum-muted-500` in light mode and is now `plum-muted-600` in dark mode, and is only used by checkbox and radio controls. Input field borders are visibly lighter than before; the `input` token keeps its name and its light value, so checkbox and radio are unchanged in light mode.

### Patch Changes

- Updated dependencies [[`0357b54`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/0357b54c812a044c0b7ad6f6aafa53ff4fdf7922)]:
  - @discuss-ds/tokens@0.2.0

## 0.18.1

### Patch Changes

- [#76](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/76) [`3e6596f`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/3e6596fecafadb0ca314c6a3e2ea51a146f0c5c1) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - StatCard `subtle` variant: the tint is now the secondary background colour (it was the page background, which is too faint on a white panel).

## 0.18.0

### Minor Changes

- [#74](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/74) [`ec31a44`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/ec31a44c4d73c781817c9481837ebed319f07de3) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - TabNavigation and TabItem: new `underline` variant for a page-level tab bar (the active tab is semibold with a 2px accent underline). StatCard: new `subtle` variant, a tinted card with no border for stats on a white panel. Nothing changes for existing callers.

## 0.17.0

### Minor Changes

- [#72](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/72) [`8956850`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/89568503fd76b323d9af660ed59ad1b41f9b3fd1) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - QuestionHeader, QuestionEditorCard and QuestionNavItem: new optional `showDragHandle` prop (default true). Set it to false when the question or row can't be moved, so the grip icon is not shown on hover and the tag or row doesn't shift to make room for it. Nothing changes for existing callers.

## 0.16.0

### Minor Changes

- [#70](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/70) [`d0d0a23`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/d0d0a23de66894ce7d569f13c5129faad72e83d9) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - QuestionOptionEditor: new optional `locked` prop keeps the label editable but removes the drag grip and the remove and add buttons, for editing a translation of options that are shared with the original. Nothing changes for existing callers.

## 0.15.0

### Minor Changes

- [#68](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/68) [`0c09dcf`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/0c09dcf4cf733c71cefabd61a37e704fb59599b8) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - QuestionOptionEditor: new optional `dragHandleProps` makes the row's grip a drag handle for reordering options (grab cursor, focusable, labelled "Reorder option N"), and a new optional `lifted` prop gives the copy that follows the pointer its lifted look (shadow, grip showing). Nothing changes for existing callers: without the props the grip stays decorative.

## 0.14.1

### Patch Changes

- [#66](https://github.com/TamyresLucas/Discuss-UI-Storybook/pull/66) [`ababa73`](https://github.com/TamyresLucas/Discuss-UI-Storybook/commit/ababa73f18dd671ed95f2f93f7e53e4354310ded) Thanks [@TamyresLucas](https://github.com/TamyresLucas)! - AIMiniAvatar: the busy animation now draws the mark along its own curve (from its first end through its loops to the last), holds, then clears the same way, instead of wiping it in from the left. Nothing changes for callers; reduced-motion users still see the still mark.

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

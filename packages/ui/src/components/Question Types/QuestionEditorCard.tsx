import * as React from "react";
import {
  Clipboard,
  Copy,
  Eye,
  Plus,
  Sparkle,
  Trash,
  Warning,
} from "@phosphor-icons/react";

import { cn } from "../../lib/utils";
import { Button } from "../Buttons & Actions/Button";
import { QuestionHeader } from "./QuestionHeader";
import type { QuestionType } from "./QuestionTypeIcon";

export interface QuestionEditorCardProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title" | "onChange"
> {
  /** Question number shown in the drag-handle tag. */
  number: number;
  title: string;
  onTitleChange?: (title: string) => void;
  /** Shown while the title is empty. Defaults to "Click to write the question text". */
  titlePlaceholder?: string;
  /** `regular` shows the title placeholder in the normal text colour instead of the muted one. Default `muted`. */
  titlePlaceholderTone?: 'muted' | 'regular';
  /** Shortest title (in characters) that may be saved. Turns on the title guardrail: see `QuestionHeader`'s `titleMinLength`. */
  titleMinLength?: number;
  /** A title longer than this many characters switches to the regular 16px body style, and shows `titleRecommendedNote` under it when given. See `QuestionHeader`. */
  titleRecommendedMax?: number;
  /** Optional text shown under a title that is longer than `titleRecommendedMax`; leave it out to change only the style. */
  titleRecommendedNote?: React.ReactNode;
  /** The question is being edited: accent border, counter and footer are shown. */
  active?: boolean;
  /**
   * Shows the hover look (lifted card, revealed actions and grip) without the pointer, for mirroring a hover that happens
   * elsewhere, such as over the same question's row in an outline.
   */
  hovered?: boolean;
  maxLength?: number;
  /** Footer label, e.g. "4/20 choices". Shown while `active`. */
  countLabel?: React.ReactNode;
  /** Header actions. Defaults to copy, delete and preview buttons wired to the `on*` callbacks. */
  actions?: React.ReactNode;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onPreview?: () => void;
  /** Sparkle button beside the card, revealed on hover, focus or while `active`. Omit to hide it. */
  onAskAi?: () => void;
  /** Footer: adds an answer choice. Omit (with `onPaste`) to hide the footer buttons. */
  onAdd?: () => void;
  /** Footer: opens paste-many-choices. */
  onPaste?: () => void;
  /** Inline error shown at the bottom of the card, e.g. "Not available in Self-Paced". Keep it as short as possible. */
  error?: React.ReactNode;
  /** Content right beside the "Question N" tag, e.g. the time allowed for the question. */
  meta?: React.ReactNode;
  /** Optional strip under the card body, e.g. an "Inferred" assumption note. */
  note?: React.ReactNode;
  /** Makes the "Question N" tag a drag handle for reordering. See `QuestionHeader`'s `dragHandleProps`. */
  dragHandleProps?: React.ComponentPropsWithRef<'span'>;
  /** Whether the grip icon shows in the "Question N" tag on hover. Defaults to true; set false when the card can't be moved. See `QuestionHeader`. */
  showDragHandle?: boolean;
  /** The question's type, shown as an icon in the "Question N" tag in its default and selected states (the grip replaces it on hover). See `QuestionHeader`. */
  questionType?: QuestionType;
}

// Figma: Question editor (351:5944) — the authoring card for every question type. Idle is a flat bordered card, hover
// lifts it and reveals the header actions, active takes the accent border and adds the counter and footer.
export const QuestionEditorCard = React.forwardRef<
  HTMLDivElement,
  QuestionEditorCardProps
>(
  (
    {
      className,
      number,
      title,
      onTitleChange,
      titlePlaceholder,
      titlePlaceholderTone,
      titleMinLength,
      titleRecommendedMax,
      titleRecommendedNote,
      active,
      hovered,
      maxLength,
      countLabel,
      actions,
      onDuplicate,
      onDelete,
      onPreview,
      onAskAi,
      onAdd,
      onPaste,
      note,
      error,
      meta,
      dragHandleProps,
      showDragHandle,
      questionType,
      children,
      ...props
    },
    ref,
  ) => {
    const footer = active && (countLabel != null || onAdd || onPaste);
    return (
      <div
        ref={ref}
        className={cn("group/editor flex w-full items-start gap-2", className)}
        data-hovered={hovered ? "" : undefined}
        {...props}
      >
        <div
          className={cn(
            "flex w-full max-w-200 flex-col overflow-hidden rounded-xl border bg-surface transition-shadow group-hover/editor:shadow-lg group-focus-within/editor:shadow-lg group-data-[hovered]/editor:shadow-lg",
            active ? "border-accent" : "border-border",
          )}
        >
          <div className={cn("flex flex-col p-6", footer ? "gap-5" : "gap-4")}>
            <div className="flex flex-col gap-4">
              <QuestionHeader
                editor
                number={number}
                title={title}
                onTitleChange={onTitleChange}
                titlePlaceholder={titlePlaceholder}
                titlePlaceholderTone={titlePlaceholderTone}
                titleMinLength={titleMinLength}
                titleRecommendedMax={titleRecommendedMax}
                titleRecommendedNote={titleRecommendedNote}
                active={active}
                showCounter={!!active}
                dragHandleProps={dragHandleProps}
                showDragHandle={showDragHandle}
                questionType={questionType}
                meta={meta}
                maxLength={maxLength}
                actions={
                  actions ?? (
                    <>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Duplicate question"
                        onClick={onDuplicate}
                      >
                        <Copy size={16} aria-hidden />
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon-sm"
                        aria-label="Delete question"
                        onClick={onDelete}
                      >
                        <Trash size={16} aria-hidden />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Preview question"
                        onClick={onPreview}
                      >
                        <Eye size={16} aria-hidden />
                      </Button>
                    </>
                  )
                }
              />
              {children}
            </div>
            {error && (
              <p className="flex items-center gap-1 text-ui-caption text-destructive-foreground">
                <Warning size={16} aria-hidden className="shrink-0" />
                {error}
              </p>
            )}
            {footer && (
              <div className="flex items-center justify-between">
                <p className="text-ui-caption text-secondary-muted-foreground">
                  {countLabel}
                </p>
                <div className="flex items-center gap-2">
                  {onAdd && (
                    <Button type="button" variant="outline" onClick={onAdd}>
                      <Plus size={16} aria-hidden />
                      Add choice
                    </Button>
                  )}
                  {onPaste && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Paste choices"
                      onClick={onPaste}
                    >
                      <Clipboard size={16} aria-hidden />
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
          {note && (
            <div className="border-t border-border px-2 py-2 text-body-small text-surface-foreground">
              {note}
            </div>
          )}
        </div>
        {onAskAi && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Ask AI"
            onClick={onAskAi}
            className="shrink-0 opacity-0 transition-opacity group-hover/editor:opacity-100 group-focus-within/editor:opacity-100 group-data-[hovered]/editor:opacity-100 focus-visible:opacity-100"
          >
            <Sparkle size={16} aria-hidden />
          </Button>
        )}
      </div>
    );
  },
);
QuestionEditorCard.displayName = "QuestionEditorCard";

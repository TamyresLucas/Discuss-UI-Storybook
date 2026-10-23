import * as React from 'react';
import { Trash } from '@phosphor-icons/react';
import { Popover as PopoverPrimitive } from 'radix-ui';

import { cn } from '../../lib/utils';
import { Button } from '../Buttons & Actions/Button';

// Internal: the underlined, clickable words shared by the text fields that can mark them (InlineEdit, QuestionOptionEditor). Only `InlineEditMark` is public.

export interface InlineEditMark {
  start: number;
  end: number;
  /** Corrections offered in the mark's card, best first (at most three are shown). Used with `onMarkApply`: with one the card has an Apply button; with several each is a choice applied by a click on it and there is no Apply button. An empty string offers to remove the marked text (the button reads "Remove"). */
  suggestions?: string[];
  /** The colour of the underline: `destructive` (default, for mistakes such as typos) or `warning` (for a recommendation, such as wording that could be clearer). */
  tone?: 'destructive' | 'warning';
  /** Why the words are marked, shown in the mark's card above the suggestions. Without it the card is unchanged. */
  message?: string;
}

/** The text split into plain and marked pieces; marks that don't fit the text are dropped. */
export function splitMarks(text: string, marks: InlineEditMark[] | undefined): { text: string; mark?: InlineEditMark }[] {
  const valid = (marks ?? []).filter((m) => Number.isInteger(m.start) && Number.isInteger(m.end) && m.start >= 0 && m.end > m.start && m.end <= text.length).sort((a, b) => a.start - b.start);
  const out: { text: string; mark?: InlineEditMark }[] = [];
  let at = 0;
  for (const m of valid) {
    if (m.start < at) continue;
    if (m.start > at) out.push({ text: text.slice(at, m.start) });
    out.push({ text: text.slice(m.start, m.end), mark: m });
    at = m.end;
  }
  if (at < text.length) out.push({ text: text.slice(at) });
  return out;
}

// A solid line under the word, destructive or warning (a warning mark also has the warning highlight behind the words). Its padding is measured (see `useMarkAlignment`) so the line sits on the field's own bottom edge.
const markClasses = (tone: InlineEditMark['tone']) => cn('rounded-xxs border-b-2', tone === 'warning' ? 'border-warning-foreground bg-warning-background-highlight' : 'border-destructive-foreground');

/**
 * Pads a mark so its background and line line up with the read-mode button. On a single line the mark fills the button's full height, and its
 * bottom edge lands exactly on the button's bottom edge, where the field's own hover and selected underline is drawn (so the mark's line covers it
 * instead of showing a second one). On a wrapped title it only fills its own line, so it never covers the lines around it. The right padding
 * depends on the font and line height, so it is measured.
 */
function useMarkAlignment(ref: React.RefObject<HTMLSpanElement | null>, text: string) {
  const [padding, setPadding] = React.useState({ top: 0, bottom: 0 });
  React.useLayoutEffect(() => {
    const mark = ref.current;
    const button = mark?.closest('button');
    if (!mark || !button) return;
    const align = () => {
      const m = mark.getBoundingClientRect();
      const b = button.getBoundingClientRect();
      const markStyle = getComputedStyle(mark);
      const buttonStyle = getComputedStyle(button);
      const border = parseFloat(markStyle.borderBottomWidth);
      // The mark's own text area, without the padding added here.
      const baseTop = m.top + parseFloat(markStyle.paddingTop);
      const baseBottom = m.bottom - parseFloat(markStyle.paddingBottom) - border;
      const contentTop = b.top + parseFloat(buttonStyle.borderTopWidth) + parseFloat(buttonStyle.paddingTop);
      const contentBottom = b.bottom - parseFloat(buttonStyle.borderBottomWidth) - parseFloat(buttonStyle.paddingBottom);
      const lineHeight = parseFloat(buttonStyle.lineHeight) || contentBottom - contentTop;
      const lines = Math.max(1, Math.round((contentBottom - contentTop) / lineHeight));
      const lineIndex = Math.min(lines - 1, Math.max(0, Math.floor(((baseTop + baseBottom) / 2 - contentTop) / lineHeight)));
      const targetTop = lineIndex === 0 ? b.top : contentTop + lineIndex * lineHeight;
      const targetBottom = lineIndex === lines - 1 ? b.bottom : contentTop + (lineIndex + 1) * lineHeight;
      const next = { top: Math.max(0, baseTop - targetTop), bottom: Math.max(0, targetBottom - baseBottom - border) };
      setPadding((p) => (Math.abs(p.top - next.top) < 0.5 && Math.abs(p.bottom - next.bottom) < 0.5 ? p : next));
    };
    align();
    const observer = new ResizeObserver(align);
    observer.observe(button);
    return () => observer.disconnect();
  }, [ref, text]);
  return padding;
}

/**
 * The marks of the saved text carried over to the text being edited, so the underlines stay while the field is open: the part before the edit keeps its marks,
 * the part after it keeps them moved by the change in length, and a mark the edit touches is dropped (those words are being rewritten).
 */
export function remapMarks(saved: string, draft: string, marks: InlineEditMark[] | undefined): InlineEditMark[] {
  if (!marks?.length) return [];
  if (saved === draft) return marks;
  const max = Math.min(saved.length, draft.length);
  let before = 0;
  while (before < max && saved[before] === draft[before]) before += 1;
  let after = 0;
  while (after < max - before && saved[saved.length - 1 - after] === draft[draft.length - 1 - after]) after += 1;
  const editEnd = saved.length - after;
  const delta = draft.length - saved.length;
  return marks.flatMap((m) => (m.end <= before ? [m] : m.start >= editEnd ? [{ ...m, start: m.start + delta, end: m.end + delta }] : []));
}

/**
 * The underlines (and, for a warning mark, the highlight) of a field's marks drawn BEHIND a field while it is being edited: the same text with invisible
 * letters, so each line lands under its words, and the field's own letters and text selection are painted over it (so the selection shows on top of the highlight).
 * The field must be transparent and positioned after it. It never takes a click (the field does), and it follows the field's horizontal scroll.
 * `className` must give it the field's own box and type.
 */
export function DraftMarks({ text, marks, className, scrollLeft = 0 }: { text: string; marks: InlineEditMark[]; className?: string; scrollLeft?: number }) {
  const ref = React.useRef<HTMLDivElement>(null);
  // A marked piece is only as tall as its letters; the highlight is stretched to the whole line, as it is when the field is not edited.
  const [pad, setPad] = React.useState(0);
  React.useLayoutEffect(() => {
    const root = ref.current;
    const first = root?.querySelector('[data-draft-mark]')?.getClientRects()[0];
    if (!root || !first) return;
    const lineHeight = parseFloat(getComputedStyle(root).lineHeight);
    const next = Number.isFinite(lineHeight) ? Math.max(0, (lineHeight - first.height) / 2) : 0;
    setPad((p) => (Math.abs(p - next) < 0.5 ? p : next));
  }, [text, marks]);
  React.useLayoutEffect(() => {
    if (ref.current) ref.current.scrollLeft = scrollLeft;
  }, [scrollLeft, text]);
  return (
    <div ref={ref} aria-hidden data-draft-marks className={cn(className, 'pointer-events-none absolute inset-0 overflow-hidden text-transparent')}>
      {splitMarks(text, marks).map((piece, i) =>
        piece.mark ? (
          <span
            key={i}
            data-draft-mark
            style={{ paddingTop: pad, paddingBottom: pad }}
            className={cn('rounded-xxs border-b-2', piece.mark.tone === 'warning' ? 'border-warning-foreground bg-warning-background-highlight' : 'border-destructive-foreground')}
          >
            {piece.text}
          </span>
        ) : (
          <span key={i}>{piece.text}</span>
        ),
      )}
    </div>
  );
}

/** The card that is open right now, anywhere on the page: opening another one closes it, so only one is ever open. */
let closeOpenMarkCard: (() => void) | null = null;

/** A marked piece of text. Plain underline, or, when the owner handles marks, a button that opens a card to apply a suggestion or dismiss the mark. */
export function MarkedText({ mark, text, onApply, onDismiss }: { mark: InlineEditMark; text: string; onApply?: (mark: InlineEditMark, replacement: string) => void; onDismiss?: (mark: InlineEditMark) => void }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [open, setOpen] = React.useState(false);
  const close = React.useCallback(() => setOpen(false), []);
  React.useEffect(
    () => () => {
      if (closeOpenMarkCard === close) closeOpenMarkCard = null;
    },
    [close],
  );
  const padding = useMarkAlignment(ref, text);
  const style = { paddingTop: padding.top, paddingBottom: padding.bottom };
  if (!onApply && !onDismiss) {
    return (
      <span ref={ref} data-mark className={markClasses(mark.tone)} style={style}>
        {text}
      </span>
    );
  }
  const suggestions = (mark.suggestions ?? []).slice(0, 3);
  const warning = mark.tone === 'warning';
  // The struck-through words are the destructive color for every tone: they are what would be replaced.
  const struck = 'text-destructive-foreground';
  const handleOpenChange = (next: boolean) => {
    if (next) {
      if (closeOpenMarkCard && closeOpenMarkCard !== close) closeOpenMarkCard();
      closeOpenMarkCard = close;
    } else if (closeOpenMarkCard === close) {
      closeOpenMarkCard = null;
    }
    setOpen(next);
  };
  // The mark sits inside the read-mode button, so clicks and keys here must not also start the edit.
  const stop = (event: React.SyntheticEvent) => event.stopPropagation();
  return (
    <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <PopoverPrimitive.Trigger asChild>
        <span ref={ref} data-mark role="button" tabIndex={-1} onClick={stop} style={style} className={cn(markClasses(mark.tone), 'cursor-pointer', warning ? '' : 'hover:bg-destructive-soft')}>
          {text}
        </span>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={8}
          style={{ zIndex: 'var(--sys-z-40)' }}
          onClick={stop}
          onKeyDown={stop}
          // The mark is not focusable, and focus jumping back to it would make a card opened next think focus left it.
          onCloseAutoFocus={(event) => event.preventDefault()}
          className="flex w-72 flex-col gap-3 rounded-md border border-border bg-surface p-4 text-left text-body-base font-normal shadow-md outline-none"
        >
          {suggestions.length > 1 && onApply ? (
            // Several possible fixes: each one is a choice, applied with a click, so there is no Apply button.
            <div className="flex flex-col gap-1" role="group" aria-label="Choose a correction">
              {suggestions.map((suggestion) => (
                <Button key={suggestion} type="button" size="sm" variant="ghost" className="h-auto justify-start px-2 py-1 whitespace-normal" onClick={() => onApply(mark, suggestion)}>
                  <s className={struck}>{text}</s> <span className="font-semibold text-accent-foreground">{suggestion === '' ? 'Remove' : suggestion}</span>
                </Button>
              ))}
            </div>
          ) : (
            suggestions.length > 0 && (
              <p className="min-w-0 break-words">
                <s className={struck}>{text}</s>
                {suggestions[0] !== '' && (
                  <>
                    {' '}
                    <span className="font-semibold text-accent-foreground">{suggestions[0]}</span>
                  </>
                )}
              </p>
            )
          )}
          {/* The rationale comes after the correction it explains, and before the buttons. */}
          {mark.message && <p className="min-w-0 break-words text-body-small text-surface-foreground">{mark.message}</p>}
          <div className={cn('flex items-center gap-3', warning ? 'justify-end' : 'justify-between')}>
            {onDismiss ? (
              <Button type="button" size="sm" variant="ghost" onClick={() => onDismiss(mark)}>
                <Trash size={16} aria-hidden /> Dismiss
              </Button>
            ) : (
              <span />
            )}
            {onApply && suggestions.length === 1 && (
              <Button type="button" size="sm" onClick={() => onApply(mark, suggestions[0])}>
                {suggestions[0] === '' ? 'Remove' : 'Apply'}
              </Button>
            )}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}


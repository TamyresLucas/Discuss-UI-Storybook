import * as React from 'react';
import { Trash } from '@phosphor-icons/react';
import { Popover as PopoverPrimitive } from 'radix-ui';

import { cn } from '../../lib/utils';
import { Button } from '../Buttons & Actions/Button';

// Internal: the underlined, clickable words shared by the text fields that can mark them (InlineEdit, QuestionOptionEditor). Only `InlineEditMark` is public.

export interface InlineEditMark {
  start: number;
  end: number;
  /** Corrections offered in the mark's card, best first (at most three are shown). Used with `onMarkApply`: the first one is applied by the card's Apply button, the others by a click on them. An empty string offers to remove the marked text (the button reads "Remove"). */
  suggestions?: string[];
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

// A solid destructive line under the word. Its padding is measured (see `useMarkAlignment`) so the line sits on the field's own bottom edge.
const markClasses = 'rounded-xxs border-b-2 border-destructive-foreground';

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
      <span ref={ref} data-mark className={markClasses} style={style}>
        {text}
      </span>
    );
  }
  const suggestions = (mark.suggestions ?? []).slice(0, 3);
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
        <span ref={ref} data-mark role="button" tabIndex={-1} onClick={stop} style={style} className={cn(markClasses, 'cursor-pointer hover:bg-destructive-soft')}>
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
          {suggestions.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="min-w-0 break-words">
                <s className="text-destructive-foreground">{text}</s>
                {suggestions[0] !== '' && (
                  <>
                    {' '}
                    <span className="font-semibold text-accent-foreground">{suggestions[0]}</span>
                  </>
                )}
              </p>
              {/* Other ways to fix it, each applied with one click. */}
              {onApply &&
                suggestions.slice(1).map((suggestion) => (
                  <Button key={suggestion} type="button" size="sm" variant="ghost" className="h-auto justify-start py-1 whitespace-normal" onClick={() => onApply(mark, suggestion)}>
                    <s className="text-destructive-foreground">{text}</s> <span className="font-semibold text-accent-foreground">{suggestion === '' ? 'Remove' : suggestion}</span>
                  </Button>
                ))}
            </div>
          )}
          <div className="flex items-center justify-between gap-3">
            {onDismiss ? (
              <Button type="button" size="sm" variant="ghost" onClick={() => onDismiss(mark)}>
                <Trash size={16} aria-hidden /> Dismiss
              </Button>
            ) : (
              <span />
            )}
            {onApply && suggestions.length > 0 && (
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


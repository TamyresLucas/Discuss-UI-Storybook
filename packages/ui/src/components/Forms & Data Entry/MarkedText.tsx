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

// The line under a marked word is destructive or warning (a warning mark also has the warning highlight behind the words). It is not drawn by the word's own box
// but by one box per line of the word (`MarkLines`), so on a title that wraps every line reaches the field's edges the same way.
const lineClasses = (tone: InlineEditMark['tone'], hovered: boolean) =>
  cn('pointer-events-none absolute -z-10 rounded-xxs border-b-2', tone === 'warning' ? 'border-warning-foreground bg-warning-background-highlight' : cn('border-destructive-foreground', hovered && 'bg-destructive-soft'));

interface MarkLine {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface FieldBox {
  top: number;
  bottom: number;
  /** The text area inside the field's border and padding. */
  contentTop: number;
  contentBottom: number;
  lineHeight: number;
}

/**
 * The box of each line of a marked word, relative to `origin`. Each one is the line's own height, except that the first line reaches the field's top edge and the last
 * line the field's bottom edge: its line then lands exactly on the field's own bottom border (the field's hover and selected underline), covering it instead of showing a
 * second one a few pixels above. `rects` are the word's pieces, one per line. Without a field, each piece is its own box.
 */
export function markLines(rects: { left: number; top: number; width: number; height: number }[], origin: { left: number; top: number }, field?: FieldBox): MarkLine[] {
  const count = field ? Math.max(1, Math.round((field.contentBottom - field.contentTop) / field.lineHeight)) : 1;
  const boxes = rects
    .filter((r) => r.width > 0)
    .map((r) => {
      if (!field) return { left: r.left - origin.left, top: r.top - origin.top, width: r.width, height: r.height };
      const index = Math.min(count - 1, Math.max(0, Math.floor((r.top + r.height / 2 - field.contentTop) / field.lineHeight)));
      const top = index === 0 ? field.top : field.contentTop + index * field.lineHeight;
      const bottom = index === count - 1 ? field.bottom : field.contentTop + (index + 1) * field.lineHeight;
      return { left: r.left - origin.left, top: top - origin.top, width: r.width, height: bottom - top };
    });
  // A line can come in several pieces (the space where the text wraps is one): they make one box.
  return boxes.reduce<MarkLine[]>((out, box) => {
    const same = field ? out.find((o) => Math.abs(o.top - box.top) < 0.5 && Math.abs(o.height - box.height) < 0.5) : undefined;
    if (!same) return [...out, box];
    const left = Math.min(same.left, box.left);
    const right = Math.max(same.left + same.width, box.left + box.width);
    return out.map((o) => (o === same ? { ...o, left, width: right - left } : o));
  }, []);
}

const sameLines = (a: MarkLine[], b: MarkLine[]) => a.length === b.length && a.every((l, i) => (Object.keys(l) as (keyof MarkLine)[]).every((k) => Math.abs(l[k] - b[i][k]) < 0.5));

/** Measures the lines of a marked word after every render (a word can move when the text before it changes) and when the field changes size. */
function useMarkLines(anchorRef: React.RefObject<HTMLSpanElement | null>, markRef: React.RefObject<HTMLSpanElement | null>) {
  const [lines, setLines] = React.useState<MarkLine[]>([]);
  const measure = React.useCallback(() => {
    const anchor = anchorRef.current;
    const mark = markRef.current;
    if (!anchor || !mark) return;
    const button = mark.closest('button');
    const a = anchor.getBoundingClientRect();
    let field: FieldBox | undefined;
    if (button) {
      const b = button.getBoundingClientRect();
      const style = getComputedStyle(button);
      const contentTop = b.top + (parseFloat(style.borderTopWidth) || 0) + (parseFloat(style.paddingTop) || 0);
      const contentBottom = b.bottom - (parseFloat(style.borderBottomWidth) || 0) - (parseFloat(style.paddingBottom) || 0);
      field = { top: b.top, bottom: b.bottom, contentTop, contentBottom, lineHeight: parseFloat(style.lineHeight) || contentBottom - contentTop };
    }
    const next = markLines([...mark.getClientRects()], a, field);
    setLines((prev) => (sameLines(prev, next) ? prev : next));
  }, [anchorRef, markRef]);
  React.useLayoutEffect(measure);
  React.useLayoutEffect(() => {
    const button = markRef.current?.closest('button');
    if (!button) return;
    const observer = new ResizeObserver(measure);
    observer.observe(button);
    return () => observer.disconnect();
  }, [markRef, measure]);
  return lines;
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
 * The highlight and the underline of a field's marks while the field is being edited, drawn in two layers so the field looks as it does when it is not edited:
 * the same box per line of the marked words (see `markLines`), the first line reaching the field's top and the last line's underline landing on its bottom border.
 * - `behind` goes before the field and draws the highlight; the field is transparent and painted over it, so its letters and the browser's text selection show over the highlight.
 * - `over` goes after the field and draws the underlines, so the last line's underline covers the field's own bottom border.
 * Both hold the same text with invisible letters, to know where each line of the words is and follow the field's horizontal scroll. They never take a click (the field does).
 * `className` must give the text the field's own padding, border and type; `singleLine` is for a field whose text never wraps.
 */
export function DraftMarks({ text, marks, layer, className, scrollLeft = 0, singleLine }: { text: string; marks: InlineEditMark[]; layer: 'behind' | 'over'; className?: string; scrollLeft?: number; singleLine?: boolean }) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const textRef = React.useRef<HTMLDivElement>(null);
  const [boxes, setBoxes] = React.useState<{ tone: string; box: MarkLine }[]>([]);
  React.useLayoutEffect(() => {
    if (textRef.current) textRef.current.scrollLeft = scrollLeft;
  }, [scrollLeft, text]);
  // The boxes follow the text after every render, and are only replaced when they moved.
  React.useLayoutEffect(() => {
    const root = rootRef.current;
    const mirror = textRef.current;
    if (!root || !mirror) return;
    const r = root.getBoundingClientRect();
    const style = getComputedStyle(mirror);
    const contentTop = r.top + (parseFloat(style.borderTopWidth) || 0) + (parseFloat(style.paddingTop) || 0);
    const contentBottom = r.bottom - (parseFloat(style.borderBottomWidth) || 0) - (parseFloat(style.paddingBottom) || 0);
    const lineHeight = singleLine ? contentBottom - contentTop : parseFloat(style.lineHeight) || contentBottom - contentTop;
    const field: FieldBox = { top: r.top, bottom: r.bottom, contentTop, contentBottom, lineHeight };
    const next = [...mirror.querySelectorAll<HTMLElement>('[data-draft-mark]')].flatMap((el) =>
      markLines([...el.getClientRects()], { left: r.left, top: r.top }, field).map((box) => ({ tone: el.dataset.tone ?? 'destructive', box })),
    );
    setBoxes((prev) => (prev.length === next.length && prev.every((p, i) => p.tone === next[i].tone && sameLines([p.box], [next[i].box])) ? prev : next));
  });
  return (
    <div ref={rootRef} aria-hidden data-draft-marks data-layer={layer} className="pointer-events-none absolute inset-0">
      <div ref={textRef} className={cn(className, 'absolute inset-0 overflow-hidden text-transparent')}>
        {splitMarks(text, marks).map((piece, i) =>
          piece.mark ? (
            <span key={i} data-draft-mark data-tone={piece.mark.tone ?? 'destructive'}>
              {piece.text}
            </span>
          ) : (
            <span key={i}>{piece.text}</span>
          ),
        )}
      </div>
      {/* The boxes may reach a little past the field's edges (the last underline covers its border), but not sideways. */}
      <div className="absolute inset-0" style={{ clipPath: 'inset(-4px 0)' }}>
        {boxes.map(({ tone, box }, i) =>
          layer === 'behind' ? (
            tone === 'warning' && <span key={i} data-draft-box className="absolute rounded-xxs bg-warning-background-highlight" style={box} />
          ) : (
            <span key={i} data-draft-box className={cn('absolute rounded-xxs border-b-2', tone === 'warning' ? 'border-warning-foreground' : 'border-destructive-foreground')} style={box} />
          ),
        )}
      </div>
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
  const anchorRef = React.useRef<HTMLSpanElement>(null);
  const [hovered, setHovered] = React.useState(false);
  const lines = useMarkLines(anchorRef, ref);
  // An empty, positioned anchor just before the word holds one box per line of it; the word comes after it and is positioned too, so its letters are painted over them.
  const layers = (
    <span ref={anchorRef} aria-hidden className="relative isolate">
      {lines.map((line, i) => (
        <span key={i} data-mark-line className={lineClasses(mark.tone, hovered)} style={line} />
      ))}
    </span>
  );
  if (!onApply && !onDismiss) {
    return (
      <>
        {layers}
        <span ref={ref} data-mark data-tone={mark.tone ?? 'destructive'} className="relative">
          {text}
        </span>
      </>
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
      {layers}
      <PopoverPrimitive.Trigger asChild>
        <span
          ref={ref}
          data-mark
          data-tone={mark.tone ?? 'destructive'}
          role="button"
          tabIndex={-1}
          onClick={stop}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="relative cursor-pointer"
        >
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


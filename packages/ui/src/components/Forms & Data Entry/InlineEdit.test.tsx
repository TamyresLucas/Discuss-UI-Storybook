import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { InlineEdit } from './InlineEdit';
import { markLines, remapMarks } from './MarkedText';

/** A two-line, 74px field (4px padding, 2px bottom border, 32px lines) for tests that need layout: jsdom has none. Returns what undoes it. */
function stubFieldLayout(pieces: { left: number; top: number; width: number; height: number }[]) {
  const rect = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({ left: 0, top: 100, right: 459, bottom: 174, width: 459, height: 74, x: 0, y: 100, toJSON: () => ({}) });
  const rects = vi.spyOn(HTMLElement.prototype, 'getClientRects').mockImplementation(function (this: HTMLElement) {
    return (this.hasAttribute('data-mark') || this.hasAttribute('data-draft-mark') ? pieces : []) as unknown as DOMRectList;
  });
  const real = window.getComputedStyle.bind(window);
  const given: Record<string, string> = { lineHeight: '32px', paddingTop: '4px', paddingBottom: '4px', borderTopWidth: '0px', borderBottomWidth: '2px' };
  const style = vi.spyOn(window, 'getComputedStyle').mockImplementation(
    (element, pseudo) =>
      new Proxy(real(element, pseudo), {
        get: (target, key) => (typeof key === 'string' && key in given ? given[key] : typeof Reflect.get(target, key) === 'function' ? Reflect.get(target, key).bind(target) : Reflect.get(target, key)),
      }),
  );
  return () => [rect, rects, style].forEach((m) => m.mockRestore());
}

describe('InlineEdit', () => {
  it('shows the value as a button and the placeholder when empty', () => {
    const { rerender } = render(<InlineEdit aria-label="Name" defaultValue="Alpha" />);
    expect(screen.getByRole('button')).toHaveTextContent('Alpha');
    rerender(<InlineEdit aria-label="Name" value="" placeholder="Add a name" />);
    expect(screen.getByRole('button')).toHaveTextContent('Add a name');
  });

  it('commits on Enter and returns focus to the button', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<InlineEdit aria-label="Name" defaultValue="Alpha" onValueChange={onValueChange} />);
    await user.click(screen.getByRole('button'));
    const field = screen.getByRole('textbox', { name: 'Name' });
    expect(field).toHaveFocus();
    await user.clear(field);
    await user.type(field, 'Beta{Enter}');
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('Beta');
    expect(screen.getByRole('button')).toHaveTextContent('Beta');
    expect(screen.getByRole('button')).toHaveFocus();
  });

  it('commits on blur', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<InlineEdit aria-label="Name" defaultValue="Alpha" onValueChange={onValueChange} />);
    await user.click(screen.getByRole('button'));
    await user.type(screen.getByRole('textbox'), '2');
    await user.tab();
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('Alpha2');
  });

  it('reverts on Escape without saving', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<InlineEdit aria-label="Name" defaultValue="Alpha" onValueChange={onValueChange} />);
    await user.click(screen.getByRole('button'));
    await user.type(screen.getByRole('textbox'), 'zzz{Escape}');
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole('button')).toHaveTextContent('Alpha');
  });

  it('does not call onValueChange when nothing changed', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<InlineEdit aria-label="Name" defaultValue="Alpha" onValueChange={onValueChange} />);
    await user.click(screen.getByRole('button'));
    await user.keyboard('{Enter}');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('multiline: Enter adds a line break, Ctrl+Enter commits', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<InlineEdit aria-label="Goal" multiline defaultValue="a" onValueChange={onValueChange} />);
    await user.click(screen.getByRole('button'));
    await user.type(screen.getByRole('textbox'), '{Enter}b');
    expect(onValueChange).not.toHaveBeenCalled();
    await user.keyboard('{Control>}{Enter}{/Control}');
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('a\nb');
  });

  it('shows the pencil for a short label but not for longer (multiline) text', () => {
    const { container, rerender } = render(<InlineEdit aria-label="Name" defaultValue="Alpha" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.firstElementChild).toHaveClass('inline-flex');
    rerender(<InlineEdit aria-label="Goal" multiline defaultValue="A longer description" />);
    expect(container.querySelector('svg')).not.toBeInTheDocument();
    expect(container.firstElementChild).toHaveClass('w-full');
    expect(screen.getByRole('button')).toHaveClass('w-full');
  });

  describe('question variant', () => {
    it('fills the width, has no pencil and square corners', () => {
      const { container } = render(<InlineEdit variant="question" aria-label="Question" defaultValue="Hi" />);
      expect(container.querySelector('svg')).not.toBeInTheDocument();
      const button = screen.getByRole('button');
      expect(button).toHaveClass('w-full', 'rounded-none', 'border-b');
      expect(button).toHaveClass('border-transparent');
    });

    it('hover uses the input border colour; only selected takes the accent', () => {
      const { rerender } = render(<InlineEdit variant="question" aria-label="Question" defaultValue="Hi" />);
      const idle = screen.getByRole('button');
      expect(idle).toHaveClass('border-transparent', 'enabled:hover:border-input-muted');
      expect(idle).not.toHaveClass('border-accent-muted');
      rerender(<InlineEdit variant="question" selected aria-label="Question" defaultValue="Hi" />);
      const selected = screen.getByRole('button');
      expect(selected).toHaveClass('border-accent-muted');
      expect(selected).not.toHaveClass('border-transparent');
      // Hovering a selected question must not drop back to the input colour.
      expect(selected).not.toHaveClass('enabled:hover:border-input-muted');
    });

    it('hover border is 1px and the selected border is the bolder 2px, at the same height', () => {
      const { rerender } = render(<InlineEdit variant="question" aria-label="Question" defaultValue="Hi" />);
      const idle = screen.getByRole('button');
      // 1px border + 5px bottom padding = 2px border + 4px bottom padding.
      expect(idle).toHaveClass('border-b', 'pb-1.25', 'pt-1');
      expect(idle).not.toHaveClass('border-b-2');
      rerender(<InlineEdit variant="question" selected aria-label="Question" defaultValue="Hi" />);
      const selected = screen.getByRole('button');
      expect(selected).toHaveClass('border-b-2', 'py-1');
      expect(selected).not.toHaveClass('pb-1.25');
    });

    it('multiline: Enter saves and Shift+Enter adds a line break', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<InlineEdit variant="question" multiline aria-label="Question" defaultValue="a" onValueChange={onValueChange} />);
      await user.click(screen.getByRole('button'));
      await user.type(screen.getByRole('textbox'), '{Shift>}{Enter}{/Shift}b');
      expect(onValueChange).not.toHaveBeenCalled();
      await user.keyboard('{Enter}');
      expect(onValueChange).toHaveBeenCalledExactlyOnceWith('a\nb');
    });
  });

  it('reports the draft on every keystroke and the saved value when editing ends', async () => {
    const user = userEvent.setup();
    const onDraftChange = vi.fn();
    render(<InlineEdit aria-label="Name" defaultValue="Al" onDraftChange={onDraftChange} />);
    await user.click(screen.getByRole('button'));
    await user.type(screen.getByRole('textbox'), 'p');
    expect(onDraftChange).toHaveBeenLastCalledWith('Alp');
    await user.keyboard('{Escape}');
    expect(onDraftChange).toHaveBeenLastCalledWith('Al');
  });

  it('is not editable when disabled', async () => {
    const user = userEvent.setup();
    render(<InlineEdit aria-label="Name" defaultValue="Alpha" disabled />);
    await user.click(screen.getByRole('button'));
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('has no accessibility violations in read or edit mode', async () => {
    const user = userEvent.setup();
    const { container } = render(<InlineEdit aria-label="Name" defaultValue="Alpha" />);
    expect(await axe(container)).toHaveNoViolations();
    await user.click(screen.getByRole('button'));
    expect(await axe(container)).toHaveNoViolations();
  });

  it('question variant has no accessibility violations in read or edit mode', async () => {
    const user = userEvent.setup();
    const { container } = render(<InlineEdit variant="question" multiline selected aria-label="Question" defaultValue="Hi" />);
    expect(await axe(container)).toHaveNoViolations();
    await user.click(screen.getByRole('button'));
    expect(await axe(container)).toHaveNoViolations();
  });

  it('does not save an edit shorter than minLength: it stays open with a message', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<InlineEdit aria-label="Goal" multiline minLength={10} defaultValue="A long enough value" onValueChange={onValueChange} />);
    await user.click(screen.getByRole('button'));
    const field = screen.getByRole('textbox', { name: 'Goal' });
    await user.clear(field);
    await user.type(field, 'short');
    await user.tab();
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('Enter at least 10 characters (5 now).');
    expect(screen.getByRole('textbox', { name: 'Goal' })).toHaveAttribute('aria-invalid', 'true');
    // The message follows what is typed, and the edit saves once it is long enough.
    await user.type(screen.getByRole('textbox', { name: 'Goal' }), ' enough');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    await user.tab();
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('short enough');
  });

  it('refuses an edit that validate rejects, and Escape still reverts', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<InlineEdit aria-label="Name" defaultValue="Alpha" validate={(v) => (v.includes('!') ? 'No exclamation marks.' : null)} onValueChange={onValueChange} />);
    await user.click(screen.getByRole('button'));
    await user.type(screen.getByRole('textbox'), '!{Enter}');
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('No exclamation marks.');
    await user.type(screen.getByRole('textbox'), '{Escape}');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('Alpha');
  });

  it('leaves an unchanged value alone even if it would not pass', async () => {
    const user = userEvent.setup();
    render(<InlineEdit aria-label="Goal" minLength={50} defaultValue="Too short" />);
    await user.click(screen.getByRole('button'));
    await user.tab();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('Too short');
  });

  it('showLimits shows the allowed length and a live counter while editing, and the same line turns into the error state', async () => {
    const user = userEvent.setup();
    render(<InlineEdit aria-label="Goal" multiline minLength={10} maxLength={40} showLimits defaultValue="A long enough value" />);
    expect(screen.queryByText('10 characters required')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button'));
    expect(screen.getByText('10 characters required')).toBeInTheDocument();
    expect(screen.getByText('19/40')).toBeInTheDocument();
    const field = screen.getByRole('textbox', { name: 'Goal' });
    await user.clear(field);
    await user.type(field, 'short');
    expect(screen.getByText('5/40')).toBeInTheDocument();
    await user.tab();
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('10 characters required');
    expect(alert).toHaveTextContent('Enter at least 10 characters (5 now).');
    expect(alert).toHaveClass('text-destructive');
  });

  it('does not show the limits unless asked', async () => {
    const user = userEvent.setup();
    render(<InlineEdit aria-label="Goal" minLength={10} maxLength={40} defaultValue="A long enough value" />);
    await user.click(screen.getByRole('button'));
    expect(screen.queryByText('10 characters required')).not.toBeInTheDocument();
  });

  it('submitOnEnter: Enter saves a multiline edit and Shift+Enter adds a line break', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<InlineEdit aria-label="Goal" multiline submitOnEnter defaultValue="Alpha" onValueChange={onValueChange} />);
    await user.click(screen.getByRole('button'));
    const field = screen.getByRole('textbox', { name: 'Goal' });
    await user.type(field, '{Shift>}{Enter}{/Shift}more');
    expect(onValueChange).not.toHaveBeenCalled();
    expect(field).toHaveValue('Alpha\nmore');
    await user.type(field, '{Enter}');
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('Alpha\nmore');
    expect(screen.getByRole('button')).toHaveFocus();
  });

  it('submitOnEnter with a too-short edit: Enter is refused and the field stays open and focused', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<InlineEdit aria-label="Goal" multiline submitOnEnter minLength={20} defaultValue="A long enough value here" onValueChange={onValueChange} />);
    await user.click(screen.getByRole('button'));
    const field = screen.getByRole('textbox', { name: 'Goal' });
    await user.clear(field);
    await user.type(field, 'short{Enter}');
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Goal' })).toHaveFocus();
    expect(screen.getByRole('textbox', { name: 'Goal' })).toHaveValue('short');
  });

  it('shows the text cursor over the read text, and not over a disabled field', () => {
    const { rerender } = render(<InlineEdit aria-label="Name" defaultValue="Alpha" />);
    expect(screen.getByRole('button')).toHaveClass('enabled:cursor-text');
    rerender(<InlineEdit aria-label="Name" defaultValue="Alpha" disabled />);
    expect(screen.getByRole('button')).toHaveClass('disabled:cursor-not-allowed');
  });

  it('shows the placeholder in the regular text colour when placeholderTone is regular', () => {
    const { rerender } = render(<InlineEdit aria-label="Name" placeholder="Click to edit" />);
    expect(screen.getByText('Click to edit').className).toContain('text-muted-foreground');
    rerender(<InlineEdit aria-label="Name" placeholder="Click to edit" placeholderTone="regular" />);
    expect(screen.getByText('Click to edit').className).not.toContain('text-muted-foreground');
  });

  describe('marks while the field is edited', () => {
    it('carries marks over to the typed text: kept before the edit, moved after it, dropped when touched', () => {
      const marks = [{ start: 0, end: 3 }, { start: 8, end: 13 }];
      expect(remapMarks('abc def ghijk', 'abc def ghijk', marks)).toBe(marks);
      // Typing at the end or between the marks changes nothing for them; typing before a mark moves it.
      expect(remapMarks('abc def ghijk', 'abc def ghijk!', marks)).toEqual(marks);
      expect(remapMarks('abc def ghijk', 'abc XX def ghijk', marks)).toEqual([{ start: 0, end: 3 }, { start: 11, end: 16 }]);
      expect(remapMarks('abc def ghijk', 'XX abc def ghijk', marks)).toEqual([{ start: 3, end: 6 }, { start: 11, end: 16 }]);
      // Changing the words a mark is on drops it.
      expect(remapMarks('abc def ghijk', 'abc def ghXijk', marks)).toEqual([{ start: 0, end: 3 }]);
      expect(remapMarks('abc def ghijk', 'abc def ghij', marks)).toEqual([{ start: 0, end: 3 }]);
      expect(remapMarks('abc def ghijk', '', marks)).toEqual([]);
      expect(remapMarks('abc', 'abcd', undefined)).toEqual([]);
    });

    it('keeps the underlines visible while the text is edited, in both field kinds, and takes no click', async () => {
      const user = userEvent.setup();
      for (const multiline of [false, true]) {
        const { container, unmount } = render(<InlineEdit aria-label="Q" multiline={multiline} value="Rate our product/service today" marks={[{ start: 5, end: 24, tone: 'warning', message: 'Why.' }, { start: 25, end: 30 }]} onMarkApply={vi.fn()} />);
        await user.click(screen.getByRole('button', { name: /Edit$/ }));
        // Two layers hold the marks: the highlight behind the field and the underlines over it. Neither is read by a screen reader or takes a click.
        const [behind, over] = [...container.querySelectorAll('[data-draft-marks]')];
        expect([behind.getAttribute('data-layer'), over.getAttribute('data-layer')]).toEqual(['behind', 'over']);
        for (const layer of [behind, over]) {
          expect(layer).toHaveAttribute('aria-hidden', 'true');
          expect(layer.className).toContain('pointer-events-none');
          const words = [...layer.querySelectorAll('[data-draft-mark]')];
          expect(words.map((l) => l.textContent)).toEqual(['our product/service', 'today']);
          expect(words.map((l) => l.getAttribute('data-tone'))).toEqual(['warning', 'destructive']);
        }
        // The highlight layer is painted behind the field (it comes first), the underline layer over it (it comes after), and the field lets the highlight show through, so the browser's selection shows over it.
        const field = container.querySelector(multiline ? 'textarea' : 'input')!;
        expect(behind.compareDocumentPosition(field) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
        expect(field.compareDocumentPosition(over) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
        expect(field.className).toContain('relative');
        expect(field.className).toContain('bg-transparent');
        // Typing before the marks keeps them on the same words.
        await user.keyboard('{Home}So ');
        expect([...container.querySelectorAll('[data-layer=behind] [data-draft-mark]')].map((l) => l.textContent)).toEqual(['our product/service', 'today']);
        // Changing the words under one drops that line only.
        await user.keyboard('{End}{Backspace}');
        expect([...container.querySelectorAll('[data-draft-mark]')].map((l) => l.textContent)).toEqual(['our product/service', 'our product/service']);
        unmount();
      }
    });
  });

  describe('the line of a marked word', () => {
    afterEach(() => vi.restoreAllMocks());

    // A 74px field (4px padding, 2px bottom border, two 32px lines) whose text wraps, so the word sits on both lines.
    const field = { top: 100, bottom: 174, contentTop: 104, contentBottom: 170, lineHeight: 32 };
    const first = { left: 300, top: 108, width: 33, height: 24 };
    const second = { left: 100, top: 140, width: 135, height: 24 };

    it('gives each line its own box: the first reaches the field top, the last lands on the field bottom border', () => {
      const [a, b] = markLines([first, second], { left: 290, top: 108 }, field);
      // First line: from the field's top edge to the end of its own line.
      expect(a).toEqual({ left: 10, top: -8, width: 33, height: 36 });
      // Last line: from the end of the line above to the field's bottom edge, so its underline covers the field's own border.
      expect(b).toEqual({ left: -190, top: 28, width: 135, height: 38 });
      expect(b.top + 108 + b.height).toBe(field.bottom);
      // One line fills the field's full height; a piece with no width (a line break) is skipped; without a field each piece is its own box.
      expect(markLines([{ left: 0, top: 108, width: 50, height: 24 }], { left: 0, top: 100 }, { ...field, bottom: 138, contentBottom: 134 })).toEqual([{ left: 0, top: 0, width: 50, height: 38 }]);
      expect(markLines([{ ...first, width: 0 }, second], { left: 0, top: 0 })).toEqual([{ left: 100, top: 140, width: 135, height: 24 }]);
      // The pieces of one line (the space at a wrap is one) make a single box.
      expect(markLines([first, { left: 333, top: 108, width: 6, height: 24 }, second], { left: 290, top: 108 }, field)).toEqual([a, b].map((x, i) => (i === 0 ? { ...x, width: 39 } : x)));
    });

    it('draws a line box per line of the word, in the tone of the mark (the warning one with its highlight)', () => {
      const restore = stubFieldLayout([first, second]);
      for (const [tone, border, highlight] of [['warning', 'border-warning-foreground', true], [undefined, 'border-destructive-foreground', false]] as const) {
        const { container, unmount } = render(<InlineEdit aria-label="Q" value="Rate our product/service today" marks={[{ start: 5, end: 24, tone }]} onMarkApply={vi.fn()} />);
        const lines = [...container.querySelectorAll('[data-mark-line]')];
        expect(lines).toHaveLength(2);
        for (const line of lines) {
          expect(line.className).toContain(border);
          expect(line.className.includes('bg-warning-background-highlight')).toBe(highlight);
          expect(line.className).toContain('pointer-events-none');
        }
        unmount();
      }
      restore();
    });
  });

  describe('the boxes of the marks while the field is edited', () => {
    afterEach(() => vi.restoreAllMocks());

    it('draw the highlight behind the field (warning marks only) and the underline of every mark over it, one box per line', async () => {
      const user = userEvent.setup();
      const restore = stubFieldLayout([{ left: 300, top: 108, width: 33, height: 24 }, { left: 100, top: 140, width: 135, height: 24 }]);
      const { container } = render(<InlineEdit aria-label="Q" multiline value="Rate our product/service today" marks={[{ start: 5, end: 24, tone: 'warning' }, { start: 25, end: 30 }]} onMarkApply={vi.fn()} />);
      await user.click(screen.getByRole('button', { name: /Edit$/ }));
      const boxes = (layer: string) => [...container.querySelectorAll(`[data-layer=${layer}] [data-draft-box]`)];
      // Behind: only the warning mark has a highlight (two lines). Over: both marks have an underline on each of their two lines.
      expect(boxes('behind')).toHaveLength(2);
      for (const box of boxes('behind')) expect(box.className).toContain('bg-warning-background-highlight');
      expect(boxes('over')).toHaveLength(4);
      expect(boxes('over').map((b) => (b.className.includes('border-warning-foreground') ? 'warning' : 'destructive'))).toEqual(['warning', 'warning', 'destructive', 'destructive']);
      for (const box of boxes('over')) expect(box.className).not.toContain('bg-');
      restore();
    });
  });

  describe('marks', () => {
    const text = 'Rate our product/service today';
    const mark = { start: 5, end: 24 };

    it('underlines in the destructive colour by default, with a card that has no rationale', async () => {
      const user = userEvent.setup();
      render(<InlineEdit aria-label="Q" value={text} marks={[{ ...mark, suggestions: ['the box'] }]} onMarkApply={vi.fn()} onMarkDismiss={vi.fn()} />);
      const marked = screen.getByText('our product/service');
      expect(marked).toHaveAttribute('data-tone', 'destructive');
      await user.click(marked);
      expect(screen.getByText('Apply')).toBeInTheDocument();
      expect(screen.queryByText('Names the product and the service together.')).not.toBeInTheDocument();
      // The plain card, with Dismiss and Apply at opposite ends.
      const plain = screen.getByRole('dialog');
      expect(plain.className).toContain('bg-surface');
      expect(screen.getByRole('button', { name: 'Apply' }).parentElement?.className).toContain('justify-between');
    });

    it('a warning mark has the warning underline, and its card shows the message above Dismiss and Apply', async () => {
      const user = userEvent.setup();
      const onApply = vi.fn();
      const onDismiss = vi.fn();
      render(
        <InlineEdit
          aria-label="Q"
          value={text}
          marks={[{ ...mark, suggestions: ['the box'], tone: 'warning', message: 'Names the product and the service together.' }]}
          onMarkApply={onApply}
          onMarkDismiss={onDismiss}
        />,
      );
      const marked = screen.getByText('our product/service');
      expect(marked).toHaveAttribute('data-tone', 'warning');
      await user.click(marked);
      expect(screen.getByText('Names the product and the service together.')).toBeInTheDocument();
      // Order in the card: the correction, then the rationale, then the buttons.
      const order = (a: Node, b: Node) => Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
      expect(order(screen.getByText('the box'), screen.getByText('Names the product and the service together.'))).toBe(true);
      expect(order(screen.getByText('Names the product and the service together.'), screen.getByRole('button', { name: 'Apply' }))).toBe(true);
      // The regular card (not tinted), with both buttons at the right.
      const card = screen.getByRole('dialog');
      expect(card.className).toContain('bg-surface');
      expect(card.className).toContain('border-border');
      expect(card.className).not.toContain('bg-warning-soft');
      // The words that would be replaced are struck through in the destructive color, as in any mark's card.
      expect(card.querySelector('s')?.className).toContain('text-destructive-foreground');
      expect(card.querySelector('s')?.className).not.toContain('text-warning-foreground');
      expect(screen.getByRole('button', { name: 'Apply' }).parentElement?.className).toContain('justify-end');
      await user.click(screen.getByRole('button', { name: 'Apply' }));
      expect(onApply).toHaveBeenCalledExactlyOnceWith(expect.objectContaining(mark), 'the box');
    });
  });
});

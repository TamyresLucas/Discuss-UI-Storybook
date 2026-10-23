import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import { InlineEdit } from './InlineEdit';
import { remapMarks } from './MarkedText';

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
        const overlay = container.querySelector('[data-draft-marks]')!;
        expect(overlay).toHaveAttribute('aria-hidden', 'true');
        expect(overlay.className).toContain('pointer-events-none');
        const lines = [...container.querySelectorAll('[data-draft-mark]')];
        expect(lines.map((l) => l.textContent)).toEqual(['our product/service', 'today']);
        // The warning line is the warning color, the other the destructive one.
        expect(lines[0].className).toContain('border-warning-foreground');
        expect(lines[0].className).toContain('bg-warning-background-highlight');
        expect(lines[1].className).toContain('border-destructive-foreground');
        expect(lines[1].className).not.toContain('bg-warning-background-highlight');
        // The layer is painted behind the field (it comes first), and the field lets it show through, so the browser's selection shows over the highlight.
        const field = container.querySelector(multiline ? 'textarea' : 'input')!;
        expect(overlay.compareDocumentPosition(field) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
        expect(field.className).toContain('relative');
        expect(field.className).toContain('bg-transparent');
        // Typing before the marks keeps them on the same words.
        await user.keyboard('{Home}So ');
        expect([...container.querySelectorAll('[data-draft-mark]')].map((l) => l.textContent)).toEqual(['our product/service', 'today']);
        // Changing the words under one drops that line only.
        await user.keyboard('{End}{Backspace}');
        expect([...container.querySelectorAll('[data-draft-mark]')].map((l) => l.textContent)).toEqual(['our product/service']);
        unmount();
      }
    });
  });

  describe('marks', () => {
    const text = 'Rate our product/service today';
    const mark = { start: 5, end: 24 };

    it('underlines in the destructive colour by default, with a card that has no rationale', async () => {
      const user = userEvent.setup();
      render(<InlineEdit aria-label="Q" value={text} marks={[{ ...mark, suggestions: ['the box'] }]} onMarkApply={vi.fn()} onMarkDismiss={vi.fn()} />);
      const marked = screen.getByText('our product/service');
      expect(marked.className).toContain('border-destructive-foreground');
      expect(marked.className).not.toContain('bg-warning-background-highlight');
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
      expect(marked.className).toContain('border-warning-foreground');
      expect(marked.className).toContain('bg-warning-background-highlight');
      expect(marked.className).not.toContain('border-destructive-foreground');
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

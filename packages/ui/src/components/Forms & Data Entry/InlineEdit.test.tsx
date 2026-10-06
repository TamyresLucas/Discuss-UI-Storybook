import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import { InlineEdit } from './InlineEdit';

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
      expect(idle).toHaveClass('border-transparent', 'enabled:hover:border-input');
      expect(idle).not.toHaveClass('border-accent-foreground');
      rerender(<InlineEdit variant="question" selected aria-label="Question" defaultValue="Hi" />);
      const selected = screen.getByRole('button');
      expect(selected).toHaveClass('border-accent-foreground');
      expect(selected).not.toHaveClass('border-transparent');
      // Hovering a selected question must not drop back to the input colour.
      expect(selected).not.toHaveClass('enabled:hover:border-input');
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
});

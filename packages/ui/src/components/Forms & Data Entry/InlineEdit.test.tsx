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
});

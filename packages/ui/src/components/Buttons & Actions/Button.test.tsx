import { fireEvent, render, screen } from '@testing-library/react';
import { Eye } from '@phosphor-icons/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './Button';

describe('Button', () => {
  it("turns a ghost button's text accent-foreground on hover, with no background", () => {
    render(<Button variant="ghost">Copy</Button>);
    const button = screen.getByRole('button', { name: 'Copy' });
    expect(button).toHaveClass('hover:text-accent-foreground');
    expect(button).not.toHaveClass('hover:bg-accent-soft');
    expect(button).not.toHaveClass('hover:text-accent-soft-foreground');
  });

  it('fills a ghost button\'s icon while hovered, and only a ghost button\'s', () => {
    const { rerender } = render(<Button variant="ghost" aria-label="View"><Eye data-testid="icon" /></Button>);
    const line = screen.getByTestId('icon').innerHTML;
    fireEvent.pointerEnter(screen.getByRole('button', { name: 'View' }));
    const filled = screen.getByTestId('icon').innerHTML;
    expect(filled).not.toBe(line);
    fireEvent.pointerLeave(screen.getByRole('button', { name: 'View' }));
    expect(screen.getByTestId('icon').innerHTML).toBe(line);
    rerender(<Button variant="ghost" fillIconOnHover={false} aria-label="View"><Eye data-testid="icon" /></Button>);
    fireEvent.pointerLeave(screen.getByRole('button', { name: 'View' }));
    fireEvent.pointerEnter(screen.getByRole('button', { name: 'View' }));
    expect(screen.getByTestId('icon').innerHTML).toBe(line);
    rerender(<Button variant="outline" aria-label="View"><Eye data-testid="icon" /></Button>);
    fireEvent.pointerEnter(screen.getByRole('button', { name: 'View' }));
    expect(screen.getByTestId('icon').innerHTML).toBe(line);
  });

  it('renders its label', () => {
    render(<Button>Save changes</Button>);
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeInTheDocument();
  });

  it('fires onClick when activated', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save changes</Button>);

    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not fire onClick when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Save changes
      </Button>,
    );

    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders as the child element when asChild is set, instead of wrapping it in a button', () => {
    render(
      <Button asChild>
        <a href="/activity">New activity</a>
      </Button>,
    );

    const link = screen.getByRole('link', { name: 'New activity' });
    expect(link.tagName).toBe('A');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('supports the Figma size and variant set', () => {
    render(
      <>
        <Button variant="subtle" size="sm">
          Subtle
        </Button>
        <Button variant="link">Link</Button>
        <Button variant="destructive" size="icon" aria-label="Delete" />
      </>,
    );
    expect(screen.getByRole('button', { name: 'Subtle' })).toHaveClass('h-8');
    expect(screen.getByRole('button', { name: 'Link' })).toHaveClass('underline');
    expect(screen.getByRole('button', { name: 'Delete' })).toHaveClass('size-10');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Button>Save changes</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });
});

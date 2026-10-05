import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './Button';

describe('Button', () => {
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

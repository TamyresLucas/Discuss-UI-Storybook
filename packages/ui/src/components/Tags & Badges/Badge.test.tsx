import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import { Badge } from './Badge';

describe('Badge', () => {
  it('renders static types as plain text', () => {
    render(<Badge type="secondary">Category</Badge>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
  });

  it('exposes the interactable type as a toggle button', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Badge type="interactable" selected onClick={onClick}>
        Category
      </Badge>,
    );
    const tag = screen.getByRole('button', { name: 'Category' });
    expect(tag).toHaveAttribute('aria-pressed', 'true');
    await user.click(tag);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders the id and count types as plain text', () => {
    render(
      <>
        <Badge type="id">721347</Badge>
        <Badge type="count">3</Badge>
      </>,
    );
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('721347')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <>
        <Badge>Primary</Badge>
        <Badge type="question">Select One</Badge>
        <Badge type="interactable">Category</Badge>
        <Badge type="id">721347</Badge>
        <Badge type="count">3</Badge>
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

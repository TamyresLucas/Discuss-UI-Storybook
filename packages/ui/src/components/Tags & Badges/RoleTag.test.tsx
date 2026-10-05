import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import { RoleTag } from './RoleTag';

describe('RoleTag', () => {
  it('renders static types as plain text', () => {
    render(<RoleTag type="secondary">Category</RoleTag>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
  });

  it('exposes the interactable type as a toggle button', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <RoleTag type="interactable" selected onClick={onClick}>
        Category
      </RoleTag>,
    );
    const tag = screen.getByRole('button', { name: 'Category' });
    expect(tag).toHaveAttribute('aria-pressed', 'true');
    await user.click(tag);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <>
        <RoleTag>Primary</RoleTag>
        <RoleTag type="question">Select One</RoleTag>
        <RoleTag type="interactable">Category</RoleTag>
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

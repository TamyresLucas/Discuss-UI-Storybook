import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import { getPaginationItems, Pagination } from './Pagination';

describe('getPaginationItems', () => {
  it('lists every page when there are few', () => {
    expect(getPaginationItems(1, 3)).toEqual([1, 2, 3]);
  });

  it('collapses hidden ranges into ellipses', () => {
    expect(getPaginationItems(1, 5)).toEqual([1, 2, 'ellipsis', 5]);
    expect(getPaginationItems(5, 10)).toEqual([1, 'ellipsis', 4, 5, 6, 'ellipsis', 10]);
  });

  it('shows the page instead of an ellipsis that would hide only one', () => {
    expect(getPaginationItems(4, 10)).toEqual([1, 2, 3, 4, 5, 'ellipsis', 10]);
  });
});

describe('Pagination', () => {
  it('marks the current page and changes pages', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination page={1} pageCount={5} onPageChange={onPageChange} />);

    expect(screen.getByRole('button', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page');
    await user.click(screen.getByRole('button', { name: 'Page 5' }));
    expect(onPageChange).toHaveBeenLastCalledWith(5);
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onPageChange).toHaveBeenLastCalledWith(2);
  });

  it('disables the arrows at the ends', () => {
    const { rerender } = render(<Pagination page={1} pageCount={5} onPageChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    rerender(<Pagination page={5} pageCount={5} onPageChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });

  it('shows "page/total" in the compact variant', () => {
    render(<Pagination page={2} pageCount={5} onPageChange={() => {}} variant="compact" />);
    expect(screen.getByText('2/5')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Page 2' })).not.toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Pagination page={2} pageCount={5} onPageChange={() => {}} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

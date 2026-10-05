import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  it('renders a search input with a placeholder', () => {
    render(<SearchBar placeholder="Search sessions..." aria-label="Search" />);
    expect(screen.getByRole('searchbox', { name: 'Search' })).toBeInTheDocument();
  });

  it('accepts typed input', async () => {
    const user = userEvent.setup();
    render(<SearchBar aria-label="Search" />);

    const input = screen.getByRole('searchbox', { name: 'Search' });
    await user.type(input, 'onboarding');

    expect(input).toHaveValue('onboarding');
  });

  it('clears the field and refocuses it from the clear button', async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    render(<SearchBar aria-label="Search" defaultValue="Design systems" onClear={onClear} />);

    await user.click(screen.getByRole('button', { name: 'Clear search' }));

    expect(screen.getByRole('searchbox', { name: 'Search' })).toHaveValue('');
    expect(screen.getByRole('searchbox', { name: 'Search' })).toHaveFocus();
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<SearchBar aria-label="Search" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

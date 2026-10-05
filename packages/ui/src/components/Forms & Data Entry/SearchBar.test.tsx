import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';

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

  it('has no accessibility violations', async () => {
    const { container } = render(<SearchBar aria-label="Search" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

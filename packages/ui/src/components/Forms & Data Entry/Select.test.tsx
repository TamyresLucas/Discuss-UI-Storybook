import type * as React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './Select';

function renderLanguageSelect(props: React.ComponentProps<typeof Select> = {}) {
  return render(
    <Select {...props}>
      <SelectTrigger aria-label="Language">
        <SelectValue placeholder="Select a language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="pt">Portuguese</SelectItem>
      </SelectContent>
    </Select>,
  );
}

describe('Select', () => {
  it('shows the placeholder before a value is chosen', () => {
    renderLanguageSelect();
    expect(screen.getByRole('combobox', { name: 'Language' })).toHaveTextContent('Select a language');
  });

  it('opens on click and shows both options', async () => {
    const user = userEvent.setup();
    renderLanguageSelect();

    await user.click(screen.getByRole('combobox', { name: 'Language' }));

    expect(await screen.findByRole('option', { name: 'English' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Portuguese' })).toBeInTheDocument();
  });

  it('selects an option and calls onValueChange', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderLanguageSelect({ onValueChange });

    await user.click(screen.getByRole('combobox', { name: 'Language' }));
    await user.click(await screen.findByRole('option', { name: 'Portuguese' }));

    expect(onValueChange).toHaveBeenCalledWith('pt');
    expect(screen.getByRole('combobox', { name: 'Language' })).toHaveTextContent('Portuguese');
  });

  it('has no accessibility violations when closed', async () => {
    const { container } = renderLanguageSelect();
    expect(await axe(container)).toHaveNoViolations();
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import { Checkbox, CheckboxField } from './Checkbox';

describe('Checkbox', () => {
  it('renders unchecked by default', () => {
    render(<Checkbox aria-label="Accept terms" />);
    expect(screen.getByRole('checkbox', { name: 'Accept terms' })).not.toBeChecked();
  });

  it('toggles on click and calls onCheckedChange', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox aria-label="Accept terms" onCheckedChange={onCheckedChange} />);

    const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' });
    await user.click(checkbox);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(checkbox).toBeChecked();
  });

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox aria-label="Accept terms" disabled onCheckedChange={onCheckedChange} />);

    await user.click(screen.getByRole('checkbox', { name: 'Accept terms' }));

    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('exposes the indeterminate state', () => {
    render(<Checkbox aria-label="Select all" checked="indeterminate" />);
    expect(screen.getByRole('checkbox', { name: 'Select all' })).toBePartiallyChecked();
  });

  it('labels the checkbox and describes it with CheckboxField', async () => {
    const user = userEvent.setup();
    render(<CheckboxField label="Accept terms" description="You agree to our Terms." />);

    const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' });
    expect(checkbox).toHaveAccessibleDescription('You agree to our Terms.');
    await user.click(screen.getByText('Accept terms'));
    expect(checkbox).toBeChecked();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Checkbox aria-label="Accept terms" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

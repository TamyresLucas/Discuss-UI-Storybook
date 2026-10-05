import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import { NumberInput } from './NumberInput';

describe('NumberInput', () => {
  it('steps with the buttons and reports the new value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<NumberInput aria-label="Duration" defaultValue={60} step={5} unit="minutes" onValueChange={onValueChange} />);

    await user.click(screen.getByRole('button', { name: 'Increase' }));
    expect(onValueChange).toHaveBeenLastCalledWith(65);
    await user.click(screen.getByRole('button', { name: 'Decrease' }));
    expect(screen.getByRole('spinbutton', { name: 'Duration' })).toHaveValue('60');
    expect(screen.getByText('minutes')).toBeInTheDocument();
  });

  it('steps with the arrow keys and respects min / max', async () => {
    const user = userEvent.setup();
    render(<NumberInput aria-label="Count" defaultValue={9} max={10} />);

    const spinbutton = screen.getByRole('spinbutton', { name: 'Count' });
    spinbutton.focus();
    await user.keyboard('{ArrowUp}{ArrowUp}');

    expect(spinbutton).toHaveValue('10');
    expect(spinbutton).toHaveAttribute('aria-valuemax', '10');
    expect(screen.getByRole('button', { name: 'Increase' })).toBeDisabled();
  });

  it('describes the control with the error message', () => {
    render(<NumberInput label="Duration" defaultValue={1} status="error" message="Enter a valid duration" />);
    const spinbutton = screen.getByRole('spinbutton', { name: 'Duration' });
    expect(spinbutton).toHaveAttribute('aria-invalid', 'true');
    expect(spinbutton).toHaveAccessibleDescription('Enter a valid duration');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<NumberInput aria-label="Duration" defaultValue={60} unit="minutes" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

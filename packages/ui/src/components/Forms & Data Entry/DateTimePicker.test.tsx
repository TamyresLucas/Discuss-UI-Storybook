import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import { DatePicker, DateTimePicker } from './DateTimePicker';
import { formatDateTime } from './formatDateTime';
import { TimePicker } from './TimePicker';

describe('formatDateTime', () => {
  it('formats a date with and without time', () => {
    const date = new Date(2026, 8, 23, 11, 30);
    expect(formatDateTime(date)).toBe('September 23, 2026 - 11:30 AM');
    expect(formatDateTime(date, false)).toBe('September 23, 2026');
  });
});

describe('TimePicker', () => {
  it('reports hour, minute and period changes', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<TimePicker value={{ hour: 11, minute: 30, period: 'AM' }} onValueChange={onValueChange} />);

    await user.click(screen.getByRole('tab', { name: 'PM' }));
    expect(onValueChange).toHaveBeenLastCalledWith({ hour: 11, minute: 30, period: 'PM' });

    await user.click(within(screen.getByRole('radiogroup', { name: 'Hour' })).getByRole('radio', { name: '10' }));
    expect(onValueChange).toHaveBeenLastCalledWith({ hour: 10, minute: 30, period: 'AM' });
  });
});

describe('DateTimePicker', () => {
  it('applies the chosen date and time', async () => {
    const user = userEvent.setup();
    const onApply = vi.fn();
    render(<DateTimePicker defaultValue={new Date(2026, 8, 23, 11, 30)} onApply={onApply} />);

    await user.click(screen.getByRole('button', { name: /September 10th, 2026/ }));
    await user.click(screen.getByRole('tab', { name: 'PM' }));
    await user.click(screen.getByRole('button', { name: 'Apply' }));

    const applied = onApply.mock.calls[0]![0] as Date;
    expect(applied.getDate()).toBe(10);
    expect(applied.getHours()).toBe(23);
    expect(applied.getMinutes()).toBe(30);
  });

  it('clears the selection on Reset', async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();
    render(<DateTimePicker defaultValue={new Date(2026, 8, 23, 11, 30)} onReset={onReset} showTime={false} />);

    await user.click(screen.getByRole('button', { name: 'Reset' }));

    expect(onReset).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Select Time')).not.toBeInTheDocument();
  });
});

describe('DatePicker', () => {
  it('opens a popover and shows the applied value in the trigger', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<DatePicker label="Select date and time" defaultValue={new Date(2026, 8, 23, 11, 30)} onValueChange={onValueChange} />);

    const trigger = screen.getByRole('button', { name: /Select date and time/ });
    expect(trigger).toHaveTextContent('September 23, 2026 - 11:30 AM');

    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: /September 10th, 2026/ }));
    await user.click(screen.getByRole('button', { name: 'Apply' }));

    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: /Select date and time/ })).toHaveTextContent('September 10, 2026 - 11:30 AM');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<DatePicker label="Select date and time" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

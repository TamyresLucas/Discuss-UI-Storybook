import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import { Calendar } from './Calendar';

const september = new Date(2026, 8, 1);

describe('Calendar', () => {
  it('selects a day on click', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Calendar mode="single" defaultMonth={september} onSelect={onSelect} />);

    await user.click(screen.getByRole('button', { name: /September 10th, 2026/ }));

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect((onSelect.mock.calls[0]![0] as Date).getDate()).toBe(10);
  });

  it('does not select disabled days', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Calendar mode="single" defaultMonth={september} disabled={{ before: new Date(2026, 8, 5) }} onSelect={onSelect} />);

    await user.click(screen.getByRole('button', { name: /September 2nd, 2026/ }));

    expect(onSelect).not.toHaveBeenCalled();
  });

  it('marks recommended days with a dashed outline', () => {
    render(<Calendar mode="single" defaultMonth={september} recommendedDates={[new Date(2026, 8, 14)]} />);
    expect(screen.getByRole('button', { name: /September 14th, 2026/ }).closest('td')).toHaveClass('border-dashed');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Calendar mode="single" defaultMonth={september} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

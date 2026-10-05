import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import { Switch } from './Switch';

describe('Switch', () => {
  it('renders unchecked by default', () => {
    render(<Switch aria-label="Autotranslate" />);
    expect(screen.getByRole('switch', { name: 'Autotranslate' })).not.toBeChecked();
  });

  it('toggles on click and calls onCheckedChange', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch aria-label="Autotranslate" onCheckedChange={onCheckedChange} />);

    const toggle = screen.getByRole('switch', { name: 'Autotranslate' });
    await user.click(toggle);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(toggle).toBeChecked();
  });

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch aria-label="Autotranslate" disabled onCheckedChange={onCheckedChange} />);

    await user.click(screen.getByRole('switch', { name: 'Autotranslate' }));

    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Switch aria-label="Autotranslate" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

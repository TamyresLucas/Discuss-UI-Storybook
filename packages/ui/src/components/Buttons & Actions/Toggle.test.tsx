import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import { Toggle } from './Toggle';

describe('Toggle', () => {
  it('toggles its pressed state and reports it', async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(<Toggle aria-label="AI assistant" onPressedChange={onPressedChange} />);

    const toggle = screen.getByRole('button', { name: 'AI assistant' });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await user.click(toggle);

    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(onPressedChange).toHaveBeenCalledWith(true);
  });

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup();
    render(<Toggle aria-label="AI assistant" disabled />);
    await user.click(screen.getByRole('button', { name: 'AI assistant' }));
    expect(screen.getByRole('button', { name: 'AI assistant' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Toggle aria-label="AI assistant" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

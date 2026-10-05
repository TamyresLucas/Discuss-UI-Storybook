import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { Input } from './Input';

describe('Input', () => {
  it('renders with a placeholder', () => {
    render(<Input placeholder="you@example.com" />);
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
  });

  it('accepts typed input', async () => {
    const user = userEvent.setup();
    render(<Input aria-label="Email" />);

    const input = screen.getByRole('textbox', { name: 'Email' });
    await user.type(input, 'hello@discuss.io');

    expect(input).toHaveValue('hello@discuss.io');
  });

  it('does not accept input when disabled', async () => {
    const user = userEvent.setup();
    render(<Input aria-label="Email" disabled />);

    const input = screen.getByRole('textbox', { name: 'Email' });
    await user.type(input, 'hello@discuss.io');

    expect(input).toHaveValue('');
  });

  it('links label, helper text and error state to the control', () => {
    render(<Input label="Email" description="Enter your email address" status="error" message="Enter a valid email" />);
    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Enter a valid email');
  });

  it('shows the helper text when there is no status message', () => {
    render(<Input label="Email" description="Enter your email address" />);
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAccessibleDescription('Enter your email address');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Input aria-label="Email" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

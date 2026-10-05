import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('accepts multi-line typed input', async () => {
    const user = userEvent.setup();
    render(<Textarea aria-label="Notes" />);

    const textarea = screen.getByRole('textbox', { name: 'Notes' });
    await user.type(textarea, 'line one{enter}line two');

    expect(textarea).toHaveValue('line one\nline two');
  });

  it('does not accept input when disabled', async () => {
    const user = userEvent.setup();
    render(<Textarea aria-label="Notes" disabled />);

    await user.type(screen.getByRole('textbox', { name: 'Notes' }), 'hello');

    expect(screen.getByRole('textbox', { name: 'Notes' })).toHaveValue('');
  });

  it('renders a labelled field with a success message', () => {
    render(<Textarea label="Description" status="success" message="Looks good" />);
    expect(screen.getByRole('textbox', { name: 'Description' })).toHaveAccessibleDescription('Looks good');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Textarea aria-label="Notes" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

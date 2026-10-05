import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import { InputWithAction } from './InputWithAction';

describe('InputWithAction', () => {
  it('fires the action and accepts typing', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(<InputWithAction aria-label="Emails" actionLabel="Invite" onAction={onAction} />);

    await user.type(screen.getByRole('textbox', { name: 'Emails' }), 'a@b.co');
    await user.click(screen.getByRole('button', { name: 'Invite' }));

    expect(screen.getByRole('textbox', { name: 'Emails' })).toHaveValue('a@b.co');
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('renders tags and an error message', () => {
    render(
      <InputWithAction
        aria-label="Emails"
        actionLabel="Invite"
        tags={<span>Tamyres</span>}
        status="error"
        message="Error message"
      />,
    );
    expect(screen.getByText('Tamyres')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Emails' })).toHaveAccessibleDescription('Error message');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<InputWithAction aria-label="Emails" actionLabel="Invite" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

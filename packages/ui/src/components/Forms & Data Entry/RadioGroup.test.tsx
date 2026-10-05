import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import { RadioGroup, RadioGroupItem } from './RadioGroup';

describe('RadioGroup', () => {
  it('renders each option and none checked by default', () => {
    render(
      <RadioGroup aria-label="Language">
        <RadioGroupItem value="en" aria-label="English" />
        <RadioGroupItem value="pt" aria-label="Portuguese" />
      </RadioGroup>,
    );

    expect(screen.getByRole('radio', { name: 'English' })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: 'Portuguese' })).not.toBeChecked();
  });

  it('selects one option at a time', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup aria-label="Language" onValueChange={onValueChange}>
        <RadioGroupItem value="en" aria-label="English" />
        <RadioGroupItem value="pt" aria-label="Portuguese" />
      </RadioGroup>,
    );

    await user.click(screen.getByRole('radio', { name: 'Portuguese' }));

    expect(onValueChange).toHaveBeenCalledWith('pt');
    expect(screen.getByRole('radio', { name: 'Portuguese' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'English' })).not.toBeChecked();

    await user.click(screen.getByRole('radio', { name: 'English' }));

    expect(screen.getByRole('radio', { name: 'English' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Portuguese' })).not.toBeChecked();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <RadioGroup aria-label="Language">
        <RadioGroupItem value="en" aria-label="English" />
        <RadioGroupItem value="pt" aria-label="Portuguese" />
      </RadioGroup>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

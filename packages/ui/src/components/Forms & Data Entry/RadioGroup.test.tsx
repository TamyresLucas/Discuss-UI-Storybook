import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import { RadioGroup, RadioGroupFieldItem, RadioGroupItem } from './RadioGroup';

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

  it('labels and describes options with RadioGroupFieldItem', async () => {
    const user = userEvent.setup();
    render(
      <RadioGroup aria-label="Plan">
        <RadioGroupFieldItem value="a" label="Option A" description="First choice" />
        <RadioGroupFieldItem value="b" label="Option B" disabled />
      </RadioGroup>,
    );

    expect(screen.getByRole('radio', { name: 'Option A' })).toHaveAccessibleDescription('First choice');
    await user.click(screen.getByText('Option A'));
    expect(screen.getByRole('radio', { name: 'Option A' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Option B' })).toBeDisabled();
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
